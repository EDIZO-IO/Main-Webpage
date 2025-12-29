import type { BlogData } from '../types/blog.types';

// Helper to generate a consistent ID from title or other unique fields
const generateId = (title: string, date: string): string => {
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
  const datePart = new Date(date).getTime().toString(36);
  return `${cleanTitle}-${datePart}`;
};

// Parse blog data from Google Sheets values
export const parseBlogsFromSheets = (data: any): BlogData[] => {
  const rows = data.values;
  if (!rows || rows.length <= 1) return [];

  const headers = rows[0];
  const blogs: BlogData[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    // Create a map from headers to row values
    const blog: any = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j]?.toLowerCase().trim();
      blog[header] = row[j]?.toString().trim() || '';
    }

    // Create blog object with proper structure
    const blogData: BlogData = {
      id: generateId(blog.title || `blog-${i}`, blog.publisheddate || new Date().toISOString()),
      title: blog.title || `Untitled Blog ${i}`,
      description: blog.description || '',
      content: blog.content || '',
      author: blog.author || 'Unknown Author',
      authorImage: blog.authorimage || blog.author_img || blog['author image'] || '',
      publishedDate: blog.publisheddate || blog['published date'] || new Date().toISOString(),
      category: blog.category || 'General',
      tags: blog.tags ? blog.tags.split(',').map((tag: string) => tag.trim()) : [],
      readTime: parseInt(blog.readtime || blog['read time'] || '5', 10) || 5,
      thumbnail: blog.thumbnail || blog.image || '',
      featured: blog.featured === 'true' || blog.featured === '1' || false,
      rating: parseFloat(blog.rating || '0') || 0,
      views: parseInt(blog.views || '0', 10) || 0,
      likes: parseInt(blog.likes || '0', 10) || 0,
      comments: parseInt(blog.comments || '0', 10) || 0,
      slug: blog.slug || blog.title?.toLowerCase().replace(/[^a-z0-9]/g, '-') || `blog-${i}`,
      seoDescription: blog.seodescription || blog['seo description'] || '',
      keywords: blog.keywords ? blog.keywords.split(',').map((kw: string) => kw.trim()) : [],
      status: (blog.status || 'published').toLowerCase() as 'published' | 'draft' | 'archived',
      updatedAt: blog.updatedat || blog['updated at'] || new Date().toISOString(),
    };

    // Validate required fields
    if (blogData.title && blogData.title !== '') {
      blogs.push(blogData);
    }
  }

  // Sort by published date (newest first)
  return blogs.sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
};

// Helper function to get blog by ID
export const getBlogById = (blogs: BlogData[], id: string): BlogData | undefined => {
  return blogs.find(blog => blog.id === id);
};

// Helper function to get blogs by category
export const getBlogsByCategory = (blogs: BlogData[], category: string): BlogData[] => {
  return blogs.filter(blog => blog.category.toLowerCase() === category.toLowerCase());
};

// Helper function to get featured blogs
export const getFeaturedBlogs = (blogs: BlogData[]): BlogData[] => {
  return blogs.filter(blog => blog.featured);
};

// Helper function to get trending blogs (by rating and views)
export const getTrendingBlogs = (blogs: BlogData[], limit: number = 5): BlogData[] => {
  return blogs
    .sort((a, b) => (b.rating * 1000 + b.views) - (a.rating * 1000 + a.views))
    .slice(0, limit);
};

// Helper function to search blogs
export const searchBlogs = (
  blogs: BlogData[], 
  searchTerm: string
): BlogData[] => {
  if (!searchTerm) return blogs;
  
  const term = searchTerm.toLowerCase().trim();
  return blogs.filter(blog => 
    blog.title.toLowerCase().includes(term) ||
    blog.description.toLowerCase().includes(term) ||
    blog.content.toLowerCase().includes(term) ||
    blog.author.toLowerCase().includes(term) ||
    blog.tags.some(tag => tag.toLowerCase().includes(term)) ||
    blog.category.toLowerCase().includes(term)
  );
};

// Helper function to get recent blogs
export const getRecentBlogs = (blogs: BlogData[], limit: number = 5): BlogData[] => {
  return blogs.slice(0, limit);
};

// Helper function to get blogs by tag
export const getBlogsByTag = (blogs: BlogData[], tag: string): BlogData[] => {
  return blogs.filter(blog => 
    blog.tags.some(blogTag => 
      blogTag.toLowerCase() === tag.toLowerCase()
    )
  );
};

// Helper function to get unique categories
export const getUniqueCategories = (blogs: BlogData[]): string[] => {
  const categories = new Set<string>();
  blogs.forEach(blog => {
    if (blog.category) {
      categories.add(blog.category);
    }
  });
  return Array.from(categories).sort();
};

// Helper function to get unique tags
export const getUniqueTags = (blogs: BlogData[]): string[] => {
  const tags = new Set<string>();
  blogs.forEach(blog => {
    blog.tags.forEach(tag => {
      if (tag) {
        tags.add(tag);
      }
    });
  });
  return Array.from(tags).sort();
};