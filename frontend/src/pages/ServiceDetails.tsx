import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code,
  TrendingUp,
  PenTool,
  Check,
  MessageSquare,
  Award,
  ArrowRight,
  ChevronLeft,
  Smartphone,
  Star,
  Palette,
  Video,
  ExternalLink,
} from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import Button from '../components/common/Button';
import { projects } from './Projects'; // Import projects array

// Define interfaces locally (move to Projects.tsx and export if possible)
interface Project {
  id: string;
  title: string;
  image: string;
  shortDescription: string;
  category: string;
  tech: string[];
}

interface GraphicsDesignProject {
  id: string;
  title: string;
  image: string;
  description: string;
  type: string;
  tools: string[];
  viewLink: string;
}

interface VideoEditingProject {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  type: string;
  tools: string[];
  videoLink: string;
}

// Import service banner images
import webDevImg from '../assets/services/banner/website design ban.webp';
import uiuxImg from '../assets/services/banner/graphic design ban.webp';
import videoEditingImg from '../assets/services/banner/video editing ban.webp';
import graphicDesignImg from '../assets/services/banner/graphic design ban.webp';
import appDesignImg from '../assets/services/banner/app design ban.webp';

// Fallback image
const fallbackImage = 'https://placehold.co/1200x400/DEE2E6/495057?text=Service+Details';

// Shared Why Choose Edizo content
const whyChooseEdizoServiceContent = [
  'Creative, Custom-First Approach',
  'On-Time Project Delivery',
  'Affordable & Transparent Pricing',
  'Friendly Support & Professional Team',
];

// Define Service interface
interface Service {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  features: string[];
  whyChooseEdizo: string[];
  technologies: string[];
  process: string[];
}

