// frontend/src/pages/home/MobileScrollWrapper.tsx
import React, { memo } from 'react';

interface MobileScrollWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileScrollWrapper = memo<MobileScrollWrapperProps>(({ children, className = "" }) => (
  <div className={`overflow-x-auto pb-4 ${className}`}>
    <div className="flex space-x-6 min-w-max md:w-full md:grid md:grid-cols-1 md:space-x-0 md:space-y-6">
      {children}
    </div>
  </div>
));

MobileScrollWrapper.displayName = 'MobileScrollWrapper';