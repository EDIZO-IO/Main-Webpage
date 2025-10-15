// src/config/googleConfig.ts

/**
 * Google API Configuration
 * Centralized configuration for Google Calendar and Google Sheets APIs
 */

// Environment variable helpers with detailed logging
const getEnvVar = (name: string, fallback: string = ''): string => {
  const value = import.meta.env[name] || fallback;
  
  if (!value && fallback === '') {
    console.warn(`⚠️ Environment variable ${name} is not set`);
  }
  
  return value;
};

// Google Calendar Configuration
export const CALENDAR_CONFIG = {
  CALENDAR_ID: getEnvVar('VITE_GOOGLE_CALENDAR_ID', '7ff204be43d9977d20a0e71282ae335a973e6b2a812dad20a429b6d20fbf91aa@group.calendar.google.com'),
  API_KEY: getEnvVar('VITE_GOOGLE_API_KEY'),
  CLIENT_ID: getEnvVar('VITE_GOOGLE_CLIENT_ID'),
  SCOPES: ['https://www.googleapis.com/auth/calendar.readonly'],
  DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
};

// Google Sheets Configuration
export const SHEETS_CONFIG = {
  SHEET_ID: getEnvVar('VITE_GOOGLE_SHEET_ID'),
  API_KEY: getEnvVar('VITE_GOOGLE_API_KEY'),
  SCOPES: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  DISCOVERY_DOCS: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  
  // Sheet Names
  SHEETS: {
    EVENTS: getEnvVar('VITE_EVENTS_SHEET_NAME', 'Events'),
    WEBINARS: getEnvVar('VITE_WEBINAR_SHEET_NAME', 'Webinars'),
    INTERNSHIPS: getEnvVar('VITE_INTERNSHIPS_SHEET_NAME', 'Internships'),
    TEAM: getEnvVar('VITE_TEAM_SHEET_NAME', 'Our Team'),
    APPLICATIONS: getEnvVar('VITE_APPLICATIONS_SHEET_NAME', 'Applications'),
    CONTACTS: getEnvVar('VITE_CONTACTS_SHEET_NAME', 'Contacts'),
  },
};

// Unified Google Configuration
export const GOOGLE_CONFIG = {
  CALENDAR_ID: CALENDAR_CONFIG.CALENDAR_ID,
  SHEET_ID: SHEETS_CONFIG.SHEET_ID,
  API_KEY: SHEETS_CONFIG.API_KEY,
  CLIENT_ID: CALENDAR_CONFIG.CLIENT_ID,
  SCOPES: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
  ],
};

// API Endpoints
export const GOOGLE_API_ENDPOINTS = {
  SHEETS_BASE: 'https://sheets.googleapis.com/v4/spreadsheets',
  CALENDAR_BASE: 'https://www.googleapis.com/calendar/v3',
  
  // Helper function to build Sheets API URL
  getSheetsUrl: (sheetName: string, range?: string) => {
    const baseUrl = `${GOOGLE_API_ENDPOINTS.SHEETS_BASE}/${SHEETS_CONFIG.SHEET_ID}/values`;
    const sheetRange = range ? `${sheetName}!${range}` : sheetName;
    return `${baseUrl}/${sheetRange}?key=${SHEETS_CONFIG.API_KEY}`;
  },
  
  // Helper function to build Calendar API URL
  getCalendarUrl: (calendarId?: string) => {
    const id = calendarId || CALENDAR_CONFIG.CALENDAR_ID;
    return `${GOOGLE_API_ENDPOINTS.CALENDAR_BASE}/calendars/${id}/events?key=${CALENDAR_CONFIG.API_KEY}`;
  },
};

// Configuration validation
export const validateGoogleConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!SHEETS_CONFIG.SHEET_ID) {
    errors.push('VITE_GOOGLE_SHEET_ID is not set');
  }
  
  if (!SHEETS_CONFIG.API_KEY) {
    errors.push('VITE_GOOGLE_API_KEY is not set');
  }
  
  if (!CALENDAR_CONFIG.CALENDAR_ID) {
    errors.push('VITE_GOOGLE_CALENDAR_ID is not set');
  }
  
  if (!CALENDAR_CONFIG.CLIENT_ID) {
    errors.push('VITE_GOOGLE_CLIENT_ID is not set');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

// Debug helper - logs configuration status
export const debugGoogleConfig = () => {
  console.log('🔍 ========================================');
  console.log('   GOOGLE API CONFIGURATION');
  console.log('🔍 ========================================');
  console.log('Environment Mode:', import.meta.env.MODE);
  console.log('---');
  
  console.log('📊 Google Sheets:');
  console.log('  Sheet ID:', SHEETS_CONFIG.SHEET_ID ? `✅ ${SHEETS_CONFIG.SHEET_ID}` : '❌ Missing');
  console.log('  API Key:', SHEETS_CONFIG.API_KEY ? `✅ Present (${SHEETS_CONFIG.API_KEY.substring(0, 10)}...)` : '❌ Missing');
  console.log('  Sheet Names:');
  Object.entries(SHEETS_CONFIG.SHEETS).forEach(([key, value]) => {
    console.log(`    - ${key}: ${value}`);
  });
  console.log('---');
  
  console.log('📅 Google Calendar:');
  console.log('  Calendar ID:', CALENDAR_CONFIG.CALENDAR_ID ? `✅ Present` : '❌ Missing');
  console.log('  Client ID:', CALENDAR_CONFIG.CLIENT_ID ? `✅ Present` : '❌ Missing');
  console.log('---');
  
  const validation = validateGoogleConfig();
  console.log('✅ Validation:', validation.valid ? 'PASSED' : 'FAILED');
  if (!validation.valid) {
    console.error('❌ Configuration Errors:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
  }
  console.log('🔍 ========================================\n');
};

// Auto-validate in development mode
if (import.meta.env.DEV) {
  const validation = validateGoogleConfig();
  if (!validation.valid) {
    console.warn('⚠️ Google API configuration issues detected:', validation.errors);
  }
}

// Export all configurations
export default GOOGLE_CONFIG;
