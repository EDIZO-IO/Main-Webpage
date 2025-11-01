// src/pages/Contact.tsx
import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Loader2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  ArrowRight,
  Clock,
  Zap,
  User,
  Hash,
  MessageSquare,
  AlertCircle,
  Globe,
  HeadphonesIcon,
  Sparkles,
  X,
} from 'lucide-react';

// === TypeScript Interfaces ===
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  lines: React.ReactNode[];
  gradientClass: string;
  delay?: number;
}

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

// === Memoized Animated Section ===
const AnimatedSection = memo<AnimatedSectionProps>(({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
));
AnimatedSection.displayName = 'AnimatedSection';

// === Memoized Button Component ===
const Button = memo<ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
}) => {
  const sizeClasses = useMemo(() => ({
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  }), []);

  const variantClasses = useMemo(() => ({
    primary: 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 focus:ring-2 ring-offset-2 ring-red-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-800 hover:bg-gray-50 border-2 border-gray-200 focus:ring-2 ring-offset-2 ring-gray-400 shadow-md',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-2 ring-offset-2 ring-red-600 shadow-sm',
    ghost: 'text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-2 ring-offset-2 ring-red-600',
  }), []);

  const combinedClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
    rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
  `.trim();

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
      >
        {iconLeft}
        {children}
        {iconRight}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
});
Button.displayName = 'Button';

// === Memoized Contact Info Card ===
const ContactInfo = memo<ContactInfoProps>(({ icon, title, lines, gradientClass, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ duration: 0.3, delay }}
    className={`flex items-start space-x-4 p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-2xl transition-all ${gradientClass} group`}
  >
    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-3 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-lg text-white mb-2">{title}</h4>
      <div className="space-y-2 text-white/90 text-sm">
        {lines.map((line, i) => (
          <div key={i} className="flex items-center gap-1">{line}</div>
        ))}
      </div>
    </div>
  </motion.div>
));
ContactInfo.displayName = 'ContactInfo';

// === Memoized Social Media Link ===
const SocialMediaLink = memo<{ platform: string; url: string; icon: typeof Facebook; delay: number }>(
  ({ platform, url, icon: IconComponent, delay }) => (
    <motion.a
      href={url}
      aria-label={platform}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, x: 5 }}
      transition={{ duration: 0.2, delay }}
      className="flex items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-red-500 hover:to-orange-500 border border-gray-200 hover:border-transparent shadow-sm hover:shadow-lg transition-all group"
    >
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-100 to-orange-100 group-hover:from-white/30 group-hover:to-white/20 flex items-center justify-center mr-3 transition-all shadow-sm">
        <IconComponent size={22} className="text-red-600 group-hover:text-white transition-colors" />
      </div>
      <span className="font-semibold text-gray-800 group-hover:text-white transition-colors">
        {platform}
      </span>
      <ArrowRight size={18} className="ml-auto text-gray-400 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" />
    </motion.a>
  )
);
SocialMediaLink.displayName = 'SocialMediaLink';

// === Memoized Form Input ===
const FormInput = memo<{
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
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
      {icon}
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-3.5 rounded-xl border-2 ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
      } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400`}
      placeholder={placeholder}
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
FormInput.displayName = 'FormInput';

