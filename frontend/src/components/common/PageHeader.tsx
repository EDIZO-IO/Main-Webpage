// src/components/common/PageHeader.tsx (or your component path)
import React from 'react';
// ✅ Import motion and scroll hooks from framer-motion
import { motion, useScroll, useTransform } from 'framer-motion';

// --- If you intend to use a static image as a base background, import it ---
// import headerBackgroundImage from '../../assets/background image/your-header-image.png'; // Adjust path

interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode; // ✅ Allow ReactNode for more flexible subtitles (like AnimatedTypingSubtitle)
  variant?: 'default' | 'services' | 'contact';
  // ✅ Optional: Add a prop for a background image if needed
  // backgroundImage?: string; 
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  variant = 'default',
  // backgroundImage // Destructure if used
}) => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);

  // Gradient for different variants
  const getGradientId = () => {
    if (variant === 'services') {
      return 'servicesGradient';
    } else if (variant === 'contact') {
      return 'contactGradient';
    }
    return 'defaultGradient';
  };

  return (
    <motion.div
      className="relative h-64 md:h-72 lg:h-80 text-white flex items-center justify-center overflow-hidden"
      style={{ y: backgroundY }}
    >
      {/* Curved SVG Background with Gradient */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="defaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="servicesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#7C3AED', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="contactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#EF4444', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          {/* ✅ Ensure fill uses the correct gradient ID */}
          <path
            d="M0,0 L1440,0 C1440,400 1080,600 720,600 C360,600 0,400 0,800 L0,0 Z"
            fill={`url(#${getGradientId()})`}
          />
          <path
            d="M0,200 C360,400 1080,400 1440,200 L1440,800 C1080,600 360,600 0,800 Z"
            fill={`url(#${getGradientId()})`}
            opacity="0.3"
          />
        </svg>
        {/* Subtle Noise Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27 viewBox=%270 0 100 100%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%27 height=%27100%27 filter=%27url(%23noise)%27 opacity=%270.05%27/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i} // Using index is acceptable here as the array is static
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i * 10)}%`,
            }}
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + i,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 font-['Inter',sans-serif] tracking-tight drop-shadow-lg text-white bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', type: 'spring', stiffness: 120, damping: 15 }}
        >
          {title}
        </motion.h1>

        {/* ✅ Render subtitle if it exists, handling both string and ReactNode */}
        {subtitle && (
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-yellow-100 max-w-3xl mx-auto font-['Inter',sans-serif] leading-relaxed drop-shadow-md mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Decorative underline */}
        <motion.div
          className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

export default PageHeader;