// frontend/src/pages/home/TestimonialsSection.tsx
import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, PenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../../components/common/AnimatedSection';

// ORIGINAL INTERFACE - UNCHANGED
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

// Star Rating Component - UNCHANGED LOGIC
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

// Testimonial Card - Updated UI with brand colors
const TestimonialCard = memo<{ testimonial: Testimonial; isActive?: boolean }>(
    ({ testimonial, isActive = false }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
            className={`relative backdrop-blur-sm bg-white/80 rounded-3xl shadow-lg border border-gray-100 overflow-hidden ${isActive ? 'ring-2 ring-red-500/20' : ''}`}
        >
            {/* Quote Icon with brand colors */}
            <div className="absolute top-4 right-4 text-red-100">
                <Quote className="w-12 h-12" />
            </div>

            <div className="p-8 relative z-10">
                {/* Service Tag with brand colors */}
                {testimonial.service && (
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-full text-xs font-semibold text-red-700 mb-4">
                        {testimonial.service}
                    </div>
                )}

                {/* Rating */}
                <div className="mb-4">
                    <StarRating rating={testimonial.rating} />
                </div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{testimonial.review}"
                </p>

                {/* Author Info with brand colors */}
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {testimonial.image ? (
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            testimonial.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">
                            {testimonial.role}
                            {testimonial.company && (
                                <span className="text-gray-400"> • {testimonial.company}</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Accent with brand colors */}
            <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500" />
        </motion.div>
    )
);
TestimonialCard.displayName = 'TestimonialCard';

// Main Component - ORIGINAL LOGIC, Updated UI
const TestimonialsSection = memo(() => {
    // ORIGINAL STATE - UNCHANGED
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    // ORIGINAL FETCH LOGIC - UNCHANGED
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/testimonials?limit=10`);
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

    // ORIGINAL AUTO-ROTATE - UNCHANGED
    useEffect(() => {
        if (testimonials.length <= 1) return;

        const interval = setInterval(nextTestimonial, 6000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (error && testimonials.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-gradient-to-b from-white via-gray-50/30 to-gray-50 overflow-hidden relative">
            <div className="container mx-auto px-6">
                {/* Header - BRAND COLORS */}
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/70 border border-gray-200 rounded-full mb-6 shadow-sm">
                            <Sparkles className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Client Testimonials</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Clients Say</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Hear from businesses we've helped transform with our digital solutions
                        </p>
                    </div>
                </AnimatedSection>

                {/* Desktop Grid View */}
                <div className="hidden lg:grid grid-cols-3 gap-8">
                    {testimonials.slice(0, 3).map((testimonial, index) => (
                        <motion.div
                            key={testimonial._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <TestimonialCard testimonial={testimonial} />
                        </motion.div>
                    ))}
                </div>

                {/* Mobile/Tablet Carousel View */}
                <div className="lg:hidden relative">
                    <AnimatePresence mode="wait">
                        {testimonials[currentIndex] && (
                            <TestimonialCard
                                key={testimonials[currentIndex]._id}
                                testimonial={testimonials[currentIndex]}
                                isActive
                            />
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    {testimonials.length > 0 && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={prevTestimonial}
                                className="p-3 backdrop-blur-sm bg-white/80 rounded-full shadow-lg border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </motion.button>

                            {/* Dots with brand colors */}
                            <div className="flex items-center gap-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-2.5 rounded-full transition-all ${index === currentIndex
                                            ? 'bg-gradient-to-r from-red-500 to-orange-500 w-8'
                                            : 'bg-gray-300 hover:bg-gray-400 w-2.5'
                                            }`}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={nextTestimonial}
                                className="p-3 backdrop-blur-sm bg-white/80 rounded-full shadow-lg border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all"
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </motion.button>
                        </div>
                    )}
                </div>

                {/* Stats - ORIGINAL CONTENT */}
                <AnimatedSection>
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: '5.0', label: 'Average Rating', icon: '⭐' },
                            { value: '10+', label: 'Happy Clients', icon: '😊' },
                            { value: '25+', label: 'Projects Delivered', icon: '🚀' },
                            { value: '100%', label: 'Satisfaction', icon: '✅' },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                                className="text-center p-6 backdrop-blur-sm bg-white/80 rounded-2xl shadow-sm border border-gray-100 transition-all"
                            >
                                <div className="text-3xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Write Review CTA with brand colors */}
                <AnimatedSection>
                    <div className="mt-12 text-center">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="inline-block"
                        >
                            <Link
                                to="/write-review"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-orange-600 transition-all"
                            >
                                <PenLine className="w-5 h-5" />
                                <span>Share Your Experience</span>
                            </Link>
                        </motion.div>
                        <p className="mt-4 text-gray-500 text-sm">
                            Had a great experience with us? Let others know!
                        </p>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
});

TestimonialsSection.displayName = 'TestimonialsSection';
export default TestimonialsSection;
