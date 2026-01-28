// frontend/src/pages/MultiServiceApplication.jsx
import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    X,
    Mail,
    MessageCircle,
    ShoppingCart,
    Sparkles,
    ArrowLeft,
    Package,
    Code,
    Palette,
    Video,
    Server,
    Bot,
    Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader.jsx';
import AnimatedSection from '../components/common/AnimatedSection.jsx';
import { services } from './Services.jsx';

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
const ServiceSelectionCard = memo(({ service, isSelected, onToggle, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{
            duration: 0.4,
            delay: index * 0.05,
            type: "spring",
            stiffness: 100
        }}
    >
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggle(service.id)}
            className={`relative cursor-pointer backdrop-blur-sm bg-white/90 border-2 rounded-2xl overflow-hidden transition-all duration-300 h-full ${isSelected
                ? 'border-green-500 shadow-lg shadow-green-100 ring-2 ring-green-200'
                : 'border-gray-200 hover:border-red-300 hover:shadow-lg'
                }`}
        >
            {/* Selection Indicator with animation */}
            <motion.div
                className={`absolute top-4 right-4 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 border-2 border-gray-300 text-transparent'
                    }`}
                animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
            >
                <Check className="w-4 h-4" />
            </motion.div>

            {/* Service Image */}
            <div className="relative h-36 overflow-hidden">
                <img
                    src={service.image}
                    alt={service.title}
                    className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? 'brightness-105 scale-105' : 'group-hover:scale-105'}`}
                />
                <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-green-500/10' : 'bg-black/0 group-hover:bg-black/10'
                    }`} />

                {/* Icon Badge with hover */}
                <motion.div
                    className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 backdrop-blur-sm bg-white/90 border border-gray-200 rounded-lg shadow z-10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    {service.icon}
                </motion.div>
            </div>

            {/* Service Info */}
            <div className="p-5">
                <h3 className={`text-lg font-bold mb-1 transition-colors duration-300 ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>{service.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
            </div>

            {/* Selection Overlay Effect */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none border-4 border-green-500 rounded-2xl"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    </motion.div>
));
ServiceSelectionCard.displayName = 'ServiceSelectionCard';

// === Selected Service Pill ===
const SelectedServicePill = memo(({ service, onRemove }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -10 }}
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full shadow-sm"
    >
        <span className="text-sm font-medium text-green-800">{service.title}</span>
        <motion.button
            onClick={(e) => {
                e.stopPropagation();
                onRemove(service.id);
            }}
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-5 h-5 flex items-center justify-center bg-green-200 hover:bg-red-200 text-green-700 hover:text-red-600 rounded-full transition-colors"
        >
            <X className="w-3 h-3" />
        </motion.button>
    </motion.div>
));
SelectedServicePill.displayName = 'SelectedServicePill';

// === Main Component ===
const MultiServiceApplication = () => {
    const [selectedServiceIds, setSelectedServiceIds] = useState(new Set());

    // Toggle service selection
    const handleToggleService = useCallback((serviceId) => {
        setSelectedServiceIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(serviceId)) {
                newSet.delete(serviceId);
            } else {
                newSet.add(serviceId);
            }
            return newSet;
        });
    }, []);

    // Remove service from selection
    const handleRemoveService = useCallback((serviceId) => {
        setSelectedServiceIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(serviceId);
            return newSet;
        });
    }, []);

    // Clear all selections
    const handleClearAll = useCallback(() => {
        setSelectedServiceIds(new Set());
    }, []);

    // Get selected services
    const selectedServices = useMemo(() => {
        return services.filter(s => selectedServiceIds.has(s.id));
    }, [selectedServiceIds]);

    // Generate Email content
    const emailContent = useMemo(() => {
        if (selectedServices.length === 0) return '';

        const servicesList = selectedServices
            .map(s => `• ${s.title}`)
            .join('\n');

        return `Hi Edizo Team,

I am interested in the following services:

${servicesList}

My Details:
- Name: 
- Company/Project: 
- Contact Number: 
- Detailed Requirements: 

Please provide a combined quote for these services.

Thank you!`;
    }, [selectedServices]);

    // Generate WhatsApp content
    const whatsappContent = useMemo(() => {
        if (selectedServices.length === 0) return '';

        const servicesList = selectedServices
            .map(s => `• ${s.title}`)
            .join('\n');

        return `Hi Edizo Team! 👋

I'm interested in *multiple services*:

${servicesList}

*My Details:*
• Name: 
• Project: 
• Requirements: 

Please share a combined quote!`;
    }, [selectedServices]);

    return (
        <>
            <PageHeader
                title="Multiple Service Application"
                subtitle="Select multiple services and apply for a combined quote"
            />

            <section className="py-16 bg-gradient-to-b from-white to-gray-50 min-h-screen relative overflow-hidden">
                {/* Static background gradient orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-red-100/30 to-orange-100/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-40 left-20 w-64 h-64 bg-gradient-to-br from-green-100/30 to-cyan-100/30 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-50/20 to-pink-50/20 rounded-full blur-3xl" />
                </div>

                {/* Static service theme icons as decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    {decorIcons.map((item, i) => (
                        <motion.div
                            key={i}
                            className="absolute opacity-[0.04]"
                            style={{
                                top: `${15 + (i % 3) * 30}%`,
                                left: i < 3 ? `${3 + i * 5}%` : 'auto',
                                right: i >= 3 ? `${3 + (i - 3) * 5}%` : 'auto',
                                color: item.color,
                            }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 0.04, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                        >
                            <item.Icon size={50} strokeWidth={1} />
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Back Link with hover */}
                    <AnimatedSection>
                        <motion.div whileHover={{ x: -5 }} className="inline-block">
                            <Link
                                to="/services"
                                className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium mb-8 transition-colors group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:transform group-hover:-translate-x-1 transition-transform" />
                                Back to Services
                            </Link>
                        </motion.div>
                    </AnimatedSection>

                    {/* Instructions Card */}
                    <AnimatedSection>
                        <motion.div
                            className="backdrop-blur-sm bg-gradient-to-r from-red-50/90 to-orange-50/90 border border-red-200 rounded-2xl p-6 mb-10 shadow-sm"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-start gap-4">
                                <motion.div
                                    className="p-3 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl"
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                >
                                    <Package className="w-6 h-6 text-red-600" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">How to Apply for Multiple Services</h3>
                                    <ol className="text-gray-700 space-y-2">
                                        {[
                                            'Select the services you need by clicking on them',
                                            'Review your selection in the panel below',
                                            'Contact us via Email or WhatsApp for a combined quote'
                                        ].map((step, i) => (
                                            <motion.li
                                                key={i}
                                                className="flex items-center gap-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                            >
                                                <span className="w-7 h-7 flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm">{i + 1}</span>
                                                {step}
                                            </motion.li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatedSection>

                    {/* Section Header */}
                    <AnimatedSection>
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Services</span>
                            </h2>
                            <p className="text-gray-600">Click on services to add them to your application</p>
                        </div>
                    </AnimatedSection>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                        {services.map((service, index) => (
                            <ServiceSelectionCard
                                key={service.id}
                                service={service}
                                isSelected={selectedServiceIds.has(service.id)}
                                onToggle={handleToggleService}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Selected Services Panel */}
                    <AnimatePresence>
                        {selectedServices.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-t-2 border-gray-200 shadow-2xl"
                            >
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                        {/* Selected Services Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <motion.div
                                                    className="p-2 bg-green-100 rounded-lg"
                                                    animate={{ rotate: [0, 10, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    <ShoppingCart className="w-5 h-5 text-green-600" />
                                                </motion.div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">
                                                        {selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} Selected
                                                    </h3>
                                                </div>
                                                <motion.button
                                                    onClick={handleClearAll}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="ml-4 text-sm text-gray-500 hover:text-red-600 underline transition-colors"
                                                >
                                                    Clear All
                                                </motion.button>
                                            </div>

                                            {/* Selected Pills */}
                                            <div className="flex flex-wrap gap-2">
                                                <AnimatePresence>
                                                    {selectedServices.map(service => (
                                                        <SelectedServicePill
                                                            key={service.id}
                                                            service={service}
                                                            onRemove={handleRemoveService}
                                                        />
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Contact Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                                            <motion.a
                                                href={`mailto:edizoofficial@gmail.com?subject=Multiple Service Inquiry (${selectedServices.length} Services)&body=${encodeURIComponent(emailContent)}`}
                                                whileHover={{ scale: 1.03, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                <Mail className="w-5 h-5" />
                                                <span>Email Quote Request</span>
                                            </motion.a>
                                            <motion.a
                                                href={`https://wa.me/917092435729?text=${encodeURIComponent(whatsappContent)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.03, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                <span>WhatsApp Quote</span>
                                            </motion.a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Spacer for fixed panel */}
                    {selectedServices.length > 0 && <div className="h-48" />}

                    {/* Contact Info Card */}
                    <AnimatedSection>
                        <motion.div
                            className="text-center mt-12 p-8 backdrop-blur-sm bg-gradient-to-r from-gray-50/90 to-gray-100/90 rounded-2xl border border-gray-200 shadow-sm"
                            whileHover={{ scale: 1.01 }}
                        >
                            <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className="inline-block"
                            >
                                <Sparkles className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Need Custom Package?</h3>
                            <p className="text-gray-600 mb-4">Contact us directly for tailored solutions</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
                                <motion.span
                                    className="flex items-center gap-2 text-gray-700"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Mail className="w-4 h-4 text-red-600" />
                                    edizoofficial@gmail.com
                                </motion.span>
                                <motion.span
                                    className="flex items-center gap-2 text-gray-700"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <MessageCircle className="w-4 h-4 text-green-600" />
                                    +91 7092435729
                                </motion.span>
                            </div>
                        </motion.div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
};

export default MultiServiceApplication;
