/**
 * Internship Utility Functions
 * 
 * Helper functions for internship data manipulation
 * Note: Google Sheets parsing functions removed - data now comes from REST API
 */

/**
 * Calculate final price after discount
 */
export const calculateFinalPrice = (originalPrice, discountPercent) => {
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
export const calculateSavings = (originalPrice, finalPrice) => {
  return Math.max(0, originalPrice - finalPrice);
};

/**
 * Filter internships by category
 */
export const filterByCategory = (internships, category) => {
  if (category === 'All' || !category) return internships;
  return internships.filter((i) => i.category === category);
};

/**
 * Filter internships by mode
 */
export const filterByMode = (internships, mode) => {
  if (mode === 'All') return internships;
  return internships.filter((i) => i.mode === mode);
};

/**
 * Filter internships by search term
 */
export const filterBySearch = (internships, searchTerm) => {
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
export const getUniqueCategories = (internships) => {
  const categories = new Set(internships.map((i) => i.category));
  return ['All', ...Array.from(categories).sort()];
};

/**
 * Get trending internships
 */
export const getTrendingInternships = (internships, minRating = 4.5) => {
  return internships.filter((i) => i.rating >= minRating);
};

/**
 * Sort internships by rating
 */
export const sortByRating = (internships, ascending = false) => {
  return [...internships].sort((a, b) =>
    ascending ? a.rating - b.rating : b.rating - a.rating
  );
};

/**
 * Format price with currency
 */
export const formatPrice = (price, currency = 'INR', locale = 'en-IN') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Calculate discount percentage (between two prices)
 */
export const calculateDiscountPercent = (originalPrice, discountedPrice) => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Calculate price with coupon discount
 */
export const calculatePriceWithCoupon = (originalPrice, coupon) => {
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
 * Find valid coupon by code for a specific internship and duration (Legacy)
 */
export const findValidCoupon = (internship, couponCode, duration) => {
  // New schema - check coupon_code field
  if (internship.coupon_code && internship.coupon_code.toUpperCase() === couponCode.toUpperCase()) {
    const couponDiscountKey = `coupon_discount_${duration.replace('-', '_')}`;
    const discountValue = internship[couponDiscountKey] || 0;
    
    if (discountValue > 0) {
      return {
        code: internship.coupon_code,
        discountType: 'percentage',
        discountValue,
        isActive: true
      };
    }
  }
  
  // Legacy schema - check availableCoupons array
  if (internship.availableCoupons) {
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
  }
  
  return null;
};

/**
 * Get pricing tier details with discount and coupon calculations (New Schema)
 */
export const getPricingTiers = (internship, appliedCoupon) => {
  const durations = ['15-days', '1-month', '2-months', '3-months'];

  const labels = {
    '15-days': '15 Days',
    '1-month': '1 Month',
    '2-months': '2 Months',
    '3-months': '3 Months'
  };

  const descriptions = {
    '15-days': 'Quick introduction and basics',
    '1-month': 'Comprehensive learning with projects',
    '2-months': 'In-depth training with real-world projects',
    '3-months': 'Complete mastery with industry exposure'
  };

  const featuresList = {
    '15-days': ['Basic concepts', 'Mini project', 'Certificate', 'Email support'],
    '1-month': ['Advanced topics', 'Group project', 'Certificate', 'Mentorship', 'Q&A sessions'],
    '2-months': ['Industry project', 'Portfolio building', 'Certificate', 'Mentorship', 'Code reviews', 'Interview prep'],
    '3-months': ['Live client project', 'Full mentorship', 'Certificate', 'Placement guidance', 'Interview prep', 'Resume building']
  };

  const pricingMap = {
    '15-days': internship?.price_15_days || 0,
    '1-month': internship?.price_1_month || 0,
    '2-months': internship?.price_2_months || 0,
    '3-months': internship?.price_3_months || 0
  };

  const discountMap = {
    '15-days': internship?.discount_15_days || 0,
    '1-month': internship?.discount_1_month || 0,
    '2-months': internship?.discount_2_months || 0,
    '3-months': internship?.discount_3_months || 0
  };

  const couponDiscountMap = {
    '15-days': internship?.coupon_discount_15_days || 0,
    '1-month': internship?.coupon_discount_1_month || 0,
    '2-months': internship?.coupon_discount_2_months || 0,
    '3-months': internship?.coupon_discount_3_months || 0
  };

  return durations.map((duration) => {
    const originalPrice = pricingMap[duration];
    const discountPercent = discountMap[duration];
    const couponDiscountPercent = couponDiscountMap[duration];
    const baseFinalPrice = calculateFinalPrice(originalPrice, discountPercent);
    const baseSavings = calculateSavings(originalPrice, baseFinalPrice);

    // Apply coupon discount if available
    let finalPrice = baseFinalPrice;
    let savings = baseSavings;
    let appliedCouponInfo = null;

    if (appliedCoupon && appliedCoupon.isValid && appliedCoupon.code) {
      const couponApplied = calculatePriceWithCoupon(baseFinalPrice, {
        code: appliedCoupon.code,
        discountType: 'percentage',
        discountValue: appliedCoupon.discountValue || couponDiscountPercent,
        applicableDurations: undefined,
        minOrderAmount: undefined,
        maxDiscountAmount: undefined,
        validFrom: undefined,
        validUntil: undefined,
        usageLimit: undefined,
        usedCount: undefined,
        isActive: true
      });

      if (couponApplied.isValid) {
        finalPrice = couponApplied.finalPrice;
        savings = calculateSavings(originalPrice, finalPrice);
        appliedCouponInfo = couponApplied;
      }
    } else if (couponDiscountPercent > 0) {
      const couponApplied = calculatePriceWithCoupon(baseFinalPrice, {
        code: internship.coupon_code || 'COUPON',
        discountType: 'percentage',
        discountValue: couponDiscountPercent,
        applicableDurations: undefined,
        minOrderAmount: undefined,
        maxDiscountAmount: undefined,
        validFrom: undefined,
        validUntil: undefined,
        usageLimit: undefined,
        usedCount: undefined,
        isActive: true
      });

      if (couponApplied.isValid) {
        finalPrice = couponApplied.finalPrice;
        savings = calculateSavings(originalPrice, finalPrice);
        appliedCouponInfo = couponApplied;
      }
    }

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
      appliedCoupon: appliedCouponInfo
    };
  });
};

/**
 * Get best discount duration (New Schema - for internship object)
 */
export const getBestDiscountDurationNew = (internship) => {
  if (!internship) return '1-month';

  const durations = ['15-days', '1-month', '2-months', '3-months'];
  let maxDiscount = 0;
  let bestDuration = '1-month';

  durations.forEach(duration => {
    const baseDiscount = internship[`discount_${duration.replace('-', '_')}`] || 0;
    const couponDiscount = internship[`coupon_discount_${duration.replace('-', '_')}`] || 0;
    const totalDiscount = baseDiscount + couponDiscount;

    if (totalDiscount > maxDiscount) {
      maxDiscount = totalDiscount;
      bestDuration = duration;
    }
  });

  return bestDuration;
};

/**
 * Check if internship has any discount (New Schema)
 */
export const hasDiscountNew = (internship) => {
  if (!internship) return false;

  const durations = ['15-days', '1-month', '2-months', '3-months'];
  for (const duration of durations) {
    const key = `discount_${duration.replace('-', '_')}`;
    const couponKey = `coupon_discount_${duration.replace('-', '_')}`;
    if ((internship[key] || 0) > 0 || (internship[couponKey] || 0) > 0) {
      return true;
    }
  }
  return false;
};

/**
 * Get highest discount percentage (New Schema)
 */
export const getHighestDiscountNew = (internship) => {
  if (!internship) return 0;

  const durations = ['15-days', '1-month', '2-months', '3-months'];
  let maxDiscount = 0;

  durations.forEach(duration => {
    const baseDiscount = internship[`discount_${duration.replace('-', '_')}`] || 0;
    const couponDiscount = internship[`coupon_discount_${duration.replace('-', '_')}`] || 0;
    maxDiscount = Math.max(maxDiscount, baseDiscount, couponDiscount);
  });

  return maxDiscount;
};

/**
 * Sort internships by best discount (New Schema)
 */
export const sortByDiscountNew = (internships, ascending = false) => {
  return [...internships].sort((a, b) => {
    const discountA = getHighestDiscountNew(a);
    const discountB = getHighestDiscountNew(b);
    return ascending ? discountA - discountB : discountB - discountA;
  });
};

/**
 * Get cheapest final price across all durations (New Schema)
 */
export const getCheapestPriceNew = (internship, appliedCoupon) => {
  if (!internship) return 0;

  const durations = ['15-days', '1-month', '2-months', '3-months'];

  const prices = durations.map(duration => {
    const key = `price_${duration.replace('-', '_')}`;
    const discKey = `discount_${duration.replace('-', '_')}`;
    const couponDiscKey = `coupon_discount_${duration.replace('-', '_')}`;

    const original = internship[key] || 0;
    const disc = internship[discKey] || 0;
    const couponDisc = internship[couponDiscKey] || 0;
    let baseFinalPrice = calculateFinalPrice(original, disc);

    if (!appliedCoupon && couponDisc > 0) {
      baseFinalPrice = calculateFinalPrice(baseFinalPrice, couponDisc);
    }

    if (appliedCoupon && appliedCoupon.isValid && appliedCoupon.code) {
      const couponApplied = calculatePriceWithCoupon(baseFinalPrice, {
        code: appliedCoupon.code,
        discountType: 'percentage',
        discountValue: appliedCoupon.discountValue || couponDisc,
        applicableDurations: undefined,
        minOrderAmount: undefined,
        maxDiscountAmount: undefined,
        validFrom: undefined,
        validUntil: undefined,
        usageLimit: undefined,
        usedCount: undefined,
        isActive: true
      });

      if (couponApplied.isValid) {
        return couponApplied.finalPrice;
      }
    }

    return baseFinalPrice;
  }).filter(p => p > 0);

  return prices.length > 0 ? Math.min(...prices) : 0;
};

/**
 * Sort internships by cheapest price (New Schema)
 */
export const sortByPriceNew = (internships, ascending = true, appliedCoupon) => {
  return [...internships].sort((a, b) => {
    const priceA = getCheapestPriceNew(a, appliedCoupon);
    const priceB = getCheapestPriceNew(b, appliedCoupon);
    return ascending ? priceA - priceB : priceB - priceA;
  });
};

/**
 * Filter by price range (New Schema)
 */
export const filterByPriceRangeNew = (internships, minPrice = 0, maxPrice = Infinity, duration = '1-month', appliedCoupon) => {
  return internships.filter((i) => {
    const priceKey = `price_${duration.replace('-', '_')}`;
    const discKey = `discount_${duration.replace('-', '_')}`;
    const couponDiscKey = `coupon_discount_${duration.replace('-', '_')}`;

    const originalPrice = i[priceKey] || 0;
    const discountPercent = i[discKey] || 0;
    const couponDiscountPercent = i[couponDiscKey] || 0;
    let baseFinalPrice = calculateFinalPrice(originalPrice, discountPercent);

    if (!appliedCoupon && couponDiscountPercent > 0) {
      baseFinalPrice = calculateFinalPrice(baseFinalPrice, couponDiscountPercent);
    }

    let finalPrice = baseFinalPrice;
    if (appliedCoupon && appliedCoupon.isValid && appliedCoupon.code) {
      const couponApplied = calculatePriceWithCoupon(baseFinalPrice, {
        code: appliedCoupon.code,
        discountType: 'percentage',
        discountValue: appliedCoupon.discountValue || couponDiscountPercent,
        applicableDurations: undefined,
        minOrderAmount: undefined,
        maxDiscountAmount: undefined,
        validFrom: undefined,
        validUntil: undefined,
        usageLimit: undefined,
        usedCount: undefined,
        isActive: true
      });

      if (couponApplied.isValid) {
        finalPrice = couponApplied.finalPrice;
      }
    }

    return finalPrice >= minPrice && finalPrice <= maxPrice;
  });
};

// Legacy function wrappers for backward compatibility
export const getBestDiscountDuration = (discount, couponDiscounts) => {
  // Check if called with old signature (two objects) or new (internship object)
  if (typeof discount === 'object' && discount !== null && !Array.isArray(discount) && 
      (discount.price_15_days !== undefined || discount['15-days'] !== undefined)) {
    return getBestDiscountDurationNew(discount);
  }
  // Old signature
  if (!discount && !couponDiscounts) return '1-month';
  const durations = ['15-days', '1-month', '2-months', '3-months'];
  let maxDiscount = 0;
  let bestDuration = '1-month';
  durations.forEach(duration => {
    const baseDiscount = discount?.[duration] || 0;
    const couponDiscount = couponDiscounts?.[duration] || 0;
    const totalDiscount = baseDiscount + couponDiscount;
    if (totalDiscount > maxDiscount) {
      maxDiscount = totalDiscount;
      bestDuration = duration;
    }
  });
  return bestDuration;
};

export const hasDiscount = (discount, couponDiscounts) => {
  if (typeof discount === 'object' && discount !== null && !Array.isArray(discount) && discount.price_15_days !== undefined) {
    return hasDiscountNew(discount);
  }
  if (!discount && !couponDiscounts) return false;
  if (discount && Object.values(discount).some((d) => d > 0)) return true;
  if (couponDiscounts && Object.values(couponDiscounts).some((d) => d > 0)) return true;
  return false;
};

export const getHighestDiscount = (discount, couponDiscounts) => {
  if (typeof discount === 'object' && discount !== null && !Array.isArray(discount) && discount.price_15_days !== undefined) {
    return getHighestDiscountNew(discount);
  }
  if (!discount && !couponDiscounts) return 0;
  const baseMax = discount ? Math.max(...Object.values(discount)) : 0;
  const couponMax = couponDiscounts ? Math.max(...Object.values(couponDiscounts)) : 0;
  return Math.max(baseMax, couponMax);
};

export const sortByDiscount = (internships, ascending = false) => {
  return sortByDiscountNew(internships, ascending);
};

export const getCheapestPrice = (internship, discount, couponDiscounts, appliedCoupon) => {
  if (typeof internship === 'object' && internship.price_15_days !== undefined) {
    return getCheapestPriceNew(internship, discount);
  }
  return getCheapestPriceNew({ price_15_days: internship, '15-days': discount, coupon_discounts: couponDiscounts }, appliedCoupon);
};

export const sortByPrice = (internships, ascending = true, appliedCoupon) => {
  return sortByPriceNew(internships, ascending, appliedCoupon);
};

export const filterByPriceRange = (internships, minPrice = 0, maxPrice = Infinity, duration = '1-month', appliedCoupon) => {
  return filterByPriceRangeNew(internships, minPrice, maxPrice, duration, appliedCoupon);
};

/**
 * Validate internship data
 */
export const isValidInternship = (internship) => {
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
export const getMostPopularDuration = (discount, couponDiscounts) => {
  if (!discount && !couponDiscounts) return '1-month';
  return getBestDiscountDuration(discount, couponDiscounts);
};

/**
 * Calculate ROI message based on duration
 */
export const getROIMessage = (duration) => {
  const messages = {
    '15-days': 'Best for quick upskilling',
    '1-month': 'Most popular choice',
    '2-months': 'Best value for comprehensive learning',
    '3-months': 'Ultimate career transformation package'
  };

  return messages[duration];
};

/**
 * Check if coupon code is valid for a specific internship
 */
export const validateCouponForInternship = (internship, couponCode, duration) => {
  return !!findValidCoupon(internship, couponCode, duration);
};

/**
 * Get available coupon codes for an internship
 */
export const getAvailableCoupons = (internship, duration) => {
  if (!internship.availableCoupons) return [];

  if (duration) {
    return internship.availableCoupons.filter(coupon =>
      coupon.isActive &&
      (!coupon.applicableDurations || coupon.applicableDurations.includes(duration))
    );
  }

  return internship.availableCoupons.filter(coupon => coupon.isActive);
};

/**
 * Format coupon discount display
 */
export const formatCouponDiscount = (coupon) => {
  if (!coupon.isValid) return '';

  if (coupon.discountType === 'percentage') {
    return `${coupon.discountValue}% OFF`;
  } else {
    return `${formatPrice(coupon.appliedDiscountAmount)} OFF`;
  }
};
