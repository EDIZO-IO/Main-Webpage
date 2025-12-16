import { useState, useEffect, useMemo } from 'react';
import type { BlogData } from '../../types/blog.types';
import { blogsData } from '../../data/blogs.data';

// --- Singleton cache for stat updates (views, likes, comments)
interface StatUpdates {
  [blogId: string]: {
    views?: number;
    likes?: number;
    comments?: number;
  };
}

let statUpdates: StatUpdates = {};

// Load stat updates from localStorage
const loadStatUpdates = (): StatUpdates => {
  try {
    const stored = localStorage.getItem('blogStatUpdates');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save stat updates to localStorage
const saveStatUpdates = (updates: StatUpdates) => {
  try {
    localStorage.setItem('blogStatUpdates', JSON.stringify(updates));
  } catch (e) {
    console.warn('Failed to save stat updates:', e);
  }
};

// Initialize stat updates from localStorage
statUpdates = loadStatUpdates();

// Merge static data with stat updates
const getMergedBlogs = (): BlogData[] => {
  return blogsData.map(blog => {
    const updates = statUpdates[blog.id] || {};
    return {
      ...blog,
      views: blog.views + (updates.views || 0),
      likes: blog.likes + (updates.likes || 0),
      comments: blog.comments + (updates.comments || 0),
    };
  });
};

// === Main blogs hook ===
export const useBlogs = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate async loading for smooth UX
    const timer = setTimeout(() => {
      try {
        const mergedBlogs = getMergedBlogs();
        // Sort by date (newest first)
        mergedBlogs.sort((a, b) =>
          new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
        );
        setBlogs(mergedBlogs);
        setLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load blogs');
        setLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const refresh = () => {
    const mergedBlogs = getMergedBlogs();
    mergedBlogs.sort((a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
    setBlogs(mergedBlogs);
  };

  return { blogs, loading, error, refresh };
};

// === Blog by id/slug hook ===
export const useBlog = (idOrSlug: string | undefined) => {
  const { blogs, loading: loadingAll, error: errorAll } = useBlogs();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingAll) { setLoading(true); return; }
    if (errorAll) { setError(errorAll); setLoading(false); return; }
    if (!idOrSlug) { setError('Blog ID not provided'); setLoading(false); return; }

    const found = blogs.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
    if (found) {
      setBlog(found);
      setError(null);
    } else {
      setError(`Blog with ID "${idOrSlug}" not found`);
      setBlog(null);
    }
    setLoading(false);
  }, [idOrSlug, blogs, loadingAll, errorAll]);

  return { blog, loading, error };
};

// === Update blog view count ===
export const incrementBlogView = (idOrSlug: string) => {
  const blog = blogsData.find(b => b.id === idOrSlug || b.slug === idOrSlug);
  if (blog) {
    if (!statUpdates[blog.id]) statUpdates[blog.id] = {};
    statUpdates[blog.id].views = (statUpdates[blog.id].views || 0) + 1;
    saveStatUpdates(statUpdates);
  }
};

// === Update blog likes ===
export const addBlogLike = (idOrSlug: string) => {
  const blog = blogsData.find(b => b.id === idOrSlug || b.slug === idOrSlug);
  if (blog) {
    if (!statUpdates[blog.id]) statUpdates[blog.id] = {};
    statUpdates[blog.id].likes = (statUpdates[blog.id].likes || 0) + 1;
    saveStatUpdates(statUpdates);
  }
};

// === Update comment count ===
export const addBlogComment = (idOrSlug: string) => {
  const blog = blogsData.find(b => b.id === idOrSlug || b.slug === idOrSlug);
  if (blog) {
    if (!statUpdates[blog.id]) statUpdates[blog.id] = {};
    statUpdates[blog.id].comments = (statUpdates[blog.id].comments || 0) + 1;
    saveStatUpdates(statUpdates);
  }
};

// === Filtered Blogs ===
export const useFilteredBlogs = (
  category: string = 'All',
  searchTerm: string = '',
  minRating: number = 0
) => {
  const { blogs, loading, error } = useBlogs();

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

  return { blogs: filteredBlogs, loading, error };
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
  const { blogs, loading, error } = useBlogs();

  const categories = useMemo(() => {
    if (loading || blogs.length === 0) return ['All'];

    const uniqueCategories = Array.from(new Set(blogs.map((b) => b.category))).sort();
    return ['All', ...uniqueCategories];
  }, [blogs, loading]);

  return { categories, loading, error };
};

// === Related Blogs ===
export const useRelatedBlogs = (currentBlogId: string, limit: number = 3) => {
  const { blogs, loading, error } = useBlogs();

  const relatedBlogs = useMemo(() => {
    if (loading || blogs.length === 0) return [];

    const currentBlog = blogs.find(b => b.id === currentBlogId || b.slug === currentBlogId);
    if (!currentBlog) return [];

    // Find blogs with matching category or tags
    const related = blogs
      .filter(b => b.id !== currentBlog.id)
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

// === Clear stat updates (for testing) ===
export const clearBlogsCache = () => {
  statUpdates = {};
  localStorage.removeItem('blogStatUpdates');
  console.log('🗑️ Blog stats cleared');
};
