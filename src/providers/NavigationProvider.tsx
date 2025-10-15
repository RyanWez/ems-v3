'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavigationContextType {
  isNavigating: boolean;
  progress: number;
  error: Error | null;
  startNavigation: () => void;
  finishNavigation: () => void;
  setProgress: (progress: number) => void;
  setError: (error: Error | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const pathname = usePathname();

  const startNavigation = () => {
    setError(null);
    setIsNavigating(true);
    setProgress(10);
  };

  const finishNavigation = () => {
    setProgress(100);
    setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 200);
  };

  // Listen to route changes
  useEffect(() => {
    if (isNavigating) {
      finishNavigation();
    }
  }, [pathname, isNavigating]);

  // Simulate progress during navigation
  useEffect(() => {
    if (isNavigating && progress < 90) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + Math.random() * 30, 90));
      }, 200 + Math.random() * 300);
      
      return () => clearTimeout(timer);
    }
  }, [isNavigating, progress]);

  const value: NavigationContextType = {
    isNavigating,
    progress,
    error,
    startNavigation,
    finishNavigation,
    setProgress,
    setError,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};