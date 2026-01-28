import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, Users, Clock, Award, TrendingUp, MapPin, Building,
  Calendar, Tag, Percent, CheckCircle, AlertCircle, ExternalLink,
  ArrowLeft, Mail, Phone, Globe, Target, Zap, Shield, Coffee,
  BookOpen, Briefcase, FileText, Send
} from 'lucide-react';
import { useInternship } from '../components/hooks/useInternships';
import { useStats } from '../components/hooks/useStats';
import Button from '../components/common/Button';
import PageHeader from '../components/common/PageHeader';
import { getHighestDiscount, hasDiscount, findValidCoupon, calculatePriceWithCoupon, getPricingTiers } from '../utils/internshipUtils';

// Fallback image map
const fallbackImages = {
  'ui-ux-design': '/assets/images/web-design.png',
  'frontend-development': '/assets/images/responsive-design.png',
  'backend-development': '/assets/images/back-end.png',
  'hr-management': '/assets/images/hr-manager.png',
  'data-science': '/assets/images/data-science.png',
  'java-development': '/assets/images/java.png',
  'python-development': '/assets/images/python.png',
  'marketing': '/assets/images/Marketing.png',
  'ai-ml': '/assets/images/ai-ml.png',
  'csharp': '/assets/images/c-sharp.png',
  default: 'https://via.placeholder.com/800x400?text=Internship+Image',
};

// ✅ Memoized image source function
const getImageSrc = (id, image) => {
  if (image && (image.startsWith('/') || image.startsWith('http'))) {
    return image;
  }
  if (id && fallbackImages[id]) {
    return fallbackImages[id];
  }
  return fallbackImages.default;
};


const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { internship, loading, error } = useInternship(id);
  const { stats } = useStats();


  const [selectedDuration, setSelectedDuration] = useState('1-month');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [showCouponMessage, setShowCouponMessage] = useState(false);

  // Calculate pricing tiers
  const pricingTiers = useMemo(() => {
    if (!internship) return [];
    return getPricingTiers(internship.pricing, internship.discount, appliedCoupon, internship.couponDiscounts);
  }, [internship, appliedCoupon]);

  // Get selected pricing tier
  const selectedTier = useMemo(() => {
    return pricingTiers.find(tier => tier.duration === selectedDuration) || pricingTiers[0];
  }, [pricingTiers, selectedDuration]);



  // Handle duration change
  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
  };

  // Handle coupon application
  const handleApplyCoupon = () => {
    if (!internship || !couponCode.trim()) {
      setShowCouponMessage(true);
      setTimeout(() => setShowCouponMessage(false), 3000);
      return;
    }

    const coupon = findValidCoupon(internship, couponCode, selectedDuration);
    if (coupon) {
      const couponApplied = calculatePriceWithCoupon(selectedTier.finalPrice, coupon);
      setAppliedCoupon(couponApplied);
      setShowCouponMessage(true);
      setTimeout(() => setShowCouponMessage(false), 3000);
    } else {
      setAppliedCoupon({ isValid: false, errorMessage: 'Invalid or expired coupon' });
      setShowCouponMessage(true);
      setTimeout(() => setShowCouponMessage(false), 3000);
    }
  };

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Calculate total price
  const totalPrice = useMemo(() => {
    return selectedTier?.finalPrice || 0;
  }, [selectedTier]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <PageHeader
        title={internship?.title || 'Internship Details'}
        subtitle={internship?.description || 'Detailed information about the internship program'}
        badge="EDIZO • Internship Program"
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
            to={`/apply/${id}`}
            variant="primary"
            size="md"
            iconRight={<ExternalLink className="w-5 h-5" />}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
          >
            Apply Now
          </Button>
        </div>
      </PageHeader>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Hero Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
                <div className="relative">
                  <img
                    src={getImageSrc(internship?.id, internship?.image)}
                    alt={internship?.title}
                    className="w-full h-64 md:h-80 object-cover"
                    onError={(e) => {
                      e.target.src = fallbackImages.default;
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${internship?.mode === 'Online'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                      }`}>
                      {internship?.mode}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-bold text-gray-900">{internship?.rating}/5</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{internship?.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">{internship?.category}</span>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{internship?.title}</h1>
                  <p className="text-gray-700 text-lg leading-relaxed">{internship?.description}</p>
                </div>
              </div>

              {/* Why Choose Section - Only show if data exists */}
              {internship?.whyChooseEdizo && internship.whyChooseEdizo.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-orange-500" />
                    Why Choose This Internship?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {internship.whyChooseEdizo.map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits Section - Only show if data exists */}
              {internship?.benefits && internship.benefits.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-orange-500" />
                    Key Benefits
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {internship.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Syllabus Section - Only show if data exists */}
              {internship?.syllabus && Object.values(internship.syllabus).some(topics => topics && topics.length > 0) && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-orange-500" />
                    Syllabus Overview
                  </h2>

                  <div className="space-y-6">
                    {Object.entries(internship.syllabus).map(([duration, topics]) => (
                      topics && topics.length > 0 && (
                        <div key={duration}>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                            {duration.replace('-', ' ')}
                          </h3>
                          <ul className="space-y-2">
                            {topics.map((topic, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Pricing Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">


                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      to={`/apply/${id}`}
                      variant="primary"
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
                      iconRight={<Send className="w-5 h-5" />}
                    >
                      Apply Now
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-gray-300 text-gray-800"
                    >
                      Contact Us
                    </Button>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InternshipDetails;