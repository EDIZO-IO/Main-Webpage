
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Send,
  Clock,
  IndianRupee,
  Building2,
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import JSON data
import internshipsData from './internships.json';

// --- Reusable Components ---

// Button component for consistent styling and behavior
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
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
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

// AnimatedSection component for smooth entrance animations
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

// Input Field styling
const inputFieldClasses = 'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200';

// --- Course Period Pricing Configuration ---
interface CoursePeriod {
  value: string;
  label: string;
  price: number;
  description: string;
  popular?: boolean;
}

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

// --- Internship Data Interface ---
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

// --- Fallback Image Map ---
const fallbackImages: Record<string, string> = {
  'ui-ux-design': '/assets/images/web-design.png',
  'frontend-development': '/assets/images/responsive-design.png',
  'backend-development': '/assets/images/back-end.png',
  'hr-management': '/assets/images/hr-manager.png',
  'data-analytics': '/assets/images/content-strategy.png',
  'java-development': '/assets/images/java.png',
  'python-development': '/assets/images/python.png',
  'digital-marketing': '/assets/images/content-strategy.png',
  'ai-ml': '/assets/images/ai-assistant.png',
  'ai-with-chatgpt': '/assets/images/AI with CHATGPT.png',
  'web-development': '/assets/images/web-development.png',
  'csharp': '/assets/images/c-sharp.png',
  default: '/assets/images/default-internship.png' // Generic fallback
};

// --- Image Source Function ---
const getImageSrc = (id: string | undefined, image: string | undefined): string => {
  if (!id || !image) {
    console.warn(`Image not found for ID: ${id}, using default fallback`);
    return fallbackImages.default;
  }
  // Normalize image path to ensure it starts with '/assets/images/'
  const normalizedImage = image.startsWith('/assets/images/') ? image : `/assets/images/${image.split('/').pop()}`;
  // Validate image path format
  if (!normalizedImage.match(/^\/assets\/images\/[a-zA-Z0-9-]+\.(png|jpg|jpeg|webp)$/)) {
    console.warn(`Invalid image path for ID: ${id}, path: ${image}, using fallback`);
    return fallbackImages[id] || fallbackImages.default;
  }
  return normalizedImage;
};

