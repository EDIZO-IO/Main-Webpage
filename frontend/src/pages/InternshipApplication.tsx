// src/pages/InternshipApplication.tsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { CheckCircle, XCircle, Star, TrendingUp, Loader2, Send, Clock, IndianRupee, Building2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import internshipsData from './internships.json'; // Adjust path if needed

// === Interfaces ===
interface Internship {
  id: string;
  title: string;
  category: string;
  mode: 'Online' | 'Offline';
  company: string;
  image: string;
  rating: number;
  description: string;
  isTrending?: boolean;
  syllabus: { [key: string]: string[] };
  whyChooseEdizo: string[];
  benefits: string[];
}

// Define the type for the structure *inside* the JSON file (without the 'id' property)
type InternshipDataWithoutId = Omit<Internship, 'id'>;

// FormData Interface
interface FormData {
  name: string;
  email: string;
  phone: string;
  university: string;
  yearOfStudy: string;
  education: string;
  academicExperience: string;
  message: string;
  coursePeriod: string; // Add coursePeriod to FormData
}

// Course Period Interface
interface CoursePeriod {
  value: string;
  label: string;
  price: number;
  description: string;
  popular?: boolean;
}

// === Utility Functions ===

// Image source function with fallback
const getImageSrc = (id: string | undefined, image: string | undefined): string => {
  if (!id || !image) {
    console.warn(`Image not found for ID: ${id}, using default fallback`);
    return '/assets/images/default-internship.png'; // Ensure this path is correct
  }
  // If image path is absolute or seems valid, use it
  if (image.startsWith('/') || image.startsWith('http')) {
    return image;
  }
  // Otherwise, assume it's relative to a specific asset folder
  const normalizedImage = `/assets/images/${image.split('/').pop()}`;
  if (!normalizedImage.match(/^\/assets\/images\/[a-zA-Z0-9-_.]+\.(png|jpg|jpeg|webp)$/)) {
    console.warn(`Invalid image path for ID: ${id}, path: ${image}, using fallback`);
    return `/assets/images/default-internship.png`; // Ensure this path is correct
  }
  return normalizedImage;
};

// Button Component
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline' | 'default';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  fullWidth = false,
  className = '',
  disabled = false,
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 focus:ring-red-500 shadow-md',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400',
    default: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
  };
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

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

// Course Period Pricing Configuration
const coursePeriods: CoursePeriod[] = [
  {
    value: '15-days',
    label: '15 Days',
    price: 1599,
    description: 'Quick introduction and basics',
  },
  {
    value: '1-month',
    label: '1 Month',
    price: 2999,
    description: 'Comprehensive learning with projects',
    popular: true,
  },
  {
    value: '2-months',
    label: '2 Months',
    price: 4599,
    description: 'In-depth training with real-world projects',
  },
  {
    value: '3-months',
    label: '3 Months',
    price: 7999,
    description: 'Complete mastery with industry exposure',
  },
];

