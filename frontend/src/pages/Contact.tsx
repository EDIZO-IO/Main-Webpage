// src/pages/Contact.tsx
import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, Send, CheckCircle, Loader2, Facebook, Twitter, Linkedin, Instagram,
  Youtube, ArrowRight, Clock, User, Hash, MessageSquare, AlertCircle, Globe,
  Sparkles, X, MapPin, Zap, HeadphonesIcon
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { useStats } from '../components/hooks/useStats';

// === TypeScript Interfaces ===
interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

// === Glass Contact Card ===
const GlassContactCard = memo<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  gradient: string;
  delay?: number;
}>(({ icon, title, children, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -8, scale: 1.02 }}
    className="relative p-6 rounded-3xl overflow-hidden group cursor-pointer"
    style={{
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 15px 50px -12px rgba(0, 0, 0, 0.1)',
    }}
  >
    {/* Gradient decoration */}
    <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-30 group-hover:opacity-50 transition-opacity ${gradient}`} />

    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2 text-gray-600">{children}</div>
    </div>
  </motion.div>
));
GlassContactCard.displayName = 'GlassContactCard';

// === Glass Form Input ===
const GlassFormInput = memo<{
  id: string;
  name: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
}>(({ id, name, type = 'text', label, value, onChange, placeholder, required, error, icon }) => (
  <div>
    <label htmlFor={id} className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
      {icon && <span className="text-orange-500">{icon}</span>}
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-5 py-4 rounded-2xl text-gray-900 placeholder-gray-400 transition-all
        ${error
          ? 'border-2 border-red-400 bg-red-50/50'
          : 'border border-gray-200 bg-white/80 focus:border-orange-400 focus:bg-white'
        } 
        backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-orange-100`}
      placeholder={placeholder}
      style={{
        boxShadow: error ? 'none' : '0 4px 20px -5px rgba(0, 0, 0, 0.05)',
      }}
    />
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 text-sm text-red-600 flex items-center gap-1"
      >
        <AlertCircle size={14} />
        {error}
      </motion.p>
    )}
  </div>
));
GlassFormInput.displayName = 'GlassFormInput';

// === Social Media Button ===
const SocialButton = memo<{
  platform: string;
  url: string;
  icon: typeof Facebook;
  gradient: string;
  delay: number;
}>(({ platform, url, icon: IconComponent, gradient, delay }) => (
  <motion.a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={platform}
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ scale: 1.1, y: -3 }}
    whileTap={{ scale: 0.95 }}
    className="group relative"
  >
    <div
      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}
    >
      <IconComponent size={24} className="text-white" />
    </div>
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileHover={{ opacity: 1, y: 0 }}
      className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-600 whitespace-nowrap"
    >
      {platform}
    </motion.span>
  </motion.a>
));
SocialButton.displayName = 'SocialButton';

