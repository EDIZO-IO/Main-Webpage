// src/components/common/Button.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGoogleEvents } from '../hooks/useGoogleEvents'; // ✅ Updated import path
import { motion } from 'framer-motion';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  to?: string;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  enableFestivalAnimation?: boolean;
  showFestivalEmoji?: boolean;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  enableFestivalAnimation = true,
  showFestivalEmoji = true,
  style, // Destructure style prop
}) => {
  const { getActiveEvent } = useGoogleEvents();
  const activeEvent = getActiveEvent();

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-edizo-red text-white hover:bg-red-600 focus:ring-2 ring-offset-2 ring-edizo-red',
    secondary: 'bg-gray-100 text-edizo-black hover:bg-gray-200 focus:ring-2 ring-offset-2 ring-gray-300',
    outline: 'border-2 border-edizo-red text-edizo-red hover:bg-edizo-red hover:text-white focus:ring-2 ring-offset-2 ring-edizo-red',
    ghost: 'text-edizo-red hover:text-red-600 hover:bg-red-50 focus:ring-2 ring-offset-2 ring-edizo-red',
  };

  // Memoize festival styles to prevent recalculation on every render
  const festivalStyles = useMemo(() => {
    if (!enableFestivalAnimation || !activeEvent) return {};

    const colors = activeEvent.colors || [];

    const festivalGradients: Record<string, string> = {
      'diwali': `linear-gradient(135deg, #FFD700, #FF6B35, #F7B801)`,
      'diya-glow': `linear-gradient(135deg, #FFD700, #FF6B35, #F7B801)`,
      'holi': `linear-gradient(135deg, #FF6B9D, #FFD93D, #6BCB77, #4D96FF)`,
      'color-burst': `linear-gradient(135deg, #FF6B9D, #FFD93D, #6BCB77, #4D96FF)`,
      'independence-day': `linear-gradient(135deg, #FF9933, #FFFFFF, #138808)`,
      'republic-day': `linear-gradient(135deg, #FF9933, #FFFFFF, #138808)`,
      'tricolor-wave': `linear-gradient(135deg, #FF9933, #FFFFFF, #138808)`,
      'navratri': `linear-gradient(135deg, #FF6B9D, #FFD93D, #6BCB77, #4D96FF, #C724B1)`,
      'garba-dance': `linear-gradient(135deg, #FF6B9D, #FFD93D, #6BCB77, #4D96FF, #C724B1)`,
      'christmas': `linear-gradient(135deg, #C41E3A, #FFFFFF, #0F8644)`,
      'festive-snow': `linear-gradient(135deg, #C41E3A, #FFFFFF, #0F8644)`,
      'new-year': `linear-gradient(135deg, #FFD700, #FF1493, #00CED1)`,
      'fireworks': `linear-gradient(135deg, #FFD700, #FF1493, #00CED1)`,
      'pongal': `linear-gradient(135deg, #F7B801, #FFD700, #FF9933)`,
      'product-launch': `linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)`,
      'team-anniversary': `linear-gradient(135deg, #ec4899, #f43f5e, #fb7185)`,
      'success-celebration': `linear-gradient(135deg, #ec4899, #f43f5e, #fb7185)`,
    };

    if (variant === 'primary' && colors.length > 0) {
      // Return only background property to avoid conflict with backgroundSize
      return {
        background: festivalGradients[activeEvent.animation] || 
          `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]}, ${colors[2] || colors[0]})`,
      };
    }

    if (variant === 'outline' && colors.length > 0) {
      return {
        borderColor: colors[0],
        color: colors[0],
      };
    }

    return {};
  }, [enableFestivalAnimation, activeEvent, variant]); // Add dependencies

  // Get festival animation class - COMPREHENSIVE MAPPING
  const getFestivalAnimationClass = () => {
    if (!enableFestivalAnimation || !activeEvent) return '';

    const animationClasses: Record<string, string> = {
      // Diwali Celebrations
      'diwali': 'button-diwali-glow',
      'diya-glow': 'button-diya-flicker',
      
      // Holi Celebrations
      'holi': 'button-holi-pulse',
      'color-burst': 'button-color-burst',
      
      // Independence & Republic Day
      'independence-day': 'button-tricolor-wave',
      'republic-day': 'button-republic-pulse',
      'tricolor-wave': 'button-tricolor-wave',
      'gandhi-jayanti': 'button-gandhi-peace',
      
      // Navratri & Durga Puja
      'navratri': 'button-garba-spin',
      'garba-dance': 'button-garba-spin',
      'durga-puja': 'button-durga-divine',
      
      // Christmas & New Year
      'christmas': 'button-christmas-glow',
      'festive-snow': 'button-festive-snow',
      'new-year': 'button-firework-pulse',
      'fireworks': 'button-fireworks-blast',
      
      // Harvest Festivals
      'pongal': 'button-harvest-glow',
      'makar-sankranti': 'button-kite-fly',
      'harvest-celebration': 'button-harvest-celebration',
      
      // Regional New Years
      'tamil-new-year': 'button-tamil-new-year',
      'ugadi': 'button-ugadi-glow',
      
      // Krishna Celebrations
      'janmashtami': 'button-krishna-divine',
      'krishna-leela': 'button-krishna-leela',
      
      // Raksha Bandhan
      'raksha-bandhan': 'button-raksha-thread',
      'thread-sparkle': 'button-thread-sparkle',
      
      // Eid
      'eid': 'button-eid-glow',
      'moon-glow': 'button-moon-glow',
      
      // Other Regional Festivals
      'onam': 'button-onam-floral',
      'baisakhi': 'button-baisakhi-dance',
      'lohri': 'button-lohri-bonfire',
      'bonfire-glow': 'button-bonfire-glow',
      
      // Dussehra
      'dussehra': 'button-dussehra-victory',
      'victory-sparkle': 'button-victory-sparkle',
      
      // Corporate Events
      'product-launch': 'button-product-launch',
      'company-pulse': 'button-company-pulse',
      'team-anniversary': 'button-team-anniversary',
      'success-celebration': 'button-celebration-pulse',
      'milestone-glow': 'button-milestone-glow',
      
      // Labour Day
      'labour-day': 'button-labour-solidarity',
    };

    return animationClasses[activeEvent.animation] || 'button-default-pulse';
  };

  const combinedClasses = `
    edizo-button
    ${variantClasses[variant]} 
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${getFestivalAnimationClass()}
    ${className}
  `;

  // Merge memoized festival styles with custom inline styles
  const mergedStyles = { ...festivalStyles, ...style };

  const buttonVariants = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } }
  };

  const shimmerVariant = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "linear" as const
      }
    }
  };

  // Emoji animation variants
  const emojiVariants = {
    initial: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const ButtonContent = () => (
    <>
      {/* Festival Shimmer Effect */}
      {enableFestivalAnimation && activeEvent && variant === 'primary' && (
        <motion.div
          className="button-shimmer"
          variants={shimmerVariant}
          initial="initial"
          animate="animate"
        />
      )}
      
      {/* Left Icon or Festival Emoji */}
      {iconLeft ? (
        <span className="button-icon-left">{iconLeft}</span>
      ) : (
        showFestivalEmoji && activeEvent && (
          <motion.span 
            className="button-emoji"
            variants={emojiVariants}
            initial="initial"
            animate="animate"
          >
            {activeEvent.emoji}
          </motion.span>
        )
      )}
      
      {/* Button Text */}
      <span className="button-text">{children}</span>
      
      {/* Right Icon */}
      {iconRight && <span className="button-icon-right">{iconRight}</span>}
    </>
  );

  if (to) {
    return (
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        className="inline-block"
      >
        <Link to={to} className={combinedClasses} style={mergedStyles}>
          <ButtonContent />
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        className="inline-block"
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClasses}
          style={mergedStyles}
        >
          <ButtonContent />
        </a>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      style={mergedStyles}
      whileHover="hover"
      whileTap="tap"
      variants={buttonVariants}
    >
      <ButtonContent />
    </motion.button>
  );
};

export default Button;