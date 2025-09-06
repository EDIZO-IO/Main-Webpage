import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Check,
  Users,
  BarChart2,
  Cpu,
  Clock,
  ArrowRight,
  Globe,
  Smartphone,
  Database,
  Truck,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import { projects, type Project } from './Projects';
import { motion } from 'framer-motion';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p: Project) => p.id === id);

  // If project not found
  if (!project) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Project Not Found</h2>
          <p className="text-lg text-gray-600 mb-6">
            The project you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Projects
          </Link>
        </div>
      </section>
    );
  }

  // Set page title
  useEffect(() => {
    document.title = `${project.title} | Edizo Projects`;
  }, [project.title]);

  // Add JSON-LD structured data for SEO
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.shortDescription,
      about: project.category,
      image: project.image,
      datePublished: project.timeline,
      creator: {
        '@type': 'Organization',
        name: 'Edizo',
        url: 'https://www.edizo.in',
      },
      locationCreated: {
        '@type': 'Place',
        name: project.location.split(',')[0].trim(),
      },
      workFeatured: project.tech.map((tech) => ({
        '@type': 'DefinedTerm',
        name: tech,
        inDefinedTermSet: 'https://schema.org/ComputerLanguage',
      })),
      text: project.fullDescription,
      url: `https://www.edizo.in/projects/${project.id}`,
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'project-schema';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('project-schema');
      if (existing) document.head.removeChild(existing);
    };
  }, [project]);

  // Related projects logic
  const relatedProjects = projects
    .filter(
      (p: Project) =>
        p.id !== project.id &&
        (p.category === project.category ||
          p.tech.some((tech) => project.tech.includes(tech)))
    )
    .slice(0, 3);

  return (
    <>
      <PageHeader
        title={project.title}
        subtitle={project.category}
        backgroundImage={project.image}
        style={{ 
          background: 'linear-gradient(to right, #1e40af, #7c3aed)'
        }}
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <AnimatedSection>
                <Link
                  to="/projects"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group transition-colors duration-300"
                >
                  <ArrowLeft className="mr-1 transition-transform group-hover:-translate-x-1" size={18} />
                  <span className="font-medium">Back to Projects</span>
                </Link>

                <div className="flex items-center mb-6">
                  <div className="mr-4">{project.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{project.title}</h2>
                    <p className="text-lg text-gray-600">{project.shortDescription}</p>
                  </div>
                </div>

                <div className="prose max-w-none text-gray-700 mb-8 leading-relaxed">
                  <p>{project.fullDescription}</p>
                  
                  {/* Enhanced UI for RedCap project */}
                  {project.id === 'redcap-logistics-platform' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="mt-8 p-8 bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 rounded-2xl border border-red-100 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center mb-6">
                        <Globe className="text-red-600 mr-3" size={28} />
                        <h3 className="text-2xl font-bold text-red-800">RedCap Logistics Platform</h3>
                      </div>
                      
                      <p className="mb-6 text-gray-700 text-lg">
                        Experience seamless logistics with our state-of-the-art platform.{' '}
                        <a 
                          href="https://recapweb.netlify.app/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-red-600 hover:text-red-800 font-semibold hover:underline transition-colors duration-200"
                        >
                          Visit Live Site
                        </a>
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-100"
                        >
                          <Globe className="mr-3 text-blue-600" size={24} />
                          <div>
                            <div className="font-semibold text-gray-900">Web Application</div>
                            <div className="text-sm text-gray-600">React.js Frontend</div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-100"
                        >
                          <Smartphone className="mr-3 text-green-600" size={24} />
                          <div>
                            <div className="font-semibold text-gray-900">Mobile App</div>
                            <div className="text-sm text-gray-600">Flutter Framework</div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-100"
                        >
                          <Database className="mr-3 text-red-600" size={24} />
                          <div>
                            <div className="font-semibold text-gray-900">Database</div>
                            <div className="text-sm text-gray-600">MySQL Backend</div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-100"
                        >
                          <Truck className="mr-3 text-orange-600" size={24} />
                          <div>
                            <div className="font-semibold text-gray-900">Backend</div>
                            <div className="text-sm text-gray-600">Express.js Server</div>
                          </div>
                        </motion.div>
                      </div>
                      
                      <div className="mt-8">
                        <h4 className="font-semibold text-gray-900 text-lg mb-4">Key Features:</h4>
                        <ul className="space-y-3">
                          {[
                            'On-demand transportation for goods of all sizes',
                            'Real-time vehicle tracking with GPS',
                            'Enterprise logistics management',
                            'Packers and movers services',
                            'Intercity courier services',
                          ].map((feature, i) => (
                            <motion.li 
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start"
                            >
                              <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                              <span className="text-gray-700">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <motion.a
                        href="https://recapweb.netlify.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md"
                      >
                        <Globe className="mr-2" size={20} />
                        Explore RedCap Now
                      </motion.a>
                    </motion.div>
                  )}
                </div>

                {/* Highlights & Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <Users className="mr-2 text-blue-600" size={20} />
                      Project Highlights
                    </h3>
                    <ul className="space-y-3">
                      {project.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" size={16} />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <BarChart2 className="mr-2 text-blue-600" size={20} />
                      Key Results
                    </h3>
                    <p className="text-gray-700">{project.results}</p>
                  </motion.div>
                </div>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <AnimatedSection delay={0.2}>
                <div className="bg-white rounded-xl p-6 sticky top-6 shadow-md border border-gray-200">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900">Project Details</h3>
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <MapPin className="mr-3 mt-1 text-gray-500" size={18} />
                      <div>
                        <h4 className="font-medium text-gray-900">Location</h4>
                        <p className="text-gray-600">{project.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar className="mr-3 mt-1 text-gray-500" size={18} />
                      <div>
                        <h4 className="font-medium text-gray-900">Timeline</h4>
                        <p className="text-gray-600">{project.timeline}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Cpu className="mr-3 mt-1 text-gray-500" size={18} />
                      <div>
                        <h4 className="font-medium text-gray-900">Technologies</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.tech.map((tech, i) => (
                            <span
                              key={i}
                              className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="mr-3 mt-1 text-gray-500" size={18} />
                      <div>
                        <h4 className="font-medium text-gray-900">Challenges</h4>
                        <p className="text-gray-600">{project.challenges}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Gallery */}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Project Gallery</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="aspect-w-1 aspect-h-1"
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover rounded-lg shadow-md border border-gray-100"
                          loading="lazy"
                        />
                      </motion.div>
                      <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm font-medium">
                        +2 Screenshots
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Live Demo Button for RedCap Project */}
                  {project.id === 'redcap-logistics-platform' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 pt-6 mt-6"
                    >
                      <motion.a 
                        href="https://recapweb.netlify.app/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-md"
                      >
                        <Globe className="mr-2" size={20} />
                        Visit Live Website
                      </motion.a>
                    </motion.div>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="mt-20">
              <AnimatedSection>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedProjects.map((related: Project) => (
                    <Link
                      to={`/projects/${related.id}`}
                      key={related.id}
                      className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 group"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50" />
                        <div className="absolute bottom-2 left-2">
                          <span className="bg-white text-gray-900 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {related.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{related.shortDescription}</p>
                        <div className="flex items-center text-sm font-medium text-red-600 group-hover:text-red-800">
                          View Details
                          <ArrowRight className="ml-1 transition-transform group-hover:translate-x-1" size={16} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectDetails;