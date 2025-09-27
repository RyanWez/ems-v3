'use client';

import { Suspense, useEffect } from 'react';
import { EmployeeListSkeleton } from '@/components/skeletons/EmployeeListSkeleton';
import { useAccessibility } from '@/hooks/useAccessibility';

// Enhanced loading component with accessibility
function AccessibleLoadingContent() {
  const { announce } = useAccessibility();

  // Announce loading state to screen readers
  useEffect(() => {
    announce('Loading employee data', 'polite');
  }, [announce]);

  return (
    <div 
      role="status" 
      aria-label="Loading employee data"
      className="w-full"
    >
      <EmployeeListSkeleton />
      <span className="sr-only">Loading employee information, please wait...</span>
    </div>
  );
}

// Fallback component for Suspense
function LoadingFallback() {
  return (
    <div 
      className="flex items-center justify-center min-h-[200px]"
      role="status"
      aria-label="Loading"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default function Loading() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AccessibleLoadingContent />
    </Suspense>
  );
}