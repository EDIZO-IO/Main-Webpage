// frontend/src/pages/home/InternshipsSection.tsx
import { memo } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useTrendingInternships } from '../../components/hooks/useInternships';
import { AnimatedSection } from './AnimatedSection';
import PortfolioCard from './PortfolioCard';
import { getHighestDiscount, hasDiscount } from '../../utils/internship.utils';

const InternshipsSection = memo(() => {
  const { internships: trendingInternships, loading: internshipsLoading } = useTrendingInternships(4.5, 3);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-red-50/10 to-orange-50/10 relative overflow-hidden">
      {/* Simple static background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-orange-100/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-gray-200 rounded-full mb-4 shadow-sm">
              <span className="text-lg font-serif text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Career Growth</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Internships</span>
            </h2>
            <p className="text-lg text-gray-600">
              Launch your career with hands-on experience
            </p>
          </AnimatedSection>
        </div>

        {internshipsLoading ? (
          <div className="text-center py-10">
            <Loader2 className="animate-spin text-red-600 mx-auto mb-4" size={40} />
            <p className="text-gray-600">Loading internships...</p>
          </div>
        ) : trendingInternships.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
              {trendingInternships.map((item, index) => (
                <div
                  key={item.id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
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
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button
                to="/internships"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
                style={{
                  background: "linear-gradient(131deg, #dc2612 0%, #ea580c 100%)",
                  boxShadow: "0 8px 30px -8px rgba(220,38,38,0.4)"
                }}
              >
                Explore All Internships
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-10">
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