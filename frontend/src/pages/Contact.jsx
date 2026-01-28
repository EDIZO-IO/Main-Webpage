// src/pages/Contact.tsx
import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, Send, CheckCircle, Loader2, Facebook, Twitter, Linkedin, Instagram,
  Youtube, X, MapPin, Clock, User, Hash, MessageSquare, AlertCircle, Globe,
  HeadphonesIcon
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { useStats } from '../components/hooks/useStats';

// === TypeScript Interfaces ===

// === Simple Contact Card ===
const SimpleContactCard = memo(({ icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3 }}
    className="p-5 rounded-lg border border-gray-200 bg-white"
  >
    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <div className="space-y-1 text-gray-600 text-sm">{children}</div>
  </motion.div>
));
SimpleContactCard.displayName = 'SimpleContactCard';

// === Simple Form Input ===
const SimpleFormInput = memo(({ id, name, type = 'text', label, value, onChange, placeholder, required, error, icon }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 pl-10 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900`}
        placeholder={placeholder}
      />
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle size={12} />
        {error}
      </p>
    )}
  </div>
));
SimpleFormInput.displayName = 'SimpleFormInput';

// === Social Media Button ===
const SocialButton = memo(({ platform, url, icon: IconComponent }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={platform}
    className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors"
  >
    <IconComponent size={18} />
  </a>
));
SocialButton.displayName = 'SocialButton';

// === Main Component ===
const Contact = () => {
  const { stats } = useStats();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Animation variables
  const opacity = 0;
  const y = 20;
  const x = 0;
  const scale = 1;
  const stiffness = 100;
  const damping = 10;
  const duration = 1;
  const rotate = 360;
  const ease = "linear";
  const top = 0;
  const left = 0;
  const bottom = 0;
  const zIndex = 1;
  const repeat = Infinity;

  // Form validation
  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => Object.assign({}, prev, { [name]: value }));

    if (formError) setFormError(null);
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [formError, formErrors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormError('Please fix the errors in the form before submitting.');
      return;
    }

    setLoading(true);
    setFormError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/submit-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setFormSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setFormErrors({});

        setTimeout(() => setFormSubmitted(false), 10000);
      } else {
        throw new Error(result.message || "An error occurred while sending the message.");
      }
    } catch (error) {
      let errorMessage = "Failed to send message. ";

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage += "Please check your internet connection.";
      } else if (error.message.includes('429')) {
        errorMessage += "Too many requests. Please wait and try again.";
      } else {
        errorMessage += error.message || "Please try again later.";
      }

      setFormError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, API_BASE_URL]);

  const handleResetForm = useCallback(() => {
    setFormSubmitted(false);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setFormErrors({});
    setFormError(null);
  }, []);

  const socialMedia = useMemo(() => [
    { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61576742758066', icon: Facebook },
    { platform: 'Twitter', url: 'https://x.com/EdizoPvtLtd', icon: Twitter },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/edizo-pvt-ltd-149748367/', icon: Linkedin },
    { platform: 'Instagram', url: 'https://www.instagram.com/e.d.i.z.o._official/', icon: Instagram },
    { platform: 'YouTube', url: 'https://www.youtube.com/@team-edizo', icon: Youtube }
  ], []);

  // Schema.org structured data
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Edizo",
      "url": "https://www.edizo.in/contact",
      "description": "Get in touch with Edizo for inquiries about UI/UX, web & app development, and digital design services.",
      "mainEntity": {
        "@type": "Organization",
        "name": "Edizo",
        "url": "https://www.edizo.in",
        "logo": "https://www.edizo.in/logo.png",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+917092435729",
          "email": "edizoofficial@gmail.com",
          "contactType": "Customer Support",
          "areaServed": "Worldwide",
          "availableLanguage": "English"
        },
        "sameAs": socialMedia.map(s => s.url)
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'contact-schema';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('contact-schema');
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, [socialMedia]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <PageHeader
        title="Get In Touch"
        subtitle="Have a project in mind? Let's work together to bring your vision to life."
        badge="We're Here to Help"
      />

      {/* Main Content */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <SimpleContactCard
              icon={<MapPin className="w-5 h-5 text-red-600" />}
              title="Location"
            >
              <p className="font-medium text-gray-800">Global Remote Operations</p>
              <p className="text-xs">Serving clients worldwide</p>
            </SimpleContactCard>

            <SimpleContactCard
              icon={<Mail className="w-5 h-5 text-red-600" />}
              title="Email Us"
            >
              <a href="mailto:edizoteam@gmail.com" className="block font-medium text-gray-800 hover:text-red-600 transition-colors text-sm">
                edizoteam@gmail.com
              </a>
              <p className="text-xs text-gray-500 mt-1">For contact & support</p>
              <a href="mailto:edizoofficial@gmail.com" className="block mt-1 hover:text-red-600 transition-colors text-sm">
                edizoofficial@gmail.com
              </a>
              <p className="text-xs text-gray-500">For services</p>
            </SimpleContactCard>

            <SimpleContactCard
              icon={<Phone className="w-5 h-5 text-red-600" />}
              title="Call Us"
            >
              <a href="tel:+917092435729" className="block font-medium text-gray-800 hover:text-red-600 transition-colors text-sm">
                +91 7092435729
              </a>
              <p className="text-xs flex items-center gap-1">
                <Clock size={10} /> Mon-Sat: 9 AM - 6 PM IST
              </p>
            </SimpleContactCard>

            <SimpleContactCard
              icon={<Clock className="w-5 h-5 text-red-600" />}
              title="Quick Response"
            >
              <p className="font-medium text-gray-800 text-sm">24-48 Hour Reply</p>
              <p className="text-xs">We value your time</p>
            </SimpleContactCard>
          </div>

          {/* Main Card - Form + Info */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Info & Social */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Let's Start a <span className="text-red-600">Conversation</span>
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              {/* Contact Details */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: Phone, text: '+91 7092435729', href: 'tel:+917092435729' },
                  { icon: Mail, text: 'edizoteam@gmail.com', href: 'mailto:edizoteam@gmail.com' },
                  { icon: Globe, text: 'www.edizo.in', href: 'https://www.edizo.in' },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target={item.icon === Globe ? '_blank' : ''}
                    className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-colors text-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span>{item.text}</span>
                  </a>
                ))}
              </div>

              {/* Social Media */}
              <div>
                <p className="text-gray-500 text-xs font-medium mb-3">CONNECT WITH US</p>
                <div className="flex gap-2">
                  {socialMedia.map((social) => (
                    <SocialButton key={social.platform} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Send a Message</h3>
                  <p className="text-gray-500 text-xs">We'll respond within 24-48 hours</p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {formSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </motion.div>
                    <h4 className="text-xl font-bold mb-2 text-gray-900">Thank You!</h4>
                    <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                      Your message has been received. We'll get back to you shortly.
                    </p>
                    <button
                      onClick={handleResetForm}
                      className="px-6 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {formError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-lg flex items-start gap-2 bg-red-50 border border-red-200"
                      >
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-red-700 font-medium text-xs">Error</p>
                          <p className="text-red-600 text-xs">{formError}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormError(null)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SimpleFormInput
                        id="name"
                        name="name"
                        label="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Name"
                        required
                        error={formErrors.name}
                        icon={<User className="w-4 h-4" />}
                      />
                      <SimpleFormInput
                        id="email"
                        name="email"
                        type="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="yourmail@example.com"
                        required
                        error={formErrors.email}
                        icon={<Mail className="w-4 h-4" />}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <SimpleFormInput
                        id="phone"
                        name="phone"
                        type="tel"
                        label="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Mobile Number"
                        icon={<Phone className="w-4 h-4" />}
                      />
                      <SimpleFormInput
                        id="subject"
                        name="subject"
                        label="Subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="How can we help?"
                        required
                        error={formErrors.subject}
                        icon={<Hash className="w-4 h-4" />}
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 pl-10 rounded-lg border ${formErrors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 resize-none`}
                          placeholder="Tell us about your project..."
                        />
                      </div>
                      {formErrors.message && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {formErrors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
                      <p className="text-xs text-gray-600">
                        We respect your privacy and never share your information.
                      </p>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-red-500" />
                        <span className="text-xs font-medium text-gray-700">Or call us: +91 7092435729</span>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: '24/7', label: 'Support Available', icon: Clock },
              { value: '<24h', label: 'Response Time', icon: MessageSquare },
              { value: stats.satisfaction_rate?.value || '100%', label: stats.satisfaction_rate?.label || 'Satisfaction', icon: CheckCircle },
              { value: stats.happy_clients?.value || '500+', label: stats.happy_clients?.label || 'Happy Clients', icon: User }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-4 rounded-lg bg-white border border-gray-200"
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-red-100 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-xs">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;