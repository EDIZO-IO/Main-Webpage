import type { ReactNode, ComponentType } from 'react';

// --- Team Member Base Type ---
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  /**
   * `photo`: Can be:
   *   - A filename in /assets/team/ (e.g. "john.png")
   *   - A full asset path (e.g. "/assets/team/john.png")
   *   - Any absolute URL (e.g. "https://cdn.site.com/avatar.jpg")
   * Preferred: keep all team images in /public/assets/team/ for static serving,
   * or provide absolute/remote URLs if using CDN or external avatar system.
   */
  photo: string;
  email: string;
}

// --- Modal Props for Team Member Details ---
export interface TeamMemberModalProps {
  member: TeamMember;
  onClose: () => void;
}

// --- Hook Return Type for Team Loading ---
export interface UseTeamMembersReturn {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
}

// --- Supported Social Media Platforms (expandable) ---
export type SocialPlatform = 'email'; // Add 'twitter' | 'linkedin' | etc. as needed

// --- Social Media Link Type ---
export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
}

// --- Team Member With Socials (for richer UI) ---
export interface TeamMemberWithSocials extends TeamMember {
  socialLinks: SocialLink[];
}

// --- Helper: Is URL Valid? ---
export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '' || url === '#' || url === 'N/A') {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// --- Helper: Is Email Valid? ---
export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// --- Helper: Detect Social Platform (expand logic for more platforms) ---
export const getSocialPlatform = (url: string): SocialPlatform | null => {
  if (url.toLowerCase().includes('mailto:') || isValidEmail(url)) {
    return 'email';
  }
  // Expand here for other platforms (e.g., twitter.com, linkedin.com)
  return null;
};

// --- Type for Google Sheets Team row (all strings; parsing/number conversion in hook) ---
export interface TeamSheetRow {
  id: string;
  name: string;
  role: string;
  /**
   * Can be a filename (resolved to /assets/team/), a public path, or an absolute URL.
   */
  photo: string;
  email: string;
}
