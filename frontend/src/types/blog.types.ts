export interface BlogData {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  authorImage: string;
  publishedDate: string; // ISO string
  category: string;
  tags: string[];
  readTime: number; // in minutes
  thumbnail: string;
  featured: boolean;
  rating: number; // 0-5
  views: number;
  likes: number;
  comments: number;
  slug: string;
  seoDescription: string;
  keywords: string[];
  status: 'published' | 'draft' | 'archived';
  updatedAt: string; // ISO string
}