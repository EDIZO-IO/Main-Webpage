// frontend/src/pages/home/TestimonialsSection.tsx
import { memo, useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../../components/common/AnimatedSection';

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company: string;
    image: string;
    rating: number;
    review: string;
    service: string;
}

// Star Rating Component
const StarRating = memo<{ rating: number }>(({ rating }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
        ))}
    </div>
));
StarRating.displayName = 'StarRating';

// Simplified Testimonial Card - No animations
const TestimonialCard = memo<{ testimonial: Testimonial }>(
    ({ testimonial }) => (
        <div className="relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 text-red-100">
                <Quote className="w-10 h-10" />
            </div>

            <div className="p-6 relative z-10">
                {/* Service Tag */}
                {testimonial.service && (
                    <div className="inline-flex items-center px-2 py-1 bg-red-50 border border-red-100 rounded-full text-xs font-semibold text-red-700 mb-3">
                        {testimonial.service}
                    </div>
                )}

                {/* Rating */}
                <div className="mb-3">
                    <StarRating rating={testimonial.rating} />
                </div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed mb-4 italic text-sm line-clamp-3">
                    "{testimonial.review}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        {testimonial.image ? (
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-full h-full object-cover rounded-full"
                                loading="lazy"
                            />
                        ) : (
                            testimonial.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h4>
                        <p className="text-xs text-gray-500">
                            {testimonial.role}
                            {testimonial.company && <span> • {testimonial.company}</span>}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
        </div>
    )
);
TestimonialCard.displayName = 'TestimonialCard';

// Main Component
const TestimonialsSection = memo(() => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/testimonials?limit=6`);
                const data = await response.json();

                if (data.success && data.data.length > 0) {
                    setTestimonials(data.data);
                } else {
                    setError('No testimonials available');
                }
            } catch (err) {
                console.error('Error fetching testimonials:', err);
                setError('Unable to load testimonials');
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, [API_BASE_URL]);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-rotate
    useEffect(() => {
        if (testimonials.length <= 1) return;
        const interval = setInterval(nextTestimonial, 6000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center items-center h-48">
                        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (error && testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Header */}
                <AnimatedSection>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full mb-4 shadow-sm">
                            <Sparkles className="w-3 h-3 text-red-600" />
                            <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Client Testimonials</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Clients Say</span>
                        </h2>
                        <p className="text-gray-600 max-w-xl mx-auto">
                            Hear from businesses we've helped transform
                        </p>
                    </div>
                </AnimatedSection>

                {/* Desktop Grid View */}
                <div className="hidden lg:grid grid-cols-3 gap-6">
                    {testimonials.slice(0, 3).map((testimonial, index) => (
                        <div
                            key={testimonial._id}
                            className="opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                        >
                            <TestimonialCard testimonial={testimonial} />
                        </div>
                    ))}
                </div>

                {/* Mobile Carousel View */}
                <div className="lg:hidden">
                    {testimonials[currentIndex] && (
                        <TestimonialCard testimonial={testimonials[currentIndex]} />
                    )}

                    {/* Navigation */}
                    {testimonials.length > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <button
                                onClick={prevTestimonial}
                                className="p-2 bg-white rounded-full shadow border border-gray-200 hover:border-red-300 transition-colors"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Dots */}
                            <div className="flex items-center gap-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-2 rounded-full transition-all ${index === currentIndex
                                            ? 'bg-gradient-to-r from-red-500 to-orange-500 w-6'
                                            : 'bg-gray-300 w-2'
                                            }`}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextTestimonial}
                                className="p-2 bg-white rounded-full shadow border border-gray-200 hover:border-red-300 transition-colors"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Write Review CTA */}
                <AnimatedSection>
                    <div className="mt-12 text-center">
                        <Link
                            to="/write-review"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        >
                            <PenLine className="w-4 h-4" />
                            <span>Share Your Experience</span>
                        </Link>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
});

TestimonialsSection.displayName = 'TestimonialsSection';
export default TestimonialsSection;
