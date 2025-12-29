export interface BlogData {
  _id: string;                    // MongoDB ID
  id: string;                     // Alias for _id
  title: string;                  // Main title
  slug: string;                   // URL-friendly slug
  description: string;            // Short preview/intro
  content: string;                // Full HTML/text content
  author: string;                 // Author name
  authorImage: string;            // Author profile image (URL)
  thumbnail: string;              // Cover image
  category: string;               // E.g. "Technology", "Design", etc.
  tags: string[];                 // ["react", "startup"], etc.
  readTime: number;               // In minutes
  featured: boolean;              // Highlighted/pinned on frontpage
  status: 'published' | 'draft' | 'archived'; // Workflow status
  rating: number;                 // 0–5 star (user/editorial)
  views: number;                  // View count
  likes: number;                  // Like count
  comments: number;               // Number of comments
  seoDescription: string;         // For <meta name="description">
  keywords: string[];             // For SEO
  publishedDate: string;          // ISO string
  createdAt: string;              // ISO string
  updatedAt: string;              // ISO string (last update)

  // Optional fields
  coverImageBlur?: string;        // base64 tiny image preview for LQIP
  relatedIds?: string[];          // Related blog IDs
  socialShareUrl?: string;        // Prefilled social share URL
}

// For API responses
export interface BlogsApiResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  data: BlogData[];
}

export interface BlogApiResponse {
  success: boolean;
  data: BlogData;
}

export interface CategoriesApiResponse {
  success: boolean;
  data: string[];
}
