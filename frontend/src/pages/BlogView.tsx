import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Heart, MessageCircle, Star, Tag, User, Clock } from 'lucide-react';
import { useBlogs, incrementBlogView, addBlogLike, addBlogComment } from '../components/hooks/useBlogs';
import type { BlogData } from '../types/blog.types';

const BlogView: React.FC = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const navigate = useNavigate();
  const { blogs, loading, error } = useBlogs();

  // Find by either slug or id for robust navigation
  const blog: BlogData | undefined = blogs.find(
    b => b.id === slugOrId || b.slug === slugOrId
  );

  const [viewed, setViewed] = useState(false);
  const [likes, setLikes] = useState(blog?.likes ?? 0);
  const [comments, setComments] = useState(blog?.comments ?? 0);
  const [views, setViews] = useState(blog?.views ?? 0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (blog) {
      setLikes(blog.likes || 0);
      setComments(blog.comments || 0);
      setViews(blog.views || 0);
    }
  }, [blog]);

  useEffect(() => {
    if (blog && slugOrId && !viewed) {
      incrementBlogView(blog.slug || blog.id); // Use slug if possible
      setViews(v => v + 1);
      setViewed(true);
    }
  }, [blog, slugOrId, viewed]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-orange-400 rounded-full border-t-transparent animate-spin mb-8" />
        <p className="text-lg font-medium text-gray-700">Loading blog...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <ArrowLeft className="w-8 h-8 mb-4 cursor-pointer" onClick={() => navigate(-1)} />
        <h2 className="text-2xl font-bold mb-2 text-red-500">Blog not found</h2>
        <p className="text-gray-600 mb-6">Sorry, the blog you requested does not exist.</p>
        <Link to="/blogs" className="px-6 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600">All Blogs</Link>
      </div>
    );
  }

  const handleLike = () => {
    if (!hasLiked) {
      addBlogLike(blog.slug || blog.id);   // Persist to Google Sheet
      setLikes(l => l + 1);                // Optimistic UI
      setHasLiked(true);
    }
  };

  const handleComment = () => {
    addBlogComment(blog.slug || blog.id);  // Persist to Google Sheet
    setComments(c => c + 1);               // Optimistic UI
    // Optionally open comments modal here
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <div className="max-w-2xl mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <Link to="/blogs" className="text-orange-600 hover:underline flex items-center gap-2 mb-1">
            <ArrowLeft className="w-5 h-5" /> Back to Blogs
          </Link>
          <div className="flex flex-row flex-wrap gap-2 ml-auto">
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">{blog.category}</span>
            {blog.featured && <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-xs font-semibold">Featured</span>}
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{new Date(blog.publishedDate).toLocaleDateString()}</span>
          </div>
        </div>
        <h1 className="font-extrabold text-3xl sm:text-4xl mb-4 leading-tight text-gray-900">{blog.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
          <span className="flex items-center gap-2"><User className="w-4 h-4" /> {blog.author}</span>
          <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {blog.readTime} min read</span>
          <span className="flex items-center gap-2"><Eye className="w-4 h-4" /> {views}</span>
          <span className="flex items-center gap-1">
            {[...Array(5)].map((_, i: number) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(blog.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="ml-0.5">{blog.rating}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags?.map((tag: string, i: number) => (
            <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-medium border border-gray-200">
              <Tag className="w-3 h-3" /> {tag}
            </span>
          ))}
        </div>
        <div className="prose max-w-none mb-8">
          {blog.content?.split('\n').map((p: string, i: number) => (
            <p key={i} className="mb-4">{p}</p>
          ))}
        </div>
        <div className="flex gap-9 mt-8 mb-4 text-lg">
          <button
            className={`flex items-center gap-2 transition ${hasLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
            onClick={handleLike}
            type="button"
            disabled={hasLiked}
            title={hasLiked ? "You liked this" : "Like this blog"}
          >
            <Heart className="w-5 h-5" /> {likes}
          </button>
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition"
            onClick={handleComment}
            type="button"
          >
            <MessageCircle className="w-5 h-5" /> {comments}
          </button>
          <span className="flex items-center gap-2 text-gray-600">
            <Eye className="w-5 h-5" /> {views}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
