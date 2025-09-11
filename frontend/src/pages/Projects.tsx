// src/pages/Projects.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Removed AnimatePresence import
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
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import placeholderImage from '../assets/placeholder.png'; // Fallback image

// --- Types ---
export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  timeline: string;
  shortDescription: string;
  fullDescription: string;
  tech: string[];
  features: string[];
  image: string;
  icon: JSX.IntrinsicElements;
  challenges: string;
  results: string;
  gradient: string;
}
interface GraphicsProject {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  description: string;
  image: string;
  type: string;
  dimensions: string;
  tools: string[];
  viewLink: string;
}

// --- Auto-Scrolling Gallery ---
const AutoScrollingGallery: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div
      className="relative w-full overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center mb-6 px-4">
        <Palette className="text-red-500 mr-2" size={24} />
        <h3 className="text-2xl font-bold text-gray-800">Our Creative Team</h3>
      </div>
      <div className="flex overflow-hidden">
        <motion.div
          animate={{ x: isPaused ? "0%" : "-50%" }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="flex flex-nowrap"
        >
          {[...Array(6)].map((_, index) => (
            <div
              key={`gallery-${index}`}
              className="flex-shrink-0 w-72 mx-3 transform transition-all duration-300 hover:scale-105"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white p-4 h-80">
                <img
                  src={`https://placehold.co/600x400/eee/999?text=Team+Member+${index + 1}`}
                  alt={`Team Member ${index + 1}`}
                  className="w-full h-48 object-cover rounded-xl"
                  loading="lazy"
                  onError={(e) => {
                    console.warn(`Failed to load gallery image`);
                    e.currentTarget.src = placeholderImage;
                  }}
                />
                <div className="mt-4 text-center">
                  <h4 className="text-lg font-semibold text-gray-900">Team Member {index + 1}</h4>
                  <p className="text-sm text-gray-600">Creative Designer</p>
                  <a
                    href="https://bytecode.edizo.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-1"
                  >
                    View Profile
                    <ExternalLink size={16} />
                  </a>
                </div>
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graphicsProjects, setGraphicsProjects] = useState<GraphicsProject[]>([]);

  // Extract categories
  const devCategories = ['All', 'Cybersecurity', 'Computer Vision & AI', 'Web Development', 'Full-Stack Development'];
  const graphicsCategories = ['All', 'Branding', 'UI/UX Design', 'Illustration'];

  // Fetch graphics projects (will be empty or fetch from external source)
  useEffect(() => {
    const fetchGraphicsProjects = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        // Simulate fetching from external source
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In a real app, this would be a fetch call to /data/graphics-design.json
        // For now, we'll just set it to an empty array to avoid the error
        setGraphicsProjects([]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching graphics projects:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setGraphicsProjects([]); // Fallback to empty array
        setLoading(false);
      }
    };
    fetchGraphicsProjects();
  }, []);

  // Filter logic
  const filteredDevProjects = devCategories.filter(category => 
    selectedCategory === 'All' || category === selectedCategory
  );

  const filteredGraphicsProjects = graphicsCategories.filter(category => 
    selectedCategory === 'All' || category === selectedCategory
  );

  // Add JSON-LD for SEO - ✅ FIXED URLs
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Edizo Projects Portfolio',
      description: 'A curated list of featured projects by Edizo in cybersecurity, AI, web development, and graphics design.',
      url: 'https://www.edizo.in/projects',
      numberOfItems: devCategories.length + graphicsCategories.length,
      itemListElement: [
        ...devCategories.map((category, index) => ({
          '@type': 'CreativeWork',
          position: index + 1,
          name: category,
          description: `Discover our work in ${category}`,
          category: category,
          creator: { '@type': 'Organization', name: 'Edizo' },
          thumbnailUrl: 'https://placehold.co/600x400/eee/999?text=Project+Thumbnail',
          url: 'https://bytecode.edizo.in',
        })),
        ...graphicsCategories.map((category, index) => ({
          '@type': 'CreativeWork',
          position: devCategories.length + index + 1,
          name: category,
          description: `Explore our creative work in ${category}`,
          category: category,
          creator: { '@type': 'Organization', name: 'Edizo' },
          thumbnailUrl: 'https://placehold.co/600x400/eee/999?text=Design+Thumbnail',
          url: 'https://bytecode.edizo.in',
        }))
      ]
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
  }, []); // Dependency array is correct

  // Handle error display for graphics tab specifically
  if (error && activeTab === 'graphics') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-16">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Projects</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()} // Simple retry
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Our Projects"
        subtitle={<AnimatedTypingSubtitle phrases={['Innovative Solutions', 'Creative Designs', 'Impactful Videos']} />}
      />
      <AutoScrollingGallery />
      <section className="bg-gray-50 py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover our expertise in crafting cutting-edge solutions, stunning graphics, and engaging videos that drive real impact.
                All project details are available on our dedicated platform.
              </p>
            </div>
          </AnimatedSection>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('development')}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm
                ${activeTab === 'development'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
            >
              <Shield size={18} />
              Development
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('graphics')}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm
                ${activeTab === 'graphics'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
            >
              <Palette size={18} />
              Graphics Design
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('video')}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm
                ${activeTab === 'video'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
            >
              <Video size={18} />
              Video Editing
            </motion.button>
          </div>

          {/* Search & View Mode */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div className="relative w-full sm:w-2/3 lg:w-1/2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'development' ? 'development projects' : activeTab === 'graphics' ? 'graphics projects' : 'video projects'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search projects"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm transition-all"
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
          {(activeTab === 'development' || activeTab === 'graphics') && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {(activeTab === 'development' ? devCategories : graphicsCategories).map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm
                    ${selectedCategory === category
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          )}

          {/* Projects Grid/List */}
          <div className="space-y-8">
            {activeTab === 'development' && (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${viewMode === 'list' ? 'md:grid-cols-1' : ''}`}>
                {filteredDevProjects.length > 0 ? (
                  filteredDevProjects.map((category) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 ${viewMode === 'list' ? 'md:flex' : ''}`}
                    >
                      {viewMode === 'list' ? (
                        <div className="md:flex">
                          <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                            <img
                              src={`https://placehold.co/600x400/eee/999?text=${encodeURIComponent(category)}`}
                              alt={category}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              loading="lazy"
                              onError={(e) => {
                                console.warn(`Failed to load project image for ${category}`);
                                e.currentTarget.src = placeholderImage;
                              }}
                            />
                          </div>
                          <div className="p-6 md:w-2/3">
                            <div className="flex items-center mb-3">
                              <div className="mr-3">
                                {category === 'Cybersecurity' && <Shield className="text-blue-500" size={24} />}
                                {category === 'Computer Vision & AI' && <Eye className="text-green-500" size={24} />}
                                {category === 'Web Development' && <Gamepad className="text-purple-500" size={24} />}
                                {category === 'Full-Stack Development' && <MapPin className="text-red-500" size={24} />}
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 truncate" title={category}>
                                {category}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              Explore detailed case studies, technical insights, and success stories for our {category.toLowerCase()} projects on our dedicated platform.
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                {category}
                              </span>
                              <a
                                href="https://bytecode.edizo.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 hover:text-red-700 font-medium flex items-center group"
                              >
                                View Projects
                                <ArrowRight
                                  size={16}
                                  className="ml-1 transition-transform group-hover:translate-x-1"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={`https://placehold.co/600x400/eee/999?text=${encodeURIComponent(category)}`}
                              alt={category}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              loading="lazy"
                              onError={(e) => {
                                console.warn(`Failed to load project image for ${category}`);
                                e.currentTarget.src = placeholderImage;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                {category}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center mb-3">
                              <div className="mr-3">
                                {category === 'Cybersecurity' && <Shield className="text-blue-500" size={24} />}
                                {category === 'Computer Vision & AI' && <Eye className="text-green-500" size={24} />}
                                {category === 'Web Development' && <Gamepad className="text-purple-500" size={24} />}
                                {category === 'Full-Stack Development' && <MapPin className="text-red-500" size={24} />}
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 truncate" title={category}>
                                {category}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              Explore detailed case studies, technical insights, and success stories for our {category.toLowerCase()} projects on our dedicated platform.
                            </p>
                            <a
                              href="https://bytecode.edizo.in"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700 font-medium flex items-center group mt-4"
                            >
                              View Projects
                              <ArrowRight
                                size={16}
                                className="ml-1 transition-transform group-hover:translate-x-1"
                              />
                            </a>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    key="no-results-dev"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-12"
                  >
                    <p className="text-gray-500 text-lg">No development projects match your search.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                      }}
                      className="mt-4 text-red-600 hover:underline font-semibold"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                )}
              </div>
            )}
            {activeTab === 'graphics' && (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${viewMode === 'list' ? 'md:grid-cols-1' : ''}`}>
                {loading ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-600">Loading graphics design projects...</p>
                  </div>
                ) : error ? (
                 <div className="col-span-full text-center py-12">
                    <p className="text-red-600">Failed to load graphics projects: {error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 text-red-600 hover:underline font-semibold"
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredGraphicsProjects.length > 0 ? (
                  filteredGraphicsProjects.map((category) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 ${viewMode === 'list' ? 'md:flex' : ''}`}
                    >
                      {viewMode === 'list' ? (
                        <div className="md:flex">
                          <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                            <img
                              src={`https://placehold.co/600x400/eee/999?text=${encodeURIComponent(category)}`}
                              alt={category}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              loading="lazy"
                              onError={(e) => {
                                console.warn(`Failed to load graphics project image for ${category}`);
                                e.currentTarget.src = placeholderImage;
                              }}
                            />
                          </div>
                          <div className="p-6 md:w-2/3">
                            <div className="flex items-center mb-3">
                              <Palette className="text-blue-500 mr-3" size={24} />
                              <h3 className="text-xl font-bold text-gray-900 truncate" title={category}>
                                {category}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              Explore our portfolio of creative work, including branding, UI/UX design, and illustration projects on our dedicated platform.
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                {category}
                              </span>
                              <a
                                href="https://bytecode.edizo.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 hover:text-red-700 font-medium flex items-center group"
                              >
                                View Designs
                                <ArrowRight
                                  size={16}
                                  className="ml-1 transition-transform group-hover:translate-x-1"
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={`https://placehold.co/600x400/eee/999?text=${encodeURIComponent(category)}`}
                              alt={category}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              loading="lazy"
                              onError={(e) => {
                                console.warn(`Failed to load graphics project image for ${category}`);
                                e.currentTarget.src = placeholderImage;
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                {category}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <div className="flex items-center mb-3">
                              <Palette className="text-blue-500 mr-3" size={24} />
                              <h3 className="text-xl font-bold text-gray-900 truncate" title={category}>
                                {category}
                              </h3>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              Explore our portfolio of creative work, including branding, UI/UX design, and illustration projects on our dedicated platform.
                            </p>
                            <a
                              href="https://bytecode.edizo.in"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-700 font-medium flex items-center group mt-4"
                            >
                              View Designs
                              <ArrowRight
                                size={16}
                                className="ml-1 transition-transform group-hover:translate-x-1"
                              />
                            </a>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    key="no-results-graphics"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-12"
                  >
                    <p className="text-gray-500 text-lg">No graphics projects match your search.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                      }}
                      className="mt-4 text-red-600 hover:underline font-semibold"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                )}
              </div>
            )}
            {activeTab === 'video' && (
              <div className="text-center py-16">
                <Video className="text-gray-400 mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Video Editing Projects</h3>
                <p className="text-gray-500">This section is currently under development. Please check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;