// Main Component
const InternshipApplication: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate(); // Initialize useNavigate
  const [activePeriod, setActivePeriod] = useState<string>('15-days');
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
    coursePeriod: '', // Initialize coursePeriod
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If coursePeriod changes, update activePeriod for syllabus display
    if (name === 'coursePeriod') {
      setActivePeriod(value);
    }
  };

  // Get selected period details
  const getSelectedPeriodDetails = (): CoursePeriod | undefined => {
    return coursePeriods.find((period) => period.value === formData.coursePeriod);
  };

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // --- FIXED: Data Fetching and Type Handling ---
  useEffect(() => {
    const fetchInternship = () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        if (!id) {
          setError('Internship ID not provided');
          setInternship(null);
          setLoading(false);
          return;
        }

        // 1. Cast the imported JSON data to the correct type structure
        const data: Record<string, InternshipDataWithoutId> = internshipsData as Record<string, InternshipDataWithoutId>;

        // 2. Access the specific internship data using the ID from the URL
        const internshipDataWithoutId: InternshipDataWithoutId | undefined = data[id];

        if (internshipDataWithoutId) {
          // 3. Construct the full Internship object
          const selectedInternship: Internship = {
            id: id, // Add the id from the URL parameter
            ...internshipDataWithoutId // Spread the rest of the properties
          };

          setInternship(selectedInternship);

          // Set default course period if not already set
          if (!formData.coursePeriod) {
            const defaultPeriod = Object.keys(selectedInternship.syllabus)[0] || '15-days';
            setFormData(prev => ({ ...prev, coursePeriod: defaultPeriod }));
            setActivePeriod(defaultPeriod);
          } else {
             // Ensure activePeriod reflects formData.coursePeriod
             setActivePeriod(formData.coursePeriod);
          }
          setError(null);
        } else {
          setError(`Internship with ID "${id}" not found`);
          setInternship(null);
        }
      } catch (err) {
        console.error("Error processing internship data for ID:", id, err);
        setError(err instanceof Error ? err.message : 'Failed to load internship data');
        setInternship(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]); // Run effect when 'id' changes

  // Preload image
  useEffect(() => {
    if (internship?.image) {
        const imgSrc = getImageSrc(internship.id, internship.image);
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = imgSrc;
        document.head.appendChild(link);
        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
        };
    }
    const cleanup = () => {};
    return cleanup;
  }, [internship?.id, internship?.image]); // Dependency array

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.coursePeriod) {
      setSubmissionStatus('error');
      setSubmissionMessage('Please select a course period.');
      return;
    }

    setSubmissionStatus('processing');
    setSubmissionMessage('Sending your application and confirmation email...');

    const selectedPeriod = getSelectedPeriodDetails();

    try {
      // --- Send application data to the correct backend endpoint ---
      const response = await fetch(`${API_BASE_URL}/api/send-email`, {
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
          coursePeriod: selectedPeriod?.label, // Send label for display
          price: selectedPeriod?.price,       // Send price for display
          internshipTitle: internship?.title,
          company: internship?.company,
          // Add any other fields expected by your server.js /api/send-email handler
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);

      setSubmissionStatus('success');
      setSubmissionMessage('Application submitted successfully! A confirmation email has been sent to you.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        university: '',
        yearOfStudy: '',
        education: '',
        academicExperience: '',
        message: '',
        coursePeriod: '', // Reset coursePeriod
      });
      // Reset activePeriod to default of the internship or first available
      if (internship) {
        const defaultPeriod = Object.keys(internship.syllabus)[0] || '15-days';
        setActivePeriod(defaultPeriod);
        setFormData(prev => ({ ...prev, coursePeriod: defaultPeriod }));
      }
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


  // Get current syllabus based on activePeriod
  const currentSyllabus = internship?.syllabus[activePeriod] || [];

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-20 px-6 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        <p className="text-gray-600 mt-4">Loading internship details...</p>
      </div>
    );
  }

  // --- Error State ---
  if (error || !internship) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20 px-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Internship Not Found</h1>
        <p className="text-lg text-gray-600 mt-2">{error || "The internship you're looking for does not exist."}</p>
        <Button
          onClick={() => navigate('/internships')} // Use navigate for back button
          variant="outline"
          className="mt-6 border-red-600 text-red-600 hover:bg-red-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Internships
        </Button>
      </div>
    );
  }

  // --- Success/Error Message Display Helper ---
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
              Thank you for applying. A confirmation email has been sent to <span className="font-semibold">{formData.email}</span>. Our team will contact you soon.
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
    <div className="min-h-screen bg-white flex flex-col items-center py-16 px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="relative bg-gray-800 rounded-lg overflow-hidden mb-8 w-full max-w-6xl">
        <img
          src={getImageSrc(internship.id, internship.image)}
          alt={`${internship.title} course banner`}
          className="w-full h-64 object-cover opacity-50"
          loading="lazy"
          onError={(e) => {
            console.warn(`Failed to load header image for ID: ${internship.id}, path: ${internship.image}`);
            e.currentTarget.src = '/assets/images/default-internship.png'; // Ensure this path is correct
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {internship.title} Application
          </h1>
          <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
            <Building2 size={16} />
            {internship.company}
          </span>
        </div>
      </div>

      <section className="w-full max-w-2xl">
        <AnimatedSection delay={0.2}>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Submission Message */}
            {renderSubmissionMessage()}

            {/* Form or Success Message */}
            {submissionStatus !== 'success' ? (
              <>
                <div className="flex items-center mb-6">
                  <img
                    src={getImageSrc(internship.id, internship.image)}
                    alt={`${internship.title} thumbnail`}
                    className="w-12 h-12 object-cover rounded-lg mr-4"
                    loading="lazy"
                    onError={(e) => {
                      console.warn(`Failed to load thumbnail image for ID: ${internship.id}, path: ${internship.image}`);
                      e.currentTarget.src = '/assets/images/default-internship.png'; // Ensure this path is correct
                    }}
                  />
                  <h3 className="text-2xl font-bold text-gray-800">Apply Now</h3>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Form Fields */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                      placeholder="Enter Name"
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                      placeholder="example@gmail.com"
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                      placeholder="+91 12345 67890"
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
                    <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                      University/College Name *
                    </label>
                    <input
                      type="text"
                      id="university"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                      placeholder="e.g., University of XYZ"
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
                    <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Year of Study *
                    </label>
                    <select
                      id="yearOfStudy"
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
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
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.35 }}>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                      Degree and Branch *
                    </label>
                    <input
                      type="text"
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                      placeholder="e.g., B.Tech in Computer Science"
                    />
                  </motion.div>
                  {/* Course Period Selection */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
                    <label htmlFor="coursePeriod" className="block text-sm font-medium text-gray-700 mb-3">
                      <Clock className="inline-block w-4 h-4 mr-1" />
                      Select Course Period *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {coursePeriods.map((period) => (
                        <motion.div
                          key={period.value}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 * coursePeriods.indexOf(period) }}
                          className="relative"
                        >
                          <input
                            type="radio"
                            id={`period-${period.value}`}
                            name="coursePeriod"
                            value={period.value}
                            checked={formData.coursePeriod === period.value}
                            onChange={handleInputChange}
                            required
                            className="sr-only"
                          />
                          <label
                            htmlFor={`period-${period.value}`}
                            className={`relative flex flex-col p-4 cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                              formData.coursePeriod === period.value
                                ? 'border-red-500 bg-red-50 ring-2 ring-red-200'
                                : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                            } ${period.popular ? 'ring-2 ring-blue-200 border-blue-400' : ''}`}
                          >
                            {period.popular && (
                              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                Popular
                              </div>
                            )}
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-semibold text-gray-800">{period.label}</span>
                              <div className="flex items-center text-green-600 font-bold">
                                <IndianRupee className="w-4 h-4" />
                                <span>{period.price.toLocaleString()}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{period.description}</p>
                          </label>
                        </motion.div>
                      ))}
                    </div>
                    {/* Display selected period info below radio buttons */}
                    {getSelectedPeriodDetails() && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800">Selected: {getSelectedPeriodDetails()?.label}</span>
                          <div className="flex items-center text-green-700 font-bold">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            <span>{getSelectedPeriodDetails()?.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.45 }}>
                    <label htmlFor="academicExperience" className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Projects / Relevant Experience
                    </label>
                    <textarea
                      id="academicExperience"
                      name="academicExperience"
                      value={formData.academicExperience}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 resize-none"
                      placeholder="Describe relevant academic projects, coursework, or any prior experience..."
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 resize-none"
                      placeholder="Why are you interested in this internship and Edizo?"
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.55 }}>
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      className="flex items-center justify-center"
                      disabled={submissionStatus === 'processing'}
                    >
                      {submissionStatus === 'processing' ? (
                        <Loader2 className="mr-2 animate-spin" size={18} />
                      ) : (
                        <Send className="mr-2" size={18} />
                      )}
                      Submit Application
                      {getSelectedPeriodDetails() && (
                        <span className="ml-2 text-sm"> (₹{getSelectedPeriodDetails()?.price.toLocaleString()})</span>
                      )}
                    </Button>
                  </motion.div>
                  {/* Processing Message */}
                  {submissionStatus === 'processing' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 text-center text-red-600 flex items-center justify-center"
                    >
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      {submissionMessage}
                    </motion.div>
                  )}
                </form>
              </>
            ) : (
              // --- Success Message with Option to Apply Again ---
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-6"
              >
                 <Button
                  variant="outline"
                  onClick={() => {
                    setSubmissionStatus('idle');
                    setSubmissionMessage('');
                    // Reset form data if needed, though it's already reset on success
                     if (internship) {
                       const defaultPeriod = Object.keys(internship.syllabus)[0] || '15-days';
                       setActivePeriod(defaultPeriod);
                       setFormData(prev => ({ ...prev, coursePeriod: defaultPeriod }));
                     }
                  }}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  Submit Another Application
                </Button>
              </motion.div>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* Syllabus Section */}
      {internship && (
        <section className="w-full max-w-6xl mt-16">
          <AnimatedSection>
            <div className="flex items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Clock className="text-red-600" size={24} />
                Syllabus & Learning Path
              </h3>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 mb-5">
              {Object.keys(internship.syllabus).map((periodKey) => {
                const periodConfig = coursePeriods.find(p => p.value === periodKey);
                const label = periodConfig ? periodConfig.label : periodKey.replace('-', ' ').replace('days', ' Days').replace('month', ' Month').replace('months', ' Months');
                return (
                  <motion.button
                    key={periodKey}
                    onClick={() => {
                      setActivePeriod(periodKey);
                      // Sync formData.coursePeriod if needed, though UI handles it
                      // setFormData(prev => ({ ...prev, coursePeriod: periodKey }));
                    }}
                    className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
                      activePeriod === periodKey
                        ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {label}
                  </motion.button>
                );
              })}
            </div>
            {currentSyllabus.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  {activePeriod.replace('-', ' ').replace('days', ' Days').replace('month', ' Month').replace('months', ' Months')} Program
                </h4>
                <ul className="space-y-3">
                  {currentSyllabus.map((topic, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-start text-gray-600 text-sm p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-xs font-bold">
                        {index + 1}
                      </div>
                      <span>{topic}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <p className="text-gray-500 text-sm italic bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                No syllabus available for this program duration.
              </p>
            )}
          </AnimatedSection>
        </section>
      )}


       {/* Final CTA */}
      <section className="w-full max-w-6xl mt-16">
        <AnimatedSection delay={0.4}>
          <div className="text-center pt-8">
            {submissionStatus !== 'success' && (
              <Button
                onClick={() => {
                   // Trigger form submission if not already submitted
                   if (submissionStatus === 'idle') {
                     const form = document.querySelector('form'); // Get the form element
                     if (form) {
                       form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); // Trigger submit
                     }
                   }
                }}
                variant="primary"
                className="px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 shadow-lg"
                disabled={submissionStatus === 'processing'}
              >
                {submissionStatus === 'processing' ? (
                   <Loader2 className="mr-2 animate-spin" size={20} />
                 ) : (
                   <Send className="mr-2" size={20} />
                 )}
                Apply Now →
              </Button>
            )}
            <p className="text-gray-500 text-sm mt-3">
              Limited seats • 100% Certification • Mentorship Included
            </p>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default InternshipApplication;