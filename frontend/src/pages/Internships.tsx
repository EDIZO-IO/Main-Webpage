import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Clock, Wifi, Home, ArrowRight, Star, Search } from 'lucide-react';

// Mock PageHeader and AnimatedSection for self-contained example
const PageHeader = ({ title, subtitle, backgroundImage, backgroundStyle }) => (
  <motion.div
    className="relative bg-cover bg-center py-20 text-white text-center rounded-lg shadow-lg"
    style={{ backgroundImage: `url(${backgroundImage})`, ...backgroundStyle }}
  >
    <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
    <div className="relative z-10 p-4">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h1>
      <p className="text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>
    </div>
  </motion.div>
);

const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, type: 'spring', stiffness: 120, damping: 15 }}
  >
    {children}
  </motion.div>
);

// Local image imports
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
import header from '../assets/background image/internship.png';

// Define the common "Why Choose EDIZO?" content
const whyChooseEdizoContent = [
  "100% Internship Certification",
  "Real-Time, Hands-On Project for Each Course",
  "Learn from Experienced Industry Mentors",
  "Placement Guidance & Portfolio Support",
  "Flexible Duration: 15 Days to 3 Months",
  "Paid Internship Opportunities",
  "Modes: Online & Offline",
];

// Define the common "Benefits" content
const commonBenefits = [
  "Gain In-Demand Industry Skills",
  "Build Strong Resume with Real-Time Projects",
  "Improve Communication & Team Collaboration",
  "Internship Certificate Recognized by Companies",
  "Opportunity to Work on Live Client Projects",
  "Boost Confidence for Interviews & Job Roles",
  "Get Exposure to Professional Tools & Platforms",
];

// Internship opportunity data
const internships = [
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    category: 'Design',
    mode: 'Online',
    image: webDesign,
    rating: 4.7,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
  {
    id: 'frontend-development',
    title: 'Frontend Development',
    category: 'Development',
    mode: 'Online',
    image: responsiveDesign,
    rating: 4.5,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
  {
    id: 'backend-development',
    title: 'Backend Development',
    category: 'Development',
    mode: 'Online',
    image: backEnd,
    rating: 4.6,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
  {
    id: 'hr-management',
    title: 'HR Management',
    category: 'HR',
    mode: 'Online',
    image: hrManager,
    rating: 4.2,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    category: 'Data Science',
    mode: 'Online',
    image: dataAnalytics,
    rating: 4.8,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
  {
    id: 'java-development',
    title: 'Java Development',
    category: 'Java',
    mode: 'Online',
    image: java,
    rating: 4.4,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
  {
    id: 'python-development',
    title: 'Python Programming',
    category: 'Python',
    mode: 'Online',
    image: python,
    rating: 4.6,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    category: 'Marketing',
    mode: 'Online',
    image: contentStrategy,
    rating: 4.3,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    category: 'AI/ML',
    mode: 'Online',
    image: aiAssistant,
    rating: 4.9,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
  {
    id: 'ai-with-chatgpt',
    title: 'AI with ChatGPT',
    category: 'AI/ML',
    mode: 'Online',
    image: aiChatgpt,
    rating: 4.8,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
  {
    id: 'web-development',
    title: 'Web Development',
    category: 'Development',
    mode: 'Online',
    image: webDevelopment,
    rating: 4.7,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
  {
    id: 'csharp',
    title: 'C-Sharp',
    category: 'C#',
    mode: 'Online',
    image: Csharp,
    rating: 4.5,
    whyChooseEdizo: whyChooseEdizoContent,
    benefits: commonBenefits,
  },
];

const Internships = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);

  const categories = ['All', ...new Set(internships.map(i => i.category))];

  const filteredInternships = internships.filter(i => {
    const matchesCategory = selectedCategory === 'All' || i.category === selectedCategory;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      i.title.toLowerCase().includes(search) ||
      i.id.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: 'spring',
        stiffness: 120,
        damping: 15,
      },
    }),
  };

  return (
    <>
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Inter Font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>
        {`
        body {
          font-family: 'Inter', sans-serif;
        }
        .container-custom {
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }
        `}
      </style>

      <PageHeader
        title={
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"
          >
            Internship Opportunities
          </motion.span>
        }
        subtitle={
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-white"
          >
            Jumpstart your career with real-world experience in a dynamic, innovative environment.
          </motion.span>
        }
        backgroundImage={header}
        backgroundStyle={{ y: backgroundY }}
      />

      <section className="section bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container-custom mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-8">
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Available Internships</h2>
                <div className="relative flex items-center w-full md:w-auto max-w-md">
                  <input
                    type="text"
                    placeholder="Search Internship Title..."
                    className="p-3 pl-10 rounded-full border border-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500 w-full shadow-sm bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ boxShadow: '0 0 10px rgba(255, 0, 0, 0.1)' }}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600" size={20} />
                </div>
              </div>
              {/* Category Filter Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {categories.map(category => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                Apply for one of our internship programs and gain valuable experience working with industry experts on real projects.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredInternships.map((internship, index) => (
              <motion.div
                key={internship.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="group rounded-xl shadow-lg border border-red-600/20 bg-white hover:shadow-2xl hover:border-red-200 transition-all duration-300 cursor-pointer"
                whileHover={{ rotateX: 2, rotateY: 2, scale: 1.035 }}
                style={{ perspective: 1000, boxShadow: '0 0 15px rgba(255, 0, 0, 0.1)' }}
              >
                <Link to={`/internships/${internship.id}`}>
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={internship.image}
                      alt={internship.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                        {internship.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-1 line-clamp-2 bg-gradient-to-r from-red-600 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                      {internship.title}
                    </h3>
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-500 mr-2">
                        {[...Array(Math.floor(internship.rating))].map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" stroke="none" />
                        ))}
                        {internship.rating % 1 !== 0 && (
                          <Star size={16} fill="url(#half-star)" stroke="none" />
                        )}
                        <svg width="0" height="0" className="absolute">
                          <linearGradient id="half-star">
                            <stop offset="50%" stopColor="#facc15" />
                            <stop offset="50%" stopColor="#d1d5db" />
                          </linearGradient>
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm font-semibold">{internship.rating}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        {internship.mode === 'Online' ? (
                          <>
                            <Wifi className="mr-1 text-red-600" size={16} />
                            <span className="text-gray-700">Online</span>
                          </>
                        ) : (
                          <>
                            <Home className="mr-1 text-red-600" size={16} />
                            <span className="text-gray-700">Offline</span>
                          </>
                        )}
                      </div>
                    </div>
                    <motion.div
                      className="border-t border-gray-200 pt-3"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <span className="text-red-600 font-semibold hover:underline flex items-center justify-between">
                        Explore More <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Internships;