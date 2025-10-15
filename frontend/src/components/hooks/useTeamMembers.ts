// src/hooks/useTeamMembers.ts

import { useState, useEffect, useRef } from 'react';
import type { TeamMember, UseTeamMembersReturn } from '../../types/team.types';

// ✅ Singleton cache to prevent multiple API calls
interface CacheEntry {
  data: TeamMember[];
  timestamp: number;
  loading: boolean;
  error: string | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let globalCache: CacheEntry | null = null;
let fetchPromise: Promise<TeamMember[]> | null = null;

export const useTeamMembers = (): UseTeamMembersReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async (): Promise<TeamMember[]> => {
      const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
      const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
      const SHEET_NAME = import.meta.env.VITE_TEAM_SHEET_NAME || 'Our Team';
      
      // ✅ UPDATED: Changed range to A2:D for only Name, Role, Photo, Email
      const RANGE = `${SHEET_NAME}!A2:D`;

      if (!SHEET_ID || !API_KEY) {
        throw new Error('Missing Google Sheets configuration. Please check your .env file.');
      }

      console.log(`📊 Fetching team members from Google Sheets...`);
      console.log(`Sheet: "${SHEET_NAME}", Range: ${RANGE}`);

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Failed to fetch team data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.values && data.values.length > 0) {
        // ✅ UPDATED: Parse only Name (A), Role (B), Photo (C), Email (D)
        const members: TeamMember[] = data.values.map((row: string[], index: number) => ({
          id: index + 1,
          name: row[0] || 'Unknown',
          role: row[1] || 'Team Member',
          photo: row[2] || 'https://via.placeholder.com/150?text=No+Photo',
          email: row[3] || '',
        }));
        
        console.log(`✅ Successfully loaded ${members.length} team members from Google Sheets`);
        console.log('Sample member:', members[0]);
        
        return members;
      } else {
        console.warn('⚠️ No team members found in Google Sheets. The sheet may be empty or improperly configured.');
        return [];
      }
    };

    const loadTeamMembers = async () => {
      // ✅ Check if cache is valid
      if (globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
        if (!isMountedRef.current) return;
        setTeamMembers(globalCache.data);
        setLoading(globalCache.loading);
        setError(globalCache.error);
        return;
      }

      // ✅ If already fetching, wait for that promise
      if (fetchPromise) {
        try {
          const data = await fetchPromise;
          if (!isMountedRef.current) return;
          setTeamMembers(data);
          setLoading(false);
          setError(null);
        } catch (err) {
          if (!isMountedRef.current) return;
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred while fetching team data';
          setError(errorMessage);
          setLoading(false);
        }
        return;
      }

      // ✅ Start new fetch
      try {
        setLoading(true);
        setError(null);
        
        globalCache = {
          data: [],
          timestamp: Date.now(),
          loading: true,
          error: null
        };

        fetchPromise = fetchTeamMembers();
        const data = await fetchPromise;
        
        globalCache = {
          data,
          timestamp: Date.now(),
          loading: false,
          error: null
        };

        if (!isMountedRef.current) return;
        setTeamMembers(data);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred while fetching team data';
        console.error('❌ Error fetching team members:', errorMessage);
        
        // Additional debugging info
        if (err instanceof Error && err.message.includes('404')) {
          console.error('💡 Tip: Check if the sheet name "Our Team" exists in your Google Sheets');
        }
        if (err instanceof Error && err.message.includes('403')) {
          console.error('💡 Tip: Ensure the Google Sheet is publicly accessible or API key has proper permissions');
        }
        
        globalCache = {
          data: [],
          timestamp: Date.now(),
          loading: false,
          error: errorMessage
        };

        if (!isMountedRef.current) return;
        setError(errorMessage);
        setLoading(false);
      } finally {
        fetchPromise = null;
      }
    };

    loadTeamMembers();
  }, []);

  return { teamMembers, loading, error };
};

// ✅ Utility to manually clear cache if needed
export const clearTeamMembersCache = () => {
  globalCache = null;
  fetchPromise = null;
};
