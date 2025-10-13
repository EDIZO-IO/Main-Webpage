// src/types/webinar.ts
export type WebinarStatus = 'Confirmed' | 'Waiting' | 'Not Fixed' | 'Coming Soon';

export interface Webinar {
  id: number;
  title: string;
  date: string; // Can be empty string if not fixed
  status: WebinarStatus;
  location: string;
  description: string;
  registrationLink?: string;
}
