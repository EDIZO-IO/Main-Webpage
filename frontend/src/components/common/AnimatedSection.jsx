import React, { useEffect, useRef, useState } from 'react';

// Simplified AnimatedSection using CSS transitions instead of framer-motion
const AnimatedSection = ({
    children,
    delay = 0.2,
    threshold = 0.1,
    once = true,
    animationType = 'fadeUp'
}) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once && ref.current) {
                        observer.unobserve(ref.current);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin: '-50px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold, once]);

    const getTransformStyle = () => {
        if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
        switch (animationType) {
            case 'fadeUp': return 'translate3d(0, 20px, 0) scale(1)';
            case 'zoomIn': return 'translate3d(0, 0, 0) scale(0.95)';
            case 'slideLeft': return 'translate3d(20px, 0, 0) scale(1)';
            case 'slideRight': return 'translate3d(-20px, 0, 0) scale(1)';
            default: return 'translate3d(0, 20px, 0) scale(1)';
        }
    };

    return (
        <div
            ref={ref}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: getTransformStyle(),
                transition: `opacity 0.4s ease-out ${delay}s, transform 0.4s ease-out ${delay}s`,
                willChange: 'opacity, transform'
            }}
        >
            {children}
        </div>
    );
};

export default AnimatedSection;