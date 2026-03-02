// Team member types

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  bio?: string;
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}
