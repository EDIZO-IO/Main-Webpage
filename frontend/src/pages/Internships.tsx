import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Wifi, ArrowRight, Star, Search } from 'lucide-react';

// === Local Image Imports ===
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
import headerImg from '../assets/background image/internship.png';

// === Define TypeScript interfaces ===
interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  backgroundImage: string;
  style?: React.CSSProperties & { y?: number };
}

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

// === Mock Components (for self-contained example) ===
const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  style = {} 
}) => (
  <motion.div
    className="relative bg-cover bg-center py-24 text-white text-center rounded-2xl shadow-2xl overflow-hidden"
    style={{ 
      backgroundImage: `url(${backgroundImage})`,
      ...(style as React.CSSProperties)
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-red-900/60"></div>
    <div className="relative z-10 px-6">
      {title}
      {subtitle && (
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-100 mt-4 font-light">
          {subtitle}
        </p>
      )}
    </div>
  </motion.div>
);

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
    image: Csharp,
    rating: 4.5,
  },
];

// === Main Component ===
const Internships: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);

  const categories = ['All', ...new Set(internships.map(i => i.category))];
  const trendingInternships = internships.filter(i => i.isTrending);
  const filteredInternships = internships.filter(i => {
    const matchesCategory = selectedCategory === 'All' || i.category === selectedCategory;
    const search = searchTerm.toLowerCase();
    const matchesSearch = i.title.toLowerCase().includes(search) || i.id.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4, type: 'spring', stiffness: 100, damping: 18 },
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* === Hero Header === */}
      <PageHeader
        title={
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500"
          >
            Internship Opportunities
          </motion.h1>
        }
        subtitle="Jumpstart your career with real-world experience in a dynamic, innovative environment."
        backgroundImage={headerImg}
        style={{ y: backgroundY.get() }}
      />

      {/* === Trending Internships (Smaller Cards) === */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                🔥 Trending Right Now
              </h2>
              <p className="text-gray-600 mt-2">Our most popular programs loved by students</p>
            </div>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {trendingInternships.map((internship, index) => (
              <motion.div
                key={internship.id}
                custom={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group w-48 sm:w-52 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <Link to={`/internships/${internship.id}`}>
                  <div className="relative h-28 overflow-hidden rounded-t-xl">
                    <img
                      src={internship.image}
                      alt={internship.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 h-10">
                      {internship.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex text-yellow-500 text-xs">
                        {'★'.repeat(Math.floor(internship.rating))}
                        {'☆'.repeat(5 - Math.floor(internship.rating))}
                      </div>
                      <span className="text-xs text-red-600 font-medium">{internship.rating}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === All Internships === */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Available Internships</h2>
              <div className="max-w-md mx-auto relative mb-6">
                <input
                  type="text"
                  placeholder="Search internships..."
                  className="w-full p-3 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-red-500 text-white shadow'
                        : 'bg-white text-gray-700 hover:bg-red-50 border border-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
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
                whileHover="hover"
                viewport={{ once: true, margin: '-50px' }}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <Link to={`/internships/${internship.id}`}>
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={internship.image}
                      alt={internship.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                      {internship.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {internship.title}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500 mr-2">
                        {[...Array(5)].map((_, i) =>
                          i < Math.floor(internship.rating) ? (
                            <Star key={i} size={16} fill="currentColor" stroke="none" />
                          ) : (
                            <Star key={i} size={16} fill="none" stroke="currentColor" />
                          )
                        )}
                      </div>
                      <span className="text-gray-600 text-sm font-medium">{internship.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Wifi className="mr-1 text-red-500" size={14} />
                      <span>{internship.mode}</span>
                    </div>
                    <div className="border-t pt-3">
                      <span className="text-red-600 text-sm font-semibold flex items-center hover:underline group-hover:gap-1 transition-all">
                        Explore More <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Internships;