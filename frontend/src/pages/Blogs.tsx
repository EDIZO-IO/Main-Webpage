import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,Star, 
  TrendingUp, X
} from 'lucide-react';

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

  // UI helpers
  const handleCategoryClick = (cat: string) => setSelectedCategory(cat);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-16 flex items-center justify-center">
        <div className="animate-pulse w-full max-w-3xl">
          <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-16 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto text-center">
          <div className="text-red-500 text-6xl mb-5">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Blogs</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Hero Header */}
      <header className="relative w-full flex flex-col justify-center items-center pt-20 pb-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative text-center z-10"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">
            Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500">Edizo Blog</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-4">Tech, Business, and Stories from our teams. Discover insights and innovations every week.</p>
        </motion.div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-[-60px] w-72 h-72 bg-red-200/50 rounded-full blur-3xl" />
          <div className="absolute right-0 bottom-[-80px] w-80 h-80 bg-yellow-100/60 rounded-full blur-2xl" />
        </div>
      </header>

      {/* Search & Filters Section */}
      <section className="container mx-auto px-4 mb-8">
        <div className="bg-white/80 rounded-2xl shadow-lg p-6 sticky top-6 z-30">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent font-medium"
              />
            </div>
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto max-w-full">
              <motion.button
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition 
                  ${selectedCategory === 'All'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-red-50'}`}
                onClick={() => handleCategoryClick('All')}
                whileTap={{ scale: 0.9 }}
              >
                All
              </motion.button>
              {categories.map((cat: string) => (
                <motion.button
                  key={cat}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition 
                    ${selectedCategory === cat
                    ? 'bg-gradient-to-r from-orange-400 to-yellow-500 text-white shadow'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-yellow-50'}`}
                  onClick={() => handleCategoryClick(cat)}
                  whileTap={{ scale: 0.9 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
            {/* Rating Filter Pills */}
            <div className="flex items-center gap-2 ml-auto">
              {[0, 4, 3, 2].map((r) =>
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border 
                    ${minRating === r
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-orange-700 border-orange-200 hover:bg-orange-50'}
                    flex items-center gap-1`}
                  aria-label={r === 0 ? "All ratings" : `${r}+ stars`}
                >
                  <Star className={minRating === r ? "fill-current text-yellow-300" : "text-yellow-400"} size={14} />
                  {r === 0 ? "All" : `${r}+`}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Listing */}
      <section className="container mx-auto px-4 mb-20">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-orange-500" />
            Trending & Recent
          </h2>
          {searchTerm || selectedCategory !== 'All' || minRating !== 0 ? (
            <button
              className="ml-3 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setMinRating(0); }}
            >
              Reset Filters
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {(filteredBlogs.length > 0 ? filteredBlogs : blogs).map((blog: BlogData, index: number) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              index={index}
              
            />
          ))}
        </div>
        {filteredBlogs.length === 0 && (
          <div className="text-center py-28">
            <p className="text-xl text-gray-600 mb-2">No blogs found for your filters/search.</p>
            <button
              className="px-6 py-2 text-white bg-gradient-to-r from-red-600 to-orange-500 rounded-lg font-semibold"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setMinRating(0); }}
            >Show All Blogs</button>
          </div>
        )}
      </section>

      {/* Blog Details Modal */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/55 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {selectedBlog.thumbnail && (
                <img
                  src={selectedBlog.thumbnail}
                  alt={selectedBlog.title}
                  className="w-full h-56 object-cover rounded-t-2xl"
                />
              )}
              <button
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                aria-label="Close details"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="p-6">
                <BlogCard
                  blog={selectedBlog}
                
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
