// frontend/src/utils/internship.utils.ts

import type { InternshipData, CurrencyCode } from '../types/intership.types';

/**
 * Transform Google Sheets row data to InternshipData format (with pricing)
 */
export const transformSheetRowToInternship = (row: any[]): InternshipData => {
  return {
    id: row[0] || '',
    title: row[1] || 'Untitled',
    category: row[2] || 'General',
    mode: (row[3] || 'Online') as 'Online' | 'Offline',
    company: row[4] || 'EDIZO',
    image: row[5] || '',
    rating: parseFloat(row[6]) || 0,
    description: row[7] || '',
    whyChooseEdizo: [
      row[8], row[9], row[10], row[11],
      row[12], row[13], row[14],
    ].filter(Boolean),
    benefits: [
      row[15], row[16], row[17], row[18],
      row[19], row[20], row[21],
    ].filter(Boolean),
    syllabus: {
      '15-days': row[22] ? row[22].split(',').map((s: string) => s.trim()) : [],
      '1-month': row[23] ? row[23].split(',').map((s: string) => s.trim()) : [],
      '2-months': row[24] ? row[24].split(',').map((s: string) => s.trim()) : [],
      '3-months': row[25] ? row[25].split(',').map((s: string) => s.trim()) : [],
    },
    pricing: {
      '15-days': parseFloat(row[26]) || 0,
      '1-month': parseFloat(row[27]) || 0,
      '2-months': parseFloat(row[28]) || 0,
      '3-months': parseFloat(row[29]) || 0,
    },
  };
};

/**
 * Parse Google Sheets API response
 */
export const parseInternshipsFromSheets = (sheetData: any): InternshipData[] => {
  if (!sheetData.values || sheetData.values.length === 0) {
    return [];
  }

  // Skip header row (index 0) and map the rest
  return sheetData.values.slice(1).map(transformSheetRowToInternship);
};

/**
 * Filter internships by category
 */
export const filterByCategory = (
  internships: InternshipData[],
  category: string
): InternshipData[] => {
  if (category === 'All') return internships;
  return internships.filter((i) => i.category === category);
};

/**
 * Filter internships by search term
 */
export const filterBySearch = (
  internships: InternshipData[],
  searchTerm: string
): InternshipData[] => {
  if (!searchTerm) return internships;
  const term = searchTerm.toLowerCase();
  return internships.filter(
    (i) =>
      i.title.toLowerCase().includes(term) ||
      i.description.toLowerCase().includes(term) ||
      i.category.toLowerCase().includes(term) ||
      i.id.toLowerCase().includes(term)
  );
};

/**
 * Get all unique categories
 */
export const getUniqueCategories = (internships: InternshipData[]): string[] => {
  const categories = new Set(internships.map((i) => i.category));
  return ['All', ...Array.from(categories)];
};

/**
 * Get trending internships
 */
export const getTrendingInternships = (
  internships: InternshipData[],
  minRating: number = 4.5
): InternshipData[] => {
  return internships.filter((i) => i.rating >= minRating);
};

/**
 * Sort internships by rating
 */
export const sortByRating = (
  internships: InternshipData[],
  ascending = false
): InternshipData[] => {
  return [...internships].sort((a, b) =>
    ascending ? a.rating - b.rating : b.rating - a.rating
  );
};

/**
 * Format price with currency
 */
export const formatPrice = (
  price: number,
  currency: CurrencyCode = 'INR',
  locale: string = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Get pricing tier details
 */
export const getPricingTiers = (pricing: any) => {
  return [
    {
      duration: '15-days' as const,
      label: '15 Days',
      price: pricing['15-days'] || 0,
      description: 'Quick introduction and basics',
      features: ['Basic concepts', 'Mini project', 'Certificate'],
    },
    {
      duration: '1-month' as const,
      label: '1 Month',
      price: pricing['1-month'] || 0,
      description: 'Comprehensive learning with projects',
      features: ['Advanced topics', 'Group project', 'Certificate', 'Mentorship'],
      isPopular: true,
    },
    {
      duration: '2-months' as const,
      label: '2 Months',
      price: pricing['2-months'] || 0,
      description: 'In-depth training with real-world projects',
      features: ['Industry project', 'Portfolio building', 'Certificate', 'Mentorship', 'Code reviews'],
    },
    {
      duration: '3-months' as const,
      label: '3 Months',
      price: pricing['3-months'] || 0,
      description: 'Complete mastery with industry exposure',
      features: ['Live client project', 'Full mentorship', 'Certificate', 'Placement guidance', 'Interview prep'],
    },
  ];
};

/**
 * Filter by price range
 */
export const filterByPriceRange = (
  internships: InternshipData[],
  minPrice: number = 0,
  maxPrice: number = Infinity,
  duration: '15-days' | '1-month' | '2-months' | '3-months' = '1-month'
): InternshipData[] => {
  return internships.filter((i) => {
    const price = i.pricing?.[duration] || 0;
    return price >= minPrice && price <= maxPrice;
  });
};
