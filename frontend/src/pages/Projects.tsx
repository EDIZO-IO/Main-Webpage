// frontend/src/pages/Projects.tsx
import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Eye,
  Gamepad,
  Search,
  Video,
  Palette,
  ExternalLink,
  Grid,
  List,
  Sparkles,
  Mail // Added Mail icon here
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import AutoScrollingGallery from '../components/common/TeamCardHorizontalScroll'; // Import the new component

// --- Project Types ---
interface ProjectCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  gradient: string;
  link: string;
}

// --- Memoized Typing Animation Component ---
interface AnimatedTypingSubtitleProps {
  phrases: string[];
}

const AnimatedTypingSubtitle = memo<AnimatedTypingSubtitleProps>(({ phrases }) => {
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
});
AnimatedTypingSubtitle.displayName = 'AnimatedTypingSubtitle';

// --- Memoized Project Category Card ---
// --- ProjectCategoryCard ---
const ProjectCategoryCard = memo<{ category: ProjectCategory; index: number; viewMode: 'grid' | 'list' }>(
  ({ category, index, viewMode }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: index * 0.03 }}
        className={`
          rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 
          bg-gradient-to-br ${category.gradient}
        `}
      >
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
      </motion.div>
    );
  }
);
ProjectCategoryCard.displayName = 'ProjectCategoryCard';

// --- Memoized Tab Button ---
const TabButton = memo<{ 
  tab: 'development' | 'graphics' | 'video'; 
  activeTab: string; 
  onClick: (tab: 'development' | 'graphics' | 'video') => void;
}>(({ tab, activeTab, onClick }) => {
  const handleClick = useCallback(() => onClick(tab), [tab, onClick]);
  
  const Icon = useMemo(() => {
    switch(tab) {
      case 'development': return Shield;
      case 'graphics': return Palette;
      case 'video': return Video;
    }
  }, [tab]);

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm
        ${activeTab === tab
          ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
        }`}
    >
      <Icon size={18} />
      {tab.charAt(0).toUpperCase() + tab.slice(1)}
    </motion.button>
  );
});
TabButton.displayName = 'TabButton';

// --- Memoized Category Filter Button ---
const CategoryFilterButton = memo<{ 
  category: string; 
  isSelected: boolean; 
  onClick: (category: string) => void;
}>(({ category, isSelected, onClick }) => {
  const handleClick = useCallback(() => onClick(category), [category, onClick]);

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm
        ${isSelected
          ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
        }`}
    >
      {category}
    </motion.button>
  );
});
CategoryFilterButton.displayName = 'CategoryFilterButton';

// --- Memoized Skeleton Loader ---
const CategoryCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="rounded-2xl shadow-lg border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-100 to-blue-50 animate-pulse flex flex-col h-[260px]"
  >
    <div className="h-12 bg-gray-200/70 w-1/3 m-6 rounded" />
    <div className="h-5 bg-gray-200/40 w-2/3 m-2 rounded" />
    <div className="h-4 bg-gray-100 w-12 m-2 rounded" />
    <div className="flex-1" />
    <div className="bg-gray-100 h-10 mt-auto" />
  </motion.div>
);

