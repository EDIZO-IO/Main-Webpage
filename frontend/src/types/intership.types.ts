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
}

/**
 * Why Choose Edizo points (7 points)
 */
export interface WhyChooseEdizo {
  point1: string; // 100% Internship Certification
  point2: string; // Real-Time, Hands-On Project for Each Course
  point3: string; // Learn from Experienced Industry Mentors
  point4: string; // Placement Guidance & Portfolio Support
  point5: string; // Flexible Duration: 15 Days to 3 Months
  point6: string; // Paid Internship Opportunities
  point7: string; // Modes: Online & Offline
}

/**
 * Benefits points (7 points)
 */
export interface Benefits {
  benefit1: string; // Gain In-Demand Industry Skills
  benefit2: string; // Build Strong Resume with Real-Time Projects
  benefit3: string; // Improve Communication & Team Collaboration
  benefit4: string; // Internship Certificate Recognized by Companies
  benefit5: string; // Opportunity to Work on Live Client Projects
  benefit6: string; // Boost Confidence for Interviews & Job Roles
  benefit7: string; // Get Exposure to Professional Tools & Platforms
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
}

/**
 * Response from Google Sheets API (Extended with pricing columns)
 */
export interface InternshipSheetRow {
  id: string;
  title: string;
  category: string;
  mode: 'Online' | 'Offline';
  company: string;
  image: string;
  rating: string; // Comes as string from sheets
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
  price15Days?: string; // Optional pricing columns (26-29)
  price1Month?: string;
  price2Months?: string;
  price3Months?: string;
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
  maxPrice?: number; // Added price filter
  minPrice?: number; // Added minimum price filter
  duration?: InternshipDuration; // Added duration filter
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
 * Pricing tier for display purposes
 */
export interface PricingTier {
  duration: InternshipDuration;
  label: string;
  price: number;
  originalPrice?: number; // Optional: for showing discounts
  discount?: number; // Optional: discount percentage
  description: string;
  features: string[];
  isPopular?: boolean;
  savings?: number; // Amount saved
}

/**
 * Course period configuration (for application form)
 */
export interface CoursePeriod {
  value: string;
  label: string;
  price: number;
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
  selectedPrice: number;
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
