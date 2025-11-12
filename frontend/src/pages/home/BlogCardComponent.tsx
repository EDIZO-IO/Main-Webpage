// frontend/src/pages/home/BlogCardComponent.tsx
import React, { memo } from 'react';
import { AnimatedSection } from './AnimatedSection';
import BlogCard from '../../components/widgets/Blogscard';

interface BlogCardProps {
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  category: string;
  thumbnail: string;
  rating: number;
  views: number;
  id: string;
  tags?: string[];
  readTime?: number;
  likes?: number;
  comments?: number;
  featured?: boolean;
  content?: string;
}

const BlogCardComponent = memo<BlogCardProps>(({
  title,
  description,
  author,
  publishedDate,
  category,
  thumbnail,
  rating,
  views,
  id,
  tags = [],
  readTime = 0,
  likes = 0,
  comments = 0,
  featured = false,
  content = ''
}) => {
  const blogData = {
    id,
    title,
    description,
    author,
    publishedDate,
    category,
    thumbnail,
    rating,
    views,
    tags,
    readTime,
    likes,
    comments,
    featured,
    content,
    authorImage: "",
    slug: id,
    seoDescription: description,
    keywords: [],
    status: "published" as const,
    excerpt: description,
    updatedAt: publishedDate
  };

  return (
    <AnimatedSection>
      <BlogCard 
        blog={blogData} 
        onClick={() => {}} 
      />
    </AnimatedSection>
  );
});

BlogCardComponent.displayName = 'BlogCardComponent';
export default BlogCardComponent;