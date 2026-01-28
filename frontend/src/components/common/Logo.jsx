// src/components/common/Logo.tsx
// Simplified Logo Component - Removed heavy festival animations
import React from 'react';

import logoIcon from '../../assets/images/logo.png';
import logoTextLight from '../../assets/images/brand-name.png';
import logoTextDark from '../../assets/images/brand-name.png';

/**
 * Simplified Logo Component - No festival animations for better performance
 */
const Logo = ({ isScrolled = false, isFooter = false }) => {
  const logoTextSrc = isScrolled || isFooter ? logoTextDark : logoTextLight;

  return (
    <div className="flex items-center gap-3 md:gap-4 transition-all duration-200">
      {/* Logo Icon Container */}
      <div className="relative" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
        {/* Main Logo Circle with White Background */}
        <div
          className="
            w-12 h-12 md:w-13 md:h-13 rounded-full
            flex items-center justify-center
            transition-transform duration-200
            hover:scale-105 shadow-lg
            relative z-10
          "
          style={{ background: 'white' }}
        >
          <img
            src={logoIcon}
            alt="Edizo Logo"
            className="w-9 h-9 md:w-10 md:h-10 object-contain relative z-20 max-w-[40px] max-h-[40px]"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}
          />
        </div>
      </div>

      {/* Brand Name Image */}
      <div className="relative z-20 transition-opacity duration-200">
        <img
          src={logoTextSrc}
          alt="Edizo"
          className="h-10 md:h-12 w-auto object-contain transition-all duration-200"
          style={{
            filter: isScrolled || isFooter
              ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
              : 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
          }}
        />
      </div>
    </div>
  );
};

export default Logo;