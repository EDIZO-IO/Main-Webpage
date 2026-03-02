// frontend/src/pages/ServiceDetails.jsx

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, AlertCircle, Star, Award, CheckCircle, Mail, MessageCircle, Heart, Share2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

import AnimatedSection from '../components/common/AnimatedSection.jsx';
import Button from '../components/common/Button.jsx';
import { useService, useServices } from '../hooks/useServices';
import { serviceApplicationsAPI } from '../api/api';
import { toast } from 'react-toastify';

// Stats Section
const StatsSection = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">100+</div>
          <div className="text-sm text-gray-600 font-medium">Projects Done</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">4.9/5</div>
          <div className="text-sm text-gray-600 font-medium">Client Rating</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
          <div className="text-sm text-gray-600 font-medium">Satisfaction</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
          <div className="text-sm text-gray-600 font-medium">Support</div>
        </div>
      </div>
    </div>
  </section>
);

// About Section
const AboutSection = ({ service }) => (
  <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div className="container mx-auto px-4">
      <AnimatedSection animation="fadeInUp">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">About This Service</h2>
          <p className="text-lg text-gray-600 leading-relaxed text-center mb-8">
            {service.description}
          </p>
          
          {service.features && service.features.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  </section>
);

// Process Section
const ProcessSection = ({ service }) => {
  const steps = [
    { title: 'Consultation', desc: 'Discuss your requirements' },
    { title: 'Planning', desc: 'Create detailed roadmap' },
    { title: 'Execution', desc: 'Build your solution' },
    { title: 'Delivery', desc: 'Launch and support' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fadeInUp">
          <h2 className="text-4xl font-bold text-gray-900 mb-3 text-center">Our Process</h2>
          <p className="text-gray-600 text-center mb-12">How we bring your vision to life</p>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-orange-200 to-red-200" />
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// Technologies Section
const TechSection = ({ service }) => (
  <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div className="container mx-auto px-4">
      <AnimatedSection animation="fadeInUp">
        <h2 className="text-4xl font-bold text-gray-900 mb-3 text-center">Technologies We Use</h2>
        <p className="text-gray-600 text-center mb-12">Industry-leading tools and frameworks</p>
        
        {service.tags && service.tags.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {service.tags.map((tech, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-white rounded-full shadow-md border border-gray-100 font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-all"
              >
                {tech}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Technologies information not available</p>
        )}
      </AnimatedSection>
    </div>
  </section>
);

// Related Service Card
const RelatedServiceCard = ({ service }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer"
      onClick={() => navigate(`/services/${service.slug || service.id}`)}
    >
      {/* Color-coded header */}
      <div className={`h-3 bg-gradient-to-r ${
        service.category === 'Development' ? 'from-blue-500 to-blue-600' :
        service.category === 'Design' ? 'from-purple-500 to-purple-600' :
        service.category === 'Marketing' ? 'from-orange-500 to-orange-600' :
        'from-gray-500 to-gray-600'
      }`}></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            service.category === 'Development' ? 'bg-blue-100 text-blue-700' :
            service.category === 'Design' ? 'bg-purple-100 text-purple-700' :
            service.category === 'Marketing' ? 'bg-orange-100 text-orange-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {service.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.short_description}</p>
        <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-xl font-semibold">
          Learn More
        </Button>
      </div>
    </motion.div>
  );
};

// Application Form Section
const ApplicationForm = ({ service, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) errors.message = 'Project details are required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await serviceApplicationsAPI.create({
        service_id: service.id,
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.company,
        budget_range: formData.budget,
        project_description: formData.message,
        service_type: service.category,
        application_status: 'submitted',
        payment_status: 'pending'
      });

      toast.success('Application submitted successfully! We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', company: '', budget: '', message: '' });
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none ${formErrors.name ? 'border-red-300' : 'border-gray-200 focus:border-orange-500'}`}
              placeholder="John Doe"
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none ${formErrors.email ? 'border-red-300' : 'border-gray-200 focus:border-orange-500'}`}
              placeholder="john@example.com"
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-orange-500"
              placeholder="+91 1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-orange-500"
              placeholder="Your Company"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Range</label>
          <select
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none focus:border-orange-500"
          >
            <option value="">Select budget range</option>
            <option value="< ₹50,000">Less than ₹50,000</option>
            <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
            <option value="₹1,00,000 - ₹5,00,000">₹1,00,000 - ₹5,00,000</option>
            <option value="> ₹5,00,000">More than ₹5,00,000</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Project Details *</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border-2 outline-none resize-none ${formErrors.message ? 'border-red-300' : 'border-gray-200 focus:border-orange-500'}`}
            rows={4}
            placeholder="Describe your project requirements, goals, and timeline..."
          />
          {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              Submit Application
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Main Component
const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApplication, setShowApplication] = useState(false);

  const { service, loading, error } = useService(id);
  const { services: allServices } = useServices();

  const relatedServices = useMemo(() => {
    if (!service || !allServices.length) return [];
    return allServices
      .filter(s => s.category === service.category && s.id !== service.id)
      .slice(0, 3);
  }, [service, allServices]);

  const handleGoBack = useCallback(() => navigate(-1), [navigate]);

  const handleApply = useCallback(() => {
    setShowApplication(true);
    setTimeout(() => {
      document.getElementById('application-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    if (service) document.title = `${service.title} | Edizo Services`;
  }, [service]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The service you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Button
            onClick={handleGoBack}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            <ArrowLeft className="inline-block mr-2 w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-red-50 opacity-80" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fadeInUp">
            <button
              onClick={handleGoBack}
              className="group flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-all mb-6"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Services</span>
            </button>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <span className="px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm">
                    {service.category}
                  </span>
                  {service.is_featured && (
                    <span className="px-4 py-2 rounded-full bg-red-100 text-red-600 font-semibold text-sm flex items-center gap-1">
                      <Award size={16} /> Featured
                    </span>
                  )}
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {service.title}
                </h1>
                
                {service.subtitle && (
                  <p className="text-lg text-orange-600 font-medium mb-4">
                    {service.subtitle}
                  </p>
                )}
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {service.short_description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={handleApply}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all"
                  >
                    {service.cta_text || 'Get Started'}
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: service.title,
                          text: service.short_description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copied to clipboard!');
                      }
                    }}
                    className="px-6 py-4 rounded-xl font-semibold border-2 bg-white border-gray-200 text-gray-700 hover:border-orange-200 transition-all"
                  >
                    <Share2 className="inline-block mr-2 w-5 h-5" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-orange-500 to-red-500 p-12 text-white">
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <CheckCircle className="w-24 h-24 mb-6 opacity-80" />
                    <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                    <p className="text-xl opacity-90 mb-4">{service.short_description}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                        {service.category}
                      </div>
                      {service.is_featured && (
                        <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold flex items-center gap-1">
                          <Award size={16} /> Featured
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* About Section */}
      <AboutSection service={service} />

      {/* Process Section */}
      <ProcessSection service={service} />

      {/* Technologies Section */}
      <TechSection service={service} />

      {/* Stats Section */}
      <StatsSection />

      {/* Application Form Section */}
      <section id="application-section" className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fadeInUp">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-3 text-center">Start Your Project</h2>
              <p className="text-gray-600 text-center mb-12">Fill out the form below and we'll get back to you within 24-48 hours</p>
              <ApplicationForm service={service} onSuccess={() => setShowApplication(false)} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fadeInUp">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Related Services</h2>
                <p className="text-gray-600 text-lg">Explore our other services that might interest you</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedServices.map((related) => (
                  <RelatedServiceCard key={related.id} service={related} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fadeInUp">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let's collaborate to create something amazing. Our team is ready to bring your vision to life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={handleApply}
                className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
              >
                <Mail className="inline-block mr-2 w-5 h-5" />
                Get a Quote
              </Button>
              <Button
                onClick={() => navigate('/contact')}
                className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-orange-700 transition-all"
              >
                <MessageCircle className="inline-block mr-2 w-5 h-5" />
                Contact Us
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetails;
