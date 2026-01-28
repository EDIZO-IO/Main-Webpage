// frontend/src/pages/Projects.tsx
import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  X,
  Play,
  ZoomIn,
  Download
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';

// --- Project Types ---
// interface ProjectCategory {
//   id;
//   title;
//   icon: Function;
//   description;
//   gradient;
//   link;
// }

// --- Graphic Design Images ---

// --- Video Project ---

// --- Memoized Typing Animation Component ---

const AnimatedTypingSubtitle = memo(({ phrases }) => {
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
const ProjectCategoryCard = memo(({ category, index, viewMode }) => {
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

// --- Image Gallery Item ---
const ImageGalleryItem = memo(({ image, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
      onClick={() => onClick(image)}
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={image.src}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full mb-2">
            {image.category}
          </span>
          <h3 className="text-white font-bold text-lg">{image.title}</h3>
        </div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
            <ZoomIn className="text-white" size={20} />
          </div>
        </div>
      </div>
    </motion.div>
  );
});
ImageGalleryItem.displayName = 'ImageGalleryItem';

// --- Lightbox Component ---
const Lightbox = memo(({ image, onClose, onNext, onPrev }) => {
  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity }}
        animate={{ opacity }}
        exit={{ opacity }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="text-white" size={24} />
        </button>

        {/* Navigation Buttons */}
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowRight className="text-white rotate-180" size={24} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowRight className="text-white" size={24} />
        </button>

        {/* Image Container */}
        <motion.div
          initial={{ scale: 0.9, opacity }}
          animate={{ scale, opacity }}
          exit={{ scale: 0.9, opacity }}
          transition={{ type: 'spring', damping }}
          className="max-w-5xl max-h-[85vh] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={image.src}
            alt={image.title}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
            <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full mb-2">
              {image.category}
            </span>
            <h3 className="text-white font-bold text-2xl">{image.title}</h3>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
});
Lightbox.displayName = 'Lightbox';

// --- Video Gallery Item ---
const VideoGalleryItem = memo(({ video, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-gray-900"
    >
      <div className="aspect-video overflow-hidden">
        {isPlaying ? (
          <iframe
            src={video.videoUrl}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Play Overlay */}
            <div
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/50 transition-colors"
              onClick={() => setIsPlaying(true)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/30"
              >
                <Play className="text-white ml-1" size={32} fill="currentColor" />
              </motion.div>
            </div>
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full mb-2">
                {video.category}
              </span>
              <h3 className="text-white font-bold text-lg">{video.title}</h3>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
});
VideoGalleryItem.displayName = 'VideoGalleryItem';

// --- Memoized Tab Button ---
const TabButton = memo(({ tab, activeTab, onClick }) => {
  const handleClick = useCallback(() => onClick(tab), [tab, onClick]);

  const Icon = useMemo(() => {
    switch (tab) {
      case 'development': return Shield;
      case 'graphics': return Palette;
      case 'video': return Video;
    }
  }, [tab]);

  const tabLabels = {
    development: 'Development',
    graphics: 'Graphic Design',
    video: 'Video Editing'
  };

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
      {tabLabels[tab]}
    </motion.button>
  );
});
TabButton.displayName = 'TabButton';

// --- Memoized Category Filter Button ---
const CategoryFilterButton = memo(({ category, isSelected, onClick }) => {
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
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
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

// --- Image Skeleton ---
const ImageSkeleton = () => (
  <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
);

// --- Main Component ---
const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('development');
  const [viewMode, setViewMode] = useState('grid');
  const [lightboxImage, setLightboxImage] = useState(null);

  // ✅ Graphic Design Images from public folder
  const graphicDesignImages = useMemo(() => [
    {
      id: 'gd-1',
      src: '/graphicdesign/20251001_172832.png',
      title: 'Creative Design 1',
      category: 'Branding'
    },
    {
      id: 'gd-2',
      src: '/graphicdesign/A2A.png',
      title: 'A2A Design',
      category: 'Logo Design'
    },
    {
      id: 'gd-3',
      src: '/graphicdesign/C-G 3D.png',
      title: 'C-G 3D Design',
      category: '3D Design'
    },
    {
      id: 'gd-4',
      src: '/graphicdesign/C-G.png',
      title: 'C-G Design',
      category: 'Logo Design'
    },
    {
      id: 'gd-5',
      src: '/graphicdesign/DJ HD LOGO.png',
      title: 'DJ HD Logo',
      category: 'Logo Design'
    },
    {
      id: 'gd-6',
      src: '/graphicdesign/E2D.png',
      title: 'E2D Design',
      category: 'Branding'
    },
    {
      id: 'gd-7',
      src: '/graphicdesign/MR REAL YT.png',
      title: 'MR Real YT',
      category: 'YouTube Art'
    },
    {
      id: 'gd-8',
      src: '/graphicdesign/cse.png',
      title: 'CSE Design',
      category: 'Branding'
    },
    {
      id: 'gd-9',
      src: '/graphicdesign/cse1.png',
      title: 'CSE Design Variant',
      category: 'Branding'
    },
    {
      id: 'gd-10',
      src: '/graphicdesign/edizo.png',
      title: 'Edizo Brand Design',
      category: 'Branding'
    },
    {
      id: 'gd-11',
      src: '/graphicdesign/redcap.png',
      title: 'Redcap Design',
      category: 'Logo Design'
    },
  ], []);

  // ✅ Video Projects - Actual videos
  const videoProjects = useMemo(() => [
    {
      id: 'vid-1',
      thumbnail: 'https://img.youtube.com/vi/sAzLHsgBjV4/maxresdefault.jpg',
      videoUrl: 'https://www.youtube.com/embed/sAzLHsgBjV4?autoplay=1',
      title: 'Video Editing Showcase',
      category: 'Video Editing'
    },
  ], []);

  // ✅ Memoize static project data
  const developmentCategories = useMemo(() => [
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
      icon: Search,
      description: 'Epic Nexus Gaming Community Platform',
      gradient: 'from-purple-50 to-pink-50',
      link: 'https://bytecode.edizo.in'
    },
  ], []);

  // ✅ Memoize graphic design categories for filtering
  const graphicDesignCategories = useMemo(() =>
    ['All', ...new Set(graphicDesignImages.map(img => img.category))],
    [graphicDesignImages]
  );

  // ✅ Filter graphic design images
  const filteredGraphicImages = useMemo(() => {
    if (selectedCategory === 'All') return graphicDesignImages;
    return graphicDesignImages.filter(img => img.category === selectedCategory);
  }, [graphicDesignImages, selectedCategory]);

  // ✅ Lightbox navigation
  const handleLightboxOpen = useCallback((image) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
  }, []);

  const handleLightboxNext = useCallback(() => {
    if (!lightboxImage) return;
    const currentIndex = filteredGraphicImages.findIndex(img => img.id === lightboxImage.id);
    const nextIndex = (currentIndex + 1) % filteredGraphicImages.length;
    setLightboxImage(filteredGraphicImages[nextIndex]);
  }, [lightboxImage, filteredGraphicImages]);

  const handleLightboxPrev = useCallback(() => {
    if (!lightboxImage) return;
    const currentIndex = filteredGraphicImages.findIndex(img => img.id === lightboxImage.id);
    const prevIndex = currentIndex === 0 ? filteredGraphicImages.length - 1 : currentIndex - 1;
    setLightboxImage(filteredGraphicImages[prevIndex]);
  }, [lightboxImage, filteredGraphicImages]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxImage) return;
      if (e.key === 'Escape') handleLightboxClose();
      if (e.key === 'ArrowRight') handleLightboxNext();
      if (e.key === 'ArrowLeft') handleLightboxPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, handleLightboxClose, handleLightboxNext, handleLightboxPrev]);

  // ✅ Memoized callbacks
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSelectedCategory('All');
    setSearchTerm('');
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleViewModeToggle = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
  }, []);

  // ✅ Schema.org structured data
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Edizo Projects Portfolio',
      description: 'A curated list of featured projects by Edizo in cybersecurity, AI, web development, graphics design, and video editing.',
      url: 'https://www.edizo.in/projects',
      numberOfItems: developmentCategories.length + graphicDesignImages.length + videoProjects.length,
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
  }, [developmentCategories, graphicDesignImages, videoProjects]);

  const typingPhrases = useMemo(() => ['Innovative Solutions', 'Creative Designs', 'Impactful Videos'], []);

  // Filter development categories by search
  const filteredDevelopmentCategories = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return developmentCategories.filter(category =>
      searchTerm === '' || category.title.toLowerCase().includes(lowerSearch)
    );
  }, [developmentCategories, searchTerm]);

  const loading = false;

  return (
    <>
      <PageHeader
        title="Our Projects"
        subtitle={<AnimatedTypingSubtitle phrases={typingPhrases} />}
      />

      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox
          image={lightboxImage}
          onClose={handleLightboxClose}
          onNext={handleLightboxNext}
          onPrev={handleLightboxPrev}
        />
      )}

      <section className="bg-white py-20 md:py-28 px-4">
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
            {(['development', 'graphics', 'video']).map((tab) => (
              <TabButton
                key={tab}
                tab={tab}
                activeTab={activeTab}
                onClick={setActiveTab}
              />
            ))}
          </div>

          {/* Content Based on Active Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'development' && (
              <motion.div
                key="development"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Search for Development */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                  <div className="relative w-full sm:w-2/3 lg:w-1/2">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    <input
                      type="text"
                      placeholder="Search development projects..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      aria-label="Search projects"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all bg-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleViewModeToggle('grid')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
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
                      onClick={() => handleViewModeToggle('list')}
                      className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                        ? 'bg-red-100 text-red-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                      aria-label="List view"
                    >
                      <List size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Development Projects Grid */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                      <CategoryCardSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredDevelopmentCategories.length === 0 ? (
                  <motion.div
                    initial={{ opacity, scale: 0.95 }}
                    animate={{ opacity, scale }}
                    className="text-center py-16 bg-white rounded-2xl border border-gray-200"
                  >
                    <Search className="text-gray-400 mx-auto mb-4" size={48} />
                    <p className="text-gray-700 text-lg font-semibold mb-2">No projects found</p>
                    <p className="text-gray-500 mb-6">Try adjusting your search</p>
                    <button
                      onClick={handleClearFilters}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                ) : (
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${viewMode === 'list' ? 'md:grid-cols-1' : ''}`}>
                    {filteredDevelopmentCategories.map((category, index) => (
                      <ProjectCategoryCard
                        key={category.id}
                        category={category}
                        index={index}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'graphics' && (
              <motion.div
                key="graphics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Category Filter for Graphics */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {graphicDesignCategories.map((category) => (
                    <CategoryFilterButton
                      key={category}
                      category={category}
                      isSelected={selectedCategory === category}
                      onClick={handleCategoryChange}
                    />
                  ))}
                </div>

                {/* Graphic Design Gallery - Masonry Style */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                  {filteredGraphicImages.map((image, index) => (
                    <div key={image.id} className="break-inside-avoid">
                      <ImageGalleryItem
                        image={image}
                        index={index}
                        onClick={handleLightboxOpen}
                      />
                    </div>
                  ))}
                </div>

                {filteredGraphicImages.length === 0 && (
                  <motion.div
                    initial={{ opacity, scale: 0.95 }}
                    animate={{ opacity, scale }}
                    className="text-center py-16 bg-white rounded-2xl border border-gray-200"
                  >
                    <Palette className="text-gray-400 mx-auto mb-4" size={48} />
                    <p className="text-gray-700 text-lg font-semibold mb-2">No designs found</p>
                    <p className="text-gray-500 mb-6">Try selecting a different category</p>
                    <button
                      onClick={handleClearFilters}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
                    >
                      Show All
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Video Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {videoProjects.map((video, index) => (
                    <VideoGalleryItem
                      key={video.id}
                      video={video}
                      index={index}
                    />
                  ))}
                </div>

                {videoProjects.length === 0 && (
                  <motion.div
                    initial={{ opacity, scale: 0.95 }}
                    animate={{ opacity, scale }}
                    className="text-center py-16 bg-white rounded-2xl border border-gray-200"
                  >
                    <Video className="text-gray-400 mx-auto mb-4" size={48} />
                    <p className="text-gray-700 text-lg font-semibold mb-2">No videos available</p>
                    <p className="text-gray-500">Check back soon for more content</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default Projects;
