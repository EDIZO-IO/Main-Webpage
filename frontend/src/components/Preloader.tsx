import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';
import brandName from '../assets/images/brand-name.png';

interface Props {
  onLoaded: () => void;
  duration?: number; // optional override (ms)
}

const Preloader: React.FC<Props> = ({ onLoaded, duration = 3000 }) => {
  useEffect(() => {
    const t = setTimeout(onLoaded, duration); // hide after duration
    return () => clearTimeout(t);
  }, [onLoaded, duration]);

  // Animation variants for orbiting particles
  const orbitParticleVariants = {
    animate: (i: number) => ({
      rotate: 360,
      transition: {
        duration: 2 + i * 0.5,
        repeat: Infinity,
        ease: 'linear',
      },
    }),
  };

  // Animation variants for floating background particles
  const floatParticleVariants = {
    animate: (i: number) => ({
      y: [0, 100, 0],
      opacity: [0.2, 0.6, 0.2],
      transition: {
        repeat: Infinity,
        duration: 6 + i * 2,
        delay: i * 1.5,
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-red-900 via-gray-900 to-black z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            animate="animate"
            variants={floatParticleVariants}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${20 + (i * 15) % 80}%`,
              top: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Orbiting Particles and Logo */}
      <div className="relative w-32 h-32 z-20">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            custom={i}
            animate="animate"
            variants={orbitParticleVariants}
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              backgroundColor: '#FF0000', // Red particles
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              x: 40 + i * 10, // Varying orbit radius
              y: 0,
              originX: 0,
              originY: 0,
            }}
          />
        ))}
        {/* Spinning Logo */}
        <motion.img
          src={logo}
          alt="Edizo Logo"
          style={{
            width: '80px',
            height: '80px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: '-50%',
            zIndex: 1,
          }}
          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 0.8, ease: 'easeOut' },
            scale: { duration: 0.8, ease: 'easeOut' },
            rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
          }}
        />
      </div>
      {/* Brand Name Image */}
      <motion.img
        src={brandName}
        alt="Edizo Brand Name"
        style={{
          width: '150px',
          height: 'auto',
          marginTop: '1rem',
          zIndex: 20,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
    </div>
  );
};

export default Preloader;