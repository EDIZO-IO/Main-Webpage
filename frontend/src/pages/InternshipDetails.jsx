import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, Users, Clock, Award, TrendingUp, MapPin, Building,
  Calendar, Tag, CheckCircle, AlertCircle, ExternalLink,
  ArrowLeft, Mail, Phone, Globe, Target, Zap, Shield,
  BookOpen, Briefcase, FileText, Send, Wifi
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

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { internship, loading, error } = useInternship(id);
  const { stats } = useStats();

  // Get category colors
  const colors = categoryColors[internship?.category] || categoryColors.default;

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
              {/* Hero Section - Color-coded header instead of image */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
                <div className={`relative h-64 bg-gradient-to-br ${colors.gradient} p-8 text-white`}>
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Building className="w-5 h-5 opacity-80" />
                          <span className="font-semibold text-lg">{internship?.company}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-3">{internship?.title}</h1>
                        <div className="flex items-center gap-4 mt-4 flex-wrap">
                          <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                            <Wifi className="w-4 h-4" />
                            {internship?.mode}
                          </span>
                          <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                            <Tag className="w-4 h-4" />
                            {internship?.category}
                          </span>
                          <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                            <Star className="w-4 h-4 text-yellow-300 fill-current" />
                            {internship?.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About This Internship</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{internship?.description}</p>
                </div>
              </div>

              {/* Why Choose Section */}
              {internship?.why_choose_edizo_1 && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Target className="w-6 h-6 text-orange-500" />
                    Why Choose This Internship?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      internship.why_choose_edizo_1,
                      internship.why_choose_edizo_2,
                      internship.why_choose_edizo_3,
                      internship.why_choose_edizo_4,
                      internship.why_choose_edizo_5,
                      internship.why_choose_edizo_6
                    ].filter(Boolean).map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits Section */}
              {internship?.benefit_1 && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Zap className="w-6 h-6 text-orange-500" />
                    Key Benefits
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      internship.benefit_1,
                      internship.benefit_2,
                      internship.benefit_3,
                      internship.benefit_4,
                      internship.benefit_5,
                      internship.benefit_6,
                      internship.benefit_7
                    ].filter(Boolean).map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Syllabus Section */}
              {internship?.syllabus_1_month && (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-orange-500" />
                    Syllabus Overview
                  </h2>

                  <div className="space-y-6">
                    {internship.syllabus_15_days && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          15 Days Program
                        </h3>
                        <ul className="space-y-2">
                          {JSON.parse(internship.syllabus_15_days).map((topic, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {internship.syllabus_1_month && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          1 Month Program
                        </h3>
                        <ul className="space-y-2">
                          {JSON.parse(internship.syllabus_1_month).map((topic, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {internship.syllabus_2_months && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          2 Months Program
                        </h3>
                        <ul className="space-y-2">
                          {JSON.parse(internship.syllabus_2_months).map((topic, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {internship.syllabus_3_months && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          3 Months Program
                        </h3>
                        <ul className="space-y-2">
                          {JSON.parse(internship.syllabus_3_months).map((topic, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Pricing Overview Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Program Pricing</h3>
                  
                  <div className="space-y-3 mb-6">
                    {[
                      { label: '15 Days', price: internship?.price_15_days, discount: internship?.discount_15_days },
                      { label: '1 Month', price: internship?.price_1_month, discount: internship?.discount_1_month },
                      { label: '2 Months', price: internship?.price_2_months, discount: internship?.discount_2_months },
                      { label: '3 Months', price: internship?.price_3_months, discount: internship?.discount_3_months }
                    ].map((tier, index) => {
                      const originalPrice = tier.price || 0;
                      const discount = tier.discount || 0;
                      const finalPrice = originalPrice - (originalPrice * discount / 100);
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="font-medium text-gray-700">{tier.label}</span>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">₹{finalPrice.toLocaleString()}</div>
                            {discount > 0 && (
                              <div className="text-xs text-green-600">Save {discount}%</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

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
                      icon={<Mail className="w-5 h-5" />}
                    >
                      Contact Us
                    </Button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Program Highlights</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">100% Internship Certification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Real-Time Hands-On Projects</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Expert Mentor Support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Placement Guidance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700">Flexible Learning Schedule</span>
                    </div>
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
