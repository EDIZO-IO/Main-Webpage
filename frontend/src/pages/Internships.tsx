import React from 'react';
// Mock Link and motion for self-contained example
const Link = ({ to, children }) => <a href={to}>{children}</a>;
const motion = {
  // Modified mock to filter out framer-motion specific props
  div: ({ children, whileInView, viewport, ...props }) => <div {...props}>{children}</div>,
};

import { Clock, Wifi, Home, ArrowRight, Star, Search } from 'lucide-react'; // Added Star for ratings and Search for the input

// Mock PageHeader and AnimatedSection for self-contained example
const PageHeader = ({ title, subtitle, backgroundImage }) => (
  <div
    className="relative bg-cover bg-center py-20 text-white text-center rounded-lg shadow-lg"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
    <div className="relative z-10 p-4">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{title}</h1>
      <p className="text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>
    </div>
  </div>
);

const AnimatedSection = ({ children }) => <div className="animate-fade-in-up">{children}</div>;

// Local image imports - These would typically be handled by a bundler
// For this self-contained example, we'll use placeholder images or mock them if not directly available.
// In a real project, ensure these paths are correct.
import webDesign from '../assets/images/web-design.png';
import responsiveDesign from '../assets/images/responsive-design.png';
import backEnd from '../assets/images/back-end.png';
import hrManager from '../assets/images/hr-manager.png';
import dataAnalytics from '../assets/images/data-Analystics.png';
import java from '../assets/images/java.png';
import python from '../assets/images/AI with CHATGPT.png'; // Assuming this is also used for general Python
import contentStrategy from '../assets/images/content-strategy.png';
import aiAssistant from '../assets/images/ai-assistant.png';
import aiChatgpt from '../assets/images/AI with CHATGPT.png';
import webDevelopment from '../assets/images/web-development.png';
import Csharp from '../assets/images/c-sharp.png';
import header from '../assets/background image/internship.png';


// Original Internship opportunity data - ADDED keyTopics to each internship
const originalInternships = [
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: webDesign,
    rating: 4.7,
    company: 'InnovateTech Solutions',
    keyTopics: ['UI/UX Principles', 'Figma/Adobe XD', 'User Research'],
  },
  {
    id: 'frontend-development',
    title: 'Frontend Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: responsiveDesign,
    rating: 4.5,
    company: 'WebCrafters Inc.',
    keyTopics: ['React/Vue.js', 'HTML/CSS/JS', 'Responsive Design'],
  },
  {
    id: 'backend-development',
    title: 'Backend Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: backEnd,
    rating: 4.6,
    company: 'ServerSide Innovations',
    keyTopics: ['Node.js/Django', 'Databases', 'API Development'],
  },
  {
    id: 'hr-management',
    title: 'HR Management Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: hrManager,
    rating: 4.2,
    company: 'PeopleFirst HR',
    keyTopics: ['Recruitment', 'Onboarding', 'Employee Engagement'],
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: dataAnalytics,
    rating: 4.8,
    company: 'Insightful Data Co.',
    keyTopics: ['Data Analysis', 'SQL/Python', 'Data Visualization'],
  },
  {
    id: 'java-development',
    title: 'Java Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: java,
    rating: 4.4,
    company: 'Enterprise Java Hub',
    keyTopics: ['Java OOP', 'Spring Boot', 'Microservices'],
  },
  {
    id: 'python-development',
    title: 'Python Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: python,
    rating: 4.6,
    company: 'Pythonic Solutions',
    keyTopics: ['Python Scripting', 'Django/Flask', 'Automation'],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: contentStrategy,
    rating: 4.3,
    company: 'GrowthMarketers',
    keyTopics: ['SEO', 'Content Marketing', 'Social Media'],
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: aiAssistant,
    rating: 4.9,
    company: 'Cognitive AI Labs',
    keyTopics: ['ML Models', 'Deep Learning', 'AI Algorithms'],
  },
  {
    id: 'ai-with-chatgpt',
    title: 'AI with ChatGPT Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: aiChatgpt,
    rating: 4.8,
    company: 'Conversational AI Co.',
    keyTopics: ['NLP', 'Chatbot Development', 'Prompt Engineering'],
  },
  {
    id: 'web-development',
    title: 'Web Development Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: webDevelopment,
    rating: 4.7,
    company: 'FullStack Devs',
    keyTopics: ['Full-stack Dev', 'Frontend/Backend', 'Database Integration'],
  },
  {
    id: 'Csharp',
    title: 'C-Sharp Intern',
    category: 'Paid',
    mode: 'Online',
    duration: '30 days / 3 months',
    image: Csharp,
    rating: 4.5,
    company: '.NET Innovators',
    keyTopics: ['C# Programming', '.NET Framework', 'OOP Concepts'],
  },
];

// Function to generate new topic-specific internships
const generateTopicInternships = (originalInternship) => {
    const newInternships = [];
    originalInternship.keyTopics.forEach(topic => {
        const topicSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
        const newId = `${originalInternship.id}-${topicSlug}`;

        newInternships.push({
            id: newId,
            title: `${topic} Intern`,
            category: originalInternship.category,
            mode: originalInternship.mode,
            // Set a shorter duration for the split courses
            duration: '15 days / 1 month', // Updated duration for split courses
            department: originalInternship.department,
            description: `This specialized internship provides in-depth focus on ${topic.toLowerCase()}. You will develop advanced skills and practical experience in this specific area, building upon the foundational knowledge of ${originalInternship.title.replace(' Intern', '')}.`,
            responsibilities: [
                `Focus on tasks directly related to ${topic.toLowerCase()}`,
                `Apply learned principles and techniques in ${topic.toLowerCase()} projects`,
                `Collaborate with team members on specific ${topic.toLowerCase()} challenges`,
                `Research and implement best practices in ${topic.toLowerCase()}`,
            ],
            requirements: [
                `Strong interest and basic understanding of ${topic.toLowerCase()}`,
                `Ability to quickly learn and adapt to new concepts in ${topic.toLowerCase()}`,
                `Problem-solving skills relevant to ${topic.toLowerCase()}`,
                `Good communication and teamwork abilities`,
            ],
            benefits: originalInternship.benefits, // Inherit all benefits
            priceINR: originalInternship.priceINR,
            image: originalInternship.image, // Inherit image
            rating: originalInternship.rating, // Inherit rating
            company: originalInternship.company, // Inherit company
            keyTopics: [topic], // The new internship only has this one key topic
        });
    });
    return newInternships;
};

// Combine original and newly generated topic-specific internships
let internships = [...originalInternships]; // Start with existing internships
originalInternships.forEach(original => {
    if (original.keyTopics && original.keyTopics.length > 0) {
        internships = internships.concat(generateTopicInternships(original));
    }
});


const Internships = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
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
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        `}
      </style>

      <PageHeader
        title={<span className="text-red-500">Internship Opportunities</span>}
        subtitle={<span className="text-white">Jumpstart your career with real-world experience in a dynamic, innovative environment.</span>}
        backgroundImage={header}
      />
      <section className="section bg-gray-100 py-16 rounded-lg">
        <div className="container-custom mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-8"> {/* Flex container for heading and search */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Available Internships</h2>
                <div className="relative flex items-center w-full md:w-auto max-w-md">
                  <input
                    type="text"
                    placeholder="Search Certificate ID..."
                    className="p-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 w-full shadow-sm"
                  />
                  <Search className="absolute left-3 text-gray-400" size={20} />
                </div>
              </div>
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
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={internship.image}
                      alt={internship.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        {internship.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{internship.title}</h3>
                    {/* Removed the company name line */}

                    {/* Rating Section */}
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

                    {/* Key Topics Section - NEW */}
                    <div className="mb-4">
                        {internship.keyTopics && internship.keyTopics.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {internship.keyTopics.map((topic, topicIndex) => (
                                    <span
                                        key={topicIndex}
                                        className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                    >
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        )}
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