// --- Main InternshipApplication Component ---
const InternshipApplication: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const internshipId = id && id in internshipsData ? id : 'web-development';
  const internship = (internshipsData as Record<string, Internship>)[internshipId];

  // State to manage the application submission status
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState<string>('');

  // State to hold form data
  interface FormData {
    name: string;
    email: string;
    phone: string;
    university: string;
    yearOfStudy: string;
    education: string;
    coursePeriod: string;
    academicExperience: string;
    message: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    university: '',
    yearOfStudy: '',
    education: '',
    coursePeriod: '',
    academicExperience: '',
    message: '',
  });

  // Handle input changes for text fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Get selected period details
  const getSelectedPeriodDetails = (): CoursePeriod | undefined => {
    return coursePeriods.find((period) => period.value === formData.coursePeriod);
  };

  // Define the API base URL for your Render backend
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionStatus('processing');
    setSubmissionMessage('Sending your application and confirmation email...');

    const selectedPeriod = getSelectedPeriodDetails();

    try {
      // Step 1: Send confirmation email to applicant
      const applicantRes = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          internshipTitle: internship?.title || 'Internship',
          coursePeriod: selectedPeriod?.label,
          price: selectedPeriod?.price,
          company: internship?.company || 'EDIZO',
        }),
      });

      if (!applicantRes.ok) {
        const errorText = await applicantRes.text();
        console.warn('⚠️ Failed to send confirmation email to applicant:', applicantRes.status, errorText);
      } else {
        console.log('✅ Confirmation email sent to applicant.');
      }

      // Step 2: Send application notification to admin
      const adminRes = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          university: formData.university,
          yearOfStudy: formData.yearOfStudy,
          education: formData.education,
          coursePeriod: selectedPeriod?.label,
          price: selectedPeriod?.price,
          academicExperience: formData.academicExperience,
          message: formData.message,
          internshipTitle: internship?.title || 'Internship',
          company: internship?.company || 'EDIZO',
        }),
      });

      if (!adminRes.ok) {
        const errorText = await adminRes.text();
        throw new Error(`❌ Failed to notify admin: ${adminRes.status} - ${errorText}`);
      }

      console.log('✅ Application notification email sent to admin.');
      setSubmissionStatus('success');
      setSubmissionMessage('🎉 Application submitted successfully! A confirmation email has been sent to you.');

      // Reset the form
      setFormData({
        name: '',
        email: '',
        phone: '',
        university: '',
        yearOfStudy: '',
        education: '',
        coursePeriod: '',
        academicExperience: '',
        message: '',
      });
    } catch (error) {
      console.error('❌ Error in form submission:', error);
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error: Could not connect to the server. Please check your internet connection and the server URL.';
      } else if (error instanceof Error) {
        errorMessage = `Submission failed: ${error.message}`;
      }

      setSubmissionStatus('error');
      setSubmissionMessage(errorMessage);
    }
  };

  // Preload the header image
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getImageSrc(id, internship.image);
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [id, internship.image]);

  const selectedPeriod = getSelectedPeriodDetails();

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] flex flex-col items-center py-16 px-4 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="relative bg-gray-800 rounded-lg overflow-hidden mb-8 w-full max-w-6xl">
        <img
          src={getImageSrc(id, internship.image)}
          alt={`${internship.title} course banner`}
          className="w-full h-64 object-cover opacity-50"
          loading="lazy"
          onError={(e) => {
            console.warn(`Failed to load header image for ID: ${id}, path: ${internship.image}`);
            e.currentTarget.src = fallbackImages[id] || fallbackImages.default;
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
            {submissionStatus === 'idle' || submissionStatus === 'processing' ? (
              <>
                <div className="flex items-center mb-6">
                  <img
                    src={getImageSrc(id, internship.image)}
                    alt={`${internship.title} course thumbnail`}
                    className="w-12 h-12 object-cover rounded-lg mr-4"
                    loading="lazy"
                    onError={(e) => {
                      console.warn(`Failed to load thumbnail image for ID: ${id}, path: ${internship.image}`);
                      e.currentTarget.src = fallbackImages[id] || fallbackImages.default;
                    }}
                  />
                  <h3 className="text-2xl font-bold text-gray-800">Apply Now</h3>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
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
                      className={inputFieldClasses}
                      placeholder="Enter Name"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
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
                      className={inputFieldClasses}
                      placeholder="example@gmail.com"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={inputFieldClasses}
                      placeholder="+91 12345 67890"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                  >
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
                      className={inputFieldClasses}
                      placeholder="e.g., University of XYZ"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Year of Study *
                    </label>
                    <select
                      id="yearOfStudy"
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleInputChange}
                      required
                      className={inputFieldClasses}
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
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                  >
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
                      className={inputFieldClasses}
                      placeholder="e.g., B.Tech in Computer Science"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
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
                            id={period.value}
                            name="coursePeriod"
                            value={period.value}
                            onChange={handleInputChange}
                            required
                            className="sr-only"
                          />
                          <label
                            htmlFor={period.value}
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
                    {selectedPeriod && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800">
                            Selected: {selectedPeriod.label}
                          </span>
                          <div className="flex items-center text-green-700 font-bold">
                            <IndianRupee className="w-4 h-4 mr-1" />
                            <span>{selectedPeriod.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.45 }}
                  >
                    <label htmlFor="academicExperience" className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Projects / Relevant Experience
                    </label>
                    <textarea
                      id="academicExperience"
                      name="academicExperience"
                      value={formData.academicExperience}
                      onChange={handleInputChange}
                      rows={3}
                      className={`${inputFieldClasses} resize-none`}
                      placeholder="Describe relevant academic projects, coursework, or any prior experience..."
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className={`${inputFieldClasses} resize-none`}
                      placeholder="Why are you interested in this internship and Edizo?"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.55 }}
                  >
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
                      {selectedPeriod && (
                        <span className="ml-2 text-sm">
                          (₹{selectedPeriod.price.toLocaleString()})
                        </span>
                      )}
                    </Button>
                  </motion.div>
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
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-6"
              >
                <div
                  className={`p-4 rounded-lg mb-4 ${
                    submissionStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {submissionStatus === 'success' ? (
                    <>
                      <CheckCircle className="inline-block mr-2 text-green-600" size={24} />
                      <p className="font-medium">Application Submitted Successfully!</p>
                      <p className="text-sm mt-2">
                        Thank you for applying. A confirmation email has been sent to{' '}
                        <span className="font-semibold">{formData.email}</span>. Our team will contact you soon.
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="inline-block mr-2 text-red-600" size={24} />
                      <p className="font-medium">Application Submission Failed!</p>
                      <p className="text-sm mt-2">{submissionMessage}</p>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmissionStatus('idle');
                    setSubmissionMessage('');
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
    </div>
  );
};

export default InternshipApplication;
