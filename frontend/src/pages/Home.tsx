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
} from 'lucide-react';

// Custom Components
import AnimatedSection from '../components/common/AnimatedSection';
import Button from '../components/common/Button';

// Service Images
import uiuxImg from '../assets/services/uiux.webp';
import videoImg from '../assets/services/video editing.webp';
import graphicImg from '../assets/services/graphic design.webp';
import webDevImg from '../assets/services/website design.webp';
import appDesignImg from '../assets/services/app design.webp';

// Project Images
import faceguard from '../assets/project/face-Guard.png';
import ransomware from '../assets/project/Ransomware.png';
import Epicnexus from '../assets/project/Epic-nexus.png';

// Custom component for animated typing text
const AnimatedTypingText: React.FC<{ phrases: string[] }> = ({ phrases }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const currentPhrase = phrases[phraseIndex];
      const currentSpeed = isDeleting ? 75 : 150;

      if (isDeleting) {
        if (displayedText.length > 0) {
          setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
          setTypingSpeed(currentSpeed);
        } else {
          setIsDeleting(false);
          setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
          setTypingSpeed(150);
        }
      } else {
        if (displayedText.length < currentPhrase.length) {
          setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
          setTypingSpeed(currentSpeed);
        } else {
          setTypingSpeed(2000);
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, phraseIndex, phrases, typingSpeed]);

  return (
    <span className="relative font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-300">
      {displayedText}
      {/* Blinking cursor animation */}
      <span className="absolute right-0 bottom-0 -mr-2 w-1 h-full bg-red-600 animate-pulse-cursor" />
      <style jsx>{`
        .animate-pulse-cursor {
          animation: pulse-cursor 1s infinite;
        }
        @keyframes pulse-cursor {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </span>
  );
};

// Define animation variants for card hover effect
const cardVariants = {
  initial: { y: 0 },
  whileHover: {
    y: -5,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    transition: { type: "spring", stiffness: 300 }
  }
};

// New custom button component for a more attractive "view all" link
const ActionLinkButton: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link
    to={to}
    className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-lg
               bg-gradient-to-r from-red-500 to-purple-600 text-white rounded-full shadow-lg
               hover:from-red-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
  >
    {children}
    <ArrowRight size={20} />
  </Link>
);


const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.2 } },
  };

  // Define service data with images and icons
  const services = [
    { title: 'UI/UX Design', description: 'Creating intuitive and beautiful user interfaces.', icon: <PenTool className="text-blue-500 mb-3" size={40} />, image: uiuxImg },
    { title: 'Video Editing', description: 'Transforming raw footage into engaging stories.', icon: <Video className="text-red-500 mb-3" size={40} />, image: videoImg },
    { title: 'Graphic Design', description: 'Crafting stunning visuals for your brand.', icon: <ImageIcon className="text-green-500 mb-3" size={40} />, image: graphicImg },
    { title: 'Web Development', description: 'Building fast, responsive, and robust websites.', icon: <Code className="text-purple-500 mb-3" size={40} />, image: webDevImg },
  ];

  return (
    <div className="bg-gray-50 text-gray-800">
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50"
          >
            <div className="w-16 h-16 border-4 border-edizo-red border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
{/* Hero Section with Video Background */}
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Background video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover z-0"
  >
    <source src="/assets/videos/hero.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Professional gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/70 z-0" />
  <div className="absolute inset-0 bg-black/25 z-0" />

  {/* Hero Content */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 1 }}
    className="container-custom relative z-10 text-white text-center"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-center">
      <div className="w-full">
        {/* Professional main heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-2xl">
          <span className="text-slate-100 font-bold">Welcome to</span>{" "}
          <span className="bg-gradient-to-r from-red-800 via-red-600 to-red-500 bg-clip-text text-transparent">
            EDIZO
          </span>
        </h1>

        {/* Professional subheading */}
        <h2 className="text-xl md:text-2xl font-semibold mb-6 max-w-lg mx-auto h-12">
          <div className="text-slate-200 drop-shadow-lg font-medium">
            <AnimatedTypingText phrases={['Creative Services', 'Real-World Learning', 'All in One Place']} />
          </div>
        </h2>

        {/* Professional paragraph */}
        <AnimatedSection delay={1.4}>
          <p className="text-lg md:text-2xl mb-8 max-w-xl mx-auto leading-relaxed drop-shadow-lg">
            <span className="text-slate-100 font-semibold">Get premium</span>{" "}
            <span className="text-red-600 font-semibold">video editing</span>,{" "}
            <span className="text-red-600 font-semibold">graphic design</span>,{" "}
            <span className="text-slate-100 font-semibold">and</span>{" "}
            <span className="text-red-600 font-semibold">web development services</span>.<br />
            <span className="text-slate-200 font-medium">Launch your career with our exclusive</span>{" "}
            <span className="text-red-600 font-semibold">internship programs</span>.
          </p>
        </AnimatedSection>

        {/* Button group with 3D Upcoming Events */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            to="/services"
            className="bg-red-600 hover:bg-red-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
          >
            Explore Services
          </Button>
          <Button
            variant="outline"
            size="lg"
            to="/contact"
            className="border-2 border-slate-300 text-slate-100 hover:bg-slate-100 hover:text-slate-900 shadow-lg transition-all duration-300"
          >
            Get in Touch
          </Button>
          {/* 3D Elevated Button */}
          <Link
            to="/events"
            className="group relative inline-flex items-center gap-3 px-8 py-4
              bg-gradient-to-b from-yellow-400 to-yellow-600
              text-gray-900 font-bold rounded-xl
              shadow-lg hover:shadow-xl
              transform hover:-translate-y-2 hover:rotate-1
              transition-all duration-300 ease-out"
            style={{
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-xl"
            >
              🎯
            </motion.div>
            <span>Upcoming Events</span>
            {/* 3D shadow effect */}
            <div className="absolute inset-0 bg-yellow-600/50 rounded-xl
              translate-y-2 -z-10 group-hover:translate-y-3
              transition-transform duration-300"></div>
          </Link>
        </div>
      </div>
    </div>

    {/* Professional scroll indicator */}
    <motion.div
      animate={{ y: [0, 12, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white hidden md:block"
    >
      <div className="bg-slate-100/20 rounded-full p-3 backdrop-blur-sm border border-slate-400/30">
        <ChevronDown className="w-6 h-6 text-slate-200" />
      </div>
    </motion.div>
  </motion.div>
</section>



            {/* About Us Section with updated content */}
            <section id="about" className="py-20 md:py-32">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection delay={0.1}>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      About <span className="text-edizo-red">Edizo</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      We are a full-stack digital agency specializing in UI/UX, web development, and brand storytelling. Our mission is to empower businesses with impactful digital experiences.
                    </p>
                  </div>
                </AnimatedSection>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <AnimatedSection delay={0.2}>
                    <motion.div variants={cardVariants} whileHover="whileHover" className="rounded-xl shadow-lg p-8 text-center bg-white border border-gray-200">
                      <Users className="text-edizo-red mx-auto mb-4" size={32} />
                      <h3 className="font-bold text-3xl mb-2 text-gray-900">30+ Clients</h3>
                      <p className="text-gray-600">We have successfully helped over 30 clients achieve their digital goals and grow their businesses.</p>
                    </motion.div>
                  </AnimatedSection>
                  <AnimatedSection delay={0.3}>
                    <motion.div variants={cardVariants} whileHover="whileHover" className="rounded-xl shadow-lg p-8 text-center bg-white border border-gray-200">
                      <ProjectsIcon className="text-edizo-red mx-auto mb-4" size={32} />
                      <h3 className="font-bold text-3xl mb-2 text-gray-900">70+ Projects</h3>
                      <p className="text-gray-600">Our team has delivered over 70 unique projects, each with a focus on innovation and quality.</p>
                    </motion.div>
                  </AnimatedSection>
                  <AnimatedSection delay={0.4}>
                    <motion.div variants={cardVariants} whileHover="whileHover" className="rounded-xl shadow-lg p-8 text-center bg-white border border-gray-200">
                      <UserCheck className="text-edizo-red mx-auto mb-4" size={34} />
                      <h3 className="font-bold text-2xl mb-2 text-gray-900">10+ Team Members</h3>
                      <p className="text-gray-600">A diverse and skilled team of over 10 professionals, dedicated to bringing your vision to life.</p>
                    </motion.div>
                  </AnimatedSection>
                  <AnimatedSection delay={0.5}>
                    <motion.div variants={cardVariants} whileHover="whileHover" className="rounded-xl shadow-lg p-8 text-center bg-white border border-gray-200">
                      <Star className="text-edizo-red mx-auto mb-4" size={29} />
                      <h3 className="font-bold text-xl mb-2">Our Values</h3>
                      <p className="text-gray-600">Creativity, integrity, collaboration, and a relentless pursuit of excellence in everything we do.</p>
                    </motion.div>
                  </AnimatedSection>
                </div>
              </div>
            </section>

            {/* Services Overview Section */}
            <section id="services" className="py-20 md:py-32 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <AnimatedSection delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Our <span className="text-edizo-red">Services</span>
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
                    We offer a wide range of services to help you build and grow your digital presence.
                  </p>
                </AnimatedSection>
                <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" variants={staggerContainer}>
                  {services.map((service, index) => (
                    <motion.div variants={fadeInUp} key={index} className="bg-gray-100 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        {service.icon}
                        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-gray-600">{service.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                <AnimatedSection delay={0.6}>
                  <div className="mt-12 flex justify-center">
                    <ActionLinkButton to="/services">
                      View All Services
                    </ActionLinkButton>
                  </div>
                </AnimatedSection>
              </div>
            </section>

            {/* Projects Overview Section */}
            <section id="projects" className="py-20 md:py-32">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <AnimatedSection delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Recent <span className="text-edizo-red">Projects</span>
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
                    Showcasing our best work and client success stories.
                  </p>
                </AnimatedSection>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatedSection delay={0.2}>
                    <motion.div
                      variants={cardVariants}
                      whileHover="whileHover"
                      className="rounded-xl shadow-xl border border-gray-200 bg-white p-8 flex flex-col items-center justify-center text-center"
                    >
                      <h3 className="font-bold text-xl text-blue-500 mb-2">AI Ransomware</h3>
                      <p className="text-gray-600 text-sm">AI-based detection system.</p>
                      <img src={ransomware} alt="AI Ransomware Detection" className="mt-4 rounded-lg w-full" />
                    </motion.div>
                  </AnimatedSection>
                  <AnimatedSection delay={0.3}>
                    <motion.div
                      variants={cardVariants}
                      whileHover="whileHover"
                      className="rounded-xl shadow-xl border border-gray-200 bg-white p-8 flex flex-col items-center justify-center text-center"
                    >
                      <h3 className="font-bold text-xl text-green-500 mb-2">FaceGuard-GAN</h3>
                      <p className="text-gray-600 text-sm">Deepfake detection platform.</p>
                      <img src={faceguard} alt="FaceGuard-GAN" className="mt-4 rounded-lg w-full" />
                    </motion.div>
                  </AnimatedSection>
                  <AnimatedSection delay={0.4}>
                    <motion.div
                      variants={cardVariants}
                      whileHover="whileHover"
                      className="rounded-xl shadow-xl border border-gray-200 bg-white p-8 flex flex-col items-center justify-center text-center"
                    >
                      <h3 className="font-bold text-xl text-purple-500 mb-2">Epic Nexus</h3>
                      <p className="text-gray-600 text-sm">Gaming Community Platform.</p>
                      <img src={Epicnexus} alt="Epic Nexus Platform" className="mt-4 rounded-lg w-full" />
                    </motion.div>
                  </AnimatedSection>
                </div>
                <AnimatedSection delay={0.6}>
                  <div className="mt-12 flex justify-center">
                    <ActionLinkButton to="/projects">
                      View All Projects
                    </ActionLinkButton>
                  </div>
                </AnimatedSection>
              </div>
            </section>
            
            {/* Internships Section (from original snippet) */}
            <section className="py-20 md:py-32 bg-gray-50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                <AnimatedSection delay={0.2}>
                  <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Student <span className="text-orange-500">Internship</span> Program
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                      Launch your career with hands-on experience in a dynamic and innovative environment.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 mb-8">
                      <li className="flex items-start">
                        <Star className="text-orange-500 mr-2 mt-1 flex-shrink-0" size={16} />
                        <span>Real-world project experience</span>
                      </li>
                      <li className="flex items-start">
                        <Star className="text-orange-500 mr-2 mt-1 flex-shrink-0" size={16} />
                        <span>Mentorship from industry experts</span>
                      </li>
                      <li className="flex items-start">
                        <Star className="text-orange-500 mr-2 mt-1 flex-shrink-0" size={16} />
                        <span>Flexible hours and remote opportunities</span>
                      </li>
                      <li className="flex items-start">
                        <Star className="text-orange-500 mr-2 mt-1 flex-shrink-0" size={16} />
                        <span>Potential for full-time employment</span>
                      </li>
                    </ul>
                    <ActionLinkButton to="/internships">
                      Browse Opportunities
                    </ActionLinkButton>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.3}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="whileHover"
                    className="rounded-xl shadow-xl w-72 h-auto border border-gray-200 backdrop-blur-md bg-gradient-to-br from-white via-[#E5E7EB] to-white p-8 flex flex-col items-center justify-center text-center"
                    style={{ perspective: 600, transformStyle: 'preserve-3d' }}
                  >
                    <motion.div
                      whileHover={{ rotateY: 10, rotateX: -10 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="mb-4"
                    >
                      <Briefcase className="h-12 w-12 text-orange-500" />
                    </motion.div>
                    <h3 className="font-bold text-xl text-orange-500 mb-2">Launch Your Career</h3>
                    <p className="text-[#4B5563] text-sm">Explore exciting internships tailored to your skills and aspirations. Get hands-on experience and build your professional portfolio from day one.</p>
                  </motion.div>
                </AnimatedSection>
              </div>
            </section>
            {/* Call to Action Section (Contact) */}
            <section className="py-20 text-center bg-gradient-to-r from-red-600 to-purple-800 text-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
                  <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
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
