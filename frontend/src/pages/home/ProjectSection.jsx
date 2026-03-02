import { memo, useState, useCallback, useEffect } from 'react';
import { ArrowRight, Palette, Video, Sparkles, Play, ZoomIn, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';
import { useProjects } from '../../hooks/useProjects';

// Lightbox Component
const Lightbox = memo(({ image, onClose }) => {
  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="text-white" size={20} />
      </button>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="max-w-4xl max-h-[80vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.src}
          alt={image.title}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
          <span className="inline-block px-2 py-1 bg-orange-600 text-white text-xs font-medium rounded-full mb-1">
            {image.category}
          </span>
          <h3 className="text-white font-bold text-lg">{image.title}</h3>
        </div>
      </motion.div>
    </motion.div>
  );
});
Lightbox.displayName = 'Lightbox';

// Main Component
const ProjectsSection = memo(() => {
  const { projects, loading, error } = useProjects();
  const [lightboxImage, setLightboxImage] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');
  const [displayProjects, setDisplayProjects] = useState([]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      // Get featured projects or first 6 projects
      const featured = projects.filter(p => p.is_featured).slice(0, 6);
      setDisplayProjects(featured.length > 0 ? featured : projects.slice(0, 6));
    }
  }, [projects]);

  const handleLightboxOpen = useCallback((image) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
  }, []);

  // Convert project data to gallery format
  const galleryImages = displayProjects.map(project => ({
    id: project.id,
    src: project.image_url || 'https://placehold.co/600x400?text=' + encodeURIComponent(project.title),
    title: project.title,
    category: project.project_type || 'Project'
  }));

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <Lightbox image={lightboxImage} onClose={handleLightboxClose} />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-4 shadow-sm">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
                Our Portfolio
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Creative Work</span>
            </h2>
            <p className="text-gray-600">
              Showcasing our successful projects and client work
            </p>
          </AnimatedSection>
        </div>

        {/* Projects Grid from Database */}
        {displayProjects.length > 0 ? (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mb-10"
          >
            {/* Horizontal Scroll Layout for Projects */}
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-6" style={{ minWidth: 'max-content' }}>
                {galleryImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer group flex-shrink-0 w-80"
                    onClick={() => handleLightboxOpen(image)}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/600x400?text=' + encodeURIComponent(image.title);
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-all">
                          <ZoomIn className="text-white" size={32} />
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900 truncate">{image.title}</h3>
                          {displayProjects.find(p => p.id === image.id)?.client_name && (
                            <p className="text-xs text-gray-500 mt-1">
                              {displayProjects.find(p => p.id === image.id).client_name}
                            </p>
                          )}
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {image.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12 mb-10">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-10 h-10 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Projects Coming Soon</h3>
            <p className="text-gray-600">We're working on some amazing projects</p>
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center">
          <Button
            onClick={() => window.location.href = '/projects'}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all inline-flex items-center gap-2"
          >
            View All Projects
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';
export default ProjectsSection;
