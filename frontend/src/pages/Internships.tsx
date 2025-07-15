import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Wifi, Home, ArrowRight, Star } from 'lucide-react'; // Added Star for ratings
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';

import header from '../assets/background image/internship.png';

// Import local images
import webDesign from '../assets/images/web-design.png';
import responsiveDesign from '../assets/images/responsive-design.png';
import backEnd from '../assets/images/back-end.png';
import hrManager from '../assets/images/hr-manager.png';
import dataAnalytics from '../assets/images/data-Analystics.png';
import java from '../assets/images/java.png';
import python from '../assets/images/python.png';
import contentStrategy from '../assets/images/content-strategy.png';
import aiAssistant from '../assets/images/ai-assistant.png';
import aiChatgpt from '../assets/images/AI with CHATGPT.png';
import webDevelopment from '../assets/images/web-development.png';
import Csharp from '../assets/images/c-sharp.png';

// Internship opportunity data
const internships = [
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Work alongside our design team to create beautiful, intuitive user interfaces and improve user experiences.',
    image: webDesign,
    rating: 4.7, // Added rating
    // students: '12,500', // Added students enrolled
    // company: 'InnovateTech Solutions', // Added company
    // priceINR: 4500, // Removed price
  },
  {
    id: 'frontend-development',
    title: 'Frontend Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Develop responsive web applications using modern frontend technologies like React, Vue.js, and TypeScript.',
    image: responsiveDesign,
    rating: 4.5,
    students: '15,200',
    // company: 'WebCrafters Inc.',
    // priceINR: 4500, // Removed price
  },
  {
    id: 'backend-development',
    title: 'Backend Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Build scalable backend systems using Node.js, Django, or Spring Boot while working with databases and APIs.',
    image: backEnd,
    rating: 4.6,
    // students: '10,800',
    // company: 'ServerSide Innovations',
    // priceINR: 4500, // Removed price
  },
  {
    id: 'hr-management',
    title: 'HR Management Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Assist in recruitment, onboarding, employee engagement, and performance management tasks.',
    image: hrManager,
    rating: 4.2,
    // students: '8,100',
    // company: 'PeopleFirst HR',
    // priceINR: 4500, // Removed price
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Analyze datasets to uncover insights and support data-driven decisions using tools like Excel, SQL, and Python.',
    image: dataAnalytics,
    rating: 4.8,
    // students: '18,900',
    // company: 'Insightful Data Co.',
    // priceINR: 4500, // Removed price
  },
  {
    id: 'java-development',
    title: 'Java Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Learn enterprise-level Java development with frameworks like Spring Boot and Hibernate.',
    image: java,
    rating: 4.4,
    // students: '11,300',
    // company: 'Enterprise Java Hub',
    // priceINR: 4500, // Removed price
  },
  {
    id: 'python-development',
    title: 'Python Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Explore scripting, automation, and backend development using Python and related libraries.',
    image: python,
    rating: 4.6,
    // students: '14,000',
    // company: 'Pythonic Solutions',
    // priceINR: 4500, // Removed price
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Gain hands-on experience in SEO, content marketing, social media strategy, and campaign analytics.',
    image: contentStrategy,
    rating: 4.3,
    // students: '9,700',
    // company: 'GrowthMarketers',
    // priceINR: 4500, // Removed price
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Work on machine learning models, deep learning projects, and real-world AI use cases.',
    image: aiAssistant,
    rating: 4.9,
    // students: '20,100',
    // company: 'Cognitive AI Labs',
    // priceINR: 4500, // Removed price
  },
  {
    id: 'ai-with-chatgpt',
    title: 'AI with ChatGPT Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Explore natural language processing, chatbot development, and prompt engineering using GPT-based models.',
    image: aiChatgpt,
    rating: 4.8,
    // students: '17,600',
    // company: 'Conversational AI Co.',
    // priceINR: 4500, // Removed price
  },
  {
    id: 'web-development',
    title: 'Web Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Get practical experience building full-stack web applications using modern frameworks and tools.',
    image: webDevelopment,
    rating: 4.7,
    // students: '16,800',
    // company: 'FullStack Devs',
    // priceINR: 4500, // Removed price
  },
  {
    id: 'Csharp',
    title: 'C-Sharp Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    // description: 'Get practical experience building full-stack web applications using modern frameworks and tools.',
    image: Csharp,
    rating: 4.5,
    // students: '9,500',
    // company: '.NET Innovators',
    // priceINR: 4500, // Removed price
  },
];

const Internships: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <>
      <PageHeader
        title={<span className="text-red-500">Internship Opportunities</span>}
        subtitle={<span className="text-white">Jumpstart your career with real-world experience in a dynamic, innovative environment.</span>}
        backgroundImage={header}
      />
      <section className="section bg-gray-100 py-16">
        <div className="container-custom mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Available Internships</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Apply for one of our internship programs and gain valuable experience working with industry experts on real projects.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {internships.map((internship, index) => (
              <motion.div
                key={internship.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <Link to={`/internships/${internship.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={internship.image}
                      alt={internship.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/300x180/E0E0E0/666666?text=${encodeURIComponent('Image Error')}`;
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        {internship.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{internship.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">by {internship.company}</p>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">{internship.description}</p>

                    {/* Rating and Students Section */}
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
                      <span className="text-gray-500 text-sm ml-2">({internship.students} students)</span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        {internship.mode === 'Online' ? (
                          <>
                            <Wifi className="mr-1 text-red-500" size={16} />
                            <span>Online</span>
                          </>
                        ) : (
                          <>
                            <Home className="mr-1 text-red-500" size={16} />
                            <span>Offline</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 text-red-500" size={16} />
                        <span>{internship.duration}</span>
                      </div>
                    </div>

                    {/* Price Section - Removed */}
                    {/* {internship.category === 'Paid' && (
                      <div className="mb-3">
                        <span className="text-xl font-bold text-gray-900">₹{internship.priceINR}</span>
                      </div>
                    )} */}

                    <div className="border-t border-gray-200 pt-3">
                      <span
                        className="text-red-600 font-medium hover:underline flex items-center justify-between"
                      >
                        Explore More <ArrowRight className="ml-1 w-4 h-4" />
                      </span>
                    </div>
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
