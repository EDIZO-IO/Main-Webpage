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
        const SHEET_NAME = import.meta.env.VITE_TEAM_SHEET_NAME || 'Our Team';
        
        // ✅ UPDATED: Changed range from A2:H to A2:K to include GitHub, Portfolio, and Bio
        const RANGE = `${SHEET_NAME}!A2:K`;

        if (!SHEET_ID || !API_KEY) {
          throw new Error('Missing Google Sheets configuration. Please check your .env file.');
        }

        console.log(`📊 Fetching team members from Google Sheets...`);
        console.log(`Sheet: "${SHEET_NAME}", Range: ${RANGE}`);

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Failed to fetch team data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.values && data.values.length > 0) {
          // ✅ UPDATED: Parse with GitHub (column I) and Portfolio (column J), Bio moved to column K
          const members: TeamMember[] = data.values.map((row: string[], index: number) => ({
            id: index + 1,
            name: row[0] || 'Unknown',
            role: row[1] || 'Team Member',
            photo: row[2] || 'https://via.placeholder.com/150?text=No+Photo',
            email: row[3] || '',
            linkedin: row[4] || '',
            facebook: row[5] || '',
            instagram: row[6] || '',
            github: row[7] || '',        // ✅ NEW - Column H (index 7)
            portfolio: row[8] || '',     // ✅ NEW - Column I (index 8)
            bio: row[9] || '',           // ✅ UPDATED - Moved to Column J (index 9)
          }));
          
          setTeamMembers(members);
          console.log(`✅ Successfully loaded ${members.length} team members from Google Sheets`);
          console.log('Sample member:', members[0]); // Log first member for debugging
        } else {
          setTeamMembers([]);
          console.warn('⚠️ No team members found in Google Sheets. The sheet may be empty or improperly configured.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred while fetching team data';
        setError(errorMessage);
        console.error('❌ Error fetching team members:', errorMessage);
        
        // Additional debugging info
        if (err instanceof Error && err.message.includes('404')) {
          console.error('💡 Tip: Check if the sheet name "Our Team" exists in your Google Sheets');
        }
        if (err instanceof Error && err.message.includes('403')) {
          console.error('💡 Tip: Ensure the Google Sheet is publicly accessible or API key has proper permissions');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return { teamMembers, loading, error };
};
