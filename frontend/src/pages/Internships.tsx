// src/pages/Internships.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wifi, ArrowRight, Star, Search } from 'lucide-react';

// === Local Image Imports ===
import webDesign from '../assets/images/web-design.png';
import responsiveDesign from '../assets/images/responsive-design.png';
import backEnd from '../assets/images/back-end.png';
import hrManager from '../assets/images/hr-manager.png';
import dataAnalytics from '../assets/images/content-strategy.png';
import java from '../assets/images/java.png';
import python from '../assets/images/python.png';
import contentStrategy from '../assets/images/content-strategy.png';
import aiAssistant from '../assets/images/ai-assistant.png';
import aiChatgpt from '../assets/images/AI with CHATGPT.png';
import webDevelopment from '../assets/images/web-development.png';
import csharp from '../assets/images/c-sharp.png';
// import headerImg from '../assets/background image/internship.png'; // Remove this import

// === Define TypeScript interfaces ===
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

interface Internship {
  id: string;
  title: string;
  category: string;
  mode: 'Online' | 'Offline';
  image: string;
  rating: number;
  isTrending?: boolean;
}

// === Simplified PageHeader Component (Styled like Home.tsx) ===
interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode; // Allow ReactNode for flexibility like AnimatedTypingSubtitle
  // Removed variant prop
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
}) => {
  // Use scroll effect like in Home.tsx
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    // Match the structure and classes from Home.tsx Hero section
    <section
      className="relative text-white pt-20 pb-16 md:pt-28 md:pb-24" // Added pt for header space
      aria-labelledby="internships-hero-title"
    >
      {/* Curved SVG Background with Gradient - Simplified from Home.tsx */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Use the same gradient as Home.tsx for consistency */}
            <linearGradient id="internshipsHeroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M0,0 L1440,0 C1440,400 1080,600 720,600 C360,600 0,400 0,800 L0,0 Z"
            fill="url(#internshipsHeroGradient)"
          />
          <path
            d="M0,200 C360,400 1080,400 1440,200 L1440,800 C1080,600 360,600 0,800 Z"
            fill="url(#internshipsHeroGradient)"
            opacity="0.3"
          />
        </svg>
        {/* Subtle Noise Overlay - Same as Home.tsx */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27 viewBox=%270 0 100 100%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%27 height=%27100%27 filter=%27url(%23noise)%27 opacity=%270.05%27/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* Floating Particles - Simplified version from Home.tsx */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + i * 2,
              delay: i * 1,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${20 + (i * 20) % 80}%`,
              top: `${20 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Content - Match Home.tsx content structure */}
      <motion.div
        className="container mx-auto px-6 lg:px-12 relative z-20" // Use container and padding like Home
        style={{ y: backgroundY }} // Apply parallax effect
      >
        <div className="max-w-4xl mx-auto text-center"> {/* Center content */}
          {/* Use motion.divs for fade-in like Home.tsx */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', stiffness: 120, damping: 15 }}
          >
            <h1 id="internships-hero-title" className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="text-white">{title}</span>
            </h1>
          </motion.div>

          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            >
              <p className="text-lg md:text-xl font-light mb-8 text-white max-w-lg mx-auto">
                {subtitle}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

// === Animated Section Component ===
const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100, damping: 20 }}
  >
    {children}
  </motion.div>
);

// === Internship Data ===
const internships: Internship[] = [
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    category: 'Design',
    mode: 'Online',
    image: webDesign,
    rating: 4.7,
    isTrending: true,
  },
  {
    id: 'frontend-development',
    title: 'Frontend Development',
    category: 'Development',
    mode: 'Online',
    image: responsiveDesign,
    rating: 4.5,
  },
  {
    id: 'backend-development',
    title: 'Backend Development',
    category: 'Development',
    mode: 'Online',
    image: backEnd,
    rating: 4.6,
  },
  {
    id: 'hr-management',
    title: 'HR Management',
    category: 'HR',
    mode: 'Online',
    image: hrManager,
    rating: 4.2,
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    category: 'Data Science',
    mode: 'Online',
    image: dataAnalytics,
    rating: 4.8,
    isTrending: true,
  },
  {
    id: 'java-development',
    title: 'Java Development',
    category: 'Java',
    mode: 'Online',
    image: java,
    rating: 4.4,
  },
  {
    id: 'python-development',
    title: 'Python Programming',
    category: 'Python',
    mode: 'Online',
    image: python,
    rating: 4.6,
    isTrending: true,
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    category: 'Marketing',
    mode: 'Online',
    image: contentStrategy,
    rating: 4.3,
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning',
    category: 'AI/ML',
    mode: 'Online',
    image: aiAssistant,
    rating: 4.9,
    isTrending: true,
  },
  {
    id: 'ai-with-chatgpt',
    title: 'AI with ChatGPT',
    category: 'AI/ML',
    mode: 'Online',
    image: aiChatgpt,
    rating: 4.8,
    isTrending: true,
  },
  {
    id: 'web-development',
    title: 'Web Development',
    category: 'Development',
    mode: 'Online',
    image: webDevelopment,
    rating: 4.7,
  },
  {
    id: 'csharp',
    title: 'C-Sharp',
    category: 'C#',
    mode: 'Online',
    image: csharp,
    rating: 4.5,
  },
];

// === Main Component ===
const Internships: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = ['All', ...new Set(internships.map((i) => i.category))];
  const trendingInternships = internships.filter((i) => i.isTrending);
  const filteredInternships = internships.filter((i) => {
    const matchesCategory = selectedCategory === 'All' || i.category === selectedCategory;
    const matchesSearch = i.title.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Add JSON-LD for SEO - ✅ FIXED URLs (Removed trailing spaces)
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org', // ✅ Fixed
      '@type': 'ItemList',
      name: 'Edizo Internship Programs',
      description: 'A collection of internship programs offered by Edizo in various fields such as Design, Development, AI/ML, and more.',
      url: 'https://www.edizo.in/internships', // ✅ Fixed
      numberOfItems: internships.length,
      itemListElement: internships.map((internship, index) => ({
        '@type': 'Course',
        position: index + 1,
        name: internship.title,
        description: `A ${internship.mode.toLowerCase()} internship program in ${internship.category}.`,
        provider: {
          '@type': 'Organization',
          name: 'Edizo',
          url: 'https://www.edizo.in', // ✅ Fixed
        },
        image: internship.image,
        url: `https://www.edizo.in/internships/${internship.id}`, // ✅ Fixed
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'internships-schema';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('internships-schema');
      if (existing) document.head.removeChild(existing);
    };
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4, type: 'spring', stiffness: 100, damping: 18 },
    }),
    hover: { scale: 1.02, borderColor: '#DC2626' },
  };

  return (
    // Update main div background to match Home.tsx
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 font-['Inter',sans-serif]">
      {/* Use the new PageHeader styled like Home.tsx */}
      <PageHeader
        title="Our Internships"
        subtitle="Kickstart your career with hands-on experience in a supportive, innovative environment."
      />

      {/* Rest of your component remains largely the same, just wrapped in the new structure */}
      {/* Trending Internships */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <span className="text-red-600">🔥</span> Trending Internships
              </h2>
              <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                Discover our most popular internship programs, highly rated by students.
              </p>
            </div>
          </AnimatedSection>

          <div className="flex overflow-x-auto space-x-4 pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
            {trendingInternships.length > 0 ? (
              trendingInternships.map((internship, index) => (
                <motion.div
                  key={internship.id}
                  custom={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4, borderColor: '#DC2626' }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group flex-shrink-0 w-64 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 snap-center"
                >
                  <Link to={`/internships/${internship.id}`}>
                    <div className="relative h-32 overflow-hidden rounded-t-lg">
                      <img
                        src={internship.image}
                        alt={internship.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        🔥 Trending
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-800 line-clamp-2 h-10 group-hover:text-red-600 transition-colors">
                        {internship.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-600 text-sm">{internship.category}</span>
                        <span className="text-xs font-medium text-white bg-red-600 rounded-full px-2 py-1">
                          {internship.rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full">No trending internships available.</p>
            )}
          </div>
        </div>
      </section>

      {/* All Internships */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">All Internship Programs</h2>
              <div className="max-w-md mx-auto relative mb-6">
                <input
                  type="text"
                  placeholder="Search internships..."
                  className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search internships"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
              <p className="text-gray-600 max-w-xl mx-auto">
                Explore our range of internship programs and gain hands-on experience with industry experts.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInternships.length > 0 ? (
              filteredInternships.map((internship, index) => (
                <motion.div
                  key={internship.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true, margin: '-50px' }}
                  className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <Link to={`/internships/${internship.id}`}>
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={internship.image}
                        alt={internship.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {internship.category}
                      </span>
                      {internship.rating >= 4.8 && (
                        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                          New
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {internship.title}
                      </h3>
                      <div className="flex items-center mb-2">
                        <span className="text-white text-sm font-medium bg-red-600 rounded-full px-2 py-1 mr-2">
                          {internship.rating}
                        </span>
                        <span className="text-gray-600 text-sm">{internship.category}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Wifi className="mr-1 text-red-600" size={14} />
                        <span>{internship.mode}</span>
                      </div>
                      <div className="border-t pt-3">
                        <span className="text-red-600 text-sm font-semibold flex items-center hover:underline group-hover:gap-1 transition-all">
                          Explore More <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-full">No internships match your search criteria.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Internships;