

// --- Team Member Base Type ---
export 

// --- Modal Props for Team Member Details ---
export 

// --- Hook Return Type for Team Loading ---
export 

// --- Supported Social Media Platforms (expandable) ---
 // Add 'twitter' | 'linkedin' | etc. as needed

// --- Social Media Link Type ---
export interface SocialLink {
  platform;
  url;
  icon: ComponentType<{ size?; className? }>;
  label;
}

// --- Team Member With Socials (for richer UI) ---
export interface TeamMemberWithSocials extends TeamMember {
  socialLinks;
}

// --- Helper: Is URL Valid? ---
export const isValidUrl = (url) => {
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
export const isValidEmail = (email) => {
  if (!email || email.trim() === '') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// --- Helper: Detect Social Platform (expand logic for more platforms) ---
export const getSocialPlatform = (url): SocialPlatform | null => {
  if (url.toLowerCase().includes('mailto:') || isValidEmail(url)) {
    return 'email';
  }
  // Expand here for other platforms (e.g., twitter.com, linkedin.com)
  return null;
};

// --- Type for Google Sheets Team row (all strings; parsing/number conversion in hook) ---
export 
