// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase as ProjectsIcon,
  UserCheck,
  Star,
  ArrowRight,
  PenTool,
  Code,
  Smartphone,
  Video,
  ImageIcon,
  Calendar,
  MessageCircle,
  Target,
  Zap,
  Shield,
} from 'lucide-react';

// Project Images
import faceguard from '../assets/project/face-Guard.png';
import ransomware from '../assets/project/Ransomware.png';
import Epicnexus from '../assets/project/Epic-nexus.png';

// Internship Images
import webDevelopment from '../assets/images/web-development.png';
import responsiveDesign from '../assets/images/responsive-design.png';
import contentStrategy from '../assets/images/content-strategy.png';

// Animated Section Component
const AnimatedSection = ({ children, delay = 0.1 }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

// Testimonials
const testimonials = [
  {
    name: "Sarah Kim",
    role: "Marketing Director, TechNova",
    rating: 5,
    content: "Edizo transformed our brand presence. They delivered beyond expectations — on time, under budget, and with stunning results.",
  },
  {
    name: "James Patel",
    role: "Founder, Nexora",
    rating: 5,
    content: "A true game-changer! Their user-centric approach made our app intuitive, fast, and loved by users from day one.",
  },
  {
    name: "Lena Wu",
    role: "CEO, VisionLabs",
    rating: 5,
    content: "Professional, responsive, and deeply creative. Edizo helped us scale our digital footprint with measurable impact.",
  },
];

// Services
const services = [
  { icon: PenTool, title: "UI/UX Design", desc: "Human-centered design that users love and clients rate 5 stars." },
  { icon: Code, title: "Web Development", desc: "Fast, scalable websites built with React, Next.js, and modern stacks." },
  { icon: Smartphone, title: "App Development", desc: "Cross-platform mobile apps with React Native & Flutter." },
  { icon: Video, title: "Video Editing", desc: "Engaging visuals for social media, ads, and brand storytelling." },
  { icon: ImageIcon, title: "Graphic Design", desc: "Brand-aligned visuals that elevate your identity." },
];

// Projects
const projects = [
  { img: faceguard, title: "FaceGuard UI/UX", category: "Design", link: "/projects/faceguard" },
  { img: ransomware, title: "Ransomware Awareness", category: "Web", link: "/projects/ransomware" },
  { img: Epicnexus, title: "Epic Nexus App", category: "App", link: "/projects/epic-nexus" },
];

// Internships
const internships = [
  { img: webDevelopment, title: "Web Development Intern", link: "/internships/web-dev" },
  { img: responsiveDesign, title: "UI/UX Design Intern", link: "/internships/ui-ux" },
  { img: contentStrategy, title: "Content & Strategy Intern", link: "/internships/content-strategy" },
];

const Home = () => {
  return (
    <div className="bg-white">
      {/* ====== HERO SECTION ====== */}
      <section className="relative text-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-gray-900 to-black z-0"></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10 py-20 text-center">
          <p
            className="uppercase tracking-widest text-sm md:text-base text-red-300 font-semibold mb-4"
            aria-label="Trusted by over 50 global clients"
          >
            Trusted by 50+ Global Clients
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-red-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Digital Excellence, Backed by Reviews
          </h1>
          <p className="text-lg md:text-xl font-light mb-10 text-gray-200 max-w-2xl mx-auto">
            We craft digital experiences that <strong>clients love</strong>. Rated <strong>5.0/5</strong> by 50+ satisfied partners.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/services"
              className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Explore Services
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              Get Free Consultation
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">5.0 Rating • 50+ Reviews</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">50+ Happy Clients</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== UPCOMING EVENTS (Enhanced) ====== */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="container mx-auto px-6 text-center max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full font-semibold text-lg mb-6 shadow-sm border border-purple-200">
              <Calendar className="w-5 h-5 text-purple-600" />
              Upcoming Events
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Free Webinars & Workshops</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Learn from industry experts, boost your skills, and stay ahead of the curve — all for free.
            </p>

            <Link
              to="/events"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              🚀 View All Events & Register
              <Calendar size={20} />
            </Link>

            <p className="text-sm text-gray-500 mt-6">
              1,000+ professionals attended in the last 6 months
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </section>

      {/* ====== STATS SECTION ====== */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "50+", label: "Happy Clients" },
              { icon: ProjectsIcon, value: "75+", label: "Projects Delivered" },
              { icon: UserCheck, value: "30+", label: "Experts" },
              { icon: Star, value: "5.0", label: "Client Rating" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Icon className="w-10 h-10 mx-auto text-red-600" />
                  <h3 className="text-4xl font-bold text-gray-900 mt-3">{stat.value}</h3>
                  <p className="text-gray-500 mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== SERVICES ====== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Expert solutions loved by clients across industries.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <AnimatedSection key={i} delay={0.1 * i}>
                <motion.div
                  className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  tabIndex="0"
                  aria-label={`${s.title}: ${s.desc}`}
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-red-100 rounded-lg text-red-600 mr-4">
                      <s.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{s.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{s.desc}</p>
                  <Link
                    to={`/services/${s.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-red-600 font-medium flex items-center hover:text-red-700 group"
                  >
                    Learn more
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CLIENT REVIEWS ====== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">What Clients Say</h2>
            <p className="text-lg text-center text-gray-600 mb-12">
              Real feedback from real clients — because your trust matters most.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <AnimatedSection key={i} delay={0.2 + i * 0.1}>
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className={idx < Math.round(t.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        aria-hidden="true"
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600 font-medium">{t.rating}/5</span>
                  </div>
                  <blockquote className="text-gray-700 italic mb-4">"{t.content}"</blockquote>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                      {t.name[0]}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-900">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-900 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
            >
              Read All Reviews <MessageCircle size={18} />
            </Link>
          </div>
        </div>
      </section>

  {/* ====== PROJECTS SHOWCASE ====== */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <AnimatedSection>
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Our Work</h2>
      <p className="text-lg text-center text-gray-600 mb-12">
        See how we’ve helped clients succeed with award-worthy digital solutions.
      </p>
    </AnimatedSection>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {projects.map((p, i) => (
        <AnimatedSection key={i} delay={0.2 + i * 0.1}>
          <div className="bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            <img
              src={p.img}
              alt={p.title}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                {p.category}
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-2">{p.title}</h3>
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  </div>
</section>

      {/* ====== WHY CHOOSE US ====== */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Why Choose Edizo?</h2>
            <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              We combine creativity, technology, and client satisfaction to deliver unmatched results.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "We respect your timeline and deliver on schedule — every time." },
              { icon: Shield, title: "100% Satisfaction", desc: "Your happiness is our priority. We revise until you're thrilled." },
              { icon: Target, title: "Results-Driven", desc: "We don’t just build — we optimize for growth, conversions, and impact." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={0.2 + i * 0.1}>
                <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ====== INTERNSHIPS ====== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Internships</h2>
            <p className="text-lg text-center text-gray-600 mb-12">
              Launch your career with hands-on experience at a top-rated digital agency.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {internships.map((item, i) => (
              <AnimatedSection key={i} delay={0.2 + i * 0.1}>
                <Link to={item.link} className="block">
                  <motion.div
                    className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    tabIndex="0"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <span className="text-red-600 font-medium inline-flex items-center hover:underline">
                        Learn More <ArrowRight size={16} className="ml-1" />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Be Our Next Success Story?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
              Join 50+ clients who trust us with their digital transformation.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Contact Us <ArrowRight size={20} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;