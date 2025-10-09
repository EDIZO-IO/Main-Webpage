// src/pages/Projects.tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Shield,
  Eye,
  Gamepad,
  Search,
  Video,
  Palette,
  ExternalLink,
  Grid,
  List,
  Sparkles
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';

// --- Types ---
interface ProjectCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  gradient: string;
  link: string;
}

// --- Auto-Scrolling Gallery ---
const AutoScrollingGallery: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Predefined gallery items
  const galleryItems = [
    { id: 1, name: 'Alex Johnson', role: 'Lead Developer' },
    { id: 2, name: 'Maria Garcia', role: 'Creative Director' },
    { id: 3, name: 'Sam Chen', role: 'AI Specialist' },
    { id: 4, name: 'Priya Sharma', role: 'UX Designer' },
    { id: 5, name: 'James Wilson', role: 'Video Editor' },
    { id: 6, name: 'Fatima Ahmed', role: 'Project Manager' },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center mb-6 px-4">
        <Sparkles className="text-red-500 mr-2" size={24} />
        <h3 className="text-2xl font-bold text-gray-800">Meet Our Team</h3>
      </div>
      <div className="flex overflow-hidden">
        <motion.div
          className="flex flex-nowrap"
          animate={{ x: isPaused ? 0 : "-100%" }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "loop" }}
        >
          {[...galleryItems, ...galleryItems].map((item, index) => (
            <div
              key={`${item.id}-${index}`} // Ensure unique keys for the duplicated list
              className="flex-shrink-0 w-64 mx-3"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white p-4 h-64 flex flex-col items-center justify-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-3" />
                <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// --- Typing Animation ---
interface AnimatedTypingSubtitleProps {
  phrases: string[];
}
const AnimatedTypingSubtitle: React.FC<AnimatedTypingSubtitleProps> = ({ phrases }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentPhrase.length) {
          setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
          setTypingSpeed(100 + Math.random() * 50);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
          setTypingSpeed(50);
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          setTypingSpeed(150);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, phraseIndex, phrases, typingSpeed]);

  return (
    <span className="relative text-white font-medium">
      {displayedText}
      <span className="absolute right-0 bottom-0 -mr-2 w-1 h-4 bg-white animate-pulse" />
    </span>
  );
};

// --- Main Component ---
const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'development' | 'graphics' | 'video'>('development');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Project categories data
  const developmentCategories: ProjectCategory[] = [
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      icon: Shield,
      description: 'AI-Based Ransomware Detection System',
      gradient: 'from-blue-50 to-cyan-50',
      link: 'https://bytecode.edizo.in'
    },
    {
      id: 'computer-vision-ai',
      title: 'Computer Vision & AI',
      icon: Eye,
      description: 'FaceGuard-GAN Deepfake Detection',
      gradient: 'from-green-50 to-emerald-50',
      link: 'https://bytecode.edizo.in'
    },
    {
      id: 'web-development',
      title: 'Web Development',
      icon: Gamepad,
      description: 'Epic Nexus Gaming Community Platform',
      gradient: 'from-purple-50 to-pink-50',
      link: 'https://bytecode.edizo.in'
    },
  ];

  const graphicsCategories: ProjectCategory[] = [
    {
      id: 'branding',
      title: 'Branding',
      icon: Palette,
      description: 'Complete brand identity solutions',
      gradient: 'from-red-50 to-orange-50',
      link: 'https://bytecode.edizo.in'
    },
    {
      id: 'ui-ux-design',
      title: 'UI/UX Design',
      icon: Palette,
      description: 'User-centered design experiences',
      gradient: 'from-indigo-50 to-blue-50',
      link: 'https://bytecode.edizo.in'
    },
  ];

  const videoCategories: ProjectCategory[] = [
    {
      id: 'video-editing',
      title: 'Video Editing',
      icon: Video,
      description: 'Engaging visual storytelling',
      gradient: 'from-yellow-50 to-amber-50',
      link: 'https://bytecode.edizo.in'
    },
  ];

  // Get current categories based on active tab
  const getCurrentCategories = () => {
    switch (activeTab) {
      case 'development': return developmentCategories;
      case 'graphics': return graphicsCategories;
      case 'video': return videoCategories;
      default: return developmentCategories;
    }
  };

  const currentCategories = getCurrentCategories();

  // Filter categories based on search and selection
  const filteredCategories = currentCategories.filter(category =>
    (selectedCategory === 'All' || category.title === selectedCategory) &&
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Extract unique categories for filter buttons
  const allCategories = ['All', ...new Set(currentCategories.map(c => c.title))];

  // Add JSON-LD for SEO - ✅ FIXED URLs
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Edizo Projects Portfolio',
      description: 'A curated list of featured projects by Edizo in cybersecurity, AI, web development, and graphics design.',
      url: 'https://www.edizo.in/projects',
      numberOfItems: currentCategories.length,
      itemListElement: currentCategories.map((category, index) => ({
        '@type': 'CreativeWork',
        position: index + 1,
        name: category.title,
        description: category.description,
        category: category.title,
        creator: { '@type': 'Organization', name: 'Edizo' },
        thumbnailUrl: `https://placehold.co/600x400/eee/999?text=${encodeURIComponent(category.title)}`,
        url: category.link,
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'projects-schema';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('projects-schema');
      if (existing) document.head.removeChild(existing);
    };
  }, [currentCategories]); // Dependency array is correct

  return (
    <>
      <PageHeader
        title="Our Projects"
        subtitle={<AnimatedTypingSubtitle phrases={['Innovative Solutions', 'Creative Designs', 'Impactful Videos']} />}
      />
      <AutoScrollingGallery />
      <section className="bg-gradient-to-b from-gray-50 to-blue-50 py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Project Categories</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore our expertise in crafting cutting-edge solutions, stunning graphics, and engaging videos that drive real impact.
                All project details are available on our dedicated platform.
              </p>
            </div>
          </AnimatedSection>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-12">
            {(['development', 'graphics', 'video'] as const).map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm
                  ${activeTab === tab
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
              >
                {tab === 'development' && <Shield size={18} />}
                {tab === 'graphics' && <Palette size={18} />}
                {tab === 'video' && <Video size={18} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Search & View Mode */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div className="relative w-full sm:w-2/3 lg:w-1/2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${activeTab} categories...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search projects"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all bg-white"
              />
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="Grid view"
              >
                <Grid size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-label="List view"
              >
                <List size={20} />
              </motion.button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {allCategories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm
                  ${selectedCategory === category
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
              >
                {category}
              </motion.button>
            ))}
          </div>

          {/* Projects Grid/List */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No projects match your search criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-4 text-red-600 hover:underline font-semibold"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${viewMode === 'list' ? 'md:grid-cols-1' : ''}`}>
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 bg-gradient-to-br ${category.gradient} ${viewMode === 'list' ? 'md:flex' : ''}`}
                >
                  {viewMode === 'list' ? (
                    <div className="md:flex">
                      <div className="md:w-1/3 h-48 md:h-full overflow-hidden bg-gray-200 border-2 border-dashed rounded-xl flex items-center justify-center">
                        <category.icon className="text-gray-400" size={48} />
                      </div>
                      <div className="p-6 md:w-2/3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center mb-3">
                            <category.icon className="text-red-600 mr-3" size={24} />
                            <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                        </div>
                        <a
                          href={category.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium group mt-4"
                        >
                          View Projects
                          <ExternalLink size={16} />
                          <ArrowRight
                            size={16}
                            className="ml-1 transition-transform group-hover:translate-x-1"
                          />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <category.icon className="text-red-600 mr-3" size={32} />
                          <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                        <a
                          href={category.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-medium group mt-4"
                        >
                          View Projects
                          <ExternalLink size={16} />
                          <ArrowRight
                            size={16}
                            className="ml-1 transition-transform group-hover:translate-x-1"
                          />
                        </a>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Projects;