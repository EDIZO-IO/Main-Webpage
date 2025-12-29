// frontend/src/pages/home/BlogsSection.tsx
import { memo } from 'react';
import { ArrowRight, Loader2, BookOpen, Sparkles, PenTool, FileText, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { useFeaturedBlogs } from '../../components/hooks/useBlogs';
import { AnimatedSection } from './AnimatedSection';
import BlogCard from '../../components/widgets/Blogscard';

// Static content-themed icons for decoration
const decorIcons = [
  { Icon: PenTool, color: '#f43f5e' },
  { Icon: FileText, color: '#8b5cf6' },
  { Icon: Edit3, color: '#f97316' },
  { Icon: BookOpen, color: '#06b6d4' },
];

const BlogsSection = memo(() => {
  const { blogs: featuredBlogs, loading: blogsLoading } = useFeaturedBlogs(3);

  return (
    <section className="py-24 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Background gradient orbs - static */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100/30 to-orange-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-gray-100/40 to-slate-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Static content theme icons */}
      <div className="absolute inset-0 pointer-events-none">
        {decorIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute opacity-[0.04]"
            style={{
              top: `${15 + i * 22}%`,
              left: i % 2 === 0 ? '3%' : 'auto',
              right: i % 2 === 1 ? '3%' : 'auto',
              color: item.color,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.04, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
          >
            <item.Icon size={50} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedSection>
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/70 border border-gray-200 rounded-full mb-6 shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <BookOpen className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Insights & Updates</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Latest from Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Blog
              </span>
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed">
              Industry insights, development tips, and success stories from our team
            </p>
          </AnimatedSection>
        </div>

        {blogsLoading ? (
          <div className="text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block"
            >
              <Loader2 className="w-12 h-12 text-red-500" />
            </motion.div>
            <p className="text-gray-500 mt-4">Loading latest posts...</p>
          </div>
        ) : featuredBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-14">
              {featuredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <BlogCard
                    blog={blog}
                    index={index}
                    variant="featured"
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Button
                to="/blogs"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
                style={{
                  background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                  boxShadow: "0 10px 40px -10px rgba(220,38,38,0.4)"
                }}
              >
                View All Articles
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16 backdrop-blur-sm bg-white/60 rounded-3xl border border-gray-100 shadow-sm"
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Sparkles className="w-10 h-10 text-red-500" />
            </motion.div>
            <p className="text-gray-600 mb-6 text-lg">Fresh content is on its way!</p>
            <Button
              to="/blogs"
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
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