// --- Main Component ---
const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'development' | 'graphics' | 'video'>('development');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // ✅ Memoize static project data
  const developmentCategories = useMemo<ProjectCategory[]>(() => [
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      icon: Shield,
      description: 'AI-Based Ransomware Detection System',
      gradient: 'from-blue-50 to-cyan-50',
      link: 'https://bytecode.edizo.in' // Fixed link
    },
    {
      id: 'computer-vision-ai',
      title: 'Computer Vision & AI',
      icon: Eye,
      description: 'FaceGuard-GAN Deepfake Detection',
      gradient: 'from-green-50 to-emerald-50',
      link: 'https://bytecode.edizo.in' // Fixed link
    },
    {
      id: 'web-development',
      title: 'Web Development',
      icon: Gamepad,
      description: 'Epic Nexus Gaming Community Platform',
      gradient: 'from-purple-50 to-pink-50',
      link: 'https://bytecode.edizo.in' // Fixed link
    },
  ], []);

  const graphicsCategories = useMemo<ProjectCategory[]>(() => [
    {
      id: 'branding',
      title: 'Branding',
      icon: Palette,
      description: 'Complete brand identity solutions',
      gradient: 'from-red-50 to-orange-50',
      link: 'https://bytecode.edizo.in' // Fixed link
    },
    {
      id: 'ui-ux-design',
      title: 'UI/UX Design',
      icon: Palette,
      description: 'User-centered design experiences',
      gradient: 'from-indigo-50 to-blue-50',
      link: 'https://bytecode.edizo.in' // Fixed link
    },
  ], []);

  const videoCategories = useMemo<ProjectCategory[]>(() => [
    {
      id: 'video-editing',
      title: 'Video Editing',
      icon: Video,
      description: 'Engaging visual storytelling',
      gradient: 'from-yellow-50 to-amber-50',
      link: 'https://bytecode.edizo.in' // Fixed link
    },
  ], []);

  // ✅ Memoize current categories based on active tab
  const currentCategories = useMemo(() => {
    switch (activeTab) {
      case 'development': return developmentCategories;
      case 'graphics': return graphicsCategories;
      case 'video': return videoCategories;
      default: return developmentCategories;
    }
  }, [activeTab, developmentCategories, graphicsCategories, videoCategories]);

  // ✅ Memoize filtered categories
  const filteredCategories = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return currentCategories.filter(category =>
      (selectedCategory === 'All' || category.title === selectedCategory) &&
      (searchTerm === '' || category.title.toLowerCase().includes(lowerSearch))
    );
  }, [currentCategories, selectedCategory, searchTerm]);

  // ✅ Memoize all categories for filter
  const allCategories = useMemo(() =>
    ['All', ...new Set(currentCategories.map(c => c.title))],
    [currentCategories]
  );

  // ✅ Memoized callbacks
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleTabChange = useCallback((tab: 'development' | 'graphics' | 'video') => {
    setActiveTab(tab);
    setSelectedCategory('All');
    setSearchTerm('');
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleViewModeToggle = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
  }, []);

  // ✅ Schema.org structured data
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org', // Fixed URL
      '@type': 'ItemList',
      name: 'Edizo Projects Portfolio',
      description: 'A curated list of featured projects by Edizo in cybersecurity, AI, web development, and graphics design.',
      url: 'https://www.edizo.in/projects', // Fixed URL
      numberOfItems: currentCategories.length,
      itemListElement: currentCategories.map((category, index) => ({
        '@type': 'CreativeWork',
        position: index + 1,
        name: category.title,
        description: category.description,
        category: category.title,
        creator: { '@type': 'Organization', name: 'Edizo' },
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
  }, [currentCategories]);

  const typingPhrases = useMemo(() => ['Innovative Solutions', 'Creative Designs', 'Impactful Videos'], []);

  // Simulate loading state if needed - currently set to false
  const loading = false;

  return (
    <>
      <PageHeader
        title="Our Projects"
        subtitle={<AnimatedTypingSubtitle phrases={typingPhrases} />}
      />

      {/* Add the Team Card Horizontal Scroll Component here */}
      <AutoScrollingGallery />

      <section className="bg-gradient-to-b from-gray-50 to-blue-50 py-20 md:py-28 px-4">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="text-center mb-14 md:mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative inline-block">
                Featured Project Categories
                <span className="block absolute left-1/2 transform -translate-x-1/2 h-1 w-28 bg-gradient-to-r from-red-500 via-yellow-400 to-orange-400 rounded-full -bottom-2 animate-pulse opacity-75" />
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Explore our expertise in crafting cutting-edge solutions, stunning graphics, and engaging videos that drive real impact.
              </p>
            </div>
          </AnimatedSection>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {(['development', 'graphics', 'video'] as const).map((tab) => (
              <TabButton
                key={tab}
                tab={tab}
                activeTab={activeTab}
                onClick={setActiveTab}
              />
            ))}
          </div>

          {/* Search & View Mode */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div className="relative w-full sm:w-2/3 lg:w-1/2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              <input
                type="text"
                placeholder={`Search ${activeTab} categories...`}
                value={searchTerm}
                onChange={handleSearchChange} // Use the memoized callback
                aria-label="Search projects"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all bg-white"
              />
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleViewModeToggle('grid')} // Use the memoized callback
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
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleViewModeToggle('list')} // Use the memoized callback
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
              <CategoryFilterButton
                key={category}
                category={category}
                isSelected={selectedCategory === category}
                onClick={handleCategoryChange} // Use the memoized callback
              />
            ))}
          </div>

          {/* Projects Grid/List/Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {[...Array(6)].map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-gray-200"
            >
              <Search className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-gray-700 text-lg font-semibold mb-2">No projects found</p>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={handleClearFilters} // Use the memoized callback
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${viewMode === 'list' ? 'md:grid-cols-1' : ''}`}>
              {filteredCategories.map((category, index) => (
                <ProjectCategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Projects;