// Service Data
const servicesData: Record<string, Service> = {
  'video-editing': {
    title: 'Video Editing',
    subtitle: 'Professional video production and editing services',
    description:
      'We turn raw footage into polished, engaging content. Whether it’s for social media, corporate events, or promotions, our editing enhances visual appeal and storytelling.',
    image: videoEditingImg,
    icon: TrendingUp,
    features: [
      'Promotional Videos & Intros',
      'Reels, Shorts & YouTube Edits',
      'Event Highlights & Corporate Videos',
      'Motion Graphics & Animations',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent,
    technologies: ['Adobe Premiere', 'After Effects', 'Final Cut Pro', 'DaVinci Resolve'],
    process: ['Footage Review', 'Editing', 'Color Grading', 'Sound Mixing', 'Final Review', 'Delivery'],
  },
  'graphic-design': {
    title: 'Graphic Design',
    subtitle: 'Creative visual content for branding and marketing',
    description:
      'Great design builds strong brands. Our creative team brings ideas to life with visuals that are both impactful and purpose-driven across digital and print media.',
    image: graphicDesignImg,
    icon: PenTool,
    features: [
      'Logo Design & Brand Identity',
      'Posters, Brochures & Business Cards',
      'Certificates, Banners & Flyers',
      'Social Media Post & Ad Designs',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent,
    technologies: ['Photoshop', 'Illustrator', 'InDesign', 'Canva'],
    process: ['Briefing', 'Concept Development', 'Design Creation', 'Revisions', 'Finalization'],
  },
  'web-development': {
    title: 'Web Development',
    subtitle: 'Custom web solutions that drive business growth',
    description:
      'We build responsive and high-performance websites tailored to your business needs — from personal portfolios to full-scale e-commerce platforms.',
    image: webDevImg,
    icon: Code,
    features: [
      'Business & Portfolio Websites',
      'E-Commerce & Dynamic Sites',
      'Frontend & Backend Development',
      'SEO-Friendly, Mobile-Optimized Design',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent,
    technologies: ['React', 'Vue.js', 'Node.js', 'PHP', 'WordPress', 'MongoDB', 'MySQL'],
    process: [
      'Requirement Analysis',
      'UI/UX Design',
      'Development',
      'Quality Assurance',
      'Deployment',
      'Maintenance',
    ],
  },
  'app-development': {
    title: 'App Development',
    subtitle: 'Crafting intuitive and engaging mobile experiences',
    description:
      'We create sleek, user-friendly mobile apps that combine function with form. Our development process ensures smooth performance across Android and iOS platforms.',
    image: appDesignImg,
    icon: Smartphone,
    features: [
      'Android & iOS App Development',
      'UI/UX Design for Apps',
      'Service & Business-Based Applications',
      'Development using React Native, Flutter & Native Tools',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent,
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
    process: [
      'Discovery & Strategy',
      'UI/UX Design',
      'Development',
      'Testing',
      'Deployment',
      'Post-Launch Support',
    ],
  },
  'ui-ux': {
    title: 'UI/UX Design',
    subtitle: 'User-centered design solutions for exceptional experiences',
    description:
      'User-centered design solutions that create intuitive, engaging interfaces for digital products.',
    image: uiuxImg,
    icon: PenTool,
    features: [
      'User Research',
      'Information Architecture',
      'Wireframing',
      'Visual Design',
      'Usability Testing',
      'Interaction Design',
      'Responsive Design',
      'Design Systems',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent,
    technologies: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Zeplin'],
    process: [
      'User Research',
      'Wireframing',
      'Prototyping',
      'UI Design',
      'User Testing',
      'Implementation',
    ],
  },
};

// Related Projects Component
const RelatedProjects: React.FC<{
  serviceId: string;
  graphicsProjects: GraphicsDesignProject[];
  videoProjects: VideoEditingProject[];
  developmentProjects: Project[];
}> = ({ serviceId, graphicsProjects, videoProjects, developmentProjects }) => {
  let relatedProjects: (GraphicsDesignProject | VideoEditingProject | Project)[] = [];
  let projectType: 'graphics' | 'video' | 'development' = 'development';

  if (serviceId === 'graphic-design') {
    relatedProjects = graphicsProjects.slice(0, 3); // Show up to 3 graphics projects
    projectType = 'graphics';
  } else if (serviceId === 'video-editing') {
    relatedProjects = videoProjects.slice(0, 3); // Show up to 3 video projects
    projectType = 'video';
  } else {
    // Map service IDs to project categories
    const categoryMap: Record<string, string> = {
      'web-development': 'Web Development',
      'app-development': 'Full-Stack Development',
      'ui-ux': 'Computer Vision & AI',
    };
    const targetCategory = categoryMap[serviceId];
    relatedProjects = developmentProjects.filter((project) => project.category === targetCategory).slice(0, 3);
  }

  if (relatedProjects.length === 0) return null;

  // Helper function to get image source
  const getImageSrc = (project: GraphicsDesignProject | VideoEditingProject | Project): string => {
    if ('image' in project) return project.image; // GraphicsDesignProject or Project
    if ('thumbnail' in project) return project.thumbnail; // VideoEditingProject
    return ''; // Fallback (should not occur given the interfaces)
  };

  return (
    <AnimatedSection>
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Award className="text-red-600 mr-2" size={24} />
          Related Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProjects.map((project) => (
            <div key={project.id} className="group relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-100 bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getImageSrc(project)}
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
                      className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center"
                    >
                      {projectType === 'graphics' ? (
                        <Palette className="text-red-600" size={28} />
                      ) : projectType === 'video' ? (
                        <Video className="text-red-600" size={28} />
                      ) : (
                        <Star className="text-red-600" size={28} />
                      )}
                    </motion.div>
                  </motion.div>
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {projectType === 'graphics'
                      ? (project as GraphicsDesignProject).type.toUpperCase()
                      : projectType === 'video'
                      ? (project as VideoEditingProject).type.toUpperCase()
                      : (project as Project).category}
                  </div>
                  {projectType !== 'development' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-4 right-4 bg-white text-red-600 text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:bg-red-100 transition-colors"
                    >
                      <a
                        href={'viewLink' in project ? project.viewLink : (project as VideoEditingProject).videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        {projectType === 'graphics' ? 'View Design' : 'Watch Video'}
                        <ExternalLink size={16} className="ml-2" />
                      </a>
                    </motion.div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {projectType === 'graphics' ? (
                      <Palette className="text-red-500 mr-3" size={24} />
                    ) : projectType === 'video' ? (
                      <Video className="text-red-500 mr-3" size={24} />
                    ) : (
                      <Star className="text-red-500 mr-3" size={24} />
                    )}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate" title={project.title}>
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {'description' in project ? project.description : project.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {('tools' in project ? project.tools : project.tech).slice(0, 3).map((tool: string, i: number) => (
                      <span
                        key={i}
                        className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {tool}
                      </span>
                    ))}
                    {('tools' in project ? project.tools : project.tech).length > 3 && (
                      <span className="text-xs text-gray-500">+{('tools' in project ? project.tools : project.tech).length - 3} more</span>
                    )}
                  </div>
                  {projectType === 'development' && (
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-red-600 hover:text-red-700 font-medium flex items-center group"
                    >
                      View Project
                      <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const service = id ? servicesData[id] : null;
  const [graphicsProjects, setGraphicsProjects] = useState<GraphicsDesignProject[]>([]);
  const [videoProjects, setVideoProjects] = useState<VideoEditingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load JSON data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const graphicsResponse = await fetch('/data/graphics-design.json');
        if (!graphicsResponse.ok) throw new Error('Failed to load graphics design data');
        const graphicsData = await graphicsResponse.json();
        setGraphicsProjects(graphicsData);

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

  // Generate related services
  const relatedServices = useMemo(() => {
    if (!id) return [];
    return Object.entries(servicesData)
      .filter(([key]) => key !== id)
      .slice(0, 3);
  }, [id]);

  // Set page title
  useEffect(() => {
    if (service) {
      document.title = `${service.title} | Edizo Digital Agency`;
    }
  }, [service]);

  // Add JSON-LD structured data for SEO
  useEffect(() => {
    if (!service || !id) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceName: service.title,
      description: service.description,
      provider: {
        '@type': 'Organization',
        name: 'Edizo',
        url: 'https://www.edizo.in',
        logo: 'https://www.edizo.in/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-9876543210',
          contactType: 'Customer Service',
          areaServed: 'Worldwide',
          availableLanguage: 'English',
        },
      },
      offers: {
        '@type': 'Offer',
        price: 'variable',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: `https://www.edizo.in/services/${id}`,
      },
      areaServed: 'Worldwide',
      audience: {
        '@type': 'Audience',
        audienceType: 'Startups, SMEs, Entrepreneurs, Designers, Developers',
      },
      serviceOutput: service.features,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Technologies Used',
        itemListElement: service.technologies.map((tech) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: tech,
          },
        })),
      },
      review: {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5.0',
          bestRating: '5.0',
        },
        author: {
          '@type': 'Person',
          name: 'Edizo Client',
        },
        reviewBody: 'Delivered on time and exceeded expectations. Highly recommend!',
      },
    };

    const scriptId = 'service-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.setAttribute('data-testid', 'json-ld');
      document.head.appendChild(script);
    }

    script.innerHTML = JSON.stringify(schema);

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [service, id]);

  if (!id || !service) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Service Not Found</h2>
          <p className="text-lg text-gray-600 mb-6">
            The service you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <ChevronLeft size={18} className="mr-2" />
            Back to Services
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-red-600">Error Loading Projects</h2>
          <p className="text-lg text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  const Icon = service.icon;

  return (
    <>
      {/* Page Header */}
      <PageHeader
        title={service.title}
        subtitle={service.subtitle}
        backgroundImage={service.image || fallbackImage}
      />

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3 space-y-12">
              <AnimatedSection>
                <Link
                  to="/services"
                  className="inline-flex items-center text-red-600 hover:text-red-700 mb-6 transition-colors group"
                >
                  <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-medium">Back to Services</span>
                </Link>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Overview</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">{service.description}</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Check className="text-green-500 mr-2" size={24} />
                    What We Offer
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
                      >
                        <Check className="text-green-500 mt-1 mr-3 flex-shrink-0" size={18} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Star className="text-yellow-500 mr-2" size={24} />
                    Why Choose Edizo?
                  </h3>
                  <ul className="space-y-3">
                    {service.whyChooseEdizo.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="text-blue-600 mr-2" size={24} />
                    Our Process
                  </h3>
                  <div className="relative pl-12">
                    <div className="absolute left-6 top-0 h-full w-0.5 bg-blue-300" />
                    <div className="space-y-8">
                      {service.process.map((step, index) => (
                        <div key={index} className="relative">
                          <div className="absolute left-4 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm z-10">
                            {index + 1}
                          </div>
                          <div className="ml-16 bg-gray-50 p-5 rounded-xl hover:shadow transition-shadow">
                            <h4 className="text-xl font-semibold text-gray-900">{step}</h4>
                            <p className="text-gray-600 mt-1">Step {index + 1} of your journey with us.</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Code className="text-blue-600 mr-2" size={24} />
                    Technologies We Use
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {service.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related Projects Section */}
                <RelatedProjects
                  serviceId={id}
                  graphicsProjects={graphicsProjects}
                  videoProjects={videoProjects}
                  developmentProjects={projects}
                />
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <AnimatedSection delay={0.2}>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-6">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mr-4">
                      <Icon className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                      <p className="text-gray-600 text-sm">{service.subtitle}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <MessageSquare className="mr-2 text-red-600" size={20} />
                      Let’s Talk
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Ready to bring your {service.title.toLowerCase()} vision to life?
                    </p>
                    <Button
                      to="/contact"
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      Get Free Consultation
                    </Button>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                      <Award className="mr-2 text-red-600" size={20} />
                      Related Services
                    </h4>
                    <ul className="space-y-2">
                      {relatedServices.map(([key, rel]) => (
                        <li key={key}>
                          <Link
                            to={`/services/${key}`}
                            className="flex items-center text-gray-700 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-all group"
                          >
                            <ArrowRight className="mr-2 opacity-0 group-hover:opacity-100 text-red-600 group-hover:translate-x-1 transition-all" size={16} />
                            <span>{rel.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetails;