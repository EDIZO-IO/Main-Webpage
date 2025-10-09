// src/pages/Contact.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Loader2,
  Facebook,
  Twitter, // Assuming this is 'X'
  Linkedin,
  Instagram,
  Youtube,
  MessageCircle,
  ArrowRight,
  Clock,
  Zap,
  User,
  Hash, // For Subject
  MessageSquare, // Alternative for Message
} from 'lucide-react';

// === Type Definitions ===
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

// --- Reusable Components ---

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100, damping: 15 }}
  >
    {children}
  </motion.div>
);

const Button: React.FC<ButtonProps> = ({
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
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 focus:ring-2 ring-offset-2 ring-red-500 shadow-md hover:shadow-xl',
    secondary: 'bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-gray-50/80 border border-gray-300 focus:ring-2 ring-offset-2 ring-gray-400',
    outline: 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-2 ring-offset-2 ring-red-600',
    ghost: 'text-red-600 hover:text-red-700 focus:ring-2 ring-offset-2 ring-red-600',
  };

  const combinedClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
    rounded-full font-medium transition-all duration-300 ease-in-out flex items-center justify-center gap-2 min-h-12
  `.trim();

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
      >
        {iconLeft && <span>{iconLeft}</span>}
        {children}
        {iconRight && <span>{iconRight}</span>}
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
      {iconLeft && <span>{iconLeft}</span>}
      {children}
      {iconRight && <span>{iconRight}</span>}
    </button>
  );
};

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, title, lines, gradientClass, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`flex items-start space-x-4 p-6 rounded-2xl shadow-md border border-gray-100/50 hover:shadow-xl transition-all duration-300 ${gradientClass} group bg-white/90 backdrop-blur-sm`}
  >
    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-lg text-gray-800 mb-2">{title}</h4>
      <div className="space-y-1 text-gray-600 text-sm">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </div>
  </motion.div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // --- ADD: Define your backend API URL ---
  // Replace this with your actual backend URL (e.g., 'https://your-app-name.onrender.com' when deployed)
 const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';// Uses env var or defaults to localhost

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- UPDATE: handleSubmit to send data to backend ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      // Make the API call to your backend
      const response = await fetch(`${API_BASE_URL}/api/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // If the backend returns success, show the thank you message
        setFormSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        // If the backend returns an error, show it
        setFormError(result.message || "An error occurred while sending the message.");
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      console.error('❌ Error submitting form:', error);
      setFormError("Failed to send message. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Schema.org (Corrected URLs) ---
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org", // ✅ Removed trailing spaces
      "@type": "ContactPage",
      "name": "Contact Edizo",
      "url": "https://www.edizo.in/contact", // ✅ Removed trailing spaces
      "description": "Get in touch with Edizo for inquiries about UI/UX, web & app development, and digital design services.",
      "mainEntity": {
        "@type": "Organization",
        "name": "Edizo",
        "url": "https://www.edizo.in", // ✅ Removed trailing spaces
        "logo": "https://www.edizo.in/logo.png", // ✅ Removed trailing spaces
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+919876543210",
          "email": "edizoofficial@gmail.com", // ✅ Updated to primary email
          "contactType": "Customer Support",
          "areaServed": "Worldwide",
          "availableLanguage": "English"
        },
        "sameAs": [
          "https://www.facebook.com/profile.php?id=61576742758066",
          "https://x.com/EdizoPvtLtd", // ✅ Fixed Twitter/X URL (removed extra spaces)
          "https://www.linkedin.com/in/edizo-pvt-ltd-149748367/", // ✅ Removed trailing spaces
          "https://www.instagram.com/e.d.i.z.o._official/", // ✅ Removed trailing spaces
          "https://www.youtube.com/@team-edizo" // ✅ Removed trailing spaces
        ]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'contact-schema'; // Add ID for cleanup
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      // Cleanup function to remove the script on component unmount
      const existingScript = document.getElementById('contact-schema');
      if (existingScript && document.head.contains(existingScript)) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Curved Header Section */}
      <header className="relative w-full bg-gradient-to-br from-red-600 to-orange-600 text-white pt-24 pb-32 overflow-hidden">
        <motion.div
          className="text-center p-6 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl font-medium drop-shadow max-w-2xl mx-auto">
            We'd love to hear from you. Reach out and let's create something amazing together.
          </p>
        </motion.div>
        <svg className="absolute bottom-0 left-0 w-full h-auto text-gray-50" viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,0C144,0,288,0,432,0C576,0,720,0,864,0C1008,0,1152,0,1296,0C1440,0,1440,100,1440,100C1296,100,1152,100,1008,100C864,100,720,100,576,100C432,100,288,100,144,100C0,100,0,0,0,0Z"></path>
        </svg>
      </header>

      {/* Main Content Section */}
      <section className="relative -top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50 rounded-t-[3rem] p-6 sm:p-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 rounded-full font-medium text-sm mb-6 border border-red-200/50">
                <Zap size={16} />
                Get in Touch
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How Can We Help You?
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Whether you have a question about our services, need a consultation, or just want to say hello, our dedicated team is here to assist you every step of the way.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-6 lg:col-span-1">
              <AnimatedSection delay={0.1}>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                    <MapPin className="w-6 h-6 text-red-500 mr-2" />
                    Contact Information
                  </h3>

                  <div className="space-y-6">
                    <ContactInfo
                      icon={<MapPin size={24} />}
                      title="Location"
                      lines={['Global Remote Operations', 'Serving clients worldwide']}
                      gradientClass="bg-gradient-to-br from-blue-500 to-blue-600"
                      delay={0.2}
                    />

                    <ContactInfo
                      icon={<Mail size={24} />}
                      title="Email"
                      lines={[
                        <a key="email1" href="mailto:edizoofficial@gmail.com" className="hover:text-red-600 transition-colors flex items-center">
                          <Mail className="w-4 h-4 mr-1" /> edizoofficial@gmail.com
                        </a>,
                        <a key="email2" href="mailto:edizoteam@gmail.com" className="hover:text-red-600 transition-colors flex items-center">
                          <Mail className="w-4 h-4 mr-1" /> edizoteam@gmail.com
                        </a>
                      ]}
                      gradientClass="bg-gradient-to-br from-purple-500 to-purple-600"
                      delay={0.3}
                    />

                    <ContactInfo
                      icon={<Phone size={24} />}
                      title="Phone"
                      lines={[
                        <a key="phone" href="tel:+919876543210" className="hover:text-red-600 transition-colors flex items-center">
                          <Phone className="w-4 h-4 mr-1" /> +91 9876543210
                        </a>,
                        <span key="hours" className="text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" /> Mon-Sat: 9:00 AM - 6:00 PM (IST)
                        </span>
                      ]}
                      gradientClass="bg-gradient-to-br from-green-500 to-green-600"
                      delay={0.4}
                    />
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.5}>
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                    <MessageCircle className="w-6 h-6 text-red-500 mr-2" />
                    Connect With Us
                  </h3>

                  <div className="space-y-4">
                    {[
                      { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61576742758066', icon: Facebook },
                      { platform: 'Twitter', url: 'https://x.com/EdizoPvtLtd', icon: Twitter }, // ✅ Updated URL
                      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/edizo-pvt-ltd-149748367/', icon: Linkedin }, // ✅ Capitalized
                      { platform: 'Instagram', url: 'https://www.instagram.com/e.d.i.z.o._official/', icon: Instagram }, // Ensure correct URL
                      { platform: 'YouTube', url: 'https://www.youtube.com/@team-edizo', icon: Youtube } // ✅ Capitalized
                    ].map((social, i) => {
                      const IconComponent = social.icon;
                      return (
                        <motion.a
                          key={i}
                          href={social.url}
                          aria-label={social.platform}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.1 * i }}
                          className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white transition-all duration-300 group"
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-200 group-hover:bg-white/20 flex items-center justify-center mr-3 transition-colors duration-300">
                            <IconComponent size={20} className="group-hover:text-white" />
                          </div>
                          <span className="font-medium group-hover:text-white transition-colors duration-300">
                            {social.platform}
                          </span>
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100/50 lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-4">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Send Us a Message</h3>
                </div>

                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center py-12 px-4 bg-gradient-to-b from-green-50 to-green-100 rounded-xl"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h4 className="text-2xl font-bold mb-3 text-gray-900">Thank You!</h4>
                    <p className="text-gray-700 text-lg mb-8">
                      Your message has been sent successfully. We will get back to you shortly.
                    </p>
                    <Button variant="outline" onClick={() => setFormSubmitted(false)} size="lg">
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600"
                      >
                        {formError}
                      </motion.div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2  items-center">
                          <User className="w-4 h-4 mr-1" /> Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors bg-white/50"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2  items-center">
                          <Mail className="w-4 h-4 mr-1" /> Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors bg-white/50"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2  items-center">
                        <Phone className="w-4 h-4 mr-1" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors bg-white/50"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2  items-center">
                        <Hash className="w-4 h-4 mr-1" /> Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors bg-white/50"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2  items-center">
                        <MessageSquare className="w-4 h-4 mr-1" /> Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors bg-white/50 resize-y"
                        placeholder="Tell us about your project or ask your questions..."
                      ></textarea>
                    </div>
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      disabled={loading}
                      iconRight={loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                    >
                      {loading ? 'Sending...' : 'Send Message'} {/* ✅ Updated button text */}
                    </Button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;