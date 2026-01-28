// src/types/webinar.ts

/**
 * Webinar status types
 */

/**
 * Webinar interface
 */
export 

/**
 * Webinar filter options
 */
export 

/**
 * Webinar API response
 */
export 

/**
 * Status priority mapping for sorting
 */
export const WEBINAR_STATUS_PRIORITY, number> = {
  'Confirmed',
  'Waiting',
  'Coming Soon',
  'Not Fixed'
};

/**
 * Status color mapping for UI
 */
export const WEBINAR_STATUS_COLORS, { bg; text; border }> = {
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
export const WEBINAR_STATUS_ICONS, string> = {
  'Confirmed': '✓',
  'Waiting': '⏳',
  'Coming Soon': '🔜',
  'Not Fixed': '❓'
};

/**
 * Utility function to format webinar date
 */
export const formatWebinarDate = (dateStr) => {
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
export const isUpcomingWebinar = (webinar) => {
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
export const isPastWebinar = (webinar) => {
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
export const getWebinarStatusBadge = (status) => {
  const colors = WEBINAR_STATUS_COLORS[status];
  return `${colors.bg} ${colors.text} ${colors.border}`;
};

/**
 * Type guard to validate webinar status
 */
export const isValidWebinarStatus = (status): status is WebinarStatus => {
  return ['Confirmed', 'Waiting', 'Not Fixed', 'Coming Soon'].includes(status);
};
