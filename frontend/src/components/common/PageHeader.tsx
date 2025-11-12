import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  variant?: 'default' | 'services' | 'contact';
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  variant = 'default',
}) => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);

  // Pick gradient by page type
  const getGradientId = () => {
    if (variant === 'services') return 'servicesGradient';
    if (variant === 'contact') return 'contactGradient';
    return 'defaultGradient';
  };

  return (
    <motion.div
      className="relative h-64 md:h-72 lg:h-80 text-white flex items-center justify-center overflow-hidden"
      style={{ y: backgroundY }}
    >
      {/* SVG Gradient Background */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="defaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="servicesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="contactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
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
        {/* Subtle noise overlay for texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27 viewBox=%270 0 100 100%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%27 height=%27100%27 filter=%27url(%23noise)%27 opacity=%270.05%27/%3E%3C/svg%3E")',
          }}
        />
      </div>
      {/* Animated floating circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-white/30 rounded-full"
            style={{
              left: `${10 + i * 15}%`,
              top: `${22 + i * 10}%`,
            }}
            animate={{
              y: [0, 22, 0],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.15, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + i,
              delay: i * 0.65,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      {/* Title + Subtitle */}
      <div className="relative z-10 w-full max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 drop-shadow-lg"
          style={{
            backgroundImage: 'linear-gradient(90deg,#f43f5e,#f59e42,#3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 16px rgba(0,0,0,0.14)',
          }}
          initial={{ opacity: 0, y: -22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 120, damping: 18 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="max-w-2xl mx-auto mb-6 text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-white"
            style={{
              textShadow: '0 2px 16px rgba(0,0,0,0.2),0 0 5px #fff',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          >
            {subtitle}
          </motion.p>
        )}
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
