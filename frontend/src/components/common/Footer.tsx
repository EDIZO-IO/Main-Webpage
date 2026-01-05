import { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Send, Sparkles,
} from 'lucide-react';
import Logo from '../common/Logo';

const Footer = memo(() => {
  const socialLinks = [
    { Icon: Facebook, url: "https://www.facebook.com/profile.php?id=61576742758066", label: "Facebook", color: "hover:bg-blue-600" },
    { Icon: Twitter, url: "https://x.com/edizo_official", label: "Twitter", color: "hover:bg-sky-500" },
    { Icon: Instagram, url: "https://www.instagram.com/edizo_official?igsh=dXc1MnFucGY4MHo4", label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400" },
    { Icon: Linkedin, url: "https://www.linkedin.com/in/edizo-pvt-ltd-149748367/", label: "LinkedIn", color: "hover:bg-blue-700" },
    { Icon: Youtube, url: "https://www.youtube.com/@edizo_official", label: "YouTube", color: "hover:bg-red-600" }
  ];

  const quickLinks = [
    { to: "/services", label: "Services" },
    { to: "/about", label: "About Us" },
    { to: "/projects", label: "Projects" },
    { to: "/internships", label: "Internships" },
    { to: "/contact", label: "Contact Us" }
  ];

  const legalLinks = [
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms & Conditions" },
  ];

  const contactInfo = [
    { Icon: MapPin, content: "Virtual Office, India", href: null },
    { Icon: Phone, content: "+91 70924 35729", href: "tel:+917092435729" },
    { Icon: Mail, content: "edizoteam@gmail.com", href: "mailto:edizoteam@gmail.com" },
  ];

  return (
    <footer
      className="relative overflow-hidden"
      role="contentinfo"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950" />

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/15 to-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

      {/* Glowing Line Effect */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent blur-sm" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* Glass Card Container */}
        <div className="relative rounded-3xl overflow-hidden mb-12">
          {/* Glass Background */}
          <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.02]" />
          <div className="absolute inset-0 border border-white/[0.08] rounded-3xl" />

          {/* Inner Glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Content Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 p-8 lg:p-12">

            {/* Brand Section */}
            <div className="space-y-6 lg:col-span-1">
              <Logo isFooter />
              <p className="text-gray-400 leading-relaxed text-sm">
                Delivering innovative digital solutions that empower businesses to grow and succeed in the modern world.
              </p>

              {/* Social Links - Glass Style */}
              <div className="flex flex-wrap gap-3 pt-2">
                {socialLinks.map(({ Icon, url, label, color }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${label}`}
                    title={`Visit our ${label} page`}
                    className={`
                      relative group p-3 rounded-xl
                      bg-white/[0.05] backdrop-blur-md
                      border border-white/[0.08]
                      text-gray-400 hover:text-white
                      ${color}
                      transition-all duration-300
                      hover:scale-110 hover:shadow-lg hover:shadow-orange-500/10
                      hover:border-white/20
                    `}
                  >
                    <Icon size={20} />
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <div className="relative">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  Quick Links
                </h3>
                <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
              </div>
              <ul className="space-y-3">
                {quickLinks.map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      title={`Navigate to ${label} page`}
                      className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                    >
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mr-3 opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="relative">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  Contact Us
                </h3>
                <div className="mt-2 w-12 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
              </div>
              <ul className="space-y-4">
                {contactInfo.map(({ Icon, content, href }, i) => (
                  <li key={i} className="flex items-start gap-3 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/20">
                      <Icon className="text-orange-400 flex-shrink-0" size={16} aria-hidden="true" />
                    </div>
                    {href ? (
                      <a
                        href={href}
                        title={`Contact us at ${content}`}
                        className="text-gray-400 hover:text-white text-sm transition-colors duration-300 group-hover:translate-x-1 break-all"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">{content}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Footer Bottom - Glass Separator */}
        <div className="relative">
          {/* Glass Line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              © {new Date().getFullYear()} <span className="text-red-700 font-stretch-100%">EDIZO</span> All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {legalLinks.map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  title={`Read our ${label}`}
                  className="
                    relative text-gray-500 hover:text-white text-sm
                    transition-all duration-300
                    group
                  "
                >
                  {label}
                  <span className="
                    absolute -bottom-1 left-0 w-0 h-0.5 
                    bg-gradient-to-r from-orange-500 to-red-500 
                    group-hover:w-full transition-all duration-300 rounded-full
                  " />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
export default Footer;
