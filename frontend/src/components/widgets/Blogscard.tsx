// frontend/src/components/widgets/Blogscard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Clock, Eye, Heart, MessageCircle, Star, Tag
} from 'lucide-react';
import type { BlogData } from '../../types/blog.types';

interface BlogCardProps {
  blog: BlogData;
  onClick?: () => void;
  index?: number;
  showFullContent?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onClick,
  index = 0,
  showFullContent = false
}) => {
  return (
    <motion.article
      key={blog.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group cursor-pointer ${!showFullContent ? 'hover:-translate-y-1' : ''}`}
      onClick={onClick}
    >
      <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
        !showFullContent 
          ? 'hover:shadow-xl transform hover:-translate-y-1' 
          : 'shadow-md'
      }`}>
        {blog.thumbnail && (
          <div className="h-48 overflow-hidden">
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              {blog.category}
            </span>
            {blog.featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                Featured
              </span>
            )}
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
              {new Date(blog.publishedDate).toLocaleDateString()}
            </span>
          </div>
          
          <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors ${
            showFullContent ? 'text-2xl' : 'text-xl'
          }`}>
            {blog.title}
          </h3>
          
          <p className={`text-gray-600 mb-2 ${
            showFullContent ? 'line-clamp-none' : 'line-clamp-2'
          }`}>
            {blog.description}
          </p>
          
          {showFullContent && blog.content && (
            <div className="prose max-w-none mb-4">
              {blog.content.split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.map((tag: string, i: number) => (
              <span 
                key={i} 
                className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-medium"
              >
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime} min read</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(blog.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1">{blog.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{blog.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{blog.likes} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{blog.comments} comments</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogCard;