import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Reusable Components (Enhanced) ---

/**
 * PageHeader component for consistent page titles with background images.
 */
const PageHeader = ({ title, subtitle, backgroundImage }) => (
  <div className="relative h-72 md:h-80 bg-cover bg-center text-white flex items-center justify-center rounded-b-xl shadow-lg overflow-hidden" style={{ backgroundImage: `url(${backgroundImage})` }}>
    <div className="absolute inset-0 bg-black opacity-60 rounded-b-xl"></div> {/* Darker overlay */}
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

/**
 * AnimatedSection component for fade-in and slide-up animations.
 */
const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }} // Start slightly lower and invisible
    animate={{ opacity: 1, y: 0 }}   // Animate to full opacity and original position
    transition={{ duration: 0.7, delay, ease: "easeOut" }} // Smooth transition
    className="rounded-lg" // Consistent rounding
  >
    {children}
  </motion.div>
);

/**
 * Button component with primary, outline, and default variants.
 * Supports disabled states.
 */
const Button = ({ children, type = 'button', disabled = false, onClick, variant = 'primary', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-8 py-3 rounded-full font-semibold flex items-center justify-center transition-all duration-300
      ${variant === 'primary' ? 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg' : ''}
      ${variant === 'outline' ? 'border border-red-600 text-red-600 hover:bg-red-600 hover:text-white shadow-sm hover:shadow-md' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `}
  >
    {children}
  </button>
);

/**
 * ContactInfo reusable component for displaying contact details with icons.
 */
const ContactInfo = ({ icon, title, lines }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="flex items-start space-x-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
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

/**
 * Main Contact component for displaying contact information and a form.
 */
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
  const [formError, setFormError] = useState(null);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Define the API base URL.
  const API_BASE_URL = 'https://main-webpage-l85m.onrender.com'; // Your Render backend URL

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null); // Clear previous errors

    try {
      const response = await fetch(`${API_BASE_URL}/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Form submitted successfully:', data);

      setFormSubmitted(true);
      // Reset form data after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setFormError(error.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Common input field styling
  const inputFieldClasses = "input-field border border-gray-300 rounded-md px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 shadow-sm hover:border-red-400";


  return (
    <>
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
            {/* Contact Information Section */}
            <AnimatedSection delay={0.1}>
              <div className="bg-gray-100 p-8 rounded-xl h-full shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Our Details</h3>
                <div className="space-y-6">
                  <ContactInfo
                    icon={<MapPin className="text-white" size={20} />}
                    title="Our Virtual Office"
                    lines={['Global Remote Operations']}
                  />
                  <ContactInfo
                    icon={<Mail className="text-white" size={20} />}
                    title="Email Support"
                    lines={[
                      <a href="mailto:e.d.i.z.o.pvt.ltd@gmail.com" className="text-gray-700 hover:text-red-500 transition-colors duration-200">e.d.i.z.o.pvt.ltd@gmail.com</a>,
                      <span className="text-sm text-gray-600">For general inquiries and partnerships</span>,
                      <a href="mailto:edizocorp@gmail.com" className="text-gray-700 hover:text-red-500 mt-2 block transition-colors duration-200">edizocorp@gmail.com</a>,
                      <span className="text-sm text-gray-600">For technical support and service requests</span>,
                    ]}
                  />
                  <ContactInfo
                    icon={<Phone className="text-white" size={20} />}
                    title="Call Us"
                    lines={[
                      <a href="tel:+917092435729" className="text-gray-700 hover:text-red-500 transition-colors duration-200">+91 70924 35729</a>,
                      <span className="text-sm text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM (IST)</span>
                    ]}
                  />
                </div>

                <div className="mt-10">
                  <h4 className="font-bold text-xl mb-4 text-gray-900 border-b pb-2">Connect With Us</h4>
                  <div className="flex space-x-4 justify-center md:justify-start">
                    {/* Social media icons with actual URLs */}
                    {[
                      { platform: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61576742758066' },
                      { platform: 'Twitter', url: 'https://x.com/EdizoPvtLtd' },
                      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/edizo-pvt-ltd-149748367/' },
                      { platform: 'Instagram', url: 'https://www.instagram.com/e.d.i.z.o._official/' },
                      { platform: 'Youtube',  url: 'https://www.youtube.com/@team-edizo'}
                    ].map((social, i) => (
                      <motion.a
                        key={i}
                        href={social.url}
                        aria-label={social.platform}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 * i + 0.3 }}
                        className="bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white transition-colors duration-300 w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-md hover:shadow-lg"
                      >
                        <i className={`fa-brands fa-${social.platform.toLowerCase()}`} />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Send Message Form Section */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white p-8 rounded-xl shadow-xl lg:col-span-2">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Send Us a Message</h3>
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center py-12 px-4"
                  >
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h4 className="text-2xl font-bold mb-3">Thank You For Your Message!</h4>
                    <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                      We've successfully received your inquiry and appreciate you reaching out. Our team will review your message and get back to you as soon as possible, typically within 24-48 business hours.
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
                        transition={{ duration: 0.3 }}
                        className="text-red-600 text-center bg-red-100 p-3 rounded-md border border-red-200"
                      >
                        {formError}
                      </motion.p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name <span className="text-red-500">*</span>
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
                      </motion.div>
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
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
                      </motion.div>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={inputFieldClasses}
                        placeholder="Optional: +1 (123) 456-7890"
                      />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className={inputFieldClasses}
                        placeholder="e.g., Inquiry about services, Support request"
                      />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message <span className="text-red-500">*</span></label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className={`${inputFieldClasses} resize-y`}
                        placeholder="Write your detailed message here..."
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-right mt-6"
                    >
                      <Button type="submit" disabled={loading} className="py-3 px-8 text-lg rounded-xl">
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
                    </motion.div>
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

// Main App component to render the Contact page
const App = () => {
  return (
    <>
      {/* Link to Font Awesome for social media icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" xintegrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0V4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      <main className="min-h-screen bg-gray-50 font-sans antialiased">
        <Contact />
      </main>
    </>
  );
};

export default App;
