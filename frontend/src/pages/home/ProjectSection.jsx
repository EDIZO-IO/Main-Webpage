// frontend/src/pages/home/ProjectsSection.tsx
import { memo, useMemo, useState, useCallback } from 'react';
import { ArrowRight, Palette, Video, Sparkles, Play, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

// --- Types ---

// --- Lightbox Component ---
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
        animate={{ scale }}
        className="max-w-4xl max-h-[80vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.src}
          alt={image.title}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-lg">
          <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full mb-1">
            {image.category}
          </span>
          <h3 className="text-white font-bold text-lg">{image.title}</h3>
        </div>
      </motion.div>
    </motion.div>
  );
});
Lightbox.displayName = 'Lightbox';

// --- Main Component ---
const ProjectsSection = memo(() => {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [activeTab, setActiveTab] = useState('graphics');

  // Graphic Design Images - Only 6 images for single row
  const graphicDesignImages = useMemo(() => [
    { id: 'gd-1', src: '/graphicdesign/A2A.png', title: 'A2A Design', category: 'Logo Design' },
    { id: 'gd-2', src: '/graphicdesign/C-G 3D.png', title: 'C-G 3D', category: '3D Design' },
    { id: 'gd-3', src: '/graphicdesign/DJ HD LOGO.png', title: 'DJ HD Logo', category: 'Logo Design' },
    { id: 'gd-4', src: '/graphicdesign/edizo.png', title: 'Edizo Brand', category: 'Branding' },
    { id: 'gd-5', src: '/graphicdesign/MR REAL YT.png', title: 'MR Real YT', category: 'YouTube Art' },
    { id: 'gd-6', src: '/graphicdesign/redcap.png', title: 'Redcap', category: 'Logo Design' },
  ], []);

  // Video project
  const videoProject = useMemo(() => ({
    id: 'vid-1',
    thumbnail: 'https://img.youtube.com/vi/sAzLHsgBjV4/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/sAzLHsgBjV4?autoplay=1',
    title: 'Video Editing Showcase'
  }), []);

  const handleLightboxOpen = useCallback((image) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
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
              <Sparkles className="w-3 h-3 text-red-600" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Our Portfolio
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Creative Work</span>
            </h2>
            <p className="text-gray-600">
              Stunning graphic designs and engaging video content.
            </p>
          </AnimatedSection>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab('graphics')}
            className={`px-6 py-3 rounded-xl text-base font-semibold flex items-center gap-2 transition-all ${activeTab === 'graphics'
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            <Palette size={18} />
            Graphic Design
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-6 py-3 rounded-xl text-base font-semibold flex items-center gap-2 transition-all ${activeTab === 'video'
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            <Video size={18} />
            Video Editing
          </button>
        </div>

        {/* Content - Professional Layout */}
        <AnimatePresence mode="wait">
          {activeTab === 'graphics' ? (
            <motion.div
              key="graphics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-10"
            >
              {/* Horizontal Scroll Layout for Graphics */}
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-6" style={{ minWidth: 'max-content' }}>
                  {graphicDesignImages.map((image) => (
                    <div
                      key={image.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer group flex-shrink-0 w-64"
                      onClick={() => handleLightboxOpen(image)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={image.src}
                          alt={image.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="text-white" size={24} />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-900 truncate">{image.title}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
            <motion.div
              key="video"
              initial={{ opacity, y }}
              animate={{ opacity, y }}
              exit={{ opacity, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-10"
            >
              {/* Video Showcase */}
              <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-video bg-gray-900 relative">
                  <img
                    src={videoProject.thumbnail}
                    alt={videoProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-red-700 transition-colors">
                      <Play className="text-white ml-1" size={24} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{videoProject.title}</h3>
                  <p className="text-gray-600">Watch our latest video editing showcase featuring creative techniques and stunning visuals.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            href="/projects"
            variant="primary"
            size="lg"
            iconRight={<ArrowRight className="w-5 h-5" />}
            className="rounded-xl"
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
            }}
          >
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';
export default ProjectsSection;