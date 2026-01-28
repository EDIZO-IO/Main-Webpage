// frontend/src/pages/home/LazyImage.tsx
import React, { memo } from 'react';

export const LazyImage = memo(({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    loading="eager"
    className={className}
    onError={(e) => {
      const target = e.target;
      target.src = `https://placehold.co/400x250/D1D5DB/4B5563?text=${encodeURIComponent(alt)}`;
    }}
  />
));

LazyImage.displayName = 'LazyImage';