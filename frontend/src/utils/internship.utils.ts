// frontend/src/utils/internship.utils.ts

import type {
  InternshipData,
  CurrencyCode,
  PricingTier,
  InternshipDuration,
  InternshipPricing,
  InternshipDiscount
} from '../types/internship.types'; // ✅ Fixed typo: intership -> internship

/**
 * Calculate final price after discount
 */
export const calculateFinalPrice = (originalPrice: number, discountPercent: number): number => {
  if (originalPrice < 0 || discountPercent < 0 || discountPercent > 100) {
    console.warn('Invalid price or discount values', { originalPrice, discountPercent });
    return originalPrice;
  }
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
 * Column mapping: A-AH (33 columns)
 */
export const transformSheetRowToInternship = (row: string[]): InternshipData => {
  // Helper to safely parse float
  const parseFloat = (value: string | undefined): number => {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper to safely parse array from comma-separated string
  const parseArray = (value: string | undefined): string[] => {
    if (!value || value.trim() === '') return [];
    return value.split(',').map((s: string) => s.trim()).filter(Boolean);
  };

  return {
    id: row[0] || '',
    title: row[1] || 'Untitled',
    category: row[2] || 'General',
    mode: (row[3] === 'Offline' ? 'Offline' : 'Online') as 'Online' | 'Offline',
    company: row[4] || 'EDIZO',
    image: row[5] || 'https://via.placeholder.com/400x300?text=No+Image',
    rating: parseFloat(row[6]),
    description: row[7] || '',
    
    // Why Choose Edizo (columns I-O: 8-14)
    whyChooseEdizo: [
      row[8], row[9], row[10], row[11],
      row[12], row[13], row[14],
    ].filter(Boolean),
    
    // Benefits (columns P-V: 15-21)
    benefits: [
      row[15], row[16], row[17], row[18],
      row[19], row[20], row[21],
    ].filter(Boolean),
    
    // Syllabus (columns W-Z: 22-25)
    syllabus: {
      '15-days': parseArray(row[22]),
      '1-month': parseArray(row[23]),
      '2-months': parseArray(row[24]),
      '3-months': parseArray(row[25]),
    },
    
    // Pricing (columns AA-AD: 26-29)
    pricing: {
      '15-days': parseFloat(row[26]),
      '1-month': parseFloat(row[27]),
      '2-months': parseFloat(row[28]),
      '3-months': parseFloat(row[29]),
    },
    
    // Discount (columns AE-AH: 30-33)
    discount: {
      '15-days': parseFloat(row[30]),
      '1-month': parseFloat(row[31]),
      '2-months': parseFloat(row[32]),
      '3-months': parseFloat(row[33]),
    },
  };
};

/**
 * Parse Google Sheets API response
 */
export const parseInternshipsFromSheets = (sheetData: any): InternshipData[] => {
  if (!sheetData?.values || sheetData.values.length === 0) {
    console.warn('No data found in Google Sheets response');
    return [];
  }

  try {
    // Skip header row (index 0) and map the rest
    return sheetData.values.slice(1).map(transformSheetRowToInternship);
  } catch (error) {
    console.error('Error parsing internships from sheets:', error);
    return [];
  }
};

/**
 * Filter internships by category
 */
export const filterByCategory = (
  internships: InternshipData[],
  category: string
): InternshipData[] => {
  if (category === 'All' || !category) return internships;
  return internships.filter((i) => i.category === category);
};

/**
 * Filter internships by mode
 */
export const filterByMode = (
  internships: InternshipData[],
  mode: 'Online' | 'Offline' | 'All'
): InternshipData[] => {
  if (mode === 'All') return internships;
  return internships.filter((i) => i.mode === mode);
};

/**
 * Filter internships by search term
 */
export const filterBySearch = (
  internships: InternshipData[],
  searchTerm: string
): InternshipData[] => {
  if (!searchTerm) return internships;
  const term = searchTerm.toLowerCase().trim();
  return internships.filter(
    (i) =>
      i.title.toLowerCase().includes(term) ||
      i.description.toLowerCase().includes(term) ||
      i.category.toLowerCase().includes(term) ||
      i.company.toLowerCase().includes(term) ||
      i.id.toLowerCase().includes(term)
  );
};

/**
 * Get all unique categories
 */
export const getUniqueCategories = (internships: InternshipData[]): string[] => {
  const categories = new Set(internships.map((i) => i.category));
  return ['All', ...Array.from(categories).sort()];
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
  pricing?: InternshipPricing,
  discount?: InternshipDiscount
): PricingTier[] => {
  const durations: InternshipDuration[] = [
    '15-days',
    '1-month',
    '2-months',
    '3-months'
  ];

  const labels: Record<InternshipDuration, string> = {
    '15-days': '15 Days',
    '1-month': '1 Month',
    '2-months': '2 Months',
    '3-months': '3 Months'
  };

  const descriptions: Record<InternshipDuration, string> = {
    '15-days': 'Quick introduction and basics',
    '1-month': 'Comprehensive learning with projects',
    '2-months': 'In-depth training with real-world projects',
    '3-months': 'Complete mastery with industry exposure'
  };

  const featuresList: Record<InternshipDuration, string[]> = {
    '15-days': ['Basic concepts', 'Mini project', 'Certificate', 'Email support'],
    '1-month': ['Advanced topics', 'Group project', 'Certificate', 'Mentorship', 'Q&A sessions'],
    '2-months': ['Industry project', 'Portfolio building', 'Certificate', 'Mentorship', 'Code reviews', 'Interview prep'],
    '3-months': ['Live client project', 'Full mentorship', 'Certificate', 'Placement guidance', 'Interview prep', 'Resume building']
  };

  return durations.map((duration) => {
    const originalPrice = pricing?.[duration] || 0;
    const discountPercent = discount?.[duration] || 0;
    const finalPrice = calculateFinalPrice(originalPrice, discountPercent);
    const savings = calculateSavings(originalPrice, finalPrice);

    return {
      duration,
      label: labels[duration],
      originalPrice,
      discount: discountPercent,
      finalPrice,
      savings,
      description: descriptions[duration],
      features: featuresList[duration],
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
  duration: InternshipDuration = '1-month'
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
  discount?: InternshipDiscount
): InternshipDuration => {
  if (!discount) return '1-month';

  const durations: InternshipDuration[] = [
    '15-days',
    '1-month',
    '2-months',
    '3-months'
  ];

  let maxDiscount = 0;
  let bestDuration: InternshipDuration = '1-month';

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
export const hasDiscount = (discount?: InternshipDiscount): boolean => {
  if (!discount) return false;
  return Object.values(discount).some((d) => d > 0);
};

/**
 * Get highest discount percentage
 */
export const getHighestDiscount = (discount?: InternshipDiscount): number => {
  if (!discount) return 0;
  return Math.max(...Object.values(discount));
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
export const getCheapestPrice = (
  pricing?: InternshipPricing,
  discount?: InternshipDiscount
): number => {
  if (!pricing) return 0;

  const durations: InternshipDuration[] = [
    '15-days',
    '1-month',
    '2-months',
    '3-months'
  ];

  const prices = durations
    .map(duration => {
      const original = pricing[duration] || 0;
      const disc = discount?.[duration] || 0;
      return calculateFinalPrice(original, disc);
    })
    .filter(p => p > 0);

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

/**
 * Validate internship data
 */
export const isValidInternship = (internship: Partial<InternshipData>): boolean => {
  return !!(
    internship.id &&
    internship.title &&
    internship.category &&
    internship.mode &&
    internship.company
  );
};

/**
 * Get most popular duration based on discount
 */
export const getMostPopularDuration = (discount?: InternshipDiscount): InternshipDuration => {
  // Default popular duration is 1-month
  if (!discount || !hasDiscount(discount)) return '1-month';
  
  // Return duration with highest discount
  return getBestDiscountDuration(discount);
};

/**
 * Calculate ROI (Return on Investment) message based on pricing
 */
export const getROIMessage = (duration: InternshipDuration): string => {
  const messages: Record<InternshipDuration, string> = {
    '15-days': 'Best for quick upskilling',
    '1-month': 'Most popular choice',
    '2-months': 'Best value for comprehensive learning',
    '3-months': 'Ultimate career transformation package'
  };
  
  return messages[duration];
};
