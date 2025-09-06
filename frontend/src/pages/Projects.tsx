import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  MapPin, 
  Shield, 
  Eye, 
  Gamepad, 
  Search,
  Image as ImageIcon,
  Video,
  Palette,
  ExternalLink,
  Grid,
  List,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import headerBackground from '../assets/background image/project.png';
import faceguard from '../assets/project/face-Guard.png';
import ransomware from '../assets/project/Ransomware.png';
import Epicnexus from '../assets/project/Epic-nexus.png';
import recapImage from '../assets/project/redcap.png';

// --- Project Data ---
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
  icon: JSX.Element;
  challenges: string;
  results: string;
  gradient: string;
}

export const projects: Project[] = [
  {
    id: 'ai-ransomware-detection',
    title: 'AI-Based Ransomware Detection System',
    category: 'Cybersecurity',
    location: 'Remote / Bangalore, India',
    timeline: 'Q2 2025',
    shortDescription: 'An AI system for detecting and preventing ransomware attacks in real-time',
    fullDescription: 'This advanced cybersecurity solution uses machine learning to detect ransomware behavior patterns before encryption begins. The system combines LSTM networks for sequence analysis with Isolation Forest algorithms for anomaly detection, achieving 98.7% accuracy in our tests. It monitors file system activities, network traffic, and process behaviors to identify threats.',
    tech: ['Python', 'TensorFlow', 'LSTM', 'Isolation Forest', 'PyTorch'],
    features: [
      'Real-time monitoring of system activities',
      'Behavioral analysis of processes',
      'Early detection before encryption starts',
      'Automated threat containment',
      'Detailed threat reporting dashboard'
    ],
    image: ransomware,
    icon: <Shield className="text-blue-500" size={24} />,
    challenges: 'Developing a system that could detect ransomware with minimal false positives while maintaining system performance was our biggest challenge. We solved this by implementing a two-stage detection process.',
    results: 'Reduced ransomware infection risk by 95% for our client base, with less than 0.5% false positive rate in production environments.',
    gradient: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
  },
  {
    id: 'faceguard-gan',
    title: 'FaceGuard-GAN Deepfake Detection',
    category: 'Computer Vision & AI',
    location: 'Remote / Singapore',
    timeline: 'Q3 2025',
    shortDescription: 'GAN-powered solution for detecting manipulated facial images and videos',
    fullDescription: 'FaceGuard-GAN is our proprietary deepfake detection system that uses generative adversarial networks to identify manipulated media. The system analyzes subtle facial micro-expressions, lighting inconsistencies, and texture patterns that are often missed by conventional detection methods. It integrates seamlessly with existing identity verification workflows.',
    tech: ['GAN', 'Vision Transformer', 'TensorFlow', 'OpenCV', 'PyTorch'],
    features: [
      'Real-time deepfake detection',
      'API for integration with eKYC systems',
      'Detailed manipulation analysis',
      'Continuous learning from new threats',
      'Multi-modal detection (images & video)'
    ],
    image: faceguard,
    icon: <Eye className="text-green-500" size={24} />,
    challenges: 'Keeping pace with rapidly evolving deepfake generation techniques required us to develop an adaptive learning system that updates its detection models weekly.',
    results: 'Achieved 99.2% accuracy in detecting state-of-the-art deepfakes during independent testing by Singapore\'s Cybersecurity Agency.',
    gradient: 'bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50'
  },
  {
    id: 'epic-nexus-platform',
    title: 'Epic Nexus Gaming Community Platform',
    category: 'Web Development',
    location: 'Remote / San Francisco, CA',
    timeline: 'Q1 2025',
    shortDescription: 'Comprehensive gaming community platform with social features and reviews',
    fullDescription: 'Epic Nexus is a feature-rich gaming platform that brings together gamers, content creators, and hardware enthusiasts. The platform includes forums, game libraries, hardware benchmarking tools, and content sharing capabilities. Our custom recommendation engine personalizes the experience for each user based on their gaming preferences and hardware setup.',
    tech: ['React', 'Node.js', 'MongoDB', 'GraphQL', 'Redis'],
    features: [
      'Personalized game recommendations',
      'Hardware benchmarking tools',
      'Community forums and groups',
      'Integrated streaming support'
    ],
    image: Epicnexus,
    icon: <Gamepad className="text-purple-500" size={24} />,
    challenges: 'Handling real-time updates across a large user base while maintaining performance required innovative caching strategies and database optimizations.',
    results: 'Grew to 250,000 monthly active users within 6 months of launch, with 78% user retention rate.',
    gradient: 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50'
  },
  {
    id: 'redcap-logistics-platform',
    title: 'RedCap Logistics Platform',
    category: 'Full-Stack Development',
    location: 'Namakkal, India',
    timeline: 'Q4 2024',
    shortDescription: 'End-to-end logistics platform with web and mobile applications',
    fullDescription: 'RedCap is a comprehensive logistics platform connecting customers with transport providers for on-demand delivery services. The platform includes a React web application for customers and businesses, an Express.js backend with MySQL database, and a Flutter mobile app for drivers. The system handles booking, real-time tracking, payment processing, and analytics.',
    tech: ['React', 'Express.js', 'MySQL', 'Flutter'],
    features: [
      'Real-time vehicle tracking with GPS',
      'Automated booking and dispatch system',
      'Multi-platform support (Web & Mobile)',
      'Secure payment gateway integration',
      'Analytics dashboard for business customers'
    ],
    image: recapImage,
    icon: <MapPin className="text-red-500" size={24} />,
    challenges: 'Synchronizing real-time data across web and mobile platforms while maintaining performance under high load was our main challenge. We implemented WebSocket connections and optimized database queries.',
    results: 'Reduced booking time by 70% and improved driver utilization by 45%. The platform now handles over 5,000 daily transactions.',
    gradient: 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50'
  }
];

