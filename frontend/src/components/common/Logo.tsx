// src/components/Logo.tsx

import React from 'react';
import logoIcon from '../../assets/images/logo.png'; // Icon/logo
import logoTextLight from '../../assets/images/brand-name.png';
import logoTextDark from '../../assets/images/brand-name.png';

interface LogoProps {
  isScrolled?: boolean;
  isFooter?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isScrolled = false, isFooter = false }) => {
  const logoTextSrc = isScrolled || isFooter ? logoTextDark : logoTextLight;

  return (
    <div className="flex items-center space-x-2 md:space-x-3 transition-all duration-300">
      {/* Red Circular Icon Background */}
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-edizo flex items-center justify-center transition-transform duration-300 hover:scale-105 shadow-md">
        <img
          src={logoIcon}
          alt="Logo Icon"
          className="w-9 h-9 md:w-9 md:h-9 object-contain"
        />
      </div>

      {/* Brand Name Text/Image */}
      <img
        src={logoTextSrc}
        alt="Brand Name"
        className="h-8 md:h-9 object-contain transition-opacity duration-300"
      />
    </div>
  );
};

export default Logo;
