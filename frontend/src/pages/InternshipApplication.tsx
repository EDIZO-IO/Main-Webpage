// src/pages/InternshipApplication.tsx

// At the top of the file, fix the import statement:

import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // ✅ Fixed - import from react-router-dom, not react
import { 
  CheckCircle, XCircle, Loader2, Send, IndianRupee, Building2, ArrowLeft, 
  Check, Star, Tag, AlertCircle, Trophy, Zap, Shield, Clock, Users 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInternship } from '../components/hooks/useInternships';
import { getPricingTiers } from '../utils/internship.utils';
import type { CoursePeriod } from '../types/internship.types';


// === Interfaces ===
interface FormData {
  name: string;
  email: string;
  phone: string;
  university: string;
  yearOfStudy: string;
  education: string;
  academicExperience: string;
  message: string;
  coursePeriod: string;
}

interface FormErrors {
  [key: string]: string;
}

// Fallback images
const fallbackImages: Record<string, string> = {
  'ui-ux-design': '/assets/images/web-design.png',
  'frontend-development': '/assets/images/responsive-design.png',
  'backend-development': '/assets/images/back-end.png',
  'hr-management': '/assets/images/hr-manager.png',
  'data-analytics': '/assets/images/data-Analytics.png',
  'java-development': '/assets/images/java.png',
  'python-development': '/assets/images/python.png',
  'digital-marketing': '/assets/images/content-strategy.png',
  'ai-ml': '/assets/images/ai-assistant.png',
  'ai-with-chatgpt': '/assets/images/AI with CHATGPT.png',
  'web-development': '/assets/images/web-development.png',
  'csharp': '/assets/images/c-sharp.png',
  default: 'https://via.placeholder.com/800x400?text=Internship+Image',
};

const getImageSrc = (id: string | undefined, image: string | undefined): string => {
  if (image && (image.startsWith('/') || image.startsWith('http'))) {
    return image;
  }
  if (id && fallbackImages[id]) {
    return fallbackImages[id];
  }
  return fallbackImages.default;
};

// ✅ Memoized Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline' | 'default';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const Button = memo<ButtonProps>(({
  children,
  onClick,
  to,
  type = 'button',
  variant = 'default',
  fullWidth = false,
  className = '',
  disabled = false,
  icon,
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 focus:ring-red-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500 shadow-sm',
    default: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${variants[variant]} ${widthClass} ${className} ${disabledClasses}`}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${className} ${disabledClasses}`}
      disabled={disabled}
    >
      {children}
      {icon}
    </button>
  );
});
Button.displayName = 'Button';

// ✅ Memoized Animated Section
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection = memo<AnimatedSectionProps>(({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-30px' }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
));
AnimatedSection.displayName = 'AnimatedSection';

// ✅ Memoized Pricing Card
const PricingCard = memo<{ 
  period: CoursePeriod; 
  isSelected: boolean; 
  onClick: () => void;
}>(({ period, isSelected, onClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02, y: -4 }}
    transition={{ duration: 0.2 }}
    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
      isSelected
        ? 'border-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-xl ring-2 ring-red-200'
        : 'border-gray-200 hover:border-red-300 hover:shadow-lg bg-white'
    } ${period.isPopular ? 'ring-2 ring-blue-300' : ''}`}
    onClick={onClick}
  >
    {period.isPopular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs px-4 py-1.5 rounded-full font-bold shadow-lg z-10">
        🔥 Most Popular
      </div>
    )}
    
    {period.discount > 0 && (
      <div className="absolute -top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-lg animate-pulse">
        <Tag size={14} />
        {period.discount}% OFF
      </div>
    )}

    <div className="text-center">
      <h5 className="text-xl font-bold text-gray-900 mb-3">{period.label}</h5>
      
      <div className="mb-4">
        {period.discount > 0 ? (
          <>
            <div className="flex items-center justify-center text-sm text-gray-400 line-through mb-2">
              <IndianRupee className="w-4 h-4" />
              <span>{period.originalPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-center text-3xl font-bold text-green-600 mb-2">
              <IndianRupee className="w-6 h-6" />
              <span>{period.finalPrice.toLocaleString()}</span>
            </div>
            <p className="text-sm text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full inline-block">
              Save ₹{period.savings.toLocaleString()}
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center text-3xl font-bold text-gray-900 mb-2">
            <IndianRupee className="w-6 h-6" />
            <span>{period.originalPrice.toLocaleString()}</span>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4 px-2">{period.description}</p>
      
      <ul className="space-y-2 text-left">
        {period.features.map((feature, idx) => (
          <li key={idx} className="flex items-start text-sm text-gray-700">
            <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" strokeWidth={3} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-4 flex items-center justify-center gap-2 text-red-600 font-bold"
        >
          <CheckCircle size={20} />
          <span>Selected</span>
        </motion.div>
      )}
    </div>
  </motion.div>
));
PricingCard.displayName = 'PricingCard';

// ✅ Memoized Form Input
const FormInput = memo<{
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  delay?: number;
}>(({ id, name, type = 'text', label, value, onChange, placeholder, required = false, error, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay }}
  >
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full p-4 border-2 ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900`}
      placeholder={placeholder}
    />
    {error && (
      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
        <XCircle size={14} />
        {error}
      </p>
    )}
  </motion.div>
));
FormInput.displayName = 'FormInput';

