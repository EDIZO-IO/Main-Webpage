import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Star,
  ArrowRight,
  PenTool,
  Video,
  ImageIcon,
  Code,
  Briefcase,
  Smartphone,
  Users, // Import Users icon for Clients count
  Briefcase as ProjectsIcon, // Using Briefcase icon for projects
  UserCheck, // Import UserCheck for team members
  Calendar // NEW: Import Calendar icon for Upcoming Events
} from 'lucide-react';

// Custom Components
import Button from '../components/common/Button';



// Project Images
import faceguard from '../assets/project/face-Guard.png';
import ransomware from '../assets/project/Ransomware.png';
import Epicnexus from '../assets/project/Epic-nexus.png';

// Internship Images
import webDesign from '../assets/images/web-design.png';
import responsiveDesign from '../assets/images/responsive-design.png';
import backEnd from '../assets/images/back-end.png';
import hrManager from '../assets/images/hr-manager.png';
import dataAnalytics from '../assets/images/data-Analystics.png';
import java from '../assets/images/java.png';
import python from '../assets/images/AI with CHATGPT.png';
import contentStrategy from '../assets/images/content-strategy.png';
import aiAssistant from '../assets/images/ai-assistant.png';
import aiChatgpt from '../assets/images/AI with CHATGPT.png';
import webDevelopment from '../assets/images/web-development.png';
import Csharp from '../assets/images/c-sharp.png';

// Placeholder for AnimatedSection component
const AnimatedSection = ({ children, delay = 0.1 }) => {
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};


// Custom component for animated typing text
const AnimatedTypingText: React.FC<{ phrases: string[] }> = ({ phrases }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[phraseIndex];
      const currentLength = displayedText.length;
      const fullLength = currentPhrase.length;

      // Handle typing
      if (!isDeleting) {
        if (currentLength < fullLength) {
          setDisplayedText(currentPhrase.substring(0, currentLength + 1));
          setTypingSpeed(100 + Math.random() * 50);
        } else {
          // Pause at the end of the phrase, then start deleting
          setTimeout(() => setIsDeleting(true), 1500);
        }
      }
      // Handle deleting
      else {
        if (currentLength > 0) {
          setDisplayedText(currentPhrase.substring(0, currentLength - 1));
          setTypingSpeed(50);
        } else {
          // Done deleting, move to the next phrase
          setIsDeleting(false);
          setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
          setTypingSpeed(150);
        }
      }
    };

    const typingTimer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimer);
  }, [displayedText, isDeleting, phraseIndex, typingSpeed, phrases]);

  return <span className="text-yellow-400 font-extrabold">{displayedText}</span>;
};

// Data for the animated stats section
const stats = [
  { value: 10, label: 'Clients', icon: Users },
  { value: 20, label: 'Projects', icon: ProjectsIcon },
  { value: 25, label: 'Team Members', icon: UserCheck },
];

// Data for Services
const services = [
  { icon: PenTool, title: 'UI/UX Design', description: 'Crafting intuitive and engaging user interfaces.' },
  { icon: Video, title: 'Video Editing', description: 'Professional editing to bring your story to life.' },
  { icon: ImageIcon, title: 'Graphic Design', description: 'Visually stunning designs for a strong brand identity.' },
  { icon: Code, title: 'Web Development', description: 'Building fast, responsive, and robust websites.' },
  { icon: Smartphone, title: 'App Development', description: 'Creating seamless and innovative mobile experiences.' },
];

