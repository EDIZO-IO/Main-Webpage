// frontend/src/types/internship.types.ts

/**
 * Duration options as a const for better type safety
 */
export const INTERNSHIP_DURATIONS = ['15-days', '1-month', '2-months', '3-months'] as const;

/**
 * Pricing information for different durations
 */
export 

/**
 * Discount information for different durations (percentage 0-100)
 */
export 

/**
 * Coupon discount information for different durations (percentage 0-100)
 */
export 

/**
 * Coupon code interface
 */
export 

/**
 * Internship basic information interface
 */
export 

/**
 * Why Choose Edizo points (7 points)
 */
export 

/**
 * Benefits points (7 points)
 */
export 

/**
 * Syllabus for different durations
 */
export 

/**
 * Complete internship details interface
 */
export interface InternshipDetails extends InternshipBasic {
  whyChooseEdizo;
  benefits;
  syllabus;
  pricing;
  discount;
}

/**
 * Simplified version for arrays (like in the original JSON)
 */
export interface InternshipData {
  id;
  title;
  category;
  mode: 'Online' | 'Offline';
  company;
  image;
  rating;
  description;
  whyChooseEdizo;
  benefits;
  syllabus: {
    '15-days';
    '1-month';
    '2-months';
    '3-months';
  };
  pricing: {
    '15-days';
    '1-month';
    '2-months';
    '3-months';
  };
  discount: {
    '15-days';
    '1-month';
    '2-months';
    '3-months';
  };
  couponDiscounts?: {
    '15-days';
    '1-month';
    '2-months';
    '3-months';
  };
  availableCoupons?;
}

/**
 * Response from Google Sheets API (Extended with discount columns 30-33)
 * Columns A-AH (33 columns total)
 */
export 

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

/**
 * Filter options for internships
 */
export 

/**
 * API Response wrapper
 */
export 

/**
 * Pricing tier for display purposes (with discount support)
 * ✅ UNIFIED: This is now the single source of truth for pricing display
 */
export 

/**
 * Applied coupon information
 */
export 

/**
 * Course period configuration (for application form with discount)
 * ✅ Now just an alias of PricingTier for backwards compatibility
 */

/**
 * Currency formatter helper type
 */

/**
 * Price display options
 */
export 

/**
 * Form data for internship application
 */
export 

/**
 * Application submission status
 */

/**
 * Application API response
 */
export interface ApplicationAPIResponse {
  success;
  message;
  data?: {
    applicationId?;
    confirmationEmail?;
  };
  error?;
}

/**
 * Coupon validation response
 */
export 

/**
 * Utility functions for price calculations
 */
export const calculateFinalPrice = (originalPrice, discountPercent) => {
  if (originalPrice < 0 || discountPercent < 0 || discountPercent > 100) {
    console.warn('Invalid price or discount values');
    return originalPrice;
  }
  return Math.round(originalPrice - (originalPrice * discountPercent / 100));
};

export const calculateSavings = (originalPrice, finalPrice) => {
  return Math.max(0, originalPrice - finalPrice);
};

/**
 * Calculate price with coupon discount
 */
export const calculatePriceWithCoupon = (
  originalPrice,
  coupon
) => {
  const now = new Date();
  
  // Check if coupon is active
  if (!coupon.isActive) {
    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      appliedDiscountAmount,
      originalPrice,
      finalPrice,
      isValid,
      errorMessage: 'Coupon is not active'
    };
  }

  // Check validity dates if specified
  if (coupon.validFrom && new Date(coupon.validFrom) > now) {
    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      appliedDiscountAmount,
      originalPrice,
      finalPrice,
      isValid,
      errorMessage: 'Coupon is not yet valid'
    };
  }

  if (coupon.validUntil && new Date(coupon.validUntil) < now) {
    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      appliedDiscountAmount,
      originalPrice,
      finalPrice,
      isValid,
      errorMessage: 'Coupon has expired'
    };
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usedCount && coupon.usedCount >= coupon.usageLimit) {
    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      appliedDiscountAmount,
      originalPrice,
      finalPrice,
      isValid,
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
    isValid
  };
};

/**
 * Format price with currency
 */
export const formatPrice = (
  price,
  options = { currency: 'INR', showDecimals, showCurrencySymbol }
) => {
  const { currency, showDecimals, showCurrencySymbol, locale } = options;
  
  const formatter = new Intl.NumberFormat(locale || 'en-IN', {
    style: showCurrencySymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: showDecimals ? 2 ,
    maximumFractionDigits: showDecimals ? 2 ,
  });
  
  return formatter.format(price);
};

/**
 * Validate discount percentage
 */
export const isValidDiscount = (discount) => {
  return discount >= 0 && discount <= 100;
};

/**
 * Get discount label
 */
export const getDiscountLabel = (discount) => {
  if (discount === 0) return '';
  return `${discount}% OFF`;
};

/**
 * Type guard to check if internship has pricing
 */
export const hasValidPricing = (internship): internship is InternshipBasic & { pricing } => {
  return internship.pricing !== undefined;
};

/**
 * Type guard to check if internship has discount
 */
export const hasValidDiscount = (internship): internship is InternshipBasic & { discount } => {
  return internship.discount !== undefined;
};

/**
 * Find valid coupon by code for a specific internship and duration
 */
export const findValidCoupon = (
  internship,
  couponCode,
  duration
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