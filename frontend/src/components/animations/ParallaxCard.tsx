import React, { useEffect, useRef, useState } from 'react';

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}

// Simplified ParallaxCard with CSS transitions instead of framer-motion
export const ParallaxCard: React.FC<ParallaxCardProps> = ({
  children,
  className = "",
  depth = 20
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const rotateX = (y - 0.5) * depth;
    const rotateY = (x - 0.5) * depth;

    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(${-rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(1.02, 1.02, 1.02)
    `;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;

    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;
  };

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(0.95, 0.95, 0.95) translateY(30px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

export const ParallaxElement: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div className={`parallax-element transition-transform duration-300 ${className}`}>
      {children}
    </div>
  );
};