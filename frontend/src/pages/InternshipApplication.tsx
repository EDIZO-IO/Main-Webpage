// src/pages/InternshipApplication.tsx

import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Send, IndianRupee, Building2, ArrowLeft, Check, Star, Tag, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInternship } from '../components/hooks/useInternships'; // ✅ Use cached hook
import { getPricingTiers } from '../utils/internship.utils'; // ✅ Use utility function
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

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline' | 'default';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  to,
  type = 'button',
  variant = 'default',
  fullWidth = false,
  className = '',
  disabled = false,
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 focus:ring-red-500 shadow-md',
    outline: 'border border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
    default: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${variants[variant]} ${widthClass} ${className} ${disabledClasses}`}>
        {children}
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
    </button>
  );
};

// Animated Section Component
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100, damping: 20 }}
  >
    {children}
  </motion.div>
);

// Main Component
const InternshipApplication: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<string>('1-month');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState<string>('');
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

  // ✅ Use cached hook instead of direct fetch
  const { internship, loading, error } = useInternship(id);

  // ✅ Memoize pricing tiers calculation
  const coursePeriods = useMemo<CoursePeriod[]>(() => {
    if (!internship) return [];
    return getPricingTiers(internship.pricing, internship.discount);
  }, [internship]);

  // Set default course period when internship loads
  useEffect(() => {
    if (coursePeriods.length > 0 && !formData.coursePeriod) {
      const defaultPeriod = coursePeriods.find(p => p.isPopular)?.duration || '1-month';
      setFormData(prev => ({ ...prev, coursePeriod: defaultPeriod }));
      setActivePeriod(defaultPeriod);
    }
  }, [coursePeriods, formData.coursePeriod]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'coursePeriod') {
      setActivePeriod(value);
    }
  };

  const getSelectedPeriodDetails = (): CoursePeriod | undefined => {
    return coursePeriods.find((period) => period.duration === formData.coursePeriod);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.coursePeriod) {
      setSubmissionStatus('error');
      setSubmissionMessage('Please select a course period.');
      return;
    }

    setSubmissionStatus('processing');
    setSubmissionMessage('Submitting your application...');

    const selectedPeriod = getSelectedPeriodDetails();

    try {
      const response = await fetch(`${API_BASE_URL}/api/submit-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          university: formData.university,
          yearOfStudy: formData.yearOfStudy,
          education: formData.education,
          academicExperience: formData.academicExperience,
          message: formData.message,
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center py-20 px-6">
        <div className="text-center">
          <Loader2 className="animate-spin text-red-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Loading internship details...</p>
        </div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex flex-col items-center justify-center py-20 px-6">
        <div className="text-center max-w-lg">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={64} />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Internship Not Found</h1>
          <p className="text-lg text-gray-600 mb-6">{error || "The internship you're looking for does not exist."}</p>
          <Button onClick={() => navigate('/internships')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2 inline" /> Back to Internships
          </Button>
        </div>
      </div>
    );
  }

  const renderSubmissionMessage = () => {
    if (submissionStatus === 'idle' || submissionStatus === 'processing') return null;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`p-4 rounded-lg mb-4 ${
          submissionStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {submissionStatus === 'success' ? (
          <>
            <CheckCircle className="inline-block mr-2 text-green-600" size={24} />
            <span className="font-medium">Application Submitted Successfully!</span>
            <p className="text-sm mt-2">
              Thank you for applying! Your application has been saved. Our team will review it and contact you within 2-3 business days.
            </p>
          </>
        ) : (
          <>
            <XCircle className="inline-block mr-2 text-red-600" size={24} />
            <span className="font-medium">Application Submission Failed!</span>
            <p className="text-sm mt-2">{submissionMessage}</p>
          </>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-16 px-4 md:px-6 lg:px-8">
      <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-t-2xl overflow-hidden mb-8 w-full max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={getImageSrc(internship.id, internship.image)}
          alt={`${internship.title} course banner`}
          className="w-full h-64 object-cover object-center"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = fallbackImages.default;
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {internship.title} Application
          </h1>
          <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
            <Building2 size={16} />
            {internship.company}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200">
            <Link
              to={`/internships/${id}`}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm mb-6 transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to {internship.title}</span>
            </Link>

            {renderSubmissionMessage()}

            {submissionStatus !== 'success' ? (
              <>
                <div className="flex items-center mb-6">
                  <img
                    src={getImageSrc(internship.id, internship.image)}
                    alt={`${internship.title} thumbnail`}
                    className="w-12 h-12 object-cover rounded-lg mr-4"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImages.default;
                    }}
                  />
                  <h3 className="text-2xl font-bold text-gray-800">Apply Now</h3>
                </div>

                {/* Pricing Table with Discount */}
                {coursePeriods.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Star className="text-yellow-500" size={20} />
                      Choose Your Learning Path
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {coursePeriods.map((period) => (
                        <motion.div
                          key={period.duration}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.coursePeriod === period.duration
                              ? 'border-red-500 bg-red-50 shadow-lg ring-2 ring-red-200'
                              : 'border-gray-200 hover:border-red-300 hover:shadow-md'
                          } ${period.isPopular ? 'ring-2 ring-blue-300' : ''}`}
                          onClick={() => handleInputChange({ target: { name: 'coursePeriod', value: period.duration } } as any)}
                        >
                          {period.isPopular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold z-10">
                              Most Popular
                            </div>
                          )}
                          
                          {period.discount > 0 && (
                            <div className="absolute -top-3 right-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-md">
                              <Tag size={12} />
                              {period.discount}% OFF
                            </div>
                          )}

                          <div className="text-center">
                            <h5 className="text-lg font-bold text-gray-800 mb-1">{period.label}</h5>
                            
                            <div className="mb-2">
                              {period.discount > 0 ? (
                                <>
                                  <div className="flex items-center justify-center text-sm text-gray-400 line-through mb-1">
                                    <IndianRupee className="w-3 h-3" />
                                    <span>{period.originalPrice.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center justify-center text-2xl font-bold text-green-600">
                                    <IndianRupee className="w-5 h-5" />
                                    <span>{period.finalPrice.toLocaleString()}</span>
                                  </div>
                                  <p className="text-xs text-green-700 font-medium mt-1">
                                    Save ₹{period.savings.toLocaleString()}
                                  </p>
                                </>
                              ) : (
                                <div className="flex items-center justify-center text-2xl font-bold text-gray-800">
                                  <IndianRupee className="w-5 h-5" />
                                  <span>{period.originalPrice.toLocaleString()}</span>
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-gray-600 mb-3">{period.description}</p>
                            
                            <ul className="space-y-1 text-left">
                              {period.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start text-xs text-gray-700">
                                  <Check className="w-3 h-3 text-green-600 mr-1 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {getSelectedPeriodDetails() && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <span className="text-sm font-medium text-green-800 block">
                              Selected: {getSelectedPeriodDetails()?.label}
                            </span>
                            {getSelectedPeriodDetails()!.discount > 0 && (
                              <span className="text-xs text-green-600">
                                {getSelectedPeriodDetails()!.discount}% discount applied
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            {getSelectedPeriodDetails()!.discount > 0 && (
                              <div className="text-xs text-gray-500 line-through">
                                ₹{getSelectedPeriodDetails()!.originalPrice.toLocaleString()}
                              </div>
                            )}
                            <div className="flex items-center text-green-700 font-bold text-lg">
                              <IndianRupee className="w-4 h-4 mr-1" />
                              <span>{getSelectedPeriodDetails()!.finalPrice.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="Enter Name"
                      />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="example@gmail.com"
                      />
                    </motion.div>
                  </div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      placeholder="+91 12345 67890"
                    />
                  </motion.div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
                      <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                        University/College Name *
                      </label>
                      <input
                        type="text"
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                        placeholder="e.g., University of XYZ"
                      />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                      <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Year of Study *
                      </label>
                      <select
                        id="yearOfStudy"
                        name="yearOfStudy"
                        value={formData.yearOfStudy}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      >
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Other">Other</option>
                      </select>
                    </motion.div>
                  </div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                      Degree and Branch *
                    </label>
                    <input
                      type="text"
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                      placeholder="e.g., B.Tech in Computer Science"
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
                    <label htmlFor="academicExperience" className="block text-sm font-medium text-gray-700 mb-2">
                      Academic Projects / Relevant Experience
                    </label>
                    <textarea
                      id="academicExperience"
                      name="academicExperience"
                      value={formData.academicExperience}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-y"
                      placeholder="Describe relevant academic projects, coursework, or any prior experience..."
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.35 }}>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-y"
                      placeholder="Why are you interested in this internship and Edizo?"
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
                    <button
                      type="submit"
                      className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded-lg shadow-md hover:from-red-700 hover:to-orange-600 transition-all duration-300 flex items-center justify-center"
                      disabled={submissionStatus === 'processing' || !formData.coursePeriod}
                    >
                      {submissionStatus === 'processing' ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={20} />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2" size={20} />
                          Submit Application
                          {getSelectedPeriodDetails() && (
                            <span className="ml-2 text-sm">(₹{getSelectedPeriodDetails()!.finalPrice.toLocaleString()})</span>
                          )}
                        </>
                      )}
                    </button>
                  </motion.div>
                  {submissionStatus === 'processing' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 text-center text-red-600 flex items-center justify-center"
                    >
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      {submissionMessage}
                    </motion.div>
                  )}
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <CheckCircle className="mx-auto text-green-500" size={64} />
                <h3 className="text-2xl font-bold text-gray-800 mt-4">Thank You!</h3>
                <p className="text-gray-600 mt-2 mb-6">
                  Your application for <span className="font-semibold">{internship.title}</span> has been submitted successfully.
                </p>
                <Link
                  to={`/internships/${id}`}
                  className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  View Internship Details
                </Link>
              </motion.div>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="text-center pt-8 bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Start Your Journey?</h3>
            <p className="text-gray-500 text-sm mt-3">
              Limited seats • 100% Certification • Mentorship Included
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default InternshipApplication;
