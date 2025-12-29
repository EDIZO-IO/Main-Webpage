import React, { useEffect, useRef, useState } from 'react';

interface TextRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

// Simplified TextReveal with CSS transitions instead of framer-motion
export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  delay = 0,
  direction = 'up'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0)';
    switch (direction) {
      case 'up': return 'translate(0, 100%)';
      case 'down': return 'translate(0, -100%)';
      case 'left': return 'translate(100%, 0)';
      case 'right': return 'translate(-100%, 0)';
    }
  };

  return (
    <div className="overflow-hidden" ref={ref}>
      <div
        style={{
          transform: getTransform(),
          transition: `transform 0.6s cubic-bezier(0.6, 0.01, -0.05, 0.9) ${delay}s`,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const TextGradient: React.FC<TextRevealProps & {
  gradient?: string;
}> = ({
  children,
  delay = 0,
  gradient = "from-edizo-red via-edizo-silver to-edizo-red"
}) => {
    const ref = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (ref.current) {
              observer.unobserve(ref.current);
            }
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <span
        ref={ref}
        className={`bg-gradient-to-r ${gradient} bg-[length:200%_auto] bg-clip-text text-transparent inline-block`}
        style={{
          backgroundPosition: isVisible ? '0% 0' : '200% 0',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
          transition: `background-position 1s ease-out ${delay}s, opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
        }}
      >
        {children}
      </span>
    );
  };

export const TextSplit: React.FC<TextRevealProps> = ({
  children,
  delay = 0
}) => {
  const text = children?.toString() || '';
  const words = text.split(' ');
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <span className="inline-block" ref={ref}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ease-out ${delay + i * 0.1}s, transform 0.5s ease-out ${delay + i * 0.1}s`,
          }}
        >
          {word}
          {i !== words.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
};