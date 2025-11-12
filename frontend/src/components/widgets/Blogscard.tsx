import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Clock, Eye, Heart, MessageCircle, Star, Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { BlogData } from '../../types/blog.types';

interface BlogCardProps {
  blog: BlogData;
  index?: number;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  index = 0
}) => {
  return (
    <motion.article
      key={blog.id}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -6, scale: 1.03 }}
      className="group cursor-pointer"
    >
      <Link to={`/blogs/${blog.slug || blog.id}`} tabIndex={0} className="block focus:outline-none">
        <div className="border border-gray-200 bg-white rounded-2xl shadow-md flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg p-5">
          {/* CATEGORY + FEATURED PILL */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold shadow">{blog.category}</span>
            {blog.featured && (
              <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-xs font-semibold shadow">Featured</span>
            )}
            <span className="ml-auto px-3 py-1 bg-gray-700/10 text-gray-700 rounded-full text-[11px] font-semibold">
              {new Date(blog.publishedDate).toLocaleDateString()}
            </span>
          </div>

          {/* TITLE */}
          <h3 className="font-extrabold text-gray-900 mb-1 text-xl group-hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>

          {/* DESCRIPTION */}
          <p className="text-gray-600 mb-3 text-sm line-clamp-3">
            {blog.description}
          </p>

          {/* TAGS */}
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags?.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-medium border border-gray-200"
              >
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
            {(blog.tags?.length ?? 0) > 4 && (
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                +{blog.tags.length - 4} more
              </span>
            )}
          </div>

          {/* AUTHOR & META */}
          <div className="flex flex-wrap gap-6 items-center justify-between text-xs text-gray-500 mb-2 mt-auto">
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {blog.readTime} min read
              </span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(blog.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-1 font-bold">{blog.rating}</span>
            </div>
          </div>

          {/* STATS */}
          <div className="flex flex-row gap-6 text-[13px] text-gray-400 border-t border-gray-100 pt-3 mt-2">
            <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{blog.views} views</span>
            <span className="flex items-center gap-1"><Heart className="w-4 h-4" />{blog.likes} likes</span>
            <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />{blog.comments} comments</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