// === Main Component ===
const Contact = () => {
  const { stats } = useStats();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Form validation
  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formError) setFormError(null);
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [formError, formErrors]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
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
    } catch (error: any) {
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
    { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61576742758066', icon: Facebook, gradient: 'from-blue-500 to-blue-700' },
    { platform: 'Twitter', url: 'https://x.com/EdizoPvtLtd', icon: Twitter, gradient: 'from-sky-400 to-blue-500' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/edizo-pvt-ltd-149748367/', icon: Linkedin, gradient: 'from-blue-600 to-blue-800' },
    { platform: 'Instagram', url: 'https://www.instagram.com/e.d.i.z.o._official/', icon: Instagram, gradient: 'from-pink-500 via-purple-500 to-orange-400' },
    { platform: 'YouTube', url: 'https://www.youtube.com/@team-edizo', icon: Youtube, gradient: 'from-red-500 to-red-700' }
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-orange-50/30">
      {/* Page Header */}
      <PageHeader
        title="Get In Touch"
        subtitle="Have a project in mind? Let's work together to bring your vision to life."
        badge="We're Here to Help"
      />

      {/* Main Content */}
      <section className="relative -mt-16 z-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <GlassContactCard
              icon={<MapPin className="w-7 h-7 text-white" />}
              title="Location"
              gradient="from-orange-400 to-red-500"
              delay={0.1}
            >
              <p className="font-medium text-gray-800">Global Remote Operations</p>
              <p className="text-sm">Serving clients worldwide</p>
            </GlassContactCard>

            <GlassContactCard
              icon={<Mail className="w-7 h-7 text-white" />}
              title="Email Us"
              gradient="from-red-400 to-pink-500"
              delay={0.2}
            >
              <a href="mailto:edizoteam@gmail.com" className="block font-medium text-gray-800 hover:text-orange-600 transition-colors">
                edizoteam@gmail.com
              </a>
              <p className="text-xs text-gray-500 mt-1">For contact & support</p>
              <a href="mailto:edizoofficial@gmail.com" className="block text-sm mt-2 hover:text-orange-600 transition-colors">
                edizoofficial@gmail.com
              </a>
              <p className="text-xs text-gray-500">For services</p>
            </GlassContactCard>

            <GlassContactCard
              icon={<Phone className="w-7 h-7 text-white" />}
              title="Call Us"
              gradient="from-green-400 to-emerald-600"
              delay={0.3}
            >
              <a href="tel:+917092435729" className="block font-medium text-gray-800 hover:text-green-600 transition-colors">
                +91 7092435729
              </a>
              <p className="text-sm flex items-center gap-1">
                <Clock size={12} /> Mon-Sat: 9 AM - 6 PM IST
              </p>
            </GlassContactCard>

            <GlassContactCard
              icon={<Zap className="w-7 h-7 text-white" />}
              title="Quick Response"
              gradient="from-purple-400 to-violet-600"
              delay={0.4}
            >
              <p className="font-medium text-gray-800">24-48 Hour Reply</p>
              <p className="text-sm">We value your time</p>
            </GlassContactCard>
          </div>

          {/* Main Card - Form + Social */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[2.5rem] overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Left Side - Info & Social */}
              <div className="lg:col-span-2 p-8 md:p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-500/20 to-transparent rounded-tr-full" />

                <div className="relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-semibold text-white/90">Contact Information</span>
                  </motion.div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Conversation</span>
                  </h2>
                  <p className="text-white/70 mb-10 text-lg">
                    Fill out the form and our team will get back to you within 24 hours.
                  </p>

                  {/* Contact Details */}
                  <div className="space-y-6 mb-12">
                    {[
                      { icon: Phone, text: '+91 7092435729', href: 'tel:+917092435729' },
                      { icon: Mail, text: 'edizoteam@gmail.com', href: 'mailto:edizoteam@gmail.com' },
                      { icon: Globe, text: 'www.edizo.in', href: 'https://www.edizo.in' },
                    ].map((item, i) => (
                      <motion.a
                        key={i}
                        href={item.href}
                        target={item.icon === Globe ? '_blank' : undefined}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-4 text-white/80 hover:text-white transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{item.text}</span>
                      </motion.a>
                    ))}
                  </div>

                  {/* Social Media */}
                  <div>
                    <p className="text-white/60 text-sm font-semibold mb-4">CONNECT WITH US</p>
                    <div className="flex flex-wrap gap-3">
                      {socialMedia.map((social, i) => (
                        <SocialButton key={social.platform} {...social} delay={i * 0.1} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="lg:col-span-3 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Send a Message</h3>
                    <p className="text-gray-500 text-sm">We'll respond within 24-48 hours</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {formSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-16"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                      >
                        <CheckCircle className="w-14 h-14 text-white" />
                      </motion.div>
                      <h4 className="text-3xl font-bold mb-3 text-gray-900">Thank You!</h4>
                      <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                        Your message has been received. We'll get back to you shortly.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleResetForm}
                        className="px-8 py-4 rounded-2xl font-bold text-white shadow-xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.95) 0%, rgba(239, 68, 68, 0.95) 100%)',
                        }}
                      >
                        Send Another Message
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {formError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl flex items-start gap-3"
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-red-700 font-semibold text-sm">Error</p>
                            <p className="text-red-600 text-sm">{formError}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormError(null)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassFormInput
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
                        <GlassFormInput
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <GlassFormInput
                          id="phone"
                          name="phone"
                          type="tel"
                          label="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Mobile Number"
                          icon={<Phone className="w-4 h-4" />}
                        />
                        <GlassFormInput
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
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2  items-center gap-2">
                          <span className="text-orange-500"><MessageSquare className="w-4 h-4" /></span>
                          Your Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-5 py-4 rounded-2xl text-gray-900 placeholder-gray-400 transition-all resize-none
                            ${formErrors.message
                              ? 'border-2 border-red-400 bg-red-50/50'
                              : 'border border-gray-200 bg-white/80 focus:border-orange-400 focus:bg-white'
                            } 
                            backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-orange-100`}
                          placeholder="Tell us about your project..."
                          style={{
                            boxShadow: formErrors.message ? 'none' : '0 4px 20px -5px rgba(0, 0, 0, 0.05)',
                          }}
                        />
                        {formErrors.message && (
                          <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 text-sm text-red-600 flex items-center gap-1"
                          >
                            <AlertCircle size={14} />
                            {formErrors.message}
                          </motion.p>
                        )}
                      </div>

                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        className="w-full py-5 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-3 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.95) 0%, rgba(239, 68, 68, 0.95) 100%)',
                          boxShadow: '0 10px 40px -10px rgba(249, 115, 22, 0.5)',
                        }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="w-6 h-6" />
                          </>
                        )}
                      </motion.button>

                      <p className="text-center text-sm text-gray-500">
                        We respect your privacy and never share your information.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: '24/7', label: 'Support Available', icon: HeadphonesIcon },
              { value: '<24h', label: 'Response Time', icon: Clock },
              { value: stats.satisfaction_rate?.value || '100%', label: stats.satisfaction_rate?.label || 'Satisfaction', icon: CheckCircle },
              { value: stats.happy_clients?.value || '500+', label: stats.happy_clients?.label || 'Happy Clients', icon: User }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.02 }}
                className="text-center p-6 rounded-3xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
                }}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
