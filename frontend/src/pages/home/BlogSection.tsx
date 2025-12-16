// frontend/src/pages/home/BlogsSection.tsx
import React, { memo } from 'react';
import { ArrowRight, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { useFeaturedBlogs } from '../../components/hooks/useBlogs';
import { AnimatedSection } from './AnimatedSection';
import BlogCard from '../../components/widgets/Blogscard';

const BlogsSection = memo(() => {
  const { blogs: featuredBlogs, loading: blogsLoading } = useFeaturedBlogs(3);

  return (
    <section className="py-24 bg-gradient-to-br from-white via-orange-50/30 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedSection>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-full mb-6 shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">Insights & Updates</span>
            </motion.div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Latest from Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Blog
              </span>
            </h2>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed">
              Industry insights, development tips, and success stories from our team
            </p>
          </AnimatedSection>
        </div>

        {blogsLoading ? (
          <div className="text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block"
            >
              <Loader2 className="w-12 h-12 text-orange-500" />
            </motion.div>
            <p className="text-gray-500 mt-4">Loading latest posts...</p>
          </div>
        ) : featuredBlogs.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-14"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {featuredBlogs.map((blog, index) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  index={index}
                  variant="featured"
                />
              ))}
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button
                to="/blogs"
                variant="primary"
                size="lg"
                enableFestivalAnimation={true}
                showFestivalEmoji={true}
                iconRight={<ArrowRight className="w-5 h-5" />}
              >
                View All Articles
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-orange-500" />
            </div>
            <p className="text-gray-600 mb-6 text-lg">Fresh content is on its way!</p>
            <Button
              to="/blogs"
              variant="outline"
              size="lg"
            >
              Visit Blog Section
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
});

BlogsSection.displayName = 'BlogsSection';
export default BlogsSection;