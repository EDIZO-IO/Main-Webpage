import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, TrendingUp, X, Filter, Sparkles, BookOpen, ArrowRight
} from 'lucide-react';

import { useBlogs, useFilteredBlogs, useTrendingBlogs, useBlogCategories } from '../components/hooks/useBlogs';
import type { BlogData } from '../types/blog.types';
import BlogCard from '../components/widgets/Blogscard';

const Blogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { blogs, loading, error } = useBlogs();
  const { blogs: filteredBlogs } = useFilteredBlogs(selectedCategory, searchTerm, minRating);
  const { blogs: trendingBlogs } = useTrendingBlogs(4.0, 5);
  const { categories } = useBlogCategories();

  const handleCategoryClick = (cat: string) => setSelectedCategory(cat);
  const hasActiveFilters = searchTerm || selectedCategory !== 'All' || minRating !== 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Skeleton Header */}
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-200 rounded-xl w-1/3 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-gray-100 rounded-lg w-1/2 mx-auto animate-pulse" />
          </div>
          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-1/4" />
                    </div>
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md mx-auto text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Header */}
      <header className="relative pt-28 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-80 h-80 bg-red-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-yellow-200/40 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full mb-8 shadow-lg shadow-orange-500/10"
            >
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-gray-700">Insights & Knowledge</span>
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Explore Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-orange-600">
                Blog
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover tech insights, industry trends, and stories from our team.
              Fresh content delivered every week.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Search & Filters Section */}
      <section className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white font-medium transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <motion.button
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  ${selectedCategory === 'All'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                onClick={() => handleCategoryClick('All')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                All Posts
              </motion.button>
              {categories.slice(0, 5).map((cat: string) => (
                <motion.button
                  key={cat}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                    ${selectedCategory === cat
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  onClick={() => handleCategoryClick(cat)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cat}
                </motion.button>
              ))}
              {categories.length > 5 && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Filter className="w-4 h-4" />
                  More
                </button>
              )}
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Rating:</span>
              <div className="flex gap-1">
                {[0, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                      flex items-center gap-1
                      ${minRating === r
                        ? 'bg-yellow-400 text-yellow-900 shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'}`}
                  >
                    <Star className={`w-3 h-3 ${minRating === r ? 'fill-current' : ''}`} />
                    {r === 0 ? 'All' : `${r}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* More Categories (expandable) */}
          <AnimatePresence>
            {showFilters && categories.length > 5 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-gray-100">
                  {categories.slice(5).map((cat: string) => (
                    <motion.button
                      key={cat}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                        ${selectedCategory === cat
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      onClick={() => handleCategoryClick(cat)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {cat}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Trending Section */}
      {!hasActiveFilters && trendingBlogs.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg shadow-orange-500/25">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-orange-200 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {trendingBlogs.slice(0, 5).map((blog: BlogData, index: number) => (
              <BlogCard key={blog.id} blog={blog} index={index} variant="compact" />
            ))}
          </div>
        </section>
      )}

      {/* Blog Listing */}
      <section className="container mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg shadow-blue-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {hasActiveFilters ? 'Search Results' : 'All Articles'}
            </h2>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
              {filteredBlogs.length || blogs.length} posts
            </span>
          </div>

          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors flex items-center gap-2"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setMinRating(0); }}
            >
              <X className="w-4 h-4" />
              Clear Filters
            </motion.button>
          )}
        </div>

        {filteredBlogs.length > 0 || !hasActiveFilters ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {(filteredBlogs.length > 0 ? filteredBlogs : blogs).map((blog: BlogData, index: number) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No articles found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any blogs matching your criteria. Try adjusting your filters or search term.
            </p>
            <button
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setMinRating(0); }}
            >
              Show All Articles
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Blogs;
