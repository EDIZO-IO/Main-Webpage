import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, GraduationCap, BookOpen, Briefcase,
  FileText, Calendar, Send, ArrowLeft, CheckCircle, AlertCircle,
  MapPin, Building, School, Code, Palette, Smartphone, Globe,
  Users, Target, Award, Zap, Shield, Coffee, Star
} from 'lucide-react';
import { useInternship } from '../hooks/useInternships';
import { useStats } from '../hooks/useStats';
import Button from '../components/common/Button';
import PageHeader from '../components/common/PageHeader';

// Category color mapping
const categoryColors = {
  Development: { bg: 'bg-blue-500', gradient: 'from-blue-500 to-blue-600' },
  Design: { bg: 'bg-purple-500', gradient: 'from-purple-500 to-purple-600' },
  'Data Science': { bg: 'bg-indigo-500', gradient: 'from-indigo-500 to-indigo-600' },
  Marketing: { bg: 'bg-orange-500', gradient: 'from-orange-500 to-orange-600' },
  Management: { bg: 'bg-teal-500', gradient: 'from-teal-500 to-teal-600' },
  HR: { bg: 'bg-pink-500', gradient: 'from-pink-500 to-pink-600' },
  Java: { bg: 'bg-red-500', gradient: 'from-red-500 to-red-600' },
  Python: { bg: 'bg-green-500', gradient: 'from-green-500 to-green-600' },
  'AI/ML': { bg: 'bg-cyan-500', gradient: 'from-cyan-500 to-cyan-600' },
  default: { bg: 'bg-gray-500', gradient: 'from-gray-500 to-gray-600' }
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
      const price1Month = internship.price_1_month || 0;
      const discount1Month = internship.discount_1_month || 0;
      const finalPrice = price1Month - (price1Month * discount1Month / 100);
      const savings = price1Month - finalPrice;

      setFormData(prev => ({
        ...prev,
        internshipTitle: internship.title,
        company: internship.company,
        selectedOriginalPrice: price1Month,
        selectedDiscount: discount1Month,
        selectedFinalPrice: finalPrice,
        selectedSavings: savings,
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
    const priceMap = {
      '15-days': internship?.price_15_days || 0,
      '1-month': internship?.price_1_month || 0,
      '2-months': internship?.price_2_months || 0,
      '3-months': internship?.price_3_months || 0
    };
    
    const discountMap = {
      '15-days': internship?.discount_15_days || 0,
      '1-month': internship?.discount_1_month || 0,
      '2-months': internship?.discount_2_months || 0,
      '3-months': internship?.discount_3_months || 0
    };

    const originalPrice = priceMap[period] || 0;
    const discount = discountMap[period] || 0;
    const finalPrice = originalPrice - (originalPrice * discount / 100);
    const savings = originalPrice - finalPrice;

    setFormData(prev => ({
      ...prev,
      coursePeriod: period,
      selectedOriginalPrice: originalPrice,
      selectedDiscount: discount,
      selectedFinalPrice: finalPrice,
      selectedSavings: savings,
    }));
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
      // Import API dynamically
      const { applicationsAPI } = await import('../api/api');

      // Prepare application data
      const applicationData = {
        internship_id: id,  // Use the internship ID from URL params
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college_name: formData.university,
        current_year: parseInt(formData.yearOfStudy),
        branch: formData.education,
        cover_letter: formData.message,
        duration_selected: formData.coursePeriod,
        payment_amount: formData.selectedFinalPrice,
        payment_status: 'pending',
        application_status: 'submitted'
      };

      // Submit to API
      await applicationsAPI.create(applicationData);

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
      console.error('Submit error:', error);
      setSubmitError(error.response?.data?.error || 'Failed to submit application. Please try again.');
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
            {/* Color-coded header instead of image */}
            {(() => {
              const colors = categoryColors[internship?.category] || categoryColors.default;
              return (
                <div className={`bg-gradient-to-br ${colors.gradient} p-6 text-white`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Building className="w-6 h-6 opacity-80" />
                    <span className="font-semibold text-lg">{internship?.company}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{internship?.title}</h2>
                  <div className="flex items-center gap-4 mt-4 flex-wrap">
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      {internship?.rating}/5
                    </span>
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
                      <MapPin className="w-4 h-4" />
                      {internship?.mode}
                    </span>
                    <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold">
                      <Target className="w-4 h-4" />
                      {internship?.category}
                    </span>
                  </div>
                </div>
              );
            })()}

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
                  {[
                    { key: '15-days', label: '15 Days', price: internship?.price_15_days, discount: internship?.discount_15_days },
                    { key: '1-month', label: '1 Month', price: internship?.price_1_month, discount: internship?.discount_1_month },
                    { key: '2-months', label: '2 Months', price: internship?.price_2_months, discount: internship?.discount_2_months },
                    { key: '3-months', label: '3 Months', price: internship?.price_3_months, discount: internship?.discount_3_months }
                  ].map((period) => {
                    const originalPrice = period.price || 0;
                    const discount = period.discount || 0;
                    const finalPrice = originalPrice - (originalPrice * discount / 100);
                    const savings = originalPrice - finalPrice;

                    return (
                      <motion.div
                        key={period.key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.coursePeriod === period.key
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300'
                          }`}
                        onClick={() => handleCoursePeriodChange(period.key)}
                      >
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 capitalize">
                            {period.label}
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
