// frontend/src/pages/WriteReview.tsx
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Star,
    Send,
    CheckCircle,
    AlertCircle,
    User,
    Briefcase,
    Building2,
    MessageSquare,
    Loader2,
    ArrowLeft,
    Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';

// Star Rating Input Component
const StarRatingInput: Function<{ rating; onRatingChange: (rating) => void }> = ({
    rating,
    onRatingChange,
}) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => onRatingChange(star)}
                    className="focus:outline-none transition-colors"
                >
                    <Star
                        className={`w-8 h-8 ${star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                            }`}
                    />
                </motion.button>
            ))}
            <span className="ml-3 text-gray-600 font-medium">
                {rating > 0 ? `${rating}/5` : 'Select rating'}
            </span>
        </div>
    );
};

// Form Input Component
const FormInput: Function<{
    id;
    name;
    type?;
    label;
    value;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?;
    required?;
    error?;
    icon?: React.ReactNode;
}> = ({ id, name, type = 'text', label, value, onChange, placeholder, required, error, icon }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                </div>
            )}
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full px-4 py-3 ${icon ? 'pl-11' : ''} bg-white border-2 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-orange-500'
                    } rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-200' : 'focus:ring-orange-200'
                    } transition-all`}
            />
        </div>
        {error && (
            <motion.p
                initial={{ opacity, y: -5 }}
                animate={{ opacity, y }}
                className="text-sm text-red-600 flex items-center gap-1"
            >
                <AlertCircle size={14} />
                {error}
            </motion.p>
        )}
    </div>
);

// Service Select Component
const ServiceSelect: Function<{
    value;
    onChange: (value) => void;
}> = ({ value, onChange }) => {
    const services = [
        'Web Development',
        'UI/UX Design',
        'App Development',
        'Graphic Design',
        'Video Editing',
        'API Development',
        'SEO Optimization',
        'Digital Marketing',
        'Other',
    ];

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
                Service Used <span className="text-gray-400">(Optional)</span>
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
            >
                <option value="">Select a service</option>
                {services.map((service) => (
                    <option key={service} value={service}>
                        {service}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Main Component
const WriteReview: Function = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        role: '',
        company: '',
        service: '',
        rating,
        review: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name] }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }));
        }
    }, [formErrors]);

    const handleRatingChange = useCallback((rating) => {
        setFormData((prev) => ({ ...prev, rating }));
        if (formErrors.rating) {
            setFormErrors((prev) => ({ ...prev, rating: '' }));
        }
    }, [formErrors]);

    const handleServiceChange = useCallback((service) => {
        setFormData((prev) => ({ ...prev, service }));
    }, []);

    const validateForm = useCallback(() => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Your name is required';
        }

        if (!formData.role.trim()) {
            errors.role = 'Your role/position is required';
        }

        if (formData.rating === 0) {
            errors.rating = 'Please select a rating';
        }

        if (!formData.review.trim()) {
            errors.review = 'Please write your review';
        } else if (formData.review.trim().length < 20) {
            errors.review = 'Review must be at least 20 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitError(null);

        // Simulate successful submission since server is removed
        setTimeout(() => {
            setIsSubmitted(true);
            setIsSubmitting(false);
        }, 1500);
    };

    // Success State
    if (isSubmitted) {
        return (
            <>
                <PageHeader
                    title="Thank You!"
                    subtitle="Your review has been submitted successfully"
                />
                <section className="py-20 bg-gradient-to-b from-white to-gray-50 min-h-[60vh]">
                    <div className="max-w-2xl mx-auto px-4">
                        <motion.div
                            initial={{ opacity, scale: 0.9 }}
                            animate={{ opacity, scale }}
                            className="bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Review Submitted!
                            </h2>
                            <p className="text-gray-600 mb-8 text-lg">
                                Thank you for sharing your experience with Edizo! Your review will be reviewed and published shortly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                                >
                                    Back to Home
                                </Link>
                                <Link
                                    to="/services"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all"
                                >
                                    View Our Services
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Share Your Experience"
                subtitle="Help other clients by sharing your feedback about working with Edizo"
            />

            <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Back Link */}
                    <AnimatedSection>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </AnimatedSection>

                    {/* Form Card */}
                    <AnimatedSection>
                        <motion.div
                            initial={{ opacity, y }}
                            animate={{ opacity, y }}
                            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-white">
                                        <h2 className="text-xl font-bold">Write a Review</h2>
                                        <p className="text-white/80 text-sm">Share your honest feedback</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                {/* Error Alert */}
                                {submitError && (
                                    <motion.div
                                        initial={{ opacity, y: -10 }}
                                        animate={{ opacity, y }}
                                        className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-red-700">{submitError}</p>
                                    </motion.div>
                                )}

                                {/* Rating */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-gray-700">
                                        Your Rating <span className="text-red-500">*</span>
                                    </label>
                                    <StarRatingInput rating={formData.rating} onRatingChange={handleRatingChange} />
                                    {formErrors.rating && (
                                        <motion.p
                                            initial={{ opacity, y: -5 }}
                                            animate={{ opacity, y }}
                                            className="text-sm text-red-600 flex items-center gap-1"
                                        >
                                            <AlertCircle size={14} />
                                            {formErrors.rating}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Name & Role */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        id="name"
                                        name="name"
                                        label="Your Name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="John Doe"
                                        required
                                        error={formErrors.name}
                                        icon={<User size={18} />}
                                    />
                                    <FormInput
                                        id="role"
                                        name="role"
                                        label="Your Role/Position"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        placeholder="CEO, Developer, etc."
                                        required
                                        error={formErrors.role}
                                        icon={<Briefcase size={18} />}
                                    />
                                </div>

                                {/* Company & Service */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormInput
                                        id="company"
                                        name="company"
                                        label="Company Name"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        placeholder="Your company (optional)"
                                        icon={<Building2 size={18} />}
                                    />
                                    <ServiceSelect value={formData.service} onChange={handleServiceChange} />
                                </div>

                                {/* Review */}
                                <div className="space-y-2">
                                    <label htmlFor="review" className="block text-sm font-semibold text-gray-700">
                                        Your Review <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <textarea
                                            id="review"
                                            name="review"
                                            value={formData.review}
                                            onChange={handleInputChange}
                                            placeholder="Share your experience working with Edizo. What did you like? How did we help your business?"
                                            rows={5}
                                            className={`w-full px-4 py-3 pl-11 bg-white border-2 ${formErrors.review
                                                ? 'border-red-300 focus:border-red-500'
                                                : 'border-gray-200 focus:border-orange-500'
                                                } rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${formErrors.review ? 'focus:ring-red-200' : 'focus:ring-orange-200'
                                                } transition-all resize-none`}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            {formErrors.review && (
                                                <motion.p
                                                    initial={{ opacity, y: -5 }}
                                                    animate={{ opacity, y }}
                                                    className="text-sm text-red-600 flex items-center gap-1"
                                                >
                                                    <AlertCircle size={14} />
                                                    {formErrors.review}
                                                </motion.p>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {formData.review.length} characters
                                        </span>
                                    </div>
                                </div>

                                {/* Privacy Note */}
                                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                                    <p className="text-sm text-orange-800">
                                        <strong>Note:</strong> Your review will be reviewed before being published. We may reach out to verify your experience.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    className={`w-full py-4 px-6 flex items-center justify-center gap-2 text-white font-bold rounded-xl shadow-lg transition-all ${isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-xl'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Submit Review
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </motion.div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
};

export default WriteReview;
