import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Clock, Eye, Heart, MessageCircle, Star, Tag, ArrowUpRight, Calendar, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BlogData } from '../../types/blog.types';

interface BlogCardProps {
  blog: BlogData;
  index?: number;
  variant?: 'default' | 'featured' | 'compact';
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  index = 0,
  variant = 'default'
}) => {
  const isFeatured = variant === 'featured' || blog.featured;

  return (
    <motion.article
      key={blog.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Link
        to={`/blogs/${blog.slug || blog.id}`}
        tabIndex={0}
        className="block h-full focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 rounded-3xl"
      >
        <div className={`
          relative h-full flex flex-col overflow-hidden rounded-3xl
          bg-white border border-gray-100
          shadow-sm hover:shadow-2xl hover:shadow-orange-500/10
          transition-all duration-500
          ${isFeatured ? 'ring-2 ring-orange-400/30' : ''}
        `}>
          {/* Image Container */}
          <div className="relative overflow-hidden aspect-[16/10]">
            {/* Thumbnail */}
            {blog.thumbnail ? (
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-orange-300" />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md text-gray-800 rounded-full text-xs font-bold shadow-lg">
                {blog.category}
              </span>
              {isFeatured && (
                <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>

            {/* Read More Arrow (appears on hover) */}
            <motion.div
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
              initial={{ x: -10, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <ArrowUpRight className="w-5 h-5 text-orange-600" />
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow p-6">
            {/* Date & Read Time Row */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(blog.publishedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {blog.readTime} min read
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
              {blog.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
              {blog.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {blog.tags?.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-lg text-xs font-medium transition-colors duration-200 border border-gray-100"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
              {(blog.tags?.length ?? 0) > 3 && (
                <span className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-semibold">
                  +{blog.tags!.length - 3}
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

            {/* Author & Stats Row */}
            <div className="flex items-center justify-between">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={blog.authorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author)}&background=f97316&color=fff`}
                    alt={blog.author}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-md"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{blog.author}</p>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(blog.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200'
                          }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">{blog.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 text-gray-400">
                <span className="flex items-center gap-1 text-xs hover:text-orange-500 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  {blog.views >= 1000 ? `${(blog.views / 1000).toFixed(1)}k` : blog.views}
                </span>
                <span className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors">
                  <Heart className="w-3.5 h-3.5" />
                  {blog.likes}
                </span>
                <span className="flex items-center gap-1 text-xs hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {blog.comments}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
