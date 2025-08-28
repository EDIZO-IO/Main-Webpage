import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Send, CheckCircle, Loader2,
  Facebook, Twitter, Linkedin, Instagram, Youtube
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

// --- Reusable Components ---

const PageHeader = ({ title, subtitle, backgroundImage }) => (
  <div
    className="relative h-72 md:h-80 bg-cover bg-center text-white flex items-center justify-center rounded-b-xl shadow-lg overflow-hidden"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="absolute inset-0 bg-black opacity-60 rounded-b-xl"></div>
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative z-10 text-center p-4 max-w-2xl"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-md">{title}</h1>
      <p className="text-lg md:text-xl text-gray-200 mt-2">{subtitle}</p>
    </motion.div>
  </div>
);

const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    className="rounded-lg"
  >
    {children}
  </motion.div>
);

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
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 ring-offset-2 ring-red-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 ring-offset-2 ring-gray-300',
    outline: 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-2 ring-offset-2 ring-red-600',
    ghost: 'text-red-600 hover:text-red-700 focus:ring-2 ring-offset-2 ring-red-600',
  };

  const combinedClasses = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
    rounded-md font-medium transition-all duration-300 ease-in-out flex items-center justify-center gap-2
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

const ContactInfo = ({ icon, title, lines, gradientClass }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className={`flex items-start space-x-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${gradientClass}`}
  >
    <div className="bg-red-500 rounded-full p-3 flex items-center justify-center text-white flex-shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold text-lg text-gray-900 mb-1">{title}</h4>
      <div className="space-y-1 text-gray-700 text-sm">
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

  // ✅ Fixed: No trailing spaces in URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://main-webpage-l85m.onrender.com';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/send-contact-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        const textResult = await res.text();
        throw new Error(`Invalid JSON response: ${textResult.substring(0, 100)}...`);
      }

      if (!res.ok) throw new Error(result.message || `Error: ${res.statusText}`);

      setFormSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('❌ Error:', error);
      setFormError(
        error.message.includes("Failed to fetch")
          ? "Unable to connect to server. Please check your internet or try later."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputFieldClasses = "border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:border-red-400";

  const socialIcons = { Facebook, Twitter, Linkedin, Instagram, Youtube };

  // ✅ Add JSON-LD structured data
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
          "email": "contact@edizo.in",
          "contactType": "Customer Support",
          "areaServed": "Worldwide",
          "availableLanguage": "English"
        },
        "sameAs": [
          "https://www.facebook.com/profile.php?id=61576742758066",
          "https://x.com/EdizoPvtLtd",
          "https://www.linkedin.com/in/edizo-pvt-ltd-149748367/",
          "https://www.instagram.com/e.d.i.z.o._official/",
          "https://www.youtube.com/@team-edizo"
        ]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* JSON-LD added above */}
      <PageHeader
        title={<span className="text-white">Contact Us</span>}
        subtitle={<span className="text-gray-200">Get in touch with our team for any inquiries or assistance</span>}
        backgroundImage="https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />

      <section className="section bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">We'd Love to Hear From You</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Whether you have a question about our services, need a consultation, or just want to say hello, our dedicated team is here to assist you every step of the way.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <AnimatedSection delay={0.1}>
              <div className="bg-gray-100 p-8 rounded-xl h-full shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Our Details</h3>
                <div className="space-y-6">
                  <ContactInfo
                    icon={<MapPin className="text-white" size={20} />}
                    title="Our Virtual Office"
                    lines={['Global Remote Operations']}
                    gradientClass="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-100"
                  />
                  <ContactInfo
                    icon={<Mail className="text-white" size={20} />}
                    title="Email Support"
                    lines={[
                      <a href="mailto:edizoofficial@gmail.com" className="text-gray-700 hover:text-red-500 transition-colors">edizoofficial@gmail.com</a>,
                      <span className="text-sm text-gray-600">General inquiries & partnerships</span>,
                      <a href="mailto:edizoteam@gmail.com" className="text-gray-700 hover:text-red-500 block mt-2 transition-colors">edizoteam@gmail.com</a>,
                      <span className="text-sm text-gray-600">Technical support & service requests</span>,
                    ]}
                    gradientClass="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-100"
                  />
                  <ContactInfo
                    icon={<Phone className="text-white" size={20} />}
                    title="Call Us"
                    lines={[
                      <a href="tel:+919876543210" className="text-gray-700 hover:text-red-500 transition-colors">+91 9876543210</a>,
                      <span className="text-sm text-gray-600">Mon-Sat: 9:00 AM - 6:00 PM (IST)</span>
                    ]}
                    gradientClass="bg-gradient-to-br from-slate-50 via-slate-100 to-slate-100"
                  />
                </div>

                <div className="mt-10">
                  <h4 className="font-bold text-xl mb-4 text-gray-900 border-b pb-2">Connect With Us</h4>
                  <div className="flex space-x-4 justify-center md:justify-start">
                    {[
                      { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61576742758066' },
                      { platform: 'Twitter', url: 'https://x.com/EdizoPvtLtd' },
                      { platform: 'Linkedin', url: 'https://www.linkedin.com/in/edizo-pvt-ltd-149748367/' },
                      { platform: 'Instagram', url: 'https://www.instagram.com/edizo_official?igsh=dXc1MnFucGY4MHo4' },
                      { platform: 'Youtube', url: 'https://www.youtube.com/@edizo_official' }
                    ].map((social, i) => {
                      const IconComponent = socialIcons[social.platform];
                      return (
                        <motion.a
                          key={i}
                          href={social.url}
                          aria-label={social.platform}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 * i + 0.3 }}
                          className="bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white transition-colors duration-300 w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                          {IconComponent && <IconComponent size={24} />}
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white p-8 rounded-xl shadow-xl lg:col-span-2">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Send Us a Message</h3>
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center py-12 px-4"
                  >
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h4 className="text-2xl font-bold mb-3">Thank You!</h4>
                    <p className="text-gray-700 text-lg mb-8">
                      We've received your message and will get back to you within 24-48 hours.
                    </p>
                    <Button variant="outline" onClick={() => setFormSubmitted(false)}>
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-600 text-center bg-red-100 p-3 rounded-md border border-red-200"
                      >
                        {formError}
                      </motion.p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className={inputFieldClasses}
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={inputFieldClasses}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={inputFieldClasses}
                        placeholder="e.g., +91 98765 43210"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className={inputFieldClasses}
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className={`${inputFieldClasses} resize-y`}
                        placeholder="Tell us about your project or question..."
                      />
                    </div>

                    <div className="text-right mt-6">
                      <Button type="submit" disabled={loading} size="lg">
                        {loading ? (
                          <>
                            Sending... <Loader2 className="ml-3 w-5 h-5 animate-spin" />
                          </>
                        ) : (
                          <>
                            Send Message <Send className="ml-3 w-5 h-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;