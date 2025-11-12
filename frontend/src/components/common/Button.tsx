// src/components/common/Button.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGoogleEvents } from '../hooks/useGoogleEvents';
import { motion } from 'framer-motion';

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
  style,
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

  // Variant classes - Updated with more specific styling
  const variantClasses = {
    primary: 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 ring-offset-2 ring-red-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 ring-offset-2 ring-gray-300',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-2 ring-offset-2 ring-red-500',
    ghost: 'text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-2 ring-offset-2 ring-red-500',
  };

  // Memoize festival styles
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
      return {
        background: festivalGradients[activeEvent.animation] || 
          `linear-gradient(135deg, ${colors[0]}, ${colors[1] || colors[0]}, ${colors[2] || colors[0]})`,
        color: '#fff',
        boxShadow: `0 4px 20px 0 rgba(${parseInt(colors[0].slice(1, 3), 16)}, ${parseInt(colors[0].slice(3, 5), 16)}, ${parseInt(colors[0].slice(5, 7), 16)}, 0.3)`,
      };
    }

    if (variant === 'outline' && colors.length > 0) {
      return {
        borderColor: colors[0],
        color: colors[0],
        boxShadow: `0 4px 20px 0 rgba(${parseInt(colors[0].slice(1, 3), 16)}, ${parseInt(colors[0].slice(3, 5), 16)}, ${parseInt(colors[0].slice(5, 7), 16)}, 0.3)`,
      };
    }

    return {};
  }, [enableFestivalAnimation, activeEvent, variant]);

  // Get festival animation class
  const getFestivalAnimationClass = () => {
    if (!enableFestivalAnimation || !activeEvent) return '';

    const animationClasses: Record<string, string> = {
      'diwali': 'animate-pulse',
      'diya-glow': 'animate-pulse',
      'holi': 'animate-bounce',
      'color-burst': 'animate-bounce',
      'independence-day': 'animate-pulse',
      'republic-day': 'animate-pulse',
      'tricolor-wave': 'animate-pulse',
      'navratri': 'animate-spin',
      'garba-dance': 'animate-spin',
      'christmas': 'animate-pulse',
      'festive-snow': 'animate-pulse',
      'new-year': 'animate-bounce',
      'fireworks': 'animate-bounce',
      'pongal': 'animate-pulse',
      'product-launch': 'animate-pulse',
      'team-anniversary': 'animate-pulse',
      'success-celebration': 'animate-pulse',
    };

    return animationClasses[activeEvent.animation] || 'animate-pulse';
  };

  const combinedClasses = `
    inline-flex items-center justify-center rounded-full font-bold transition-all duration-300 ease-in-out
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

  const ButtonContent = () => (
    <>
      {/* Left Icon */}
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      
      {/* Button Text */}
      <span className="whitespace-nowrap">{children}</span>
      
      {/* Right Icon */}
      {iconRight && <span className="ml-2">{iconRight}</span>}
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