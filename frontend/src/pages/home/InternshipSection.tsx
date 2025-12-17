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
    <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full mb-6">
              <span className="text-sm font-semibold text-purple-700">Career Growth</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Trending Internships
            </h2>
            <p className="text-xl text-gray-600">
              Launch your career with hands-on experience
            </p>
          </AnimatedSection>
        </div>

        {internshipsLoading ? (
          <div className="text-center py-12">
            <Loader2 className="animate-spin text-purple-600 mx-auto mb-4" size={48} />
            <p className="text-gray-600">Loading trending internships...</p>
          </div>
        ) : trendingInternships.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {trendingInternships.map((item) => (
                <PortfolioCard
                  key={item.id}
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
              ))}
            </div>

            <div className="text-center">
              <Button
                to="/internships"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
              >
                Explore All Internships
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">No trending internships available at the moment.</p>
            <Button
              to="/internships"
              variant="outline"
              size="lg"
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