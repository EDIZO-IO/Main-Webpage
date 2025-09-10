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
import Logo from '../common/Logo'; // Ensure this path is correct

const Footer: React.FC = () => {
  const linkVariants = {
    hover: { scale: 1.05, color: '#FF0000' }, // Red hover effect
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }} // Trigger animation once
            >
              <Logo isFooter />
            </motion.div>
            <p className="text-gray-300 max-w-xs leading-relaxed text-sm">
              Edizo is committed to delivering innovative digital solutions that empower businesses to grow and succeed.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, url: "https://www.facebook.com/profile.php?id=61576742758066" },
                { Icon: Twitter, url: "https://x.com/edizo_official" }, // ✅ Removed trailing spaces
                { Icon: Instagram, url: "https://www.instagram.com/edizo_official?igsh=dXc1MnFucGY4MHo4" },
                { Icon: Linkedin, url: "https://www.linkedin.com/in/edizo-pvt-ltd-149748367/" }, // ✅ Removed trailing spaces
                { Icon: Youtube, url: "https://www.youtube.com/@edizo_official" } // ✅ Removed trailing space
              ].map(({ Icon, url }, i) => (
                <motion.a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${Icon.name || 'social media'}`} // Fallback name
                  className="text-gray-300 hover:text-red-500 transition-colors duration-300"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-sm">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-white pb-2 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-red-600"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/projects", label: "Projects" },
                { to: "/internships", label: "Internships" },
                { to: "/contact", label: "Contact Us" }
              ].map(({ to, label }) => (
                <motion.li key={label} variants={linkVariants} whileHover="hover">
                  <Link
                    to={to}
                    className="text-gray-300 hover:text-red-500 transition-colors duration-300 block text-sm font-medium py-1"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Our Services Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-sm">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-white pb-2 relative inline-block">
              Our Services
              <span className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-red-600"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/services/web-development", label: "Web Development" },
                { to: "/services/mobile-apps", label: "Mobile Applications" },
                { to: "/services/digital-marketing", label: "Digital Marketing" },
                { to: "/services/ui-ux", label: "UI/UX Design" },
                { to: "/services/consulting", label: "Business Consulting" }
              ].map(({ to, label }) => (
                <motion.li key={label} variants={linkVariants} whileHover="hover">
                  <Link
                    to={to}
                    className="text-gray-300 hover:text-red-500 transition-colors duration-300 block text-sm font-medium py-1"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info Card */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-sm">
            <h3 className="text-lg md:text-xl font-bold mb-4 text-white pb-2 relative inline-block">
              Contact
              <span className="absolute bottom-0 left-0 w-1/4 h-0.5 bg-red-600"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="text-red-500 mt-1 flex-shrink-0" size={18} aria-hidden="true" />
                <span className="text-gray-300 text-sm">Virtual Office, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-red-500 flex-shrink-0" size={18} aria-hidden="true" />
                <a
                  href="tel:+917092435729"
                  className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm"
                >
                  +91 70924 35729
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-red-500 flex-shrink-0" size={18} aria-hidden="true" />
                <a
                  href="mailto:edizoofficial@gmail.com"
                  className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm"
                >
                  edizoofficial@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-red-500 flex-shrink-0" size={18} aria-hidden="true" />
                <a
                  href="mailto:edizoteam@gmail.com"
                  className="text-gray-300 hover:text-red-500 transition-colors duration-300 text-sm"
                >
                  edizoteam@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-gray-700/30 text-center md:flex md:justify-between md:items-center text-sm">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Edizo. All rights reserved.
          </p>
          <div>
            <ul className="flex flex-wrap justify-center md:justify-end space-x-4 md:space-x-6">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;