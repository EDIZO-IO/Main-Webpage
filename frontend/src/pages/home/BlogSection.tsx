// frontend/src/pages/home/BlogsSection.tsx
import React, { memo } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useTrendingBlogs } from '../../components/hooks/useBlogs';
import { AnimatedSection } from './AnimatedSection';
import BlogCardComponent from './BlogCardComponent';

const BlogsSection = memo(() => {
  const { blogs: trendingBlogs, loading: blogsLoading } = useTrendingBlogs(4.0, 3);

  return (
    <section className="py-24 bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <span className="text-sm font-semibold text-blue-700">Insights & Updates</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Latest from Our Blog
            </h2>
            <p className="text-xl text-gray-600">
              Industry insights, tips, and success stories
            </p>
          </AnimatedSection>
        </div>

        {blogsLoading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
            <p className="text-gray-600">Loading latest blog posts...</p>
          </div>
        ) : trendingBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
              {trendingBlogs.map((blog) => (
                <BlogCardComponent 
                  key={blog.id} 
                  title={blog.title}
                  description={blog.description}
                  author={blog.author}
                  publishedDate={blog.publishedDate}
                  category={blog.category}
                  thumbnail={blog.thumbnail}
                  rating={blog.rating}
                  views={blog.views}
                  id={blog.id}
                  tags={blog.tags}
                  readTime={blog.readTime}
                  likes={blog.likes}
                  comments={blog.comments}
                  featured={blog.featured}
                  content={blog.content}
                />
              ))}
            </div>

            <div className="text-center">
              <Button 
                to="/blogs" 
                variant="primary"
                size="lg"
                enableFestivalAnimation={true}
                showFestivalEmoji={true}
                iconRight={<ArrowRight className="w-5 h-5" />}
              >
                View All Blog Posts
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">No blog posts available at the moment.</p>
            <Button 
              to="/blogs" 
              variant="outline"
              size="lg"
            >
              Visit Blog Section
            </Button>
          </div>
        )}
      </div>
    </section>
  );
});

BlogsSection.displayName = 'BlogsSection';
export default BlogsSection;