export interface BlogData {
  id: string;                     // Unique blog identifier
  title: string;                  // Main title
  description: string;            // Short preview/intro
  content: string;                // Full HTML/text content
  author: string;                 // Author name
  authorImage: string;            // Author profile image (URL)
  publishedDate: string;          // ISO string (e.g., "2023-11-07T10:00:00Z")
  category: string;               // E.g. "Tech", "Business", etc.
  tags: string[];                 // ["react", "startup"], etc.
  readTime: number;               // In minutes
  thumbnail: string;              // Cover image
  featured: boolean;              // Highlighted/pinned on frontpage
  rating: number;                 // 0–5 star (user/editorial)
  views: number;                  // View count
  likes: number;                  // Like count
  comments: number;               // Number of comments (can also be comment IDs)
  slug: string;                   // For SEO/URLs (optional if you only route by id)
  seoDescription: string;         // For <meta name="description">
  keywords: string[];             // For SEO, e.g. ["ai","startup","web"]
  status: 'published' | 'draft' | 'archived'; // Workflow status
  updatedAt: string;              // ISO string (last update)

//optional
    coverImageBlur?: string;        // base64 tiny image preview for LQIP
  relatedIds?: string[];          // Related blog IDs
  socialShareUrl?: string;        // Prefilled social share URL

}
