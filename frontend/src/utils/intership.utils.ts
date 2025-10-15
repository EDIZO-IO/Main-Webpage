// frontend/src/utils/internship.utils.ts

import type { InternshipData, CurrencyCode, PricingTier } from '../types/intership.types';

/**
 * Calculate final price after discount
 */
export const calculateFinalPrice = (originalPrice: number, discountPercent: number): number => {
  if (discountPercent <= 0) return originalPrice;
  return Math.round(originalPrice - (originalPrice * discountPercent / 100));
};

/**
 * Calculate savings amount
 */
export const calculateSavings = (originalPrice: number, finalPrice: number): number => {
  return Math.max(0, originalPrice - finalPrice);
};

/**
 * Transform Google Sheets row data to InternshipData format (with pricing and discount)
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
    // ✅ NEW: Parse discount columns (30-33)
    discount: {
      '15-days': parseFloat(row[30]) || 0,
      '1-month': parseFloat(row[31]) || 0,
      '2-months': parseFloat(row[32]) || 0,
      '3-months': parseFloat(row[33]) || 0,
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
 * Calculate discount percentage (between two prices)
 */
export const calculateDiscountPercent = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Get pricing tier details with discount calculations
 */
export const getPricingTiers = (
  pricing: any,
  discount?: any
): PricingTier[] => {
  const durations: Array<'15-days' | '1-month' | '2-months' | '3-months'> = [
    '15-days',
    '1-month',
    '2-months',
    '3-months'
  ];

  return durations.map((duration, index) => {
    const originalPrice = pricing?.[duration] || 0;
    const discountPercent = discount?.[duration] || 0;
    const finalPrice = calculateFinalPrice(originalPrice, discountPercent);
    const savings = calculateSavings(originalPrice, finalPrice);

    const labels = ['15 Days', '1 Month', '2 Months', '3 Months'];
    const descriptions = [
      'Quick introduction and basics',
      'Comprehensive learning with projects',
      'In-depth training with real-world projects',
      'Complete mastery with industry exposure'
    ];
    
    const featuresList = [
      ['Basic concepts', 'Mini project', 'Certificate', 'Email support'],
      ['Advanced topics', 'Group project', 'Certificate', 'Mentorship', 'Q&A sessions'],
      ['Industry project', 'Portfolio building', 'Certificate', 'Mentorship', 'Code reviews', 'Interview prep'],
      ['Live client project', 'Full mentorship', 'Certificate', 'Placement guidance', 'Interview prep', 'Resume building']
    ];

    return {
      duration,
      label: labels[index],
      originalPrice,
      discount: discountPercent,
      finalPrice,
      savings,
      description: descriptions[index],
      features: featuresList[index],
      isPopular: duration === '1-month',
    };
  });
};

/**
 * Filter by price range (using final price after discount)
 */
export const filterByPriceRange = (
  internships: InternshipData[],
  minPrice: number = 0,
  maxPrice: number = Infinity,
  duration: '15-days' | '1-month' | '2-months' | '3-months' = '1-month'
): InternshipData[] => {
  return internships.filter((i) => {
    const originalPrice = i.pricing?.[duration] || 0;
    const discountPercent = i.discount?.[duration] || 0;
    const finalPrice = calculateFinalPrice(originalPrice, discountPercent);
    return finalPrice >= minPrice && finalPrice <= maxPrice;
  });
};

/**
 * Format discount badge text
 */
export const formatDiscountBadge = (discountPercent: number): string => {
  if (discountPercent <= 0) return '';
  return `${discountPercent}% OFF`;
};

/**
 * Format savings text
 */
export const formatSavings = (savings: number, currency: CurrencyCode = 'INR'): string => {
  if (savings <= 0) return '';
  return `Save ${formatPrice(savings, currency)}`;
};

/**
 * Get best discount duration (returns the duration with highest discount)
 */
export const getBestDiscountDuration = (
  discount?: any
): '15-days' | '1-month' | '2-months' | '3-months' => {
  if (!discount) return '1-month';
  
  const durations: Array<'15-days' | '1-month' | '2-months' | '3-months'> = [
    '15-days',
    '1-month',
    '2-months',
    '3-months'
  ];
  
  let maxDiscount = 0;
  let bestDuration: '15-days' | '1-month' | '2-months' | '3-months' = '1-month';
  
  durations.forEach(duration => {
    const discountValue = discount[duration] || 0;
    if (discountValue > maxDiscount) {
      maxDiscount = discountValue;
      bestDuration = duration;
    }
  });
  
  return bestDuration;
};

/**
 * Check if internship has any discount
 */
export const hasDiscount = (discount?: any): boolean => {
  if (!discount) return false;
  return Object.values(discount).some((d: any) => parseFloat(d) > 0);
};

/**
 * Get highest discount percentage
 */
export const getHighestDiscount = (discount?: any): number => {
  if (!discount) return 0;
  return Math.max(...Object.values(discount).map((d: any) => parseFloat(d) || 0));
};

/**
 * Sort internships by best discount
 */
export const sortByDiscount = (
  internships: InternshipData[],
  ascending = false
): InternshipData[] => {
  return [...internships].sort((a, b) => {
    const discountA = getHighestDiscount(a.discount);
    const discountB = getHighestDiscount(b.discount);
    return ascending ? discountA - discountB : discountB - discountA;
  });
};

/**
 * Get cheapest final price across all durations
 */
export const getCheapestPrice = (pricing: any, discount: any): number => {
  const durations: Array<'15-days' | '1-month' | '2-months' | '3-months'> = [
    '15-days',
    '1-month',
    '2-months',
    '3-months'
  ];
  
  const prices = durations.map(duration => {
    const original = pricing?.[duration] || 0;
    const disc = discount?.[duration] || 0;
    return calculateFinalPrice(original, disc);
  }).filter(p => p > 0);
  
  return prices.length > 0 ? Math.min(...prices) : 0;
};

/**
 * Sort internships by cheapest price
 */
export const sortByPrice = (
  internships: InternshipData[],
  ascending = true
): InternshipData[] => {
  return [...internships].sort((a, b) => {
    const priceA = getCheapestPrice(a.pricing, a.discount);
    const priceB = getCheapestPrice(b.pricing, b.discount);
    return ascending ? priceA - priceB : priceB - priceA;
  });
};
