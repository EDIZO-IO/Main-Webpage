// frontend/src/types/internship.types.ts

/**
 * Duration options as a const for better type safety
 */
export const INTERNSHIP_DURATIONS = ['15-days', '1-month', '2-months', '3-months'] as const;
export type InternshipDuration = typeof INTERNSHIP_DURATIONS[number];

/**
 * Pricing information for different durations
 */
export interface InternshipPricing {
  '15-days': number;
  '1-month': number;
  '2-months': number;
  '3-months': number;
}

/**
 * Discount information for different durations (percentage 0-100)
 */
export interface InternshipDiscount {
  '15-days': number;
  '1-month': number;
  '2-months': number;
  '3-months': number;
}

/**
 * Internship basic information interface
 */
export interface InternshipBasic {
  id: string;
  title: string;
  category: string;
  mode: 'Online' | 'Offline';
  company: string;
  image: string;
  rating: number;
  description: string;
  isTrending?: boolean;
  pricing?: InternshipPricing;
  discount?: InternshipDiscount;
}

/**
 * Why Choose Edizo points (7 points)
 */
export interface WhyChooseEdizo {
  point1: string;
  point2: string;
  point3: string;
  point4: string;
  point5: string;
  point6: string;
  point7: string;
}

/**
 * Benefits points (7 points)
 */
export interface Benefits {
  benefit1: string;
  benefit2: string;
  benefit3: string;
  benefit4: string;
  benefit5: string;
  benefit6: string;
  benefit7: string;
}

/**
 * Syllabus for different durations
 */
export interface Syllabus {
  '15-days': string[];
  '1-month': string[];
  '2-months': string[];
  '3-months': string[];
}

/**
 * Complete internship details interface
 */
export interface InternshipDetails extends InternshipBasic {
  whyChooseEdizo: WhyChooseEdizo;
  benefits: Benefits;
  syllabus: Syllabus;
  pricing: InternshipPricing;
  discount: InternshipDiscount;
}

/**
 * Simplified version for arrays (like in the original JSON)
 */
export interface InternshipData {
  id: string;
  title: string;
  category: string;
  mode: 'Online' | 'Offline';
  company: string;
  image: string;
  rating: number;
  description: string;
  whyChooseEdizo: string[];
  benefits: string[];
  syllabus: {
    '15-days': string[];
    '1-month': string[];
    '2-months': string[];
    '3-months': string[];
  };
  pricing: {
    '15-days': number;
    '1-month': number;
    '2-months': number;
    '3-months': number;
  };
  discount: {
    '15-days': number;
    '1-month': number;
    '2-months': number;
    '3-months': number;
  };
}

/**
 * Response from Google Sheets API (Extended with discount columns 30-33)
 * Columns A-AH (33 columns total)
 */
export interface InternshipSheetRow {
  // Basic Info (A-H: 8 columns)
  id: string;                    // A
  title: string;                 // B
  category: string;              // C
  mode: 'Online' | 'Offline';    // D
  company: string;               // E
  image: string;                 // F
  rating: string;                // G
  description: string;           // H
  
  // Why Choose Edizo (I-O: 7 columns)
  whyChoose1: string;            // I
  whyChoose2: string;            // J
  whyChoose3: string;            // K
  whyChoose4: string;            // L
  whyChoose5: string;            // M
  whyChoose6: string;            // N
  whyChoose7: string;            // O
  
  // Benefits (P-V: 7 columns)
  benefit1: string;              // P
  benefit2: string;              // Q
  benefit3: string;              // R
  benefit4: string;              // S
  benefit5: string;              // T
  benefit6: string;              // U
  benefit7: string;              // V
  
  // Syllabus (W-Z: 4 columns)
  syllabus15Days: string;        // W
  syllabus1Month: string;        // X
  syllabus2Months: string;       // Y
  syllabus3Months: string;       // Z
  
  // Pricing (AA-AD: 4 columns)
  price15Days?: string;          // AA
  price1Month?: string;          // AB
  price2Months?: string;         // AC
  price3Months?: string;         // AD
  
  // Discount (AE-AH: 4 columns)
  discount15Days?: string;       // AE
  discount1Month?: string;       // AF
  discount2Months?: string;      // AG
  discount3Months?: string;      // AH
}

