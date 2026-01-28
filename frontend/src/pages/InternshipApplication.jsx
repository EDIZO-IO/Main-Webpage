import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, GraduationCap, BookOpen, Briefcase,
  FileText, Calendar, Send, ArrowLeft, CheckCircle, AlertCircle,
  MapPin, Building, School, Code, Palette, Smartphone, Globe,
  Users, Target, Award, Zap, Shield, Coffee, Star
} from 'lucide-react';
import { useInternship } from '../components/hooks/useInternships';
import { useStats } from '../components/hooks/useStats';
import Button from '../components/common/Button';
import PageHeader from '../components/common/PageHeader';

// Fallback image map
const fallbackImages = {
  'ui-ux-design': '/assets/images/web-design.png',
  'frontend-development': '/assets/images/responsive-design.png',
  'backend-development': '/assets/images/back-end.png',
  'hr-management': '/assets/images/hr-manager.png',
  'data-science': '/assets/images/data-science.png',
  'java-development': '/assets/images/java.png',
  'python-development': '/assets/images/python.png',
  'marketing': '/assets/images/marketing.png',
  'ai-ml': '/assets/images/ai-ml.png',
  'csharp': '/assets/images/c-sharp.png',
  default: 'https://via.placeholder.com/800x400?text=Internship+Image',
};

const getImageSrc = (id, image) => {
  if (image && (image.startsWith('/') || image.startsWith('http'))) {
    return image;
  }
  if (id && fallbackImages[id]) {
    return fallbackImages[id];
  }
  return fallbackImages.default;
};


const InternshipApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { internship, loading, error } = useInternship(id);
  const { stats } = useStats();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    yearOfStudy: '',
    education: '',
    academicExperience: '',
    message: '',
    coursePeriod: '1-month',
    internshipId: id,
    internshipTitle: '',
    company: '',
    selectedOriginalPrice: 0,
    selectedDiscount: 0,
    selectedFinalPrice: 0,
    selectedSavings: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Update form data when internship loads
  useEffect(() => {
    if (internship) {
      setFormData(prev => ({
        ...prev,
        internshipTitle: internship.title,
        company: internship.company,
        selectedOriginalPrice: internship.pricing?.['1-month'] || 0,
        selectedDiscount: internship.discount?.['1-month'] || 0,
        selectedFinalPrice: internship.pricing?.['1-month']
          ? internship.pricing['1-month'] - (internship.pricing['1-month'] * (internship.discount?.['1-month'] || 0) / 100)
          : 0,
        selectedSavings: internship.pricing?.['1-month'] && internship.discount?.['1-month']
          ? (internship.pricing['1-month'] * internship.discount['1-month'] / 100)
          : 0,
      }));
    }
  }, [internship]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle course period change
  const handleCoursePeriodChange = (period) => {
    setFormData(prev => {
      const originalPrice = internship?.pricing?.[period] || 0;
      const discount = internship?.discount?.[period] || 0;
      const finalPrice = originalPrice - (originalPrice * discount / 100);
      const savings = originalPrice - finalPrice;

      return {
        ...prev,
        coursePeriod: period,
        selectedOriginalPrice: originalPrice,
        selectedDiscount: discount,
        selectedFinalPrice: finalPrice,
        selectedSavings: savings,
      };
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.university.trim()) {
      newErrors.university = 'University/College is required';
    }

    if (!formData.yearOfStudy.trim()) {
      newErrors.yearOfStudy = 'Year of study is required';
    }

    if (!formData.education.trim()) {
      newErrors.education = 'Education background is required';
    }

    if (!formData.academicExperience.trim()) {
      newErrors.academicExperience = 'Academic experience is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success
      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
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
          internshipId: id,
          internshipTitle: '',
          company: '',
          selectedOriginalPrice: 0,
          selectedDiscount: 0,
          selectedFinalPrice: 0,
          selectedSavings: 0,
        });
      }, 3000);
    } catch (error) {
      setSubmitError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading internship details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Internship</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => navigate('/internships')}
            variant="primary"
            icon={<ArrowLeft className="w-5 h-5" />}
          >
            Back to Internships
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">Thank you for applying. We'll contact you soon.</p>
          <Button
            onClick={() => navigate('/internships')}
            variant="primary"
          >
            Browse More Internships
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <PageHeader
        title="Apply for Internship"
        subtitle={`Apply for ${internship?.title} at ${internship?.company}`}
        badge="EDIZO • Application"
        showServiceIcons={true}
        showStats={true}
        stats={[
          { value: stats.students_trained?.value || '500+', label: 'Students Trained' },
          { value: stats.programs_count?.value || '15+', label: 'Programs' },
          { value: stats.certification_rate?.value || '100%', label: 'Certification Rate' },
        ]}
      >
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <Button
            to="/internships"
            variant="outline"
            size="md"
            icon={<ArrowLeft className="w-5 h-5" />}
            className="border-gray-300 text-gray-800"
          >
            Back to Internships
          </Button>
          <Button
            to="/contact"
            variant="primary"
            size="md"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
          >
            Need Help?
          </Button>
        </div>
      </PageHeader>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">


            {/* Application Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-orange-500" />
                    Personal Information
                  </h3>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                {/* Education Information */}
                <div className="md:col-span-2 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-orange-500" />
                    Education Information
                  </h3>
                </div>

                <div>
                  <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                    University/College *
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      id="university"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.university ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter your institution"
                    />
                  </div>
                  {errors.university && <p className="mt-1 text-sm text-red-600">{errors.university}</p>}
                </div>

                <div>
                  <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Study *
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      id="yearOfStudy"
                      name="yearOfStudy"
                      value={formData.yearOfStudy}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.yearOfStudy ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post Graduate">Post Graduate</option>
                    </select>
                  </div>
                  {errors.yearOfStudy && <p className="mt-1 text-sm text-red-600">{errors.yearOfStudy}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                    Education Background *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      rows="3"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.education ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Describe your educational background, degree, specialization, etc."
                    />
                  </div>
                  {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="academicExperience" className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Experience *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="academicExperience"
                      name="academicExperience"
                      value={formData.academicExperience}
                      onChange={handleChange}
                      rows="4"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.academicExperience ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Describe your academic projects, achievements, skills, certifications, etc."
                    />
                  </div>
                  {errors.academicExperience && <p className="mt-1 text-sm text-red-600">{errors.academicExperience}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Message
                  </label>
                  <div className="relative">
                    <Coffee className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Any additional information you'd like to share..."
                    />
                  </div>
                </div>
              </div>

              {/* Course Period Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Select Course Period
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['15-days', '1-month', '2-months', '3-months'].map((period) => {
                    const originalPrice = internship?.pricing?.[period] || 0;
                    const discount = internship?.discount?.[period] || 0;
                    const finalPrice = originalPrice - (originalPrice * discount / 100);
                    const savings = originalPrice - finalPrice;

                    return (
                      <motion.div
                        key={period}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.coursePeriod === period
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                          }`}
                        onClick={() => handleCoursePeriodChange(period)}
                      >
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 capitalize">
                            {period.replace('-', ' ')}
                          </div>
                          <div className="mt-2">
                            <div className="text-lg font-bold text-gray-900">
                              ₹{finalPrice.toLocaleString()}
                            </div>
                            {discount > 0 && (
                              <div className="text-sm text-green-600 font-medium">
                                Save ₹{savings.toLocaleString()} ({discount}% off)
                              </div>
                            )}
                            <div className="text-xs text-gray-500 line-through">
                              ₹{originalPrice.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-8">
                <h4 className="font-semibold text-gray-900 mb-3">Price Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-600">Selected Period:</div>
                  <div className="text-gray-900 font-medium capitalize">
                    {formData.coursePeriod.replace('-', ' ')}
                  </div>

                  <div className="text-gray-600">Original Price:</div>
                  <div className="text-gray-900 font-medium">
                    ₹{formData.selectedOriginalPrice.toLocaleString()}
                  </div>

                  <div className="text-gray-600">Discount:</div>
                  <div className="text-green-600 font-medium">
                    -₹{formData.selectedSavings.toLocaleString()} ({formData.selectedDiscount}%)
                  </div>

                  <div className="text-gray-600 font-semibold">Final Price:</div>
                  <div className="text-orange-600 font-bold text-lg">
                    ₹{formData.selectedFinalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white"
                  disabled={isSubmitting}
                  icon={isSubmitting ? null : <Send className="w-5 h-5" />}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-800"
                  onClick={() => navigate('/internships')}
                >
                  Cancel
                </Button>
              </div>

              {submitError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{submitError}</span>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternshipApplication;