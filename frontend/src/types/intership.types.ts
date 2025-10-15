// frontend/src/types/internship.types.ts

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
 * Discount information for different durations (percentage)
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
  discount?: InternshipDiscount; // NEW
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
  pricing?: InternshipPricing;
  discount?: InternshipDiscount; // NEW
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
  pricing?: {
    '15-days': number;
    '1-month': number;
    '2-months': number;
    '3-months': number;
  };
  discount?: {
    '15-days': number;
    '1-month': number;
    '2-months': number;
    '3-months': number;
  };
}

/**
 * Response from Google Sheets API (Extended with discount columns 30-33)
 */
export interface InternshipSheetRow {
  id: string;
  title: string;
  category: string;
  mode: 'Online' | 'Offline';
  company: string;
  image: string;
  rating: string;
  description: string;
  whyChoose1: string;
  whyChoose2: string;
  whyChoose3: string;
  whyChoose4: string;
  whyChoose5: string;
  whyChoose6: string;
  whyChoose7: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  benefit4: string;
  benefit5: string;
  benefit6: string;
  benefit7: string;
  syllabus15Days: string;
  syllabus1Month: string;
  syllabus2Months: string;
  syllabus3Months: string;
  price15Days?: string;
  price1Month?: string;
  price2Months?: string;
  price3Months?: string;
  discount15Days?: string; // NEW - Column 30 (AE)
  discount1Month?: string; // NEW - Column 31 (AF)
  discount2Months?: string; // NEW - Column 32 (AG)
  discount3Months?: string; // NEW - Column 33 (AH)
}

/**
 * Category types
 */
export type InternshipCategory = 
  | 'Design' 
  | 'Development' 
  | 'HR' 
  | 'Data Science' 
  | 'Java' 
  | 'Python' 
  | 'Marketing' 
  | 'AI/ML' 
  | 'C#';

/**
 * Duration options
 */
export type InternshipDuration = '15-days' | '1-month' | '2-months' | '3-months';

/**
 * Filter options for internships
 */
export interface InternshipFilters {
  category?: InternshipCategory | 'All';
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
 */
export interface PricingTier {
  duration: InternshipDuration;
  label: string;
  originalPrice: number; // NEW
  discount: number; // NEW (percentage 0-100)
  finalPrice: number; // NEW (calculated)
  savings: number; // NEW (amount saved)
  description: string;
  features: string[];
  isPopular?: boolean;
}

/**
 * Course period configuration (for application form with discount)
 */
export interface CoursePeriod {
  value: string;
  label: string;
  originalPrice: number; // NEW
  discount: number; // NEW
  finalPrice: number; // NEW
  savings: number; // NEW
  description: string;
  popular?: boolean;
  features: string[];
}

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
  coursePeriod: string;
  internshipId: string;
  internshipTitle: string;
  company: string;
  selectedOriginalPrice: number; // NEW
  selectedDiscount: number; // NEW
  selectedFinalPrice: number; // NEW
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
  return Math.round(originalPrice - (originalPrice * discountPercent / 100));
};

export const calculateSavings = (originalPrice: number, finalPrice: number): number => {
  return originalPrice - finalPrice;
};
