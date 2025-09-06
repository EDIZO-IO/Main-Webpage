import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backgroundImage = 'https://images.pexels.com/photos/7102/notes-macbook-study-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
}) => {
  return (
    <div
      className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden bg-gray-800"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Solid overlay for contrast */}
      <div className="absolute inset-0 bg-gray-800/50"></div>

      {/* Content Container */}
      <div className="relative max-w-6xl mx-auto text-center px-4 md:px-6 z-10">
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-white mb-4 font-['Inter',sans-serif]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', type: 'spring', stiffness: 100, damping: 20 }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="text-base md:text-lg text-gray-200 max-w-3xl mx-auto font-['Inter',sans-serif] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;