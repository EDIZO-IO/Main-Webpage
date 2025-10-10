// src/components/common/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../common/Logo';

const Footer: React.FC = () => {
  const socialLinks = [
    { 
      Icon: Facebook, 
      url: "https://www.facebook.com/profile.php?id=61576742758066",
      label: "Facebook"
    },
    { 
      Icon: Twitter, 
      url: "  https://x.com/edizo_official  ",
      label: "Twitter"
    },
    { 
      Icon: Instagram, 
      url: "https://www.instagram.com/edizo_official?igsh=dXc1MnFucGY4MHo4",
      label: "Instagram"
    },
    { 
      Icon: Linkedin, 
      url: "  https://www.linkedin.com/in/edizo-pvt-ltd-149748367/  ",
      label: "LinkedIn"
    },
    { 
      Icon: Youtube, 
      url: "https://www.youtube.com/@edizo_official  ",
      label: "YouTube"
    }
  ];

  const quickLinks = [
    { to: "/solution", label: "Solution" },
    { to: "/team", label: "Team" },
    { to: "/contact", label: "Contact Us" }
  ];

  const legalLinks = [
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms & Conditions" },
    { to: "/cookie-policy", label: "Cookie Policy" }
  ];

  const contactInfo = [
    {
      Icon: MapPin,
      content: "Virtual Office, India",
      href: null
    },
    {
      Icon: Phone,
      content: "+91 70924 35729",
      href: "tel:+917092435729"
    },
    {
      Icon: Mail,
      content: "edizoofficial@gmail.com",
      href: "mailto:edizoofficial@gmail.com"
    },
    {
      Icon: Mail,
      content: "edizoteam@gmail.com",
      href: "mailto:edizoteam@gmail.com"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white relative overflow-hidden" role="contentinfo">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Brand Section */}
          <motion.div className="space-y-4 lg:col-span-1" variants={itemVariants}>
            <Logo isFooter />
            <p className="text-gray-400 max-w-xs leading-relaxed text-sm">
              Delivering innovative digital solutions that empower businesses to grow and succeed in the modern world.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3 pt-2">
              {socialLinks.map(({ Icon, url, label }) => (
                <motion.a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${label}`}
                  className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gradient-to-br hover:from-orange-500 hover:to-red-500 transition-all duration-300 p-2.5 rounded-lg border border-gray-700/50 hover:border-red-500/50"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-bold text-white pb-2 relative">
              Quick Links
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ to, label }) => (
                <motion.li 
                  key={label}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={to}
                    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm font-medium flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 group-hover:bg-red-500 transition-colors" />
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-bold text-white pb-2 relative">
              Contact
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
            </h3>
            <ul className="space-y-2">
              {contactInfo.map(({ Icon, content, href }, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start space-x-2"
                  whileHover={{ x: href ? 3 : 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="text-orange-500 mt-0.5 flex-shrink-0" size={16} aria-hidden="true" />
                  {href ? (
                    <a
                      href={href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm break-all"
                    >
                      {content}
                    </a>
                  ) : (
                    <span className="text-gray-300 text-sm">{content}</span>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-lg font-bold text-white pb-2 relative">
              Stay Updated
              <span className="absolute bottom-0 left-0 w-10 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
            </h3>
            <p className="text-gray-400 text-sm">
              Subscribe to our newsletter for latest updates and insights.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                aria-label="Email for newsletter"
              />
              <motion.button
                className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer Bottom */}
        <motion.div 
          className="mt-10 pt-6 border-t border-gray-800/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-gray-500 text-xs md:text-sm">
              &copy; {new Date().getFullYear()} <span className="text-white font-semibold">Edizo</span>. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {legalLinks.map(({ to, label }) => (
                <motion.div key={label} whileHover={{ y: -1 }}>
                  <Link
                    to={to}
                    className="text-gray-500 hover:text-white text-xs md:text-sm transition-colors duration-300 relative group"
                  >
                    {label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;