const Home = () => {
  const [loading, setLoading] = useState(false); // Set to false to remove the loader

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-white">
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-white z-50"
          >
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
{/* Hero Section with Live Website Preview */}
<section className="bg-gray-900 text-white py-20 md:py-32 relative overflow-hidden">
  <div className="absolute inset-0 z-0 overflow-hidden">
    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
      <source src="/assets/videos/hero.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-black opacity-50"></div>
  </div>
  
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
    <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Transforming Ideas Into <br />
        <AnimatedTypingText phrases={['Digital Reality.', 'Visual Masterpieces.', 'Business Growth.']} />
      </motion.h1>
      <motion.p
        className="text-lg md:text-xl font-light mb-6 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Edizo delivers exceptional digital solutions with a 100% client satisfaction rate across 50+ successful projects.
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Link
          to="/services"
          className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 text-center"
        >
          Explore Services
        </Link>
        {/* <Link
          to="/portfolio"
          className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 text-center"
        >
          View Portfolio
        </Link> */}
      </motion.div>
    </div>
    <div className="md:w-1/2 flex justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-yellow-500 rounded-2xl blur-md opacity-75"></div>
        <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20 overflow-hidden">
          {/* Website Preview Frame */}
          <div className="relative h-80 w-full bg-white">
            <div className="absolute inset-0 overflow-hidden">
              <iframe 
                src="https://edizo.in" 
                className="w-full h-full border-0"
                title="Edizo Website Preview"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute top-2 left-2 flex space-x-1">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>  
</section>

{/* Updated Stats Section with Real Metrics */}
<section className="bg-white py-12 md:py-20">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      <motion.div
        className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <Users className="mx-auto text-red-600 mb-2 w-10 h-10" />
        <h3 className="text-3xl font-bold text-gray-900">50+</h3>
        <p className="text-gray-500">Satisfied Clients</p>
      </motion.div>
      <motion.div
        className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <ProjectsIcon className="mx-auto text-red-600 mb-2 w-10 h-10" />
        <h3 className="text-3xl font-bold text-gray-900">75+</h3>
        <p className="text-gray-500">Projects Completed</p>
      </motion.div>
      <motion.div
        className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <UserCheck className="mx-auto text-red-600 mb-2 w-10 h-10" />
        <h3 className="text-3xl font-bold text-gray-900">30+</h3>
        <p className="text-gray-500">Expert Team Members</p>
      </motion.div>
      <motion.div
        className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Star className="mx-auto text-red-600 mb-2 w-10 h-10" />
        <h3 className="text-3xl font-bold text-gray-900">100%</h3>
        <p className="text-gray-500">Client Satisfaction</p>
      </motion.div>
    </div>
  </div>
</section>

{/* Simplified Services Section */}
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Our Digital Services
      </motion.h2>
      <motion.p
        className="text-lg text-gray-600"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
      >
        Professional solutions tailored to your business requirements
      </motion.p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          icon: PenTool,
          title: "UI/UX Design",
          description: "Create intuitive user experiences with our human-centered design approach that increases engagement and conversions"
        },
        {
          icon: Code,
          title: "Web Development",
          description: "Build high-performance websites with modern technologies like React, Next.js and headless CMS solutions"
        },
        {
          icon: Smartphone,
          title: "App Development",
          description: "Develop cross-platform mobile applications with React Native and Flutter for seamless user experiences"
        },
        {
          icon: Video,
          title: "Video Production",
          description: "Professional video editing and motion graphics for commercials, social media and corporate communications"
        },
        {
          icon: ImageIcon,
          title: "Graphic Design",
          description: "Visually compelling designs that strengthen brand identity across all marketing channels"
        },
        {
          icon: Briefcase,
          title: "Digital Marketing",
          description: "Data-driven strategies to enhance your online presence and drive measurable business growth"
        }
      ].map((service, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="p-8">
            <div className="flex items-center mb-5">
              <div className="p-3 bg-red-100 rounded-lg text-red-600 mr-4">
                <service.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
            </div>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <Link
              to={`/services/${service.title.toLowerCase().replace(' ', '-')}`}
              className="text-red-600 font-medium flex items-center hover:text-red-700"
            >
              Learn more <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>


            {/* NEW: Upcoming Events Section */}
            <section className="py-20 bg-gray-100 text-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
                  <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Join us for our upcoming workshops, webinars, and more!
                  </p>
                  <Link
                    to="/events"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold text-lg text-white bg-red-600 rounded-full shadow-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    View All Events
                    <Calendar size={20} />
                  </Link>
                </AnimatedSection>
              </div>
            </section>

            {/* Internship Section */}
            <section className="py-20 bg-gray-50 text-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection delay={0.1}>
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Internships</h2>
                    <p className="text-lg text-gray-600 mb-8">
                      We're looking for passionate individuals to join our team. Explore our internship programs and kickstart your career.
                    </p>
                    <motion.div
                      className="inline-block"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Link
                        to="/internships"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold text-lg text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-900 transform hover:scale-105 transition-all duration-300 ease-in-out"
                      >
                        Explore Internships
                        <Briefcase size={20} />
                      </Link>
                    </motion.div>
                  </div>
                </AnimatedSection>
              </div>
            </section>

            {/* Why Choose Edizo Section */}
            <section className="py-20 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Why Choose Us?</h2>
                </AnimatedSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left mt-8">
                  <AnimatedSection delay={0.2}>
                    <motion.div
                      className="bg-red-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <h3 className="text-xl font-bold text-red-600 mb-2">Creative & Custom Solutions</h3>
                      <p className="text-gray-600">We don't believe in one-size-fits-all. Our services are tailored to your unique vision, ensuring your project stands out.</p>
                    </motion.div>
                  </AnimatedSection>
                  <AnimatedSection delay={0.3}>
                    <motion.div
                      className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <h3 className="text-xl font-bold text-blue-600 mb-2">Affordable & Transparent Pricing</h3>
                      <p className="text-gray-600">Quality work doesn’t have to break the bank. We offer competitive and transparent pricing with no hidden fees.</p>
                    </motion.div>
                  </AnimatedSection>
                  <AnimatedSection delay={0.4}>
                    <motion.div
                      className="bg-green-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <h3 className="text-xl font-bold text-green-600 mb-2">Professional & Dedicated Team</h3>
                      <p className="text-gray-600">Our team is passionate about what they do. We are committed to delivering high-quality results on time, every time.</p>
                    </motion.div>
                  </AnimatedSection>
                </div>
              </div>
            </section>

            {/* Section for Internship Cards */}
            <section className="bg-gray-50 py-20">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Internships</h2>
                </AnimatedSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Internship Card 1 */}
                  <AnimatedSection delay={0.2}>
                    <motion.div
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transform hover:scale-105 transition-all duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <div className="flex justify-center mb-4">
                        <img src={webDevelopment} alt="Web Development" className="rounded-full w-24 h-24 object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Web Development Intern</h3>
                      <p className="text-gray-600 text-center text-sm mb-4">Gain hands-on experience in frontend and backend development with our expert team.</p>
                      <div className="flex justify-center">
                        <Link to="/internships/web-dev" className="inline-block px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors">
                          Learn More
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                  {/* Internship Card 2 */}
                  <AnimatedSection delay={0.3}>
                    <motion.div
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transform hover:scale-105 transition-all duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <div className="flex justify-center mb-4">
                        <img src={responsiveDesign} alt="UI/UX Design" className="rounded-full w-24 h-24 object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">UI/UX Design Intern</h3>
                      <p className="text-gray-600 text-center text-sm mb-4">Learn to create intuitive user interfaces and experiences that delight users.</p>
                      <div className="flex justify-center">
                        <Link to="/internships/ui-ux" className="inline-block px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors">
                          Learn More
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                  {/* Internship Card 3 */}
                  <AnimatedSection delay={0.4}>
                    <motion.div
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 transform hover:scale-105 transition-all duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <div className="flex justify-center mb-4">
                        <img src={contentStrategy} alt="Graphic Design" className="rounded-full w-24 h-24 object-cover" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Graphic Design Intern</h3>
                      <p className="text-gray-600 text-center text-sm mb-4">Develop your creative skills and contribute to stunning visual campaigns.</p>
                      <div className="flex justify-center">
                        <Link to="/internships/graphic-design" className="inline-block px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors">
                          Learn More
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                </div>
              </div>
            </section>

            {/* Project showcase section (start) */}
            <section className="bg-gray-100 py-20">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Our Recent Projects</h2>
                  <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Take a look at some of the amazing projects we've completed for our clients.
                  </p>
                </AnimatedSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Project Card 1 */}
                  <AnimatedSection delay={0.2}>
                    <motion.div
                      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <img src={faceguard} alt="FaceGuard" className="w-full h-48 object-cover" />
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">FaceGuard UI/UX</h3>
                        <p className="text-gray-600 text-sm">A modern and intuitive design for a security application.</p>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                  {/* Project Card 2 */}
                  <AnimatedSection delay={0.3}>
                    <motion.div
                      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <img src={ransomware} alt="Ransomware project" className="w-full h-48 object-cover" />
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ransomware Website</h3>
                        <p className="text-gray-600 text-sm">A comprehensive website for a cybersecurity awareness project.</p>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                  {/* Project Card 3 */}
                  <AnimatedSection delay={0.4}>
                    <motion.div
                      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <img src={Epicnexus} alt="Epic Nexus" className="w-full h-48 object-cover" />
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Epic Nexus App</h3>
                        <p className="text-gray-600 text-sm">Developing a full-stack application for modern-day business needs.</p>
                      </div>
                    </motion.div>
                  </AnimatedSection>
                </div>
              </div>
            </section>

            {/* Why Join Us Section (Text-based with icons) */}
            <section className="bg-white py-20">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Why Choose Edizo?</h2>
                </AnimatedSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <AnimatedSection delay={0.2}>
                    <motion.div
                      className="bg-gray-100 rounded-xl p-8 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <div className="p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 bg-red-100 text-red-600">
                        <PenTool size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Innovative Designs</h3>
                      <p className="text-gray-600 text-sm">We provide cutting-edge designs that are both functional and aesthetically pleasing.</p>
                    </motion.div>
                  </AnimatedSection>
                  {/* Card 2 */}
                  <AnimatedSection delay={0.3}>
                    <motion.div
                      className="bg-gray-100 rounded-xl p-8 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <div className="p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 bg-red-100 text-red-600">
                        <Code size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Development</h3>
                      <p className="text-gray-600 text-sm">Our development team builds robust and scalable solutions that meet your needs.</p>
                    </motion.div>
                  </AnimatedSection>
                  {/* Card 3 */}
                  <AnimatedSection delay={0.4}>
                    <motion.div
                      className="bg-gray-100 rounded-xl p-8 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow duration-300"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.5 }}
                      variants={variants}
                    >
                      <div className="p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 bg-red-100 text-red-600">
                        <Briefcase size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Portfolio Building</h3>
                      <p className="text-gray-600 text-sm">Explore exciting internships tailored to your skills and aspirations. Get hands-on experience and build your professional portfolio from day one.</p>
                    </motion.div>
                  </AnimatedSection>
                </div>
              </div>
            </section>

            {/* Call to Action Section (Contact) */}
            <section className="py-20 text-center bg-gradient-to-r from-red-600 to-purple-800 text-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
                  <p className="text-lg mb-8 max-w-2xl mx-auto">
                    Let's build something amazing together. Contact us today for a free consultation.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold text-lg text-gray-900 bg-yellow-400 rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 ease-in-out"
                  >
                    Contact Us
                    <ArrowRight size={20} />
                  </Link>
                </AnimatedSection>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Home;
