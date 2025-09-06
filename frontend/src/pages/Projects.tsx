import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Shield, Eye, Gamepad, Search } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import headerBackground from '../assets/background image/project.png';
import faceguard from '../assets/project/face-Guard.png';
import ransomware from '../assets/project/Ransomware.png';
import Epicnexus from '../assets/project/Epic-nexus.png';
import recapImage from '../assets/project/redcap.png'; // You'll need to add this image

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

// --- Main Projects Component ---
const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const unique = new Set(projects.map(p => p.category));
    return ['All', ...Array.from(unique)];
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            project.tech.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Add JSON-LD structured data for SEO
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Edizo Projects Portfolio',
      description: 'A curated list of featured projects by Edizo in cybersecurity, AI, and web development.',
      url: 'https://www.edizo.in/projects',
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
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
  }, []);

  return (
    <>
      {/* JSON-LD added via useEffect */}
      <PageHeader
        title="Our Projects"
        subtitle="Innovative solutions delivering real business impact"
        backgroundImage={headerBackground}
      />

      <section className="bg-gray-50 py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                From cybersecurity to gaming platforms, we build solutions that solve real problems with cutting-edge technology.
              </p>
            </div>
          </AnimatedSection>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-between mb-10 md:mb-12">
            {/* Search */}
            <div className="relative w-full sm:w-2/3 lg:w-1/2">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by title, tech, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search projects"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${selectedCategory === category
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 ${project.gradient}`}
                  >
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
                  <p className="text-gray-500 text-lg">No projects match your search.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 text-red-600 hover:underline"
                  >
                    Clear filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;