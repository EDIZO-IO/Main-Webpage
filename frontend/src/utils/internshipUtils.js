// frontend/src/utils/internshipUtils.js

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
 * Transform Google Sheets row data to InternshipData format (with pricing and discount)
 * Column mapping: A-AN (39 columns including coupon discount per duration)
 */
export const transformSheetRowToInternship = (row) => {
  // Helper to safely parse float
  const parseFloatSafe = (value) => {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Helper to safely parse array from comma-separated string
  const parseArray = (value) => {
    if (!value || value.trim() === '') return [];
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  };

  // Helper to parse coupon codes
  const parseCouponCodes = (value) => {
    if (!value || value.trim() === '') return [];

    // Handle the specific format from the sheet where coupon codes are stored as strings
    const couponStrings = value.split(',').map(code => code.trim()).filter(Boolean);

    if (couponStrings.length === 0) return [];

    // Map known coupon codes to their discount values
    const couponMap = {
      'EDIZOCOP': 20, // 20% discount for EDIZOCOP
      'SAVE10': 10,   // 10% discount for SAVE10
      'SAVE20': 20,   // 20% discount for SAVE20
      'SAVE25': 25,   // 25% discount for SAVE25
      'SAVE30': 30,   // 30% discount for SAVE30
      'SAVE50': 50,   // 50% discount for SAVE50
    };

    return couponStrings.map(code => {
      const upperCode = code.toUpperCase();
      const discountValue = couponMap[upperCode] || 10; // Default to 10% if not found

      return {
        code,
        discountType: 'percentage',
        discountValue,
        applicableDurations: undefined,
        minOrderAmount: undefined,
        maxDiscountAmount: undefined,
        validFrom: undefined,
        validUntil: undefined,
        usageLimit: undefined,
        usedCount: undefined,
        isActive: true
      };
    });
  };

  return {
    id: row[0] || '',
    title: row[1] || 'Untitled',
    category: row[2] || 'General',
    mode: (row[3] === 'Offline' ? 'Offline' : 'Online'),
    company: row[4] || 'EDIZO',
    image: row[5] || 'https://via.placeholder.com/400x300?text=No+Image',
    rating: parseFloatSafe(row[6]),
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
      '15-days': parseFloatSafe(row[26]),
      '1-month': parseFloatSafe(row[27]),
      '2-months': parseFloatSafe(row[28]),
      '3-months': parseFloatSafe(row[29]),
    },

    // Discount (columns AE-AH: 30-33)
    discount: {
      '15-days': parseFloatSafe(row[30]),
      '1-month': parseFloatSafe(row[31]),
      '2-months': parseFloatSafe(row[32]),
      '3-months': parseFloatSafe(row[33]),
    },

    // Coupon Codes (column AI)
    availableCoupons: parseCouponCodes(row[34]),

    // Coupon Discount by Duration (columns AJ-AM: 35-38)
    couponDiscounts: {
      '15-days': parseFloatSafe(row[35]),
      '1-month': parseFloatSafe(row[36]),
      '2-months': parseFloatSafe(row[37]),
      '3-months': parseFloatSafe(row[38]),
    }
  };
};

/**
 * Parse Google Sheets API response
 */
export const parseInternshipsFromSheets = (sheetData) => {
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
  internships,
  category
) => {
  if (category === 'All' || !category) return internships;
  return internships.filter((i) => i.category === category);
};

/**
 * Filter internships by mode
 */
export const filterByMode = (
  internships,
  mode
) => {
  if (mode === 'All') return internships;
  return internships.filter((i) => i.mode === mode);
};

/**
 * Filter internships by search term
 */
