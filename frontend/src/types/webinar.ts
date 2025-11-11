// src/types/webinar.ts

/**
 * Webinar status types
 */
export type WebinarStatus = 'Confirmed' | 'Waiting' | 'Not Fixed' | 'Coming Soon';

/**
 * Webinar interface
 */
export interface Webinar {
  id: number;
  title: string;
  date: string; // Can be empty string if not fixed (format: YYYY-MM-DD or human-readable)
  status: WebinarStatus;
  location: string; // e.g., "Online", "Zoom", "Google Meet", or physical location
  description: string;
  registrationLink?: string; // Optional registration URL
}

/**
 * Webinar filter options
 */
export interface WebinarFilters {
  status?: WebinarStatus;
  searchTerm?: string;
  hasRegistrationLink?: boolean;
}

/**
 * Webinar API response
 */
export interface WebinarAPIResponse {
  success: boolean;
  data: Webinar[];
  error?: string;
}

/**
 * Status priority mapping for sorting
 */
export const WEBINAR_STATUS_PRIORITY: Record<WebinarStatus, number> = {
  'Confirmed': 0,
  'Waiting': 1,
  'Coming Soon': 2,
  'Not Fixed': 3
};

/**
 * Status color mapping for UI
 */
export const WEBINAR_STATUS_COLORS: Record<WebinarStatus, { bg: string; text: string; border: string }> = {
  'Confirmed': {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  'Waiting': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  'Coming Soon': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  'Not Fixed': {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  }
};

/**
 * Status icons mapping
 */
export const WEBINAR_STATUS_ICONS: Record<WebinarStatus, string> = {
  'Confirmed': '✓',
  'Waiting': '⏳',
  'Coming Soon': '🔜',
  'Not Fixed': '❓'
};

/**
 * Utility function to format webinar date
 */
export const formatWebinarDate = (dateStr: string): string => {
  if (!dateStr) return 'Date TBD';
  
  try {
    // Try to parse as ISO date
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch {
    // If parsing fails, return original string
  }
  
  return dateStr;
};

/**
 * Utility function to check if webinar is upcoming
 */
export const isUpcomingWebinar = (webinar: Webinar): boolean => {
  if (!webinar.date || webinar.status === 'Not Fixed') return false;
  
  try {
    const webinarDate = new Date(webinar.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return webinarDate >= today;
  } catch {
    return false;
  }
};

/**
 * Utility function to check if webinar is past
 */
export const isPastWebinar = (webinar: Webinar): boolean => {
  if (!webinar.date) return false;
  
  try {
    const webinarDate = new Date(webinar.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return webinarDate < today;
  } catch {
    return false;
  }
};

/**
 * Utility function to get webinar status badge classes
 */
export const getWebinarStatusBadge = (status: WebinarStatus): string => {
  const colors = WEBINAR_STATUS_COLORS[status];
  return `${colors.bg} ${colors.text} ${colors.border}`;
};

/**
 * Type guard to validate webinar status
 */
export const isValidWebinarStatus = (status: string): status is WebinarStatus => {
  return ['Confirmed', 'Waiting', 'Not Fixed', 'Coming Soon'].includes(status);
};
