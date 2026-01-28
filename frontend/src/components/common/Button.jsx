import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
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
  style,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
    xl: 'px-10 py-4 text-xl',
  };

  // Variant classes - EDIZO Brand Colors (Red-Orange gradient)
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-red-600 to-orange-500 text-white
      hover:from-red-700 hover:to-orange-600
      shadow-lg hover:shadow-xl
      border-2 border-red-500/20
      focus-visible:ring-2 focus-visible:ring-red-500
      font-bold
      `,
    secondary: `
      bg-gray-100 text-gray-900 
      hover:bg-gray-200
      border-2 border-gray-200
      focus-visible:ring-2 focus-visible:ring-gray-400
      font-semibold
      backdrop-blur-sm
      `,
    outline: `
      border-2 border-gray-300 text-gray-700
      hover:bg-gray-100 hover:border-gray-400
      focus-visible:ring-2 focus-visible:ring-gray-400
      font-semibold bg-white/50 backdrop-blur-sm
      `,
    ghost: `
      text-red-600
      hover:text-orange-600 hover:bg-red-50
      focus-visible:ring-2 focus-visible:ring-red-500
      font-medium
      bg-transparent border-none
      `
  };

  // Final Button class
  const combinedClasses = [
    "inline-flex items-center justify-center",
    "rounded-full",
    "transition-all duration-300 ease-out",
    "hover:scale-[1.02] active:scale-[0.98]",
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
    className,
  ].join(' ');

  const ButtonContent = () => (
    <>
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      <span className="whitespace-nowrap">{children}</span>
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} style={style}>
        <ButtonContent />
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
        style={style}
      >
        <ButtonContent />
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-disabled={disabled}
    >
      <ButtonContent />
    </button>
  );
};

export default Button;
