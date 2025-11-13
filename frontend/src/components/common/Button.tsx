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

  // Updated variant classes
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-red-600 to-orange-500 text-white
      hover:from-orange-600 hover:to-red-500
      shadow-lg hover:shadow-xl
      border-2 border-orange-500/40
      focus-visible:ring-2 focus-visible:ring-orange-500
      font-bold
      `,
    secondary: `
      bg-gray-900/10 text-gray-900 
      hover:bg-orange-200 hover:text-orange-800
      border-2 border-orange-200
      focus-visible:ring-2 focus-visible:ring-orange-500
      font-semibold
      `,
    outline: `
      border-2 border-red-600 text-red-700
      hover:bg-red-600 hover:text-white hover:border-red-700
      focus-visible:ring-2 focus-visible:ring-red-500
      font-semibold bg-transparent
      `,
    ghost: `
      text-red-600
      hover:text-orange-600 hover:bg-orange-50
      focus-visible:ring-2 focus-visible:ring-orange-500
      font-medium
      bg-transparent border-none
      `
  };

  // Memoize festival styles as before (unchanged, see your current logic)

  // Animation classes (unchanged, but you may want to reduce animation for ghost/outline if clarity is top priority)

  const getFestivalAnimationClass = () => {
    if (!enableFestivalAnimation || !activeEvent) return '';
    const animationClasses: Record<string, string> = {
      'diwali': 'animate-pulse',
      'holi': 'animate-bounce',
      'christmas': 'animate-pulse',
      'new-year': 'animate-bounce',
      // ...etc, add more if desired
    };
    return animationClasses[activeEvent.animation] || '';
  };

  // Final Button class
  const combinedClasses = [
    "inline-flex items-center justify-center",
    "rounded-full", // change to rounded-xl if you want less rounded
    "transition-all duration-300 ease-in-out",
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
    getFestivalAnimationClass(),
    className,
  ].join(' ');

  const mergedStyles = { ...style }; // Only use dynamic/festival styles if you want

  const buttonVariants = {
    hover: { scale: 1.03, transition: { duration: 0.18 } },
    tap: { scale: 0.97, transition: { duration: 0.09 } }
  };

  const ButtonContent = () => (
    <>
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      <span className="whitespace-nowrap">{children}</span>
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
      aria-disabled={disabled}
    >
      <ButtonContent />
    </motion.button>
  );
};

export default Button;
