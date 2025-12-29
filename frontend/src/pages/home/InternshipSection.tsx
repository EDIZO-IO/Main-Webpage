// frontend/src/pages/home/InternshipsSection.tsx
import { memo } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { useTrendingInternships } from '../../components/hooks/useInternships';
import { AnimatedSection } from './AnimatedSection';
import PortfolioCard from './PortfolioCard';
import { getHighestDiscount, hasDiscount } from '../../utils/internship.utils';

const InternshipsSection = memo(() => {
  // ORIGINAL DATA HOOK - UNCHANGED
  const { internships: trendingInternships, loading: internshipsLoading } = useTrendingInternships(4.5, 3);

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-red-50/20 to-orange-50/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-gray-200/30 to-slate-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header - BRAND COLORS */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-white/70 border border-gray-200 rounded-full mb-6 shadow-sm">
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Career Growth</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Internships</span>
            </h2>
            <p className="text-xl text-gray-600">
              Launch your career with hands-on experience
            </p>
          </AnimatedSection>
        </div>

        {internshipsLoading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin text-red-600 mx-auto mb-4" size={48} />
            <p className="text-gray-600">Loading trending internships...</p>
          </div>
        ) : trendingInternships.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {trendingInternships.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PortfolioCard
                    img={item.image}
                    title={item.title}
                    category={item.category}
                    link={`/internships/${item.id}`}
                    shortDescription={item.description}
                    isExternal={false}
                    isInternship={true}
                    maxDiscount={getHighestDiscount(item.discount)}
                    hasDiscount={hasDiscount(item.discount)}
                    rating={item.rating}
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
                to="/internships"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
                style={{
                  background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                  boxShadow: "0 10px 40px -10px rgba(220,38,38,0.4)"
                }}
              >
                Explore All Internships
              </Button>
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">No trending internships available at the moment.</p>
            <Button
              to="/internships"
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              View All Internships
            </Button>
          </div>
        )}
      </div>
    </section>
  );
});

InternshipsSection.displayName = 'InternshipsSection';
export default InternshipsSection;