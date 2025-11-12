import React, { memo } from 'react';
import { AnimatedSection } from './AnimatedSection';
import BlogCard from '../../components/widgets/Blogscard';

import type { BlogData } from '../../types/blog.types';

interface BlogCardComponentProps extends Partial<BlogData> {
  // Only make fields optional for this card component usage
  id: string;
  title: string;
  description: string;
  author: string;
  publishedDate: string;
  category: string;
  thumbnail: string;
  rating: number;
  views: number;
}

const BlogCardComponent = memo<BlogCardComponentProps>((props) => {
  const {
    id,
    title,
    description,
    author,
    publishedDate,
    category,
    thumbnail,
    rating,
    views,
    tags = [],
    readTime = 0,
    likes = 0,
    comments = 0,
    featured = false,
    content = '',
    authorImage,
    slug,
    seoDescription,
    keywords,
    status,
    updatedAt,
  } = props;

  const blogData: BlogData = {
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
    authorImage: authorImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}`,
    slug: slug || id,
    seoDescription: seoDescription || description,
    keywords: keywords && keywords.length > 0 ? keywords : [
      ...tags,
      title,
      author,
      category,
      (slug || id)
    ].map(String)
     .map(str => str.toLowerCase().replace(/ /g, '-')),
    status: status || "published",
    updatedAt: updatedAt || publishedDate,
  };

  return (
    <AnimatedSection>
      <BlogCard blog={blogData} />
    </AnimatedSection>
  );
});

BlogCardComponent.displayName = 'BlogCardComponent';
export default BlogCardComponent;
