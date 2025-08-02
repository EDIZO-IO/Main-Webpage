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
    animate: { transition: { staggerChildren: 0.25 } },
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 15 },
    },
    hover: {
      scale: 1.03,
      boxShadow: '0px 12px 30px rgba(0,0,0,0.15)',
      transition: { duration: 0.2 },
    },
  };

  // Define service data with new professional gradient properties
  const homeServices = [
    { title: 'UI/UX Design', icon: <PenTool />, image: uiuxImg, link: '/services/ui-ux', gradient: 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200' },
    { title: 'Video Editing', icon: <Video />, image: videoImg, link: '/services/video-editing', gradient: 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200' },
    { title: 'Graphic Design', icon: <ImageIcon />, image: graphicImg, link: '/services/graphic-design', gradient: 'bg-gradient-to-br from-green-50 via-green-100 to-green-200' },
    { title: 'Web Development', icon: <Code />, image: webDevImg, link: '/services/web-development', gradient: 'bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200' },
    { title: 'App Design', icon: <Smartphone />, image: appDesignImg, link: '/services/app-design', gradient: 'bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200' },
  ];

  // Define project data with updated professional gradient properties
  const homeProjects = [
    { title: 'AI-Based Ransomware Detection System', shortDescription: 'An AI system for detecting and preventing ransomware attacks in real-time', image: ransomware, link: '/projects/s', gradient: 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300' }, // Silver/gray
    { title: 'FaceGuard-GAN Deepfake Detection', shortDescription: 'GAN-powered solution for detecting manipulated facial images and videos', image: faceguard, link: '/projects/ecommerce-automation', gradient: 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300' }, // Slate metallic
    { title: 'Epic Nexus Gaming Community Platform', shortDescription: 'Comprehensive gaming community platform with social features and reviews', image: Epicnexus, link: '/projects/faceguard-gan', gradient: 'bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300' }, // Zinc metallic
  ];

  return (
    <>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-50 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ loop: Infinity, duration: 2, ease: 'linear' }}
            className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"
          />
        </motion.div>
      )}

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

  {/* Optional dark overlay */}
  <div className="absolute inset-0 bg-black/60 z-0" /> {/* Slightly darker overlay for better text contrast */}

  {/* Hero Content */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 1 }}
    className="container-custom relative z-10 text-white text-center"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-center">
      <div className="w-full">
        {/* Applied professional gradient to the main heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-white via-[#E5E7EB] to-[#DC2626] bg-clip-text text-transparent">
          Welcome to <span className="text-red-600">EDIZO</span>
        </h1>
        <p className="text-lg md:text-xl text-white mb-8 max-w-lg mx-auto">
          Creative Services & Real-World Learning — All in One Place
        </p>
        <p className="text-lg md:text-xl text-white mb-8 max-w-xl mx-auto">
          Get premium <span className="text-red-600 font-bold">video editing</span>,
          <span className="text-red-600 font-bold"> graphic design</span>, and
          <span className="text-red-600 font-bold"> web development services</span>.<br />
          Launch your career with our exclusive<span className="text-red-600 font-bold"> internship programs.</span>
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="primary" size="lg" to="/services">
            Explore Services
          </Button>
          <Button variant="outline" size="lg" to="/contact">
            Get in Touch
          </Button>
        </div>
      </div>
    </div>

    {/* Scroll down icon */}
    <motion.div
      animate={{ y: [0, 12, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white hidden md:block"
    >
      <ChevronDown className="w-10 h-10" />
    </motion.div>
  </motion.div>
</section>


      {/* Services Section */}
      <section className="section bg-white py-20">
        <div className="container-custom">
          <AnimatedSection>
            <div className="text-center mb-16">
              {/* Applied professional gradient to the services heading */}
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-[#1F2937] via-[#4B5563] to-[#DC2626] bg-clip-text text-transparent">
                Our Premium Services
              </h2>
              <p className="text-lg text-[#4B5563] max-w-3xl mx-auto">
                High-quality services designed to elevate your digital presence and drive business growth.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-12">
            {homeServices.map((service, i) => (
              <div key={i} className={`card p-6 rounded-xl hover:shadow-2xl transition-all duration-300 group ${service.gradient}`}>
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-55 object-cover rounded-lg mb-4 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md"
                />
                <div className="bg-red-500 rounded-full w-14 h-14 flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300 mx-auto">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-[#1F2937]">{service.title}</h3> {/* Dark text for title */}
                <div className="text-center">
                  {/* Applied professional gradient to the learn more links */}
                  <Link to={service.link} className="inline-flex items-center font-medium hover:underline bg-gradient-to-r from-[#4B5563] to-[#DC2626] bg-clip-text text-transparent">
                    Learn more <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <AnimatedSection delay={0.4}>
            <div className="text-center mt-12">
              <Button variant="primary" to="/services">
                View All Services
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section bg-white py-20">
        <div className="container-custom">
          <AnimatedSection>
            <motion.h2
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 10 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-[#1F2937] via-[#4B5563] to-[#DC2626] bg-clip-text text-transparent"
            >
              Featured Projects
            </motion.h2>
            <p className="text-lg text-[#4B5563] max-w-2xl mx-auto text-center">
              A glimpse into some of our most impactful and innovative work, crafted to solve real-world challenges.
            </p>
          </AnimatedSection>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          >
            {homeProjects.map((project, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transition: { duration: 0.3 } }}
                className={`rounded-xl overflow-hidden shadow-lg group transition-all duration-300 ${project.gradient}`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="p-6">
                  {/* Applied professional gradient to the project titles */}
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-red-500 transition-colors duration-300 bg-gradient-to-r from-[#1F2937] to-[#4B5563] bg-clip-text text-transparent">
                    {project.title}
                  </h3>
                  <p className="text-[#4B5563] mb-4">{project.shortDescription}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection delay={0.4}>
            <div className="text-center mt-12">
              <Button variant="primary" to="/projects">
                View All Projects
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Internship Section */}
      <section className="section bg-gradient-to-r from-gray-100 to-gray-50 py-20">
        <div className="container-custom">
          <AnimatedSection>
            <div>
              {/* Applied professional gradient to the internship heading */}
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#1F2937] via-[#4B5563] to-[#DC2626] bg-clip-text text-transparent">Join Our Internship Program</h2>
              <p className="text-lg text-[#4B5563] mb-6">
                  Gain real-world experience working with industry experts in a fast-paced, innovative environment.
              </p>
              <ul className="space-y-4 mb-6">
                  {/* Applied professional gradient to the list items */}
                  <li className="flex items-start text-[#1F2937]"><Star className="text-red-500 mr-2 mt-1 flex-shrink-0" size={16} /><span>Hands-on training with cutting-edge technologies</span></li>
                  <li className="flex items-start text-[#1F2937]"><Star className="text-red-500 mr-2 mt-1 flex-shrink-0" size={16} /><span>Mentorship from industry professionals</span></li>
                  <li className="flex items-start text-[#1F2937]"><Star className="text-red-500 mr-2 mt-1 flex-shrink-0" size={16} /><span>Opportunity to work on real client projects</span></li>
                  <li className="flex items-start text-[#1F2937]"><Star className="text-red-500 mr-2 mt-1 flex-shrink-0" size={16} /><span>Potential for full-time employment</span></li>
              </ul>
              <Button variant="primary" to="/internships">
                  Browse Opportunities
              </Button>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.05, boxShadow: '0px 12px 30px rgba(0,0,0,0.2)' }}
              // Applied a subtle professional gradient background to the internship card
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
              <p className="text-[#4B5563] text-sm">Explore internship roles.</p>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Home;
