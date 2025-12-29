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
 * Coupon discount information for different durations (percentage 0-100)
 */
export interface CouponDiscounts {
  '15-days': number;
  '1-month': number;
  '2-months': number;
  '3-months': number;
}

/**
 * Coupon code interface
 */
export interface CouponCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  applicableDurations?: InternshipDuration[];
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom?: string; // ISO date string
  validUntil?: string; // ISO date string
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
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
  couponDiscounts?: CouponDiscounts;
  availableCoupons?: CouponCode[];
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
  couponDiscounts?: {
    '15-days': number;
    '1-month': number;
    '2-months': number;
    '3-months': number;
  };
  availableCoupons?: CouponCode[];
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

  // Coupon Code (AI)
  couponCode?: string;

  // Coupon Discount by Duration (AJ-AM: 35-38)
  couponDiscount15Days?: string;
  couponDiscount1Month?: string;
  couponDiscount2Months?: string;
  couponDiscount3Months?: string;
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
  appliedCoupon?: AppliedCoupon;
}

/**
 * Applied coupon information
 */
export interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  appliedDiscountAmount: number;
  originalPrice: number;
  finalPrice: number;
  isValid: boolean;
  errorMessage?: string;
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
  appliedCoupon?: AppliedCoupon;
  couponCode?: string;
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
 * Coupon validation response
 */
export interface CouponValidationResponse {
  success: boolean;
  isValid: boolean;
  appliedCoupon?: AppliedCoupon;
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
 * Calculate price with coupon discount
 */
export const calculatePriceWithCoupon = (
  originalPrice: number,
  coupon: CouponCode
): AppliedCoupon => {
  const now = new Date();
  
  // Check if coupon is active
  if (!coupon.isActive) {
    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      appliedDiscountAmount: 0,
      originalPrice,
      finalPrice: originalPrice,
      isValid: false,
      errorMessage: 'Coupon is not active'
    };
  }

  // Check validity dates if specified
  if (coupon.validFrom && new Date(coupon.validFrom) > now) {
    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      appliedDiscountAmount: 0,
      originalPrice,
      finalPrice: originalPrice,
      isValid: false,
      errorMessage: 'Coupon is not yet valid'
    };
  }

  if (coupon.validUntil && new Date(coupon.validUntil) < now) {
    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      appliedDiscountAmount: 0,
      originalPrice,
      finalPrice: originalPrice,
      isValid: false,
      errorMessage: 'Coupon has expired'
    };
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit) {
    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      appliedDiscountAmount: 0,
      originalPrice,
      finalPrice: originalPrice,
      isValid: false,
      errorMessage: 'Coupon usage limit reached'
    };
  }

  let discountAmount = 0;
  let finalPrice = originalPrice;

  if (coupon.discountType === 'percentage') {
    discountAmount = Math.min(
      originalPrice * (coupon.discountValue / 100),
      coupon.maxDiscountAmount || Infinity
    );
  } else { // fixed
    discountAmount = Math.min(coupon.discountValue, originalPrice);
    if (coupon.maxDiscountAmount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
    }
  }

  finalPrice = Math.max(0, originalPrice - discountAmount);

  return {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    appliedDiscountAmount: Math.round(discountAmount),
    originalPrice,
    finalPrice: Math.round(finalPrice),
    isValid: true
  };
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

/**
 * Find valid coupon by code for a specific internship and duration
 */
export const findValidCoupon = (
  internship: InternshipBasic,
  couponCode: string,
  duration: InternshipDuration
): CouponCode | null => {
  if (!internship.availableCoupons) return null;

  const coupon = internship.availableCoupons.find(
    c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive
  );

  if (!coupon) return null;

  // Check if coupon is valid for this duration
  if (coupon.applicableDurations && !coupon.applicableDurations.includes(duration)) {
    return null;
  }

  const now = new Date();
  
  // Check validity dates
  if (coupon.validFrom && new Date(coupon.validFrom) > now) return null;
  if (coupon.validUntil && new Date(coupon.validUntil) < now) return null;

  // Check usage limit
  if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit) {
    return null;
  }

  return coupon;
};