import { useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { testimonialsAPI } from '../api/api';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialsAPI.getAll();
        // Get approved testimonials only from database
        const approved = (response.data.testimonials || []).filter(t => t.is_approved);
        setTestimonials(approved);
      } catch (error) {
        console.error('Error fetching testimonials from API:', error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(testimonials.length, 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % Math.max(testimonials.length, 1));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < rating ? '#f97316' : 'none'}
            color={i < rating ? '#f97316' : '#d1d5db'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  // Don't render section if no testimonials from database
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-4 shadow-sm">
            <Quote className="w-3 h-3 text-orange-500" />
            <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Client Reviews</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Clients Say</span>
          </h2>
          <p className="text-gray-600">
            Real feedback from satisfied clients
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white rounded-2xl shadow-xl border border-orange-100 p-8 md:p-12">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-orange-200 opacity-50" />
            
            {testimonials[currentIndex] && (
              <div className="relative z-10">
                {/* Rating */}
                <div className="flex justify-center mb-6">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>

                {/* Content */}
                <p className="text-lg text-gray-700 text-center mb-8 leading-relaxed italic">
                  "{testimonials[currentIndex].content}"
                </p>

                {/* Author Info */}
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-lg">{testimonials[currentIndex].customer_name}</div>
                  <div className="text-gray-600 text-sm">
                    {testimonials[currentIndex].service_type || 'Valued Client'}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="p-3 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-orange-50 hover:bg-orange-100 text-orange-600 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Dots Indicator */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-orange-500 w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
