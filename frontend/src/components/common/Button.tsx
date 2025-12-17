import React from 'react';
import { Link } from 'react-router-dom';

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
  style,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl',
  };

  // Variant classes
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

  // Final Button class - simplified without heavy animations
  const combinedClasses = [
    "inline-flex items-center justify-center",
    "rounded-full",
    "transition-all duration-200 ease-out",
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
