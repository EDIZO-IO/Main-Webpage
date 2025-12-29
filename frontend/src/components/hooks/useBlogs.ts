import { useState, useEffect, useMemo, useCallback } from 'react';

// Blog interface matching MongoDB schema
export interface BlogData {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  authorImage: string;
  thumbnail: string;
  category: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  rating: number;
  views: number;
  likes: number;
  comments: number;
  seoDescription: string;
  keywords: string[];
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// === Main blogs hook - fetches from MongoDB ===
export const useBlogs = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/blogs?limit=50`);
      const data = await response.json();

      if (data.success && data.data) {
        // Map _id to id for compatibility
        const mappedBlogs = data.data.map((blog: BlogData) => ({
          ...blog,
          id: blog._id || blog.id
        }));
        setBlogs(mappedBlogs);
        setError(null);
      } else {
        setError('Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Unable to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, refresh: fetchBlogs };
};

// === Blog by id/slug hook ===
export const useBlog = (idOrSlug: string | undefined) => {
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idOrSlug) {
      setError('Blog ID not provided');
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/blogs/${idOrSlug}`);
        const data = await response.json();

        if (data.success && data.data) {
          setBlog({
            ...data.data,
            id: data.data._id || data.data.id
          });
          setError(null);
        } else {
          setError(data.message || 'Blog not found');
          setBlog(null);
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Unable to load blog');
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [idOrSlug]);

  return { blog, loading, error };
};

// === Like a blog ===
export const likeBlog = async (blogId: string): Promise<number | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${blogId}/like`, {
      method: 'POST'
    });
    const data = await response.json();
    return data.success ? data.likes : null;
  } catch (err) {
    console.error('Error liking blog:', err);
    return null;
  }
};

// === Filtered Blogs ===
export const useFilteredBlogs = (
  category: string = 'All',
  searchTerm: string = '',
  minRating: number = 0
) => {
  const { blogs, loading, error, refresh } = useBlogs();

  const filteredBlogs = useMemo(() => {
    if (loading || blogs.length === 0) return [];

    let filtered = [...blogs];

    if (category !== 'All') {
      filtered = filtered.filter((b) => b.category === category);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.description.toLowerCase().includes(term) ||
          b.category.toLowerCase().includes(term) ||
          b.author.toLowerCase().includes(term) ||
          b.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    if (minRating > 0) {
      filtered = filtered.filter((b) => b.rating >= minRating);
    }

    return filtered;
  }, [blogs, loading, category, searchTerm, minRating]);

  return { blogs: filteredBlogs, loading, error, refresh };
};

// === Trending Blogs ===
export const useTrendingBlogs = (minRating: number = 4.5, limit?: number) => {
  const { blogs, loading, error } = useBlogs();

  const trendingBlogs = useMemo(() => {
    if (loading || blogs.length === 0) return [];

    let trending = blogs
      .filter((b) => b.rating >= minRating)
      .sort((a, b) => b.rating - a.rating || b.views - a.views);

    if (limit && limit > 0) {
      trending = trending.slice(0, limit);
    }

    return trending;
  }, [blogs, loading, minRating, limit]);

  return { blogs: trendingBlogs, loading, error };
};

// === Recent Blogs ===
export const useRecentBlogs = (limit: number = 5) => {
  const { blogs, loading, error } = useBlogs();

  const recentBlogs = useMemo(() => {
    if (loading || blogs.length === 0) return [];

    const sorted = [...blogs].sort(
      (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );

    return limit ? sorted.slice(0, limit) : sorted;
  }, [blogs, loading, limit]);

  return { blogs: recentBlogs, loading, error };
};

// === Featured Blogs ===
export const useFeaturedBlogs = (limit?: number) => {
  const { blogs, loading, error } = useBlogs();

  const featuredBlogs = useMemo(() => {
    if (loading || blogs.length === 0) return [];

    let featured = blogs.filter((b) => b.featured);

    if (limit && limit > 0) {
      featured = featured.slice(0, limit);
    }

    return featured;
  }, [blogs, loading, limit]);

  return { blogs: featuredBlogs, loading, error };
};

// === Unique Categories ===
export const useBlogCategories = () => {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/blog-categories`);
        const data = await response.json();

        if (data.success && data.data) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// === Related Blogs ===
export const useRelatedBlogs = (currentBlogId: string, limit: number = 3) => {
  const { blogs, loading, error } = useBlogs();

  const relatedBlogs = useMemo(() => {
    if (loading || blogs.length === 0 || !currentBlogId) return [];

    const currentBlog = blogs.find(b => b.id === currentBlogId || b._id === currentBlogId || b.slug === currentBlogId);
    if (!currentBlog) return [];

    // Find blogs with matching category or tags
    const related = blogs
      .filter(b => b.id !== currentBlog.id && b._id !== currentBlog._id)
      .map(b => {
        let score = 0;
        if (b.category === currentBlog.category) score += 3;
        const matchingTags = b.tags.filter(tag => currentBlog.tags.includes(tag));
        score += matchingTags.length;
        return { blog: b, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.blog);

    return related;
  }, [blogs, loading, currentBlogId, limit]);

  return { blogs: relatedBlogs, loading, error };
};

// === Increment blog view (API call) ===
export const incrementBlogView = async (idOrSlug: string): Promise<void> => {
  // View is already incremented when fetching a single blog via the API
  // This is a no-op now but kept for backwards compatibility
  console.log('📊 View tracked for:', idOrSlug);
};

// === Like a blog (alias for likeBlog) ===
export const addBlogLike = async (idOrSlug: string): Promise<number | null> => {
  return likeBlog(idOrSlug);
};

// === Add comment count (placeholder - can be extended) ===
export const addBlogComment = async (idOrSlug: string): Promise<void> => {
  // In a full implementation, this would POST to an API endpoint
  console.log('💬 Comment tracked for:', idOrSlug);
};

// === Clear cache (for testing) ===
export const clearBlogsCache = () => {
  console.log('🗑️ Blog cache cleared');
};
