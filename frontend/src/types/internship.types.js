// Internship types for TypeScript/JavaScript
// Updated: 2026-03-02 - Based on new spreadsheet schema

export interface Internship {
  id: string;
  internship_id: string;
  title: string;
  slug?: string;
  category: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  company: string;
  image_url?: string;
  rating: number;
  description: string;
  
  // Why Choose Edizo (6 items)
  why_choose_edizo_1?: string;
  why_choose_edizo_2?: string;
  why_choose_edizo_3?: string;
  why_choose_edizo_4?: string;
  why_choose_edizo_5?: string;
  why_choose_edizo_6?: string;
  
  // Benefits (7 items)
  benefit_1?: string;
  benefit_2?: string;
  benefit_3?: string;
  benefit_4?: string;
  benefit_5?: string;
  benefit_6?: string;
  benefit_7?: string;
  
  // Syllabus by duration (JSON arrays)
  syllabus_15_days?: string[];
  syllabus_1_month?: string[];
  syllabus_2_months?: string[];
  syllabus_3_months?: string[];
  
  // Pricing by duration
  price_15_days?: number;
  price_1_month?: number;
  price_2_months?: number;
  price_3_months?: number;
  
  // Discount by duration
  discount_15_days?: number;
  discount_1_month?: number;
  discount_2_months?: number;
  discount_3_months?: number;
  
  // Coupon information
  coupon_code?: string;
  coupon_discount_15_days?: number;
  coupon_discount_1_month?: number;
  coupon_discount_2_months?: number;
  coupon_discount_3_months?: number;
  
  // Additional fields
  duration_weeks?: number;
  skills_taught?: string[];
  prerequisites?: string[];
  certification_included?: boolean;
  placement_support?: boolean;
  mentor_support?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
  enrollment_count?: number;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

// Helper interface for legacy compatibility
export interface InternshipLegacy {
  id: string;
  internship_id: string;
  title: string;
  slug?: string;
  category: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  company: string;
  image_url?: string;
  rating: number;
  review_count?: number;
  description: string;
  why_choose_edizo?: string[];
  benefits?: string[];
  syllabus?: {
    '15-days'?: string[];
    '1-month'?: string[];
    '2-months'?: string[];
    '3-months'?: string[];
  };
  pricing?: {
    '15-days'?: number;
    '1-month'?: number;
    '2-months'?: number;
    '3-months'?: number;
  };
  discount?: {
    '15-days'?: number;
    '1-month'?: number;
    '2-months'?: number;
    '3-months'?: number;
  };
  available_coupons?: Coupon[];
  coupon_discounts?: {
    '15-days'?: number;
    '1-month'?: number;
    '2-months'?: number;
    '3-months'?: number;
  };
  duration_weeks?: number;
  skills_taught?: string[];
  prerequisites?: string[];
  certification_included?: boolean;
  placement_support?: boolean;
  mentor_support?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
  enrollment_count?: number;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  applicableDurations?: string[];
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  validFrom?: string;
  validUntil?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
}

export interface InternshipFilters {
  category?: string;
  mode?: string;
  searchTerm?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
}

// Helper function to convert new schema to legacy format for compatibility
export const convertToInternshipLegacy = (internship: Internship): InternshipLegacy => {
  return {
    id: internship.id,
    internship_id: internship.internship_id,
    title: internship.title,
    slug: internship.slug,
    category: internship.category,
    mode: internship.mode,
    company: internship.company,
    image_url: internship.image_url,
    rating: internship.rating,
    description: internship.description,
    why_choose_edizo: [
      internship.why_choose_edizo_1,
      internship.why_choose_edizo_2,
      internship.why_choose_edizo_3,
      internship.why_choose_edizo_4,
      internship.why_choose_edizo_5,
      internship.why_choose_edizo_6
    ].filter(Boolean) as string[],
    benefits: [
      internship.benefit_1,
      internship.benefit_2,
      internship.benefit_3,
      internship.benefit_4,
      internship.benefit_5,
      internship.benefit_6,
      internship.benefit_7
    ].filter(Boolean) as string[],
    syllabus: {
      '15-days': internship.syllabus_15_days,
      '1-month': internship.syllabus_1_month,
      '2-months': internship.syllabus_2_months,
      '3-months': internship.syllabus_3_months
    },
    pricing: {
      '15-days': internship.price_15_days,
      '1-month': internship.price_1_month,
      '2-months': internship.price_2_months,
      '3-months': internship.price_3_months
    },
    discount: {
      '15-days': internship.discount_15_days,
      '1-month': internship.discount_1_month,
      '2-months': internship.discount_2_months,
      '3-months': internship.discount_3_months
    },
    coupon_discounts: {
      '15-days': internship.coupon_discount_15_days,
      '1-month': internship.coupon_discount_1_month,
      '2-months': internship.coupon_discount_2_months,
      '3-months': internship.coupon_discount_3_months
    },
    duration_weeks: internship.duration_weeks,
    skills_taught: internship.skills_taught,
    prerequisites: internship.prerequisites,
    certification_included: internship.certification_included,
    placement_support: internship.placement_support,
    mentor_support: internship.mentor_support,
    is_active: internship.is_active,
    is_featured: internship.is_featured,
    enrollment_count: internship.enrollment_count,
    display_order: internship.display_order,
    created_at: internship.created_at,
    updated_at: internship.updated_at
  };
};
