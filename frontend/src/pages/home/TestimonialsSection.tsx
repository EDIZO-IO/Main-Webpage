// frontend/src/pages/home/TestimonialsSection.tsx
import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// Testimonial Card
const TestimonialCard = memo<{ testimonial: Testimonial; isActive?: boolean }>(
    ({ testimonial, isActive = false }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className={`relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${isActive ? 'ring-2 ring-orange-500/20' : ''
                }`}
        >
            {/* Quote Icon */}
            <div className="absolute top-4 right-4 text-orange-100">
                <Quote className="w-12 h-12" />
            </div>

            <div className="p-8 relative z-10">
                {/* Service Tag */}
                {testimonial.service && (
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-full text-xs font-semibold text-orange-700 mb-4">
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

                {/* Author Info */}
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
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

            {/* Bottom Accent */}
            <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
        </motion.div>
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
                const response = await fetch(`${API_BASE_URL}/api/testimonials?limit=10`);
                const data = await response.json();

                if (data.success && data.data.length > 0) {
                    setTestimonials(data.data);
                } else {
                    // Fallback testimonials if API fails
                    setTestimonials([
                        {
                            _id: '1',
                            name: 'Rahul Sharma',
                            role: 'Startup Founder',
                            company: 'TechVenture Labs',
                            image: '',
                            rating: 5,
                            review: 'Edizo transformed our vision into a stunning website. Their team understood our needs perfectly and delivered beyond expectations.',
                            service: 'Web Development'
                        },
                        {
                            _id: '2',
                            name: 'Priya Patel',
                            role: 'Marketing Director',
                            company: 'GrowthHub India',
                            image: '',
                            rating: 5,
                            review: 'Working with Edizo on our UI/UX redesign was a game-changer. They brought fresh, innovative ideas that significantly improved our user engagement.',
                            service: 'UI/UX Design'
                        },
                        {
                            _id: '3',
                            name: 'Arjun Mehta',
                            role: 'Product Manager',
                            company: 'InnovateTech',
                            image: '',
                            rating: 5,
                            review: 'The mobile app Edizo developed for us exceeded all expectations. Smooth performance, beautiful interface, and delivered right on schedule.',
                            service: 'App Development'
                        }
                    ]);
                }
            } catch (err) {
                console.error('Error fetching testimonials:', err);
                setError('Unable to load testimonials');
                // Set fallback data
                setTestimonials([
                    {
                        _id: '1',
                        name: 'Rahul Sharma',
                        role: 'Startup Founder',
                        company: 'TechVenture Labs',
                        image: '',
                        rating: 5,
                        review: 'Edizo transformed our vision into a stunning website. Their team understood our needs perfectly and delivered beyond expectations.',
                        service: 'Web Development'
                    },
                    {
                        _id: '2',
                        name: 'Priya Patel',
                        role: 'Marketing Director',
                        company: 'GrowthHub India',
                        image: '',
                        rating: 5,
                        review: 'Working with Edizo on our UI/UX redesign was a game-changer. They brought fresh, innovative ideas that significantly improved our user engagement.',
                        service: 'UI/UX Design'
                    },
                    {
                        _id: '3',
                        name: 'Arjun Mehta',
                        role: 'Product Manager',
                        company: 'InnovateTech',
                        image: '',
                        rating: 5,
                        review: 'The mobile app Edizo developed for us exceeded all expectations. Smooth performance, beautiful interface, and delivered right on schedule.',
                        service: 'App Development'
                    }
                ]);
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

    // Auto-rotate testimonials
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
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (error && testimonials.length === 0) {
        return null; // Don't show section if no testimonials
    }

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Header */}
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-semibold text-yellow-700">Client Testimonials</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Clients Say</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Hear from businesses we've helped transform with our digital solutions
                        </p>
                    </div>
                </AnimatedSection>

                {/* Desktop Grid View */}
                <div className="hidden lg:grid grid-cols-3 gap-8">
                    {testimonials.slice(0, 3).map((testimonial, index) => (
                        <AnimatedSection key={testimonial._id} delay={index * 0.1}>
                            <TestimonialCard testimonial={testimonial} />
                        </AnimatedSection>
                    ))}
                </div>

                {/* Mobile/Tablet Carousel View */}
                <div className="lg:hidden relative">
                    <AnimatePresence mode="wait">
                        <TestimonialCard
                            key={testimonials[currentIndex]?._id}
                            testimonial={testimonials[currentIndex]}
                            isActive
                        />
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prevTestimonial}
                            className="p-3 bg-white rounded-full shadow-md border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all"
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
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex
                                        ? 'bg-orange-500 w-8'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="p-3 bg-white rounded-full shadow-md border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Stats */}
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
                                className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="text-3xl mb-2">{stat.icon}</div>
                                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Write Review CTA */}
                <AnimatedSection>
                    <div className="mt-12 text-center">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="inline-block"
                        >
                            <Link
                                to="/write-review"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-red-600 transition-all"
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
