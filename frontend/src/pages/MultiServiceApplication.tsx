// frontend/src/pages/MultiServiceApplication.tsx
import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    X,
    IndianRupee,
    Mail,
    MessageCircle,
    ShoppingCart,
    Sparkles,
    ArrowLeft,
    Package,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import { services, type Service } from './Services';

// === Service Selection Card ===
interface ServiceSelectionCardProps {
    service: Service;
    isSelected: boolean;
    onToggle: (serviceId: string) => void;
}

const ServiceSelectionCard = memo<ServiceSelectionCardProps>(({ service, isSelected, onToggle }) => (
    <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onToggle(service.id)}
        className={`relative cursor-pointer bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 ${isSelected
            ? 'border-green-500 shadow-lg shadow-green-100 ring-2 ring-green-200'
            : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }`}
    >
        {/* Selection Indicator */}
        <div className={`absolute top-4 right-4 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected
            ? 'bg-green-500 text-white scale-110'
            : 'bg-gray-100 border-2 border-gray-300 text-transparent'
            }`}>
            <Check className="w-4 h-4" />
        </div>

        {/* Service Image */}
        <div className="relative h-36 overflow-hidden">
            <img
                src={service.image}
                alt={service.title}
                className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? 'brightness-105' : ''}`}
            />
            <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-green-500/10' : 'bg-black/0'
                }`} />

            {/* Icon Badge */}
            <div className="absolute top-4 left-4 flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow z-10">
                {service.icon}
            </div>
        </div>

        {/* Service Info */}
        <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{service.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>

            {/* Price Badge */}
            <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <span className="text-xs text-gray-600">From</span>
                <div className="flex items-center text-green-700 font-bold">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{service.startingPrice.toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>

        {/* Selection Overlay Effect */}
        {isSelected && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 pointer-events-none border-4 border-green-500 rounded-2xl"
            />
        )}
    </motion.div>
));
ServiceSelectionCard.displayName = 'ServiceSelectionCard';

// === Selected Service Pill ===
const SelectedServicePill = memo<{ service: Service; onRemove: (id: string) => void }>(
    ({ service, onRemove }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-full"
        >
            <span className="text-sm font-medium text-green-800">{service.title}</span>
            <span className="text-xs text-green-600 font-bold">₹{service.startingPrice.toLocaleString('en-IN')}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(service.id);
                }}
                className="w-5 h-5 flex items-center justify-center bg-green-200 hover:bg-red-200 text-green-700 hover:text-red-600 rounded-full transition-colors"
            >
                <X className="w-3 h-3" />
            </button>
        </motion.div>
    )
);
SelectedServicePill.displayName = 'SelectedServicePill';

// === Main Component ===
const MultiServiceApplication: React.FC = () => {
    const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());

    // Toggle service selection
    const handleToggleService = useCallback((serviceId: string) => {
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
    const handleRemoveService = useCallback((serviceId: string) => {
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

    // Calculate total starting price
    const totalStartingPrice = useMemo(() => {
        return selectedServices.reduce((sum, s) => sum + s.startingPrice, 0);
    }, [selectedServices]);

    // Generate Email content
    const emailContent = useMemo(() => {
        if (selectedServices.length === 0) return '';

        const servicesList = selectedServices
            .map(s => `• ${s.title} (Starting from ₹${s.startingPrice.toLocaleString('en-IN')})`)
            .join('\n');

        return `Hi Edizo Team,

I am interested in the following services:

${servicesList}

Estimated Total Starting Price: ₹${totalStartingPrice.toLocaleString('en-IN')}

My Details:
- Name: 
- Company/Project: 
- Contact Number: 
- Detailed Requirements: 

Please provide a combined quote for these services.

Thank you!`;
    }, [selectedServices, totalStartingPrice]);

    // Generate WhatsApp content
    const whatsappContent = useMemo(() => {
        if (selectedServices.length === 0) return '';

        const servicesList = selectedServices
            .map(s => `• ${s.title} (₹${s.startingPrice.toLocaleString('en-IN')})`)
            .join('\n');

        return `Hi Edizo Team! 👋

I'm interested in *multiple services*:

${servicesList}

*Estimated Total:* ₹${totalStartingPrice.toLocaleString('en-IN')}

*My Details:*
• Name: 
• Project: 
• Requirements: 

Please share a combined quote!`;
    }, [selectedServices, totalStartingPrice]);

    return (
        <>
            <PageHeader
                title="Multiple Service Application"
                subtitle="Select multiple services and apply for a combined quote"
                variant="services"
            />

            <section className="py-16 bg-gradient-to-b from-white to-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <AnimatedSection>
                        <Link
                            to="/services"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Services
                        </Link>
                    </AnimatedSection>

                    {/* Instructions */}
                    <AnimatedSection>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-10">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <Package className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">How to Apply for Multiple Services</h3>
                                    <ol className="text-gray-700 space-y-1">
                                        <li className="flex items-center gap-2">
                                            <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">1</span>
                                            Select the services you need by clicking on them
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">2</span>
                                            Review your selection in the panel below
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">3</span>
                                            Contact us via Email or WhatsApp for a combined quote
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* Services Grid */}
                    <AnimatedSection>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Services</h2>
                            <p className="text-gray-600">Click on services to add them to your application</p>
                        </div>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                        {services.map((service, index) => (
                            <AnimatedSection key={service.id} delay={index * 0.05}>
                                <ServiceSelectionCard
                                    service={service}
                                    isSelected={selectedServiceIds.has(service.id)}
                                    onToggle={handleToggleService}
                                />
                            </AnimatedSection>
                        ))}
                    </div>

                    {/* Selected Services Panel */}
                    <AnimatePresence>
                        {selectedServices.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl"
                            >
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                                        {/* Selected Services Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <ShoppingCart className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">
                                                        {selectedServices.length} Service{selectedServices.length > 1 ? 's' : ''} Selected
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-green-700 font-bold">
                                                        <span className="text-sm text-gray-600 font-normal">Total from</span>
                                                        <IndianRupee className="w-4 h-4" />
                                                        <span className="text-lg">{totalStartingPrice.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleClearAll}
                                                    className="ml-4 text-sm text-gray-500 hover:text-red-600 underline transition-colors"
                                                >
                                                    Clear All
                                                </button>
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
                                            <a
                                                href={`mailto:edizo5491@gmail.com?subject=Multiple Service Inquiry (${selectedServices.length} Services)&body=${encodeURIComponent(emailContent)}`}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                                            >
                                                <Mail className="w-5 h-5" />
                                                <span>Email Quote Request</span>
                                            </a>
                                            <a
                                                href={`https://wa.me/917092435729?text=${encodeURIComponent(whatsappContent)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                <span>WhatsApp Quote</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Spacer for fixed panel */}
                    {selectedServices.length > 0 && <div className="h-48" />}

                    {/* Contact Info */}
                    <AnimatedSection>
                        <div className="text-center mt-12 p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                            <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Need Custom Package?</h3>
                            <p className="text-gray-600 mb-4">Contact us directly for tailored solutions</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                                <span className="flex items-center gap-2 text-gray-700">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    edizo5491@gmail.com
                                </span>
                                <span className="flex items-center gap-2 text-gray-700">
                                    <MessageCircle className="w-4 h-4 text-green-600" />
                                    +91 7092435729
                                </span>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
};

export default MultiServiceApplication;
