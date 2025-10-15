'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavigationContextType {
  isNavigating: boolean;
  progress: number;
  error: Error | null;
  startNavigation: (targetPath?: string) => void;
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
  const targetPathRef = useRef<string | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startNavigation = (targetPath?: string) => {
    // Clear any existing timers
    if (progressTimerRef.current) {
      clearTimeout(progressTimerRef.current);
    }
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
    }

    setError(null);
    setIsNavigating(true);
    setProgress(10);
    targetPathRef.current = targetPath || null;
  };

  const finishNavigation = () => {
    setProgress(100);
    finishTimerRef.current = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
      targetPathRef.current = null;
    }, 300);
  };

  // Listen to route changes - only finish if we've reached the target path
  useEffect(() => {
    if (isNavigating) {
      // If we have a target path, only finish when we reach it
      if (targetPathRef.current) {
        if (pathname === targetPathRef.current) {
          // Add a small delay to ensure the page is fully loaded
          setTimeout(() => {
            finishNavigation();
          }, 100);
        }
      } else {
        // Fallback: finish after pathname change with delay
        setTimeout(() => {
          finishNavigation();
        }, 500);
      }
    }
  }, [pathname, isNavigating]);

  // Simulate progress during navigation with more realistic timing
  useEffect(() => {
    if (isNavigating && progress < 85) {
      const delay = progress < 30 ? 100 : progress < 60 ? 200 : 400;
      const increment = progress < 30 ? 15 + Math.random() * 10 : 
                      progress < 60 ? 8 + Math.random() * 7 : 
                      2 + Math.random() * 3;
      
      progressTimerRef.current = setTimeout(() => {
        setProgress(prev => Math.min(prev + increment, 85));
      }, delay);
      
      return () => {
        if (progressTimerRef.current) {
          clearTimeout(progressTimerRef.current);
        }
      };
    }
  }, [isNavigating, progress]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearTimeout(progressTimerRef.current);
      }
      if (finishTimerRef.current) {
        clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

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