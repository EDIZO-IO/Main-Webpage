// frontend/src/pages/home/BlogsSection.tsx
import { memo } from 'react';
import { ArrowRight, Loader2, BookOpen, Sparkles } from 'lucide-react';
import Button from '../../components/common/Button';
import { useFeaturedBlogs } from '../../components/hooks/useBlogs';
import { AnimatedSection } from './AnimatedSection';
import BlogCard from '../../components/widgets/Blogscard';

const BlogsSection = memo(() => {
  const { blogs: featuredBlogs, loading: blogsLoading } = useFeaturedBlogs(3);

  return (
    <section className="py-16 bg-gradient-to-br from-white via-gray-50/30 to-white relative overflow-hidden">
      {/* Simple static background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-gray-200 rounded-full mb-5 shadow-sm">
              <BookOpen className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Insights & Updates</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest from Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Blog
              </span>
            </h2>

            <p className="text-lg text-gray-600">
              Industry insights, development tips, and success stories
            </p>
          </AnimatedSection>
        </div>

        {blogsLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin mx-auto" />
            <p className="text-gray-500 mt-4">Loading latest posts...</p>
          </div>
        ) : featuredBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
              {featuredBlogs.map((blog, index) => (
                <div
                  key={blog.id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <BlogCard
                    blog={blog}
                    index={index}
                    variant="featured"
                  />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button
                to="/blogs"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
                style={{
                  background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                  boxShadow: "0 8px 30px -8px rgba(220,38,38,0.4)"
                }}
              >
                View All Articles
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white/60 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-gray-600 mb-5">Fresh content is on its way!</p>
            <Button
              to="/blogs"
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
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