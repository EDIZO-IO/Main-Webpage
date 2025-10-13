// src/hooks/useWebinars.ts
import { useState, useEffect } from 'react';
import type { Webinar, WebinarStatus } from '../../types/webinar';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const WEBINAR_SHEET_NAME = import.meta.env.VITE_WEBINAR_SHEET_NAME || 'Webinars';

export const useWebinars = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebinars = async () => {
      if (!SHEET_ID || !API_KEY) {
        setError('Google Sheets configuration is missing. Please check your environment variables.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const range = `${WEBINAR_SHEET_NAME}!A2:G`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

        console.log('Fetching webinars from:', url);

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch webinars: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.values || data.values.length === 0) {
          console.log('No webinar data found in sheet');
          setWebinars([]);
          setLoading(false);
          return;
        }

        const parsedWebinars: Webinar[] = data.values.map((row: string[]) => {
          const [id, title, date, status, location, description, registrationLink] = row;

          return {
            id: parseInt(id, 10) || 0,
            title: title || '',
            date: date || '',
            status: (status as WebinarStatus) || 'Coming Soon',
            location: location || 'Online',
            description: description || '',
            registrationLink: registrationLink?.trim() || ''
          };
        });

        console.log('Parsed webinars:', parsedWebinars);

        // Filter out 'Not Fixed' webinars
        const filteredWebinars = parsedWebinars.filter(
          webinar => webinar.status !== 'Not Fixed'
        );

        console.log('Filtered webinars:', filteredWebinars);

        // Sort by status priority
        const sortedWebinars = filteredWebinars.sort((a, b) => {
          const statusPriority: Record<WebinarStatus, number> = {
            'Confirmed': 0,
            'Waiting': 1,
            'Coming Soon': 2,
            'Not Fixed': 3
          };

          const priorityA = statusPriority[a.status] ?? 3;
          const priorityB = statusPriority[b.status] ?? 3;

          if (priorityA !== priorityB) {
            return priorityA - priorityB;
          }

          // Sort confirmed events by date
          if (a.status === 'Confirmed' && b.status === 'Confirmed' && a.date && b.date) {
            return a.date.localeCompare(b.date);
          }

          return a.id - b.id;
        });

        console.log('Sorted webinars:', sortedWebinars);

        setWebinars(sortedWebinars);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching webinars from Google Sheets:', err);
        setError(
          err instanceof Error 
            ? err.message 
            : 'An unknown error occurred while loading webinars.'
        );
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  return { webinars, loading, error };
};
