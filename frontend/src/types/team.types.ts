// src/types/team.types.ts

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  photo: string;
  email: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  github: string;          // ✅ NEW
  portfolio: string;       // ✅ NEW
  bio: string;
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

// ✅ NEW: Social media platform types
export type SocialPlatform = 
  | 'email'
  | 'linkedin'
  | 'facebook'
  | 'instagram'
  | 'github'
  | 'portfolio';

// ✅ NEW: Social media link interface
export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

// ✅ NEW: Team member with parsed social links
export interface TeamMemberWithSocials extends TeamMember {
  socialLinks: SocialLink[];
}

// ✅ NEW: Helper function to check if URL is valid
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

// ✅ NEW: Helper to get social platform from URL
export const getSocialPlatform = (url: string): SocialPlatform | null => {
  if (!isValidUrl(url)) return null;
  
  const urlLower = url.toLowerCase();
  if (urlLower.includes('linkedin.com')) return 'linkedin';
  if (urlLower.includes('facebook.com')) return 'facebook';
  if (urlLower.includes('instagram.com')) return 'instagram';
  if (urlLower.includes('github.com')) return 'github';
  if (urlLower.includes('mailto:')) return 'email';
  return 'portfolio'; // Default for other URLs
};

// ✅ NEW: Type for Google Sheets Team row (with new columns)
export interface TeamSheetRow {
  id: string;
  name: string;
  role: string;
  photo: string;
  email: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  github: string;      // NEW - Column I
  portfolio: string;   // NEW - Column J
  bio: string;         // NEW - Column K (moved from I to K)
}
