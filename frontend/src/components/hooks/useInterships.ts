// frontend/src/hooks/useInternships.ts

import { useState, useEffect } from 'react';
import type { InternshipData } from '../../types/intership.types';
import { parseInternshipsFromSheets } from '../../utils/intership.utils';

/**
 * Custom hook for fetching internships from Google Sheets
 */
export const useInternships = () => {
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        setError(null);

        const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
        const SHEET_NAME = import.meta.env.VITE_INTERNSHIPS_SHEET_NAME || 'Internships';
        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

        // Validate environment variables
        if (!SHEET_ID || !API_KEY) {
          throw new Error('Missing Google Sheets configuration. Check your .env file.');
        }

        console.log('Fetching internships from Google Sheets...');
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw sheet data:', data);

        if (!data.values || data.values.length <= 1) {
          throw new Error('No internship data found in the sheet.');
        }

        const parsedInternships = parseInternshipsFromSheets(data);
        console.log('Parsed internships:', parsedInternships);

        setInternships(parsedInternships);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching internships:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch internships');
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  return { internships, loading, error };
};

/**
 * Custom hook for fetching a single internship by ID
 */
export const useInternship = (id: string | undefined) => {
  const [internship, setInternship] = useState<InternshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error('Internship ID not provided');
        }

        const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
        const SHEET_NAME = import.meta.env.VITE_INTERNSHIPS_SHEET_NAME || 'Internships';
        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

        if (!SHEET_ID || !API_KEY) {
          throw new Error('Missing Google Sheets configuration');
        }

        console.log('Fetching internship details for ID:', id);
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
        
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || 'Failed to fetch data');
        }

        const data = await response.json();

        if (!data.values || data.values.length <= 1) {
          throw new Error('No data found in sheet');
        }

        // Find the internship by ID
        const internshipRow = data.values.slice(1).find((row: any[]) => row[0] === id);

        if (!internshipRow) {
          throw new Error(`Internship with ID "${id}" not found`);
        }

        // Parse the row data (columns 0-29)
        const parsedInternship: InternshipData = {
          id: internshipRow[0] || id,
          title: internshipRow[1] || 'Untitled',
          category: internshipRow[2] || 'General',
          mode: (internshipRow[3] || 'Online') as 'Online' | 'Offline',
          company: internshipRow[4] || 'EDIZO',
          image: internshipRow[5] || '',
          rating: parseFloat(internshipRow[6]) || 4.0,
          description: internshipRow[7] || 'No description available.',
          whyChooseEdizo: [
            internshipRow[8], internshipRow[9], internshipRow[10], internshipRow[11],
            internshipRow[12], internshipRow[13], internshipRow[14],
          ].filter(Boolean),
          benefits: [
            internshipRow[15], internshipRow[16], internshipRow[17], internshipRow[18],
            internshipRow[19], internshipRow[20], internshipRow[21],
          ].filter(Boolean),
          syllabus: {
            '15-days': internshipRow[22] ? internshipRow[22].split(',').map((s: string) => s.trim()) : [],
            '1-month': internshipRow[23] ? internshipRow[23].split(',').map((s: string) => s.trim()) : [],
            '2-months': internshipRow[24] ? internshipRow[24].split(',').map((s: string) => s.trim()) : [],
            '3-months': internshipRow[25] ? internshipRow[25].split(',').map((s: string) => s.trim()) : [],
          },
          pricing: {
            '15-days': parseFloat(internshipRow[26]) || 0,
            '1-month': parseFloat(internshipRow[27]) || 0,
            '2-months': parseFloat(internshipRow[28]) || 0,
            '3-months': parseFloat(internshipRow[29]) || 0,
          },
        };

        console.log('Parsed internship:', parsedInternship);
        setInternship(parsedInternship);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching internship:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch internship');
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  return { internship, loading, error };
};

/**
 * Custom hook for fetching internships with filters
 */
export const useFilteredInternships = (
  category: string = 'All',
  searchTerm: string = '',
  minRating: number = 0
) => {
  const { internships, loading, error } = useInternships();
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      let filtered = [...internships];

      // Filter by category
      if (category !== 'All') {
        filtered = filtered.filter((i) => i.category === category);
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (i) =>
            i.title.toLowerCase().includes(term) ||
            i.description.toLowerCase().includes(term) ||
            i.category.toLowerCase().includes(term)
        );
      }

      // Filter by minimum rating
      if (minRating > 0) {
        filtered = filtered.filter((i) => i.rating >= minRating);
      }

      setFilteredInternships(filtered);
    } else {
      setFilteredInternships([]);
    }
  }, [internships, loading, category, searchTerm, minRating]);

  return { internships: filteredInternships, loading, error };
};

/**
 * Custom hook for getting trending internships
 */
export const useTrendingInternships = (minRating: number = 4.5) => {
  const { internships, loading, error } = useInternships();
  const [trendingInternships, setTrendingInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      const trending = internships.filter((i) => i.rating >= minRating);
      setTrendingInternships(trending);
    } else {
      setTrendingInternships([]);
    }
  }, [internships, loading, minRating]);

  return { internships: trendingInternships, loading, error };
};

/**
 * Custom hook for getting unique categories
 */
export const useCategories = () => {
  const { internships, loading, error } = useInternships();
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      const uniqueCategories = Array.from(new Set(internships.map((i) => i.category)));
      setCategories(['All', ...uniqueCategories]);
    }
  }, [internships, loading]);

  return { categories, loading, error };
};
