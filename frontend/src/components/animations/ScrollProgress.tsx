import React, { useEffect, useState } from "react";

// === Scroll Progress Bar - Simplified with CSS ===
export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-gray-300 to-red-500 origin-left z-50"
      style={{
        transform: `scaleX(${scrollProgress})`,
        transformOrigin: 'left'
      }}
    />
  );
};

// === Scroll Down Indicator - Simplified ===
export const ScrollIndicator: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div className="w-6 h-10 border-2 border-white dark:border-gray-300 rounded-full p-1 mb-2">
        <div
          className="w-1 h-2 bg-white dark:bg-gray-300 rounded-full"
          style={{
            animation: 'scrollBounce 1.5s ease-in-out infinite'
          }}
        />
      </div>
      <span
        className="text-white dark:text-gray-300 text-sm font-medium"
        style={{
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      >
        Scroll
      </span>
      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(12px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// === Parallax Section - Simplified ===
interface ParallaxSectionProps {
  children: React.ReactNode;
  offset?: number;
  direction?: "vertical" | "horizontal";
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  offset = 50,
  direction = "vertical",
}) => {
  const [transform, setTransform] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setTransform(progress * offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return (
    <div
      style={{
        transform: direction === "vertical"
          ? `translateY(${transform}px)`
          : `translateX(${transform}px)`,
        transition: 'transform 0.1s linear'
      }}
    >
      {children}
    </div>
  );
};
