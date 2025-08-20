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
import Logo from '../common/Logo'; // Ensure this path is correct

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div>
            <Logo isFooter />
            <p className="mt-4 text-gray-300 max-w-xs leading-relaxed">
              Edizo is committed to delivering innovative digital solutions that empower businesses to grow and succeed.
            </p>
            <div className="flex mt-6 space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61576742758066"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Facebook"
                className="text-gray-300 hover:text-edizo-red transition-colors duration-300"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://x.com/EdizoPvtLtd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter (X)"
                className="text-gray-300 hover:text-edizo-red transition-colors duration-300"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/e.d.i.z.o._official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="text-gray-300 hover:text-edizo-red transition-colors duration-300"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/edizo-pvt-ltd-149748367/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with us on LinkedIn"
                className="text-gray-300 hover:text-edizo-red transition-colors duration-300"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.youtube.com/@team-edizo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to us on YouTube"
                className="text-gray-300 hover:text-edizo-red transition-colors duration-300"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300 block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300 block"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300 block"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to="/internships"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300 block"
                >
                  Internships
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300 block"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/services/web-development"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300 block"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services/mobile-apps"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300 block"
                >
                  Mobile Applications
                </Link>
              </li>
              <li>
                <Link
                  to="/services/digital-marketing"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300 block"
                >
                  Digital Marketing
                </Link>
              </li>
              <li>
                <Link
                  to="/services/ui-ux"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300 block"
                >
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link
                  to="/services/consulting"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300 block"
                >
                  Business Consulting
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 text-edizo-red mt-1 flex-shrink-0" size={18} aria-hidden="true" />
                <span className="text-gray-300">Virtual Office, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 text-edizo-red flex-shrink-0" size={18} aria-hidden="true" />
                <a
                  href="tel:+917092435729"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300"
                >
                  +91 70924 35729
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-edizo-red flex-shrink-0" size={18} aria-hidden="true" />
                <a
                  href="mailto:edizoofficial@gmail.com"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300"
                >
                  edizoofficial@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 text-edizo-red flex-shrink-0" size={18} aria-hidden="true" />
                <a
                  href="mailto:edizoteam@gmail.com"
                  className="text-gray-300 hover:text-edizo-red transition-colors duration-300"
                >
                  edizoteam@gmail.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center md:flex md:justify-between md:items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Edizo. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex justify-center md:justify-end space-x-6 text-sm">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-edizo-red transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-edizo-red transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="text-gray-400 hover:text-edizo-red transition-colors duration-300"
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