/**
 * Category types
 */
export const INTERNSHIP_CATEGORIES = [
  'All',
  'Design',
  'Development',
  'HR',
  'Data Science',
  'Java',
  'Python',
  'Marketing',
  'AI/ML',
  'C#'
] as const;

export type InternshipCategory = typeof INTERNSHIP_CATEGORIES[number];

/**
 * Filter options for internships
 */
export interface InternshipFilters {
  category?: InternshipCategory;
  mode?: 'Online' | 'Offline' | 'All';
  searchTerm?: string;
  minRating?: number;
  maxPrice?: number;
  minPrice?: number;
  duration?: InternshipDuration;
  isTrending?: boolean;
}

/**
 * API Response wrapper
 */
export interface InternshipAPIResponse {
  success: boolean;
  data: InternshipData[];
  error?: string;
}

/**
 * Pricing tier for display purposes (with discount support)
 * ✅ UNIFIED: This is now the single source of truth for pricing display
 */
export interface PricingTier {
  duration: InternshipDuration;
  label: string;
  originalPrice: number;
  discount: number;
  finalPrice: number;
  savings: number;
  description: string;
  features: string[];
  isPopular?: boolean; // ✅ Unified to use isPopular
}

/**
 * Course period configuration (for application form with discount)
 * ✅ Now just an alias of PricingTier for backwards compatibility
 */
export type CoursePeriod = PricingTier;

/**
 * Currency formatter helper type
 */
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

/**
 * Price display options
 */
export interface PriceDisplayOptions {
  currency: CurrencyCode;
  showDecimals?: boolean;
  showCurrencySymbol?: boolean;
  locale?: string;
}

/**
 * Form data for internship application
 */
export interface InternshipApplicationForm {
  name: string;
  email: string;
  phone: string;
  university: string;
  yearOfStudy: string;
  education: string;
  academicExperience: string;
  message: string;
  coursePeriod: InternshipDuration;
  internshipId: string;
  internshipTitle: string;
  company: string;
  selectedOriginalPrice: number;
  selectedDiscount: number;
  selectedFinalPrice: number;
  selectedSavings: number;
}

/**
 * Application submission status
 */
export type ApplicationStatus = 'idle' | 'processing' | 'success' | 'error';

/**
 * Application API response
 */
export interface ApplicationAPIResponse {
  success: boolean;
  message: string;
  data?: {
    applicationId?: string;
    confirmationEmail?: string;
  };
  error?: string;
}

/**
 * Utility functions for price calculations
 */
export const calculateFinalPrice = (originalPrice: number, discountPercent: number): number => {
  if (originalPrice < 0 || discountPercent < 0 || discountPercent > 100) {
    console.warn('Invalid price or discount values');
    return originalPrice;
  }
  return Math.round(originalPrice - (originalPrice * discountPercent / 100));
};

export const calculateSavings = (originalPrice: number, finalPrice: number): number => {
  return Math.max(0, originalPrice - finalPrice);
};

/**
 * Format price with currency
 */
export const formatPrice = (
  price: number,
  options: PriceDisplayOptions = { currency: 'INR', showDecimals: false, showCurrencySymbol: true }
): string => {
  const { currency, showDecimals, showCurrencySymbol, locale } = options;
  
  const formatter = new Intl.NumberFormat(locale || 'en-IN', {
    style: showCurrencySymbol ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  
  return formatter.format(price);
};

/**
 * Validate discount percentage
 */
export const isValidDiscount = (discount: number): boolean => {
  return discount >= 0 && discount <= 100;
};

/**
 * Get discount label
 */
export const getDiscountLabel = (discount: number): string => {
  if (discount === 0) return '';
  return `${discount}% OFF`;
};

/**
 * Type guard to check if internship has pricing
 */
export const hasValidPricing = (internship: InternshipBasic): internship is InternshipBasic & { pricing: InternshipPricing } => {
  return internship.pricing !== undefined;
};

/**
 * Type guard to check if internship has discount
 */
export const hasValidDiscount = (internship: InternshipBasic): internship is InternshipBasic & { discount: InternshipDiscount } => {
  return internship.discount !== undefined;
};