// --- Types for JSON data ---
interface GraphicsDesignProject {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  description: string;
  image: string;
  type: 'logo' | 'poster' | 'banner' | 'brochure' | 'branding';
  dimensions: string;
  tools: string[];
  viewLink: string;
}

interface VideoEditingProject {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  description: string;
  thumbnail: string;
  duration: string;
  resolution: string;
  tools: string[];
  videoLink: string;
  type: 'promotional' | 'tutorial' | 'event' | 'social';
}

// --- Typing Animation Component ---
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

// --- Image Gallery View ---
const ImageGalleryView: React.FC<{ projects: GraphicsDesignProject[] }> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="group relative"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 bg-white transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center"
                >
                  <ImageIcon className="text-red-600" size={32} />
                </motion.div>
              </motion.div>
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {project.type.toUpperCase()}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 right-4 bg-white text-red-600 text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:bg-red-100 transition-colors"
              >
                <a
                  href={project.viewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  View Design
                  <ExternalLink size={16} className="ml-2" />
                </a>
              </motion.div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Palette className="text-red-500 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate" title={project.title}>
                  {project.title}
                </h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <span>{project.client}</span>
                  <span className="mx-2">•</span>
                  <span>{project.year}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Video Gallery View ---
const VideoGalleryView: React.FC<{ projects: VideoEditingProject[] }> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="group relative"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 bg-white transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center"
                >
                  <Video className="text-red-600" size={32} />
                </motion.div>
              </motion.div>
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {project.type.toUpperCase()}
              </div>
              <div className="absolute top-4 right-4 bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {project.duration}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 right-4 bg-white text-red-600 text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:bg-red-100 transition-colors"
              >
                <a
                  href={project.videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Watch Video
                  <ExternalLink size={16} className="ml-2" />
                </a>
              </motion.div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Video className="text-red-500 mr-3" size={24} />
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate" title={project.title}>
                  {project.title}
                </h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <span>{project.client}</span>
                  <span className="mx-2">•</span>
                  <span>{project.resolution}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- Main Projects Component ---
const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'development' | 'graphics' | 'video'>('development');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [graphicsProjects, setGraphicsProjects] = useState<GraphicsDesignProject[]>([]);
  const [videoProjects, setVideoProjects] = useState<VideoEditingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract unique categories for development projects
  const categories = ['All', ...new Set(projects.map(p => p.category))];

  // Load JSON data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load graphics design projects
        const graphicsResponse = await fetch('/data/graphics-design.json');
        if (!graphicsResponse.ok) throw new Error('Failed to load graphics design data');
        const graphicsData = await graphicsResponse.json();
        setGraphicsProjects(graphicsData);
        
        // Load video editing projects
        const videoResponse = await fetch('/data/video-editing.json');
        if (!videoResponse.ok) throw new Error('Failed to load video editing data');
        const videoData = await videoResponse.json();
        setVideoProjects(videoData);
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Filter development projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter graphics design projects
  const filteredGraphicsProjects = graphicsProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter video editing projects
  const filteredVideoProjects = videoProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add JSON-LD structured data for SEO
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Edizo Projects Portfolio',
      description: 'A curated list of featured projects by Edizo in cybersecurity, AI, web development, graphics design, and video editing.',
      url: 'https://www.edizo.in/projects',
      numberOfItems: projects.length + graphicsProjects.length + videoProjects.length,
      itemListElement: [
        ...projects.map((project, index) => ({
          '@type': 'CreativeWork',
          position: index + 1,
          name: project.title,
          description: project.shortDescription,
          category: project.category,
          datePublished: project.timeline,
          creator: {
            '@type': 'Organization',
            name: 'Edizo'
          },
          thumbnailUrl: project.image,
          url: `https://www.edizo.in/projects/${project.id}`
        })),
        ...graphicsProjects.map((project, index) => ({
          '@type': 'CreativeWork',
          position: index + 1 + projects.length,
          name: project.title,
          description: project.description,
          category: 'Graphics Design',
          datePublished: project.year,
          creator: {
            '@type': 'Organization',
            name: 'Edizo'
          },
          thumbnailUrl: project.image,
          url: project.viewLink
        })),
        ...videoProjects.map((project, index) => ({
          '@type': 'CreativeWork',
          position: index + 1 + projects.length + graphicsProjects.length,
          name: project.title,
          description: project.description,
          category: 'Video Editing',
          datePublished: project.year,
          creator: {
            '@type': 'Organization',
            name: 'Edizo'
          },
          thumbnailUrl: project.thumbnail,
          url: project.videoLink
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
  }, [projects, graphicsProjects, videoProjects]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Projects</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
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
        backgroundImage={headerBackground}
      />

      <section className="bg-gray-50 py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover our expertise in crafting cutting-edge solutions, stunning graphics, and engaging videos that drive real impact.
              </p>
            </div>
          </AnimatedSection>

          {/* Tabs Navigation */}
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

          {/* Search and View Controls */}
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

          {/* Category Filter for Development Projects */}
          {activeTab === 'development' && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((category) => (
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

          {/* Projects Content */}
          <div className="space-y-8">
            {activeTab === 'development' ? (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${viewMode === 'list' ? 'md:grid-cols-1' : ''}`}>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 ${project.gradient} ${viewMode === 'list' ? 'md:flex' : ''}`}
                    >
                      {viewMode === 'list' ? (
                        <div className="md:flex">
                          <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-6 md:w-2/3">
                            <div className="flex items-center mb-3">
                              <div className="mr-3">{project.icon}</div>
                              <h3 className="text-xl font-bold text-gray-900 truncate" title={project.title}>
                                {project.title}
                              </h3>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {project.shortDescription}
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mb-4">
                              {project.tech.slice(0, 3).map((tech, i) => (
                                <span
                                  key={i}
                                  className="bg-white text-gray-800 text-xs px-2 py-1 rounded border border-gray-200 shadow-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.tech.length > 3 && (
                                <span className="text-xs text-gray-500">+{project.tech.length - 3} more</span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="mr-1" size={14} />
                                <span>{project.location.split(',')[0].trim()}</span>
                              </div>
                              <Link
                                to={`/projects/${project.id}`}
                                className="text-red-600 hover:text-red-700 font-medium flex items-center group"
                              >
                                Details
                                <ArrowRight
                                  size={16}
                                  className="ml-1 transition-transform group-hover:translate-x-1"
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-3 left-3">
                              <span className="bg-white text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                                {project.category}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <div className="flex items-center mb-3">
                              <div className="mr-3">{project.icon}</div>
                              <h3 className="text-xl font-bold text-gray-900 truncate" title={project.title}>
                                {project.title}
                              </h3>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {project.shortDescription}
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mb-4">
                              {project.tech.slice(0, 3).map((tech, i) => (
                                <span
                                  key={i}
                                  className="bg-white text-gray-800 text-xs px-2 py-1 rounded border border-gray-200 shadow-sm"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.tech.length > 3 && (
                                <span className="text-xs text-gray-500">+{project.tech.length - 3} more</span>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="mr-1" size={14} />
                                <span>{project.location.split(',')[0].trim()}</span>
                              </div>
                              <Link
                                to={`/projects/${project.id}`}
                                className="text-red-600 hover:text-red-700 font-medium flex items-center group"
                              >
                                Details
                                <ArrowRight
                                  size={16}
                                  className="ml-1 transition-transform group-hover:translate-x-1"
                                />
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
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
            ) : activeTab === 'graphics' ? (
              <ImageGalleryView projects={filteredGraphicsProjects} />
            ) : (
              <VideoGalleryView projects={filteredVideoProjects} />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;