// ✅ Memoized Stats Badge
const StatBadge = memo<{ icon: React.ReactNode; text: string }>(({ icon, text }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600">
    {icon}
    <span>{text}</span>
  </div>
));
StatBadge.displayName = 'StatBadge';

// Main Component
const InternshipApplication: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<string>('1-month');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState<string>('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    university: '',
    yearOfStudy: '',
    education: '',
    academicExperience: '',
    message: '',
    coursePeriod: '1-month',
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const { internship, loading, error } = useInternship(id);

  // ✅ Memoize pricing tiers
  const coursePeriods = useMemo<CoursePeriod[]>(() => {
    if (!internship) return [];
    return getPricingTiers(internship.pricing, internship.discount);
  }, [internship]);

  // ✅ Memoize selected period details
  const selectedPeriodDetails = useMemo(() => 
    coursePeriods.find((period) => period.duration === formData.coursePeriod),
    [coursePeriods, formData.coursePeriod]
  );

  // Set default course period when internship loads
  useEffect(() => {
    if (coursePeriods.length > 0 && !formData.coursePeriod) {
      const defaultPeriod = coursePeriods.find(p => p.isPopular)?.duration || '1-month';
      setFormData(prev => ({ ...prev, coursePeriod: defaultPeriod }));
      setActivePeriod(defaultPeriod);
    }
  }, [coursePeriods, formData.coursePeriod]);

  // ✅ Form validation
  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.university.trim()) errors.university = 'University/College is required';
    if (!formData.yearOfStudy) errors.yearOfStudy = 'Year of study is required';
    if (!formData.education.trim()) errors.education = 'Degree and branch is required';
    if (!formData.coursePeriod) errors.coursePeriod = 'Please select a course period';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // ✅ Memoized callbacks
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name === 'coursePeriod') {
      setActivePeriod(value);
    }
  }, [formErrors]);

  const handlePeriodSelect = useCallback((duration: string) => {
    setFormData(prev => ({ ...prev, coursePeriod: duration }));
    setActivePeriod(duration);
    if (formErrors.coursePeriod) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.coursePeriod;
        return newErrors;
      });
    }
  }, [formErrors.coursePeriod]);

  const handleGoBack = useCallback(() => {
    navigate('/internships');
  }, [navigate]);

  const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmissionStatus('error');
      setSubmissionMessage('Please fix the errors in the form before submitting.');
      return;
    }

    setSubmissionStatus('processing');
    setSubmissionMessage('Submitting your application...');

    const selectedPeriod = coursePeriods.find((period) => period.duration === formData.coursePeriod);

    try {
      const response = await fetch(`${API_BASE_URL}/api/submit-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coursePeriod: selectedPeriod?.label,
          originalPrice: selectedPeriod?.originalPrice,
          discount: selectedPeriod?.discount,
          finalPrice: selectedPeriod?.finalPrice,
          savings: selectedPeriod?.savings,
          internshipTitle: internship?.title,
          company: internship?.company,
          internshipId: internship?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);

      setSubmissionStatus('success');
      setSubmissionMessage('Application submitted successfully! Our team will contact you within 2-3 business days.');

      setFormData({
        name: '',
        email: '',
        phone: '',
        university: '',
        yearOfStudy: '',
        education: '',
        academicExperience: '',
        message: '',
        coursePeriod: '1-month',
      });
      setFormErrors({});
    } catch (error: any) {
      console.error('Error in form submission:', error);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Could not connect to the server. Please check your internet connection.';
      } else if (error instanceof Error) {
        errorMessage = `Submission failed: ${error.message}`;
      }
      setSubmissionStatus('error');
      setSubmissionMessage(errorMessage);
    }
  }, [validateForm, formData, coursePeriods, internship, API_BASE_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center py-20 px-6">
        <div className="text-center">
          <Loader2 className="animate-spin text-red-600 mx-auto mb-4" size={56} />
          <p className="text-gray-700 text-xl font-medium">Loading application form...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col items-center justify-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg bg-white p-10 rounded-3xl shadow-2xl"
        >
          <AlertCircle className="text-red-600 mx-auto mb-6" size={72} />
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Internship Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">{error || "The internship you're looking for does not exist."}</p>
          <Button onClick={handleGoBack} variant="primary" icon={<ArrowLeft size={18} />}>
            Back to Internships
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4 md:px-6 lg:px-8">
      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-3xl overflow-hidden mb-10 w-full max-w-5xl mx-auto shadow-2xl">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          src={getImageSrc(internship.id, internship.image)}
          alt={`${internship.title} banner`}
          className="w-full h-72 object-cover object-center"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackImages.default;
          }}
        />
        
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${20 + i * 40}%`,
                top: `${20 + i * 30}%`,
              }}
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
              Apply for {internship.title}
            </h1>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 bg-blue-600/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                <Building2 size={18} />
                {internship.company}
              </span>
              <span className="inline-flex items-center gap-2 bg-yellow-500/90 backdrop-blur-sm text-gray-900 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                <Star size={18} fill="currentColor" />
                {internship.rating} Rating
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <AnimatedSection delay={0.1}>
          <Link
            to={`/internships/${id}`}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold mb-8 transition-all duration-200 group bg-white px-5 py-3 rounded-xl shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Internship Details</span>
          </Link>
        </AnimatedSection>

        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100">
          {/* Status Messages */}
          <AnimatePresence>
            {submissionStatus !== 'idle' && submissionStatus !== 'processing' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                {submissionStatus === 'success' ? (
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="text-green-600 flex-shrink-0" size={32} />
                      <div>
                        <h3 className="text-xl font-bold text-green-900 mb-2">Application Submitted Successfully!</h3>
                        <p className="text-green-800">
                          Thank you for applying! Our team will review your application and contact you within 2-3 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <XCircle className="text-red-600 flex-shrink-0" size={32} />
                      <div>
                        <h3 className="text-xl font-bold text-red-900 mb-2">Submission Failed</h3>
                        <p className="text-red-800">{submissionMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {submissionStatus !== 'success' ? (
            <>
              {/* Program Info */}
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
                <img
                  src={getImageSrc(internship.id, internship.image)}
                  alt={internship.title}
                  className="w-20 h-20 object-cover rounded-2xl shadow-md"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImages.default;
                  }}
                />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Your Application</h2>
                  <div className="flex flex-wrap gap-4">
                    <StatBadge icon={<Clock size={16} className="text-blue-600" />} text="Quick Process" />
                    <StatBadge icon={<Shield size={16} className="text-green-600" />} text="Secure Data" />
                    <StatBadge icon={<Users size={16} className="text-purple-600" />} text="Expert Mentors" />
                  </div>
                </div>
              </div>

              {/* Pricing Selection */}
              {coursePeriods.length > 0 && (
                <AnimatedSection delay={0.2}>
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Zap className="text-red-600" size={28} />
                      Choose Your Learning Path
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      {coursePeriods.map((period) => (
                        <PricingCard
                          key={period.duration}
                          period={period}
                          isSelected={formData.coursePeriod === period.duration}
                          onClick={() => handlePeriodSelect(period.duration)}
                        />
                      ))}
                    </div>

                    {formErrors.coursePeriod && (
                      <p className="text-red-600 text-sm flex items-center gap-1 mb-4">
                        <XCircle size={14} />
                        {formErrors.coursePeriod}
                      </p>
                    )}

                    {selectedPeriodDetails && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="text-green-600" size={28} />
                            <div>
                              <span className="text-lg font-bold text-green-900 block">
                                Selected: {selectedPeriodDetails.label}
                              </span>
                              {selectedPeriodDetails.discount > 0 && (
                                <span className="text-sm text-green-700">
                                  {selectedPeriodDetails.discount}% discount applied • Save ₹{selectedPeriodDetails.savings.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {selectedPeriodDetails.discount > 0 && (
                              <div className="text-sm text-gray-500 line-through">
                                ₹{selectedPeriodDetails.originalPrice.toLocaleString()}
                              </div>
                            )}
                            <div className="flex items-center text-green-700 font-bold text-2xl">
                              <IndianRupee className="w-5 h-5 mr-1" />
                              <span>{selectedPeriodDetails.finalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </AnimatedSection>
              )}

              {/* Application Form */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h3>

                <FormInput
                  id="name"
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  error={formErrors.name}
                  delay={0}
                />

                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@gmail.com"
                  required
                  error={formErrors.email}
                  delay={0.05}
                />

                <FormInput
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 12345 67890"
                  delay={0.1}
                />

                <FormInput
                  id="university"
                  name="university"
                  label="University/College Name"
                  value={formData.university}
                  onChange={handleInputChange}
                  placeholder="e.g., University of XYZ"
                  required
                  error={formErrors.university}
                  delay={0.15}
                />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label htmlFor="yearOfStudy" className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Year of Study <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="yearOfStudy"
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-4 border-2 ${formErrors.yearOfStudy ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900`}
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.yearOfStudy && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <XCircle size={14} />
                      {formErrors.yearOfStudy}
                    </p>
                  )}
                </motion.div>

                <FormInput
                  id="education"
                  name="education"
                  label="Degree and Branch"
                  value={formData.education}
                  onChange={handleInputChange}
                  placeholder="e.g., B.Tech in Computer Science"
                  required
                  error={formErrors.education}
                  delay={0.25}
                />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <label htmlFor="academicExperience" className="block text-sm font-semibold text-gray-700 mb-2">
                    Academic Projects / Relevant Experience (Optional)
                  </label>
                  <textarea
                    id="academicExperience"
                    name="academicExperience"
                    value={formData.academicExperience}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-y text-gray-900"
                    placeholder="Describe relevant academic projects, coursework, or prior experience..."
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.35 }}
                >
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-y text-gray-900"
                    placeholder="Why are you interested in this internship?"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="pt-6"
                >
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={submissionStatus === 'processing' || !formData.coursePeriod}
                    className="text-lg py-5 shadow-xl"
                  >
                    {submissionStatus === 'processing' ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Send size={24} />
                        Submit Application
                        {selectedPeriodDetails && (
                          <span className="ml-2 font-bold">
                            (₹{selectedPeriodDetails.finalPrice.toLocaleString()})
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <CheckCircle className="mx-auto text-green-500 mb-6" size={80} />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Thank you for applying to <span className="font-bold text-gray-900">{internship.title}</span> at {internship.company}. 
                Our team will review your application and get back to you soon.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button to={`/internships/${id}`} variant="primary" icon={<ArrowLeft size={20} />}>
                  View Internship Details
                </Button>
                <Button to="/internships" variant="outline">
                  Browse More Internships
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer CTA */}
        {submissionStatus !== 'success' && (
          <AnimatedSection delay={0.5}>
            <div className="mt-10 text-center bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Questions About This Program?</h3>
              <p className="text-gray-600 mb-6">Our team is here to help you make the right choice</p>
              <Button to="/contact" variant="outline">
                Contact Support
              </Button>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default InternshipApplication;
