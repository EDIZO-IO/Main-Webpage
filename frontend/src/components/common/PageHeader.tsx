import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';

// Define the props for the PageHeader component
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  overlayColor?: string; // Custom overlay color (e.g., 'rgba(0, 0, 0, 0.6)')
  overlayStrength?: 'light' | 'medium' | 'dark'; // Predefined overlay strengths
  showScrollIndicator?: boolean; // Option to show/hide the scroll indicator
  scrollIndicatorIcon?: React.ReactNode; // Custom icon for the scroll indicator
}

// Framer Motion variants for the title animation
const titleVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Framer Motion variants for the subtitle animation
const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.3, // Delay the subtitle animation slightly
    },
  },
};

const App: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backgroundImage = 'https://images.pexels.com/photos/7102/notes-macbook-study-conference.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  overlayColor,
  overlayStrength = 'medium',
  showScrollIndicator = true,
  scrollIndicatorIcon,
}) => {
  // State to track if the background image has loaded
  const [imageLoaded, setImageLoaded] = useState(false);

  // Effect to preload the background image and set the loading state
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setImageLoaded(true); // Set imageLoaded to true once the image loads
    };
    img.onerror = () => {
      // In case of an error, still proceed but the background might be missing
      console.error('Failed to load background image:', backgroundImage);
      setImageLoaded(true);
    };
    // Cleanup function (optional, but good practice for image loading)
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [backgroundImage]); // Rerun effect if backgroundImage URL changes

  // Function to determine the Tailwind CSS classes for the overlay
  const getOverlayClasses = () => {
    // If a custom overlay color is provided, return an empty string for classes
    if (overlayColor) {
      return '';
    }
    // Otherwise, apply predefined classes based on overlayStrength
    switch (overlayStrength) {
      case 'light':
        return 'bg-gradient-to-r from-black/40 via-black/20 to-black/40 backdrop-blur-sm';
      case 'medium':
        return 'bg-gradient-to-r from-black/70 via-black/50 to-black/70 backdrop-blur-sm';
      case 'dark':
        return 'bg-gradient-to-r from-black/80 via-black/60 to-black/80 backdrop-blur-md';
      default:
        // Default to medium if an unknown strength is provided
        return 'bg-gradient-to-r from-black/70 via-black/50 to-black/70 backdrop-blur-sm';
    }
  };

  return (
    <div
      className={`relative h-[320px] md:h-[480px] flex items-center justify-center overflow-hidden transition-opacity duration-500 rounded-lg shadow-xl ${
        imageLoaded ? 'opacity-100' : 'opacity-0 bg-gray-300' // Placeholder background while loading
      }`}
      style={{
        // Apply background image only after it has loaded
        backgroundImage: imageLoaded ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // Ensure a minimum width and responsive behavior
        width: '100%',
        minWidth: '320px', // Minimum width for mobile
        fontFamily: 'Inter, sans-serif', // Using Inter font
      }}
    >
      {/* Dark overlay for contrast, with customizable color/strength */}
      <div
        className={`absolute inset-0 ${getOverlayClasses()} rounded-lg`}
        style={overlayColor ? { background: overlayColor } : {}}
      ></div>

      {/* Content Container */}
      <div className="container-custom text-center z-10 px-4 max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
          // Ensure smooth text rendering
          style={{ textRendering: 'optimizeLegibility' }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto font-light drop-shadow-md"
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
            style={{ textRendering: 'optimizeLegibility' }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Optional decorative scroll indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          {scrollIndicatorIcon ? (
            // Render custom icon if provided
            scrollIndicatorIcon
          ) : (
            // Default scroll arrow SVG icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true" // Indicate to screen readers that this is decorative
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
