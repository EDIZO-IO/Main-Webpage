// components/common/HorizontalScroll.tsx
import React from 'react';

const HorizontalScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto scrollbar-hide -mx-6 px-6">
    <div className="flex flex-nowrap gap-6">{children}</div>
  </div>
);

export default HorizontalScroll;

// Add scrollbar-hide with Tailwind plugin or CSS as desired
// .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
// .scrollbar-hide::-webkit-scrollbar { display: none; }
