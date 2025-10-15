// src/hooks/useTeamMembers.ts

import { useState, useEffect } from 'react';
import type { TeamMember, UseTeamMembersReturn } from '../../types/team.types';

export const useTeamMembers = (): UseTeamMembersReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);

        const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
        const SHEET_NAME = import.meta.env.VITE_TEAM_SHEET_NAME || 'Our Team'; // Use env variable
        const RANGE = `${SHEET_NAME}!A2:H`;

        if (!SHEET_ID || !API_KEY) {
          throw new Error('Missing Google Sheets configuration');
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch team data: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.values && data.values.length > 0) {
          const members: TeamMember[] = data.values.map((row: string[], index: number) => ({
            id: index + 1,
            name: row[0] || '',
            role: row[1] || '',
            photo: row[2] || 'https://via.placeholder.com/150',
            email: row[3] || '',
            linkedin: row[4] || '',
            facebook: row[5] || '',
            instagram: row[6] || '',
            bio: row[7] || '',
          }));
          
          setTeamMembers(members);
          console.log(`✅ Loaded ${members.length} team members from Google Sheets`);
        } else {
          setTeamMembers([]);
          console.warn('⚠️ No team members found in Google Sheets');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('❌ Error fetching team members:', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return { teamMembers, loading, error };
};
