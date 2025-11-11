// frontend/src/pages/Blogs.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Calendar, User, Clock, Eye, Heart, MessageCircle, Star, Filter, ChevronDown,
  TrendingUp, Clock as ClockIcon, X, Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlogs, useFilteredBlogs, useTrendingBlogs, useBlogCategories } from '../components/hooks/useBlogs';
import type { BlogData } from '../types/blog.types';
import BlogCard from '../components/widgets/Blogscard';

const Blogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);

  const { blogs, loading, error } = useBlogs();
  const { blogs: filteredBlogs } = useFilteredBlogs(selectedCategory, searchTerm, minRating);
  const { blogs: trendingBlogs } = useTrendingBlogs(4.0, 5);
  const { categories } = useBlogCategories();

  // Featured blogs (top 3 by rating and views)
  const featuredBlogs = [...blogs]
    .sort((a, b) => (b.rating * 1000 + b.views) - (a.rating * 1000 + a.views))
    .slice(0, 3);

  // Recent blogs (top 6 by publish date)
  const recentBlogs = [...blogs]
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, 6);

  // Reset filters function for Show All Blogs
  const showAllBlogs = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinRating(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Blogs</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Our <span className="text-red-600">Blog</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Discover insights, tips, and stories from our team. Stay updated with the latest in technology, business, and innovation.
            </p>
            {/* Show Blogs Button */}
   
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="hidden lg:flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={3}>3+ Stars</option>
                <option value={2}>2+ Stars</option>
              </select>
            </div>
          </div>
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 pt-4 border-t border-gray-200"
              >
                <div className="flex flex-col gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {categories.map((category: string) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={4}>4+ Stars</option>
                    <option value={3}>3+ Stars</option>
                    <option value={2}>2+ Stars</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Blog Listing - Shows All Filtered/Unfiltered Blogs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <ClockIcon className="w-8 h-8 text-red-600" />
            All Blogs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(filteredBlogs.length > 0 ? filteredBlogs : blogs).map((blog: BlogData, index: number) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                index={index}
                onClick={() => setSelectedBlog(blog)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {selectedBlog.thumbnail && (
                  <img
                    src={selectedBlog.thumbnail}
                    alt={selectedBlog.title}
                    className="w-full h-64 object-cover rounded-t-2xl"
                  />
                )}
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8">
                <BlogCard
                  blog={selectedBlog}
                  showFullContent={true}
                  onClick={() => {}}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blogs;