export const filterBySearch = (
  internships,
  searchTerm
) => {
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
export const getTrendingInternships = (
  internships,
  minRating = 4.5
) => {
  return internships.filter((i) => i.rating >= minRating);
};

/**
 * Sort internships by rating
 */
export const sortByRating = (
  internships,
  ascending = false
) => {
  return [...internships].sort((a, b) =>
    ascending ? a.rating - b.rating : b.rating - a.rating
  );
};

/**
 * Format price with currency
 */
export const formatPrice = (
  price,
  currency = 'INR',
  locale = 'en-IN'
) => {
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
 * Find valid coupon by code for a specific internship and duration
 */
export const findValidCoupon = (
  internship,
  couponCode,
  duration
) => {
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

/**
 * Get pricing tier details with discount and coupon calculations
 */
export const getPricingTiers = (
  pricing,
  discount,
  appliedCoupon,
  couponDiscounts
) => {
  const durations = [
    '15-days',
    '1-month',
    '2-months',
    '3-months'
  ];

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

  return durations.map((duration) => {
    const originalPrice = pricing?.[duration] || 0;
    const discountPercent = discount?.[duration] || 0;
    const couponDiscountPercent = couponDiscounts?.[duration] || 0;
    const baseFinalPrice = calculateFinalPrice(originalPrice, discountPercent);
    const baseSavings = calculateSavings(originalPrice, baseFinalPrice);

    // Apply coupon discount if available
    let finalPrice = baseFinalPrice;
    let savings = baseSavings;
    let appliedCouponInfo = appliedCoupon;

    if (appliedCoupon && appliedCoupon.isValid && appliedCoupon.code) {
      const couponApplied = calculatePriceWithCoupon(baseFinalPrice, {
        code: appliedCoupon.code,
        discountType: appliedCoupon.discountType,
        discountValue: appliedCoupon.discountValue,
        applicableDurations: undefined,
        minOrderAmount: appliedCoupon.originalPrice,
        maxDiscountAmount: appliedCoupon.appliedDiscountAmount,
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
      // Apply coupon discount from sheet data
      const couponApplied = calculatePriceWithCoupon(baseFinalPrice, {
        code: 'SHEET_COUPON',
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
 * Filter by price range (using final price after discount and coupon)
 */
export const filterByPriceRange = (
  internships,
  minPrice = 0,
  maxPrice = Infinity,
  duration = '1-month',
  appliedCoupon
) => {
  return internships.filter((i) => {
    const originalPrice = i.pricing?.[duration] || 0;
    const discountPercent = i.discount?.[duration] || 0;
    const couponDiscountPercent = i.couponDiscounts?.[duration] || 0;
    let baseFinalPrice = calculateFinalPrice(originalPrice, discountPercent);

    // Apply sheet coupon discount if no applied coupon
    if (!appliedCoupon && couponDiscountPercent > 0) {
      baseFinalPrice = calculateFinalPrice(baseFinalPrice, couponDiscountPercent);
    }

    // Apply user-applied coupon if provided
    let finalPrice = baseFinalPrice;
    if (appliedCoupon && appliedCoupon.isValid && appliedCoupon.code) {
      const couponApplied = calculatePriceWithCoupon(baseFinalPrice, {
        code: appliedCoupon.code,
        discountType: appliedCoupon.discountType,
        discountValue: appliedCoupon.discountValue,
        applicableDurations: undefined,
        minOrderAmount: appliedCoupon.originalPrice,
        maxDiscountAmount: appliedCoupon.appliedDiscountAmount,
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

/**
 * Format discount badge text
 */
export const formatDiscountBadge = (discountPercent, appliedCoupon, couponDiscount) => {
  if (appliedCoupon && appliedCoupon.isValid && appliedCoupon.code) {
    return `COUPON APPLIED`;
  }
  if (couponDiscount && couponDiscount > 0) {
    return `${couponDiscount}% OFF`;
  }
  if (discountPercent <= 0) return '';
  return `${discountPercent}% OFF`;
};

/**
 * Format savings text with coupon information
 */
export const formatSavings = (
  savings,
  currency = 'INR',
  appliedCoupon
) => {
  if (savings <= 0) return '';

  if (appliedCoupon && appliedCoupon.isValid && appliedCoupon.code) {
    return `Save ${formatPrice(savings, currency)} with ${appliedCoupon.code}`;
  }

  return `Save ${formatPrice(savings, currency)}`;
};

/**
 * Get best discount duration (returns the duration with highest discount)
 */
export const getBestDiscountDuration = (
  discount,
  couponDiscounts
) => {
  if (!discount && !couponDiscounts) return '1-month';

  const durations = [
    '15-days',
    '1-month',
    '2-months',
    '3-months'
  ];

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

/**
 * Check if internship has any discount
 */
export const hasDiscount = (discount, couponDiscounts) => {
  if (!discount && !couponDiscounts) return false;

  if (discount) {
    if (Object.values(discount).some((d) => d > 0)) return true;
  }

  if (couponDiscounts) {
    if (Object.values(couponDiscounts).some((d) => d > 0)) return true;
  }

  return false;
};

/**
 * Get highest discount percentage
 */
export const getHighestDiscount = (discount, couponDiscounts) => {
  if (!discount && !couponDiscounts) return 0;

  const baseMax = discount ? Math.max(...Object.values(discount)) : 0;
  const couponMax = couponDiscounts ? Math.max(...Object.values(couponDiscounts)) : 0;

  return Math.max(baseMax, couponMax);
};

/**
 * Sort internships by best discount
 */
export const sortByDiscount = (
  internships,
  ascending = false
) => {
  return [...internships].sort((a, b) => {
    const discountA = getHighestDiscount(a.discount, a.couponDiscounts);
    const discountB = getHighestDiscount(b.discount, b.couponDiscounts);
    return ascending ? discountA - discountB : discountB - discountA;
  });
};

/**
 * Get cheapest final price across all durations
 */
export const getCheapestPrice = (
  pricing,
  discount,
  couponDiscounts,
  appliedCoupon
) => {
  if (!pricing) return 0;

  const durations = [
    '15-days',
    '1-month',
    '2-months',
    '3-months'
  ];

  const prices = durations
    .map(duration => {
      const original = pricing[duration] || 0;
      const disc = discount?.[duration] || 0;
      const couponDisc = couponDiscounts?.[duration] || 0;
      let baseFinalPrice = calculateFinalPrice(original, disc);

      // Apply sheet coupon discount if no applied coupon
      if (!appliedCoupon && couponDisc > 0) {
        baseFinalPrice = calculateFinalPrice(baseFinalPrice, couponDisc);
      }

      // Apply user-applied coupon if provided
      if (appliedCoupon && appliedCoupon.isValid && appliedCoupon.code) {
        const couponApplied = calculatePriceWithCoupon(baseFinalPrice, {
          code: appliedCoupon.code,
          discountType: appliedCoupon.discountType,
          discountValue: appliedCoupon.discountValue,
          applicableDurations: undefined,
          minOrderAmount: appliedCoupon.originalPrice,
          maxDiscountAmount: appliedCoupon.appliedDiscountAmount,
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
    })
    .filter(p => p > 0);

  return prices.length > 0 ? Math.min(...prices) : 0;
};

/**
 * Sort internships by cheapest price
 */
export const sortByPrice = (
  internships,
  ascending = true,
  appliedCoupon
) => {
  return [...internships].sort((a, b) => {
    const priceA = getCheapestPrice(a.pricing, a.discount, a.couponDiscounts, appliedCoupon);
    const priceB = getCheapestPrice(b.pricing, b.discount, b.couponDiscounts, appliedCoupon);
    return ascending ? priceA - priceB : priceB - priceA;
  });
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
  // Default popular duration is 1-month
  if (!discount && !couponDiscounts) return '1-month';

  // Return duration with highest discount
  return getBestDiscountDuration(discount, couponDiscounts);
};

/**
 * Calculate ROI (Return on Investment) message based on pricing
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
export const validateCouponForInternship = (
  internship,
  couponCode,
  duration
) => {
  return !!findValidCoupon(internship, couponCode, duration);
};

/**
 * Get available coupon codes for an internship
 */
export const getAvailableCoupons = (
  internship,
  duration
) => {
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