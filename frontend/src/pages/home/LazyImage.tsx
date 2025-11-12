// frontend/src/pages/home/LazyImage.tsx
import React, { memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const LazyImage = memo<LazyImageProps>(({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={className}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.src = `https://placehold.co/400x250/D1D5DB/4B5563?text=${encodeURIComponent(alt)}`;
    }}
  />
));

LazyImage.displayName = 'LazyImage';