// === Main Component ===
const Contact = () => {
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

  // ✅ Form validation
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

  // ✅ Memoized callbacks
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors
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

  // ✅ Memoized social media data
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
          "telephone": "+919876543210",
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
    <div className="bg-gradient-to-b from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Enhanced Header Section */}
      <header className="relative w-full bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white pt-28 pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-orange-600/10"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${10 + i * 25}%`,
                top: `${15 + i * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        <motion.div
          className="text-center p-6 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold">We're Here to Help</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
            Let's Start a Conversation
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Have a project in mind? Reach out to our team of experts. We're here to help bring your vision to life.
          </p>
        </motion.div>
      </header>

      {/* Main Content Section */}
      <section className="relative -top-24 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100">
            {/* Section Header */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <AnimatedSection>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  How Can We Help You?
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whether you have questions, need a consultation, or want to discuss a project, we're just a message away.
                </p>
              </AnimatedSection>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info Cards */}
              <div className="space-y-6 lg:col-span-1">
                <AnimatedSection delay={0.1}>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                      <HeadphonesIcon className="w-6 h-6 text-red-600" />
                      Get in Touch
                    </h3>

                    <div className="space-y-4">
                      <ContactInfo
                        icon={<Globe size={24} />}
                        title="Location"
                        lines={[
                          <span key="loc1" className="font-medium">Global Remote Operations</span>,
                          <span key="loc2" className="text-sm">Serving clients worldwide</span>
                        ]}
                        gradientClass="bg-gradient-to-br from-blue-500 to-blue-600"
                        delay={0.2}
                      />

                      <ContactInfo
                        icon={<Mail size={24} />}
                        title="Email Us"
                        lines={[
                          <a key="email1" href="mailto:edizoofficial@gmail.com" className="hover:underline font-medium">
                            edizoofficial@gmail.com
                          </a>,
                          <a key="email2" href="mailto:edizoteam@gmail.com" className="hover:underline font-medium">
                            edizoteam@gmail.com
                          </a>
                        ]}
                        gradientClass="bg-gradient-to-br from-purple-500 to-purple-600"
                        delay={0.3}
                      />

                      <ContactInfo
                        icon={<Phone size={24} />}
                        title="Call Us"
                        lines={[
                          <a key="phone" href="tel:+919876543210" className="hover:underline font-medium">
                            +91 9876543210
                          </a>,
                          <span key="hours" className="text-sm flex items-center gap-1">
                            <Clock size={14} /> Mon-Sat: 9 AM - 6 PM IST
                          </span>
                        ]}
                        gradientClass="bg-gradient-to-br from-green-500 to-green-600"
                        delay={0.4}
                      />
                    </div>
                  </div>
                </AnimatedSection>

                {/* Social Media Links */}
                <AnimatedSection delay={0.5}>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                      <MessageCircle className="w-6 h-6 text-red-600" />
                      Follow Us
                    </h3>

                    <div className="space-y-3">
                      {socialMedia.map((social, i) => (
                        <SocialMediaLink key={social.platform} {...social} delay={0.1 * i} />
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              </div>

              {/* Contact Form */}
              <AnimatedSection delay={0.2}>
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 md:p-10 shadow-xl border border-gray-200 lg:col-span-2">
                  <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <Send className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">Send a Message</h3>
                      <p className="text-gray-600 text-sm mt-1">We'll respond within 24-48 hours</p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {formSubmitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center py-16 px-4"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring' }}
                          className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                          <CheckCircle className="w-14 h-14 text-green-600" />
                        </motion.div>
                        <h4 className="text-3xl font-bold mb-3 text-gray-900">Thank You!</h4>
                        <p className="text-gray-700 text-lg mb-8 max-w-md mx-auto">
                          Your message has been received. We'll get back to you within 24-48 hours.
                        </p>
                        <Button variant="primary" onClick={handleResetForm} size="lg">
                          Send Another Message
                        </Button>
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
                            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
                          >
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-red-800 font-semibold text-sm">Error</p>
                              <p className="text-red-600 text-sm">{formError}</p>
                            </div>
                            <button
                              onClick={() => setFormError(null)}
                              className="ml-auto text-red-600 hover:text-red-800"
                            >
                              <X size={18} />
                            </button>
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormInput
                            id="name"
                            name="name"
                            label="Full Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                            error={formErrors.name}
                            icon={<User className="w-4 h-4" />}
                          />

                          <FormInput
                            id="email"
                            name="email"
                            type="email"
                            label="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            required
                            error={formErrors.email}
                            icon={<Mail className="w-4 h-4" />}
                          />
                        </div>

                        <FormInput
                          id="phone"
                          name="phone"
                          type="tel"
                          label="Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          icon={<Phone className="w-4 h-4" />}
                        />

                        <FormInput
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

                        <div>
                          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            Your Message <span className="text-red-600">*</span>
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={6}
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                              formErrors.message ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
                            } focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-y text-gray-900 placeholder-gray-400`}
                            placeholder="Tell us about your project or ask your questions..."
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

                        <Button
                          type="submit"
                          variant="primary"
                          fullWidth
                          size="lg"
                          disabled={loading}
                          iconRight={loading ? <Loader2 className="animate-spin" size={22} /> : <ArrowRight size={22} />}
                        >
                          {loading ? 'Sending Message...' : 'Send Message'}
                        </Button>

                        <p className="text-center text-sm text-gray-500 mt-4">
                          We respect your privacy and never share your information.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '24/7', label: 'Support Available' },
              { value: '<24h', label: 'Response Time' },
              { value: '100%', label: 'Satisfaction' },
              { value: '500+', label: 'Happy Clients' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
