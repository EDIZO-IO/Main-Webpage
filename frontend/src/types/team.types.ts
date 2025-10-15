// src/types/team.types.ts

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  photo: string;
  email: string;
}

export interface TeamMemberModalProps {
  member: TeamMember;
  onClose: () => void;
}

export interface UseTeamMembersReturn {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
}

// ✅ Social media platform types (only email now)
export type SocialPlatform = 'email';

// ✅ Social media link interface
export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

// ✅ Team member with parsed social links
export interface TeamMemberWithSocials extends TeamMember {
  socialLinks: SocialLink[];
}

// ✅ Helper function to check if URL is valid
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

// ✅ Helper function to check if email is valid
export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim() === '') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Helper to get social platform from URL (only email supported now)
export const getSocialPlatform = (url: string): SocialPlatform | null => {
  if (url.toLowerCase().includes('mailto:') || isValidEmail(url)) {
    return 'email';
  }
  return null;
};

// ✅ Type for Google Sheets Team row (simplified to 4 columns)
export interface TeamSheetRow {
  id: string;
  name: string;
  role: string;
  photo: string;
  email: string;
}
