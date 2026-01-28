// frontend/src/pages/home/InternshipsSection.tsx
import { memo } from 'react';
import { ArrowRight, Loader2, Star, Tag, Percent } from 'lucide-react';
import Button from '../../components/common/Button';
import { useTrendingInternships } from '../../components/hooks/useInternships';
import { AnimatedSection } from './AnimatedSection';
import { getHighestDiscount, hasDiscount } from '../../utils/internshipUtils';

const InternshipsSection = memo(() => {
  const { internships, loading } = useTrendingInternships(0, 3);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-4 shadow-sm">
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Career Growth</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Internships</span>
            </h2>
            <p className="text-gray-600">
              Launch your career with hands-on experience
            </p>
          </AnimatedSection>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="animate-spin text-red-600 mx-auto mb-4" size={40} />
            <p className="text-gray-600">Loading internships...</p>
          </div>
        ) : internships.length > 0 ? (
          <>
            {/* Internships List - Professional Layout */}
            <div className="space-y-6 max-w-4xl mx-auto mb-12">
              {internships.map((item, index) => (
                <div
                  key={item.id}
                  className="opacity-0 animate-fade-in-up bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-32 h-32 object-cover rounded-xl"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.category && (
                          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            {item.category}
                          </span>
                        )}

                        {hasDiscount(item.discount) && getHighestDiscount(item.discount) > 0 && (
                          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            <Tag size={12} className="mr-1" />
                            {getHighestDiscount(item.discount)}% OFF
                          </span>
                        )}

                        {item.rating && (
                          <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            <Star size={12} className="mr-1" />
                            {item.rating}/5
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        to={`/internships/${item.id}`}
                        variant="primary"
                        size="md"
                        className="rounded-xl"
                        style={{
                          background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                        }}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Button
                to="/internships"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
                className="rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #dc2612 0%, #ea580c 100%)",
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
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl"
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