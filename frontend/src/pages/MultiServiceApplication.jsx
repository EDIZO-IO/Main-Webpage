// frontend/src/pages/MultiServiceApplication.jsx
import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, X, Mail, MessageCircle, ShoppingCart, Sparkles, ArrowLeft, Package,
    Code, Palette, Video, Server, Bot, Globe, Loader2, AlertCircle,
    Smartphone, Zap, Shield, BarChart2, Search, Users, Target, Share2, TrendingUp
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader.jsx';
import AnimatedSection from '../components/common/AnimatedSection.jsx';
import { useServices } from '../hooks/useServices';
import { applicationsAPI, serviceApplicationsAPI } from '../api/api';
import { toast } from 'react-toastify';

// Service theme icons for background decoration
const decorIcons = [
    { Icon: Code, color: '#22c55e' },
    { Icon: Palette, color: '#f43f5e' },
    { Icon: Video, color: '#f97316' },
    { Icon: Server, color: '#8b5cf6' },
    { Icon: Bot, color: '#06b6d4' },
    { Icon: Globe, color: '#ec4899' },
];

// === Service Selection Card ===
const ServiceSelectionCard = memo(({ service, isSelected, onToggle, index }) => {
    const IconComponent = iconMap[service.icon] || Globe;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05, type: "spring", stiffness: 100 }}
        >
            <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggle(service.id)}
                className={`
                    relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                    ${isSelected
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/30'
                        : 'bg-white text-gray-900 hover:shadow-lg border-2 border-gray-200'
                    }
                `}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-gray-100'}`}>
                        <IconComponent size={24} className={isSelected ? 'text-white' : 'text-gray-700'} />
                    </div>
                    <motion.div
                        initial={false}
                        animate={{ scale: isSelected ? 1 : 0 }}
                        className={isSelected ? 'text-white' : 'text-orange-500'}
                    >
                        <Check size={24} strokeWidth={3} />
                    </motion.div>
                </div>
                <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                    {service.short_description}
                </p>
            </motion.div>
        </motion.div>
    );
});
ServiceSelectionCard.displayName = 'ServiceSelectionCard';

// === Form Input ===
const FormInput = memo(({ label, type = 'text', value, onChange, placeholder, required, error, icon: Icon }) => (
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon size={18} />
                </div>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all outline-none
                    ${Icon ? 'pl-12' : ''}
                    ${error
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'
                    }
                `}
            />
        </div>
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
));
FormInput.displayName = 'FormInput';

// === Textarea Input ===
const TextareaInput = memo(({ label, value, onChange, placeholder, required, error, rows = 4 }) => (
    <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className={`
                w-full px-4 py-3 rounded-xl border-2 transition-all outline-none resize-none
                ${error
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                    : 'border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'
                }
            `}
        />
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
));
TextareaInput.displayName = 'TextareaInput';

// === Main Component ===
const MultiServiceApplication = () => {
    const navigate = useNavigate();
    const { services, loading, error } = useServices();
    const [selectedServices, setSelectedServices] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        budget: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Get service IDs from URL params
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const serviceParam = params.get('service');
        if (serviceParam && services.length > 0) {
            const service = services.find(s => s.id === serviceParam || s.slug === serviceParam);
            if (service) {
                setSelectedServices([service.id]);
            }
        }
    }, [services]);

    const toggleService = useCallback((serviceId) => {
        setSelectedServices(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    }, []);

    const validateForm = useCallback(() => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        if (!formData.message.trim()) errors.message = 'Project details are required';
        if (selectedServices.length === 0) errors.services = 'Please select at least one service';
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData, selectedServices]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            // Submit service application for each selected service
            const submissions = selectedServices.map(async (serviceId) => {
                const service = services.find(s => s.id === serviceId);
                await serviceApplicationsAPI.create({
                    service_id: serviceId,
                    full_name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company_name: formData.company,
                    budget_range: formData.budget,
                    project_description: formData.message,
                    service_type: service.category,
                    application_status: 'submitted',
                    payment_status: 'pending'
                });
            });

            await Promise.all(submissions);

            toast.success('Service application submitted successfully! We will contact you soon.');
            setSubmitted(true);
            setFormData({ name: '', email: '', phone: '', company: '', budget: '', message: '' });
            setSelectedServices([]);
        } catch (err) {
            console.error('Submit error:', err);
            toast.error(err.response?.data?.error || 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedServicesList = useMemo(() => 
        services.filter(s => selectedServices.includes(s.id)),
        [services, selectedServices]
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading services...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Services</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link to="/services" className="text-orange-600 font-semibold hover:underline">
                        ← Back to Services
                    </Link>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you for your interest. Our team will review your request and get back to you within 24-48 hours.
                    </p>
                    <Link
                        to="/services"
                        className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        Back to Services
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <PageHeader
                title="Apply for Multiple Services"
                subtitle="Select the services you need and tell us about your project"
                breadcrumb={[
                    { label: 'Home', path: '/' },
                    { label: 'Services', path: '/services' },
                    { label: 'Apply' }
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <AnimatedSection animation="fadeInUp">
                    {/* Back Link */}
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 font-semibold mb-8 transition-all"
                    >
                        <ArrowLeft size={20} />
                        Back to Services
                    </Link>

                    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
                        {/* Service Selection */}
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Select Services</h2>
                            <p className="text-gray-600 mb-8">Choose all the services you're interested in</p>
                            
                            {selectedServices.length === 0 && formErrors.services && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                    <p className="text-red-600 font-medium">{formErrors.services}</p>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map((service, index) => (
                                    <ServiceSelectionCard
                                        key={service.id}
                                        service={service}
                                        isSelected={selectedServices.includes(service.id)}
                                        onToggle={toggleService}
                                        index={index}
                                    />
                                ))}
                            </div>

                            {selectedServices.length > 0 && (
                                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                                    <p className="text-orange-800 font-semibold">
                                        <Check className="inline-block mr-2 w-5 h-5" />
                                        {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Contact Information */}
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Contact Information</h2>
                            <p className="text-gray-600 mb-8">Tell us how to reach you</p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                    error={formErrors.name}
                                    icon={Mail}
                                />
                                <FormInput
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    required
                                    error={formErrors.email}
                                    icon={Mail}
                                />
                                <FormInput
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 1234567890"
                                    icon={MessageCircle}
                                />
                                <FormInput
                                    label="Company Name"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="Your Company (Optional)"
                                    icon={Package}
                                />
                            </div>
                        </section>

                        {/* Project Details */}
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Project Details</h2>
                            <p className="text-gray-600 mb-8">Tell us more about your project</p>

                            <TextareaInput
                                label="Project Description"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Describe your project, goals, timeline, and any specific requirements..."
                                required
                                error={formErrors.message}
                                rows={6}
                            />
                        </section>

                        {/* Submit Button */}
                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Submit Application
                                    </>
                                )}
                            </button>
                            <p className="text-gray-500 text-sm">
                                We'll get back to you within 24-48 hours
                            </p>
                        </div>
                    </form>
                </AnimatedSection>
            </div>
        </div>
    );
};

// Icon mapping
const iconMap = {
    Globe: Globe,
    Palette: Palette,
    Smartphone: Smartphone,
    Video: Video,
    Zap: Zap,
    Shield: Shield,
    BarChart2: BarChart2,
    Search: Search,
    Users: Users,
    Code: Code,
    Target: Target,
    Share2: Share2,
    TrendingUp: TrendingUp
};

export default MultiServiceApplication;
