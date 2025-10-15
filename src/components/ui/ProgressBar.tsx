'use client';

import React from 'react';
import { useNavigation } from '@/providers/NavigationProvider';

const ProgressBar: React.FC = () => {
  const { isNavigating, progress, error } = useNavigation();

  if (!isNavigating) return null;

  const progressBarClass = error 
    ? "h-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 transition-all duration-300 ease-out shadow-lg"
    : "h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 transition-all duration-300 ease-out shadow-lg";

  const boxShadow = error 
    ? '0 0 10px rgba(239, 68, 68, 0.5)'
    : '0 0 10px rgba(59, 130, 246, 0.5)';

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div
        className={progressBarClass}
        style={{
          width: `${progress}%`,
          boxShadow,
        }}
      >
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-r from-transparent to-white/30 animate-pulse" />
      </div>
    </div>
  );
};

export default ProgressBar;