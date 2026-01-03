// frontend/src/pages/home/ProjectsSection.tsx
import { memo, useMemo, useState, useCallback } from 'react';
import { ArrowRight, Palette, Video, Sparkles, Play, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

// --- Types ---
interface GraphicDesignImage {
  id: string;
  src: string;
  title: string;
  category: string;
}

interface VideoProject {
  id: string;
  thumbnail: string;
  videoUrl: string;
  title: string;
}

// --- Optimized Image Gallery Item - Smaller Size ---
const ImageGalleryItem = memo<{
  image: GraphicDesignImage;
  onClick: (image: GraphicDesignImage) => void;
}>(({ image, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-xl cursor-pointer flex-shrink-0 w-32 h-32 md:w-40 md:h-40"
      onClick={() => onClick(image)}
    >
      <div className="w-full h-full overflow-hidden bg-gray-100">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}
        <img
          src={image.src}
          alt={image.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />
      </div>
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
        <h3 className="text-white font-semibold text-xs line-clamp-1">{image.title}</h3>
        <div className="absolute top-2 right-2">
          <div className="bg-white/20 backdrop-blur-sm p-1 rounded-full">
            <ZoomIn className="text-white" size={12} />
          </div>
        </div>
      </div>
    </div>
  );
});
ImageGalleryItem.displayName = 'ImageGalleryItem';

// --- Lightbox Component ---
const Lightbox = memo<{
  image: GraphicDesignImage | null;
  onClose: () => void;
}>(({ image, onClose }) => {
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

// --- Compact Video Item ---
const VideoItem = memo<{ video: VideoProject }>(({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-xl bg-gray-900 w-64 h-36 md:w-80 md:h-44 flex-shrink-0">
      <div className="w-full h-full overflow-hidden">
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
            {!isLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse" />
            )}
            <img
              src={video.thumbnail}
              alt={video.title}
              className={`w-full h-full object-cover ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
            />
            <div
              className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors"
              onClick={() => setIsPlaying(true)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <Play className="text-white ml-0.5" size={20} fill="currentColor" />
              </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <h3 className="text-white font-semibold text-sm">{video.title}</h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
VideoItem.displayName = 'VideoItem';

// --- Main Component ---
const ProjectsSection = memo(() => {
  const [lightboxImage, setLightboxImage] = useState<GraphicDesignImage | null>(null);
  const [activeTab, setActiveTab] = useState<'graphics' | 'video'>('graphics');

  // Graphic Design Images - Only 6 images for single row
  const graphicDesignImages = useMemo<GraphicDesignImage[]>(() => [
    { id: 'gd-1', src: '/graphicdesign/A2A.png', title: 'A2A Design', category: 'Logo Design' },
    { id: 'gd-2', src: '/graphicdesign/C-G 3D.png', title: 'C-G 3D', category: '3D Design' },
    { id: 'gd-3', src: '/graphicdesign/DJ HD LOGO.png', title: 'DJ HD Logo', category: 'Logo Design' },
    { id: 'gd-4', src: '/graphicdesign/edizo.png', title: 'Edizo Brand', category: 'Branding' },
    { id: 'gd-5', src: '/graphicdesign/MR REAL YT.png', title: 'MR Real YT', category: 'YouTube Art' },
    { id: 'gd-6', src: '/graphicdesign/redcap.png', title: 'Redcap', category: 'Logo Design' },
  ], []);

  // Video project
  const videoProject = useMemo<VideoProject>(() => ({
    id: 'vid-1',
    thumbnail: 'https://img.youtube.com/vi/sAzLHsgBjV4/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/sAzLHsgBjV4?autoplay=1',
    title: 'Video Editing Showcase'
  }), []);

  const handleLightboxOpen = useCallback((image: GraphicDesignImage) => {
    setLightboxImage(image);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleLightboxClose = useCallback(() => {
    setLightboxImage(null);
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Simple background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-40 -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <Lightbox image={lightboxImage} onClose={handleLightboxClose} />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header - Compact */}
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-gray-200 rounded-full mb-4 shadow-sm">
              <Sparkles className="w-3 h-3 text-red-600" />
              <span className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Portfolio
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Creative Work</span>
            </h2>
            <p className="text-sm text-gray-600">
              Stunning graphic designs and engaging video content.
            </p>
          </AnimatedSection>
        </div>

        {/* Tab Switcher - Compact */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('graphics')}
            className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'graphics'
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            <Palette size={14} />
            Graphic Design
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'video'
                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            <Video size={14} />
            Video Editing
          </button>
        </div>

        {/* Content - Single Row */}
        <AnimatePresence mode="wait">
          {activeTab === 'graphics' ? (
            <motion.div
              key="graphics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-8"
            >
              {/* Single Row Horizontal Scroll */}
              <div className="flex justify-center gap-3 flex-wrap md:flex-nowrap overflow-x-auto pb-2 scrollbar-hide">
                {graphicDesignImages.map((image) => (
                  <ImageGalleryItem
                    key={image.id}
                    image={image}
                    onClick={handleLightboxOpen}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-8"
            >
              {/* Centered Video */}
              <div className="flex justify-center">
                <VideoItem video={videoProject} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <div className="text-center">
          <Button
            href="/projects"
            variant="primary"
            size="md"
            iconRight={<ArrowRight className="w-4 h-4" />}
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
              boxShadow: "0 6px 20px -6px rgba(220,38,38,0.4)"
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