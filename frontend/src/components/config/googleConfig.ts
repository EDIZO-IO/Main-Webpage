// src/config/googleConfig.ts
export const GOOGLE_CONFIG = {
  CALENDAR_ID: import.meta.env.VITE_GOOGLE_CALENDAR_ID || process.env.REACT_APP_GOOGLE_CALENDAR_ID || 'primary',
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID || process.env.REACT_APP_GOOGLE_SHEET_ID || '',
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || process.env.REACT_APP_GOOGLE_API_KEY || '',
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
  SCOPES: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
  ]
};
