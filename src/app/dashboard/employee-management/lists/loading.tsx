'use client';

import { Suspense, useEffect } from 'react';
import { EmployeeListSkeleton } from '@/components/skeletons/EmployeeListSkeleton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAccessibility } from '@/hooks/useAccessibility';

// Enhanced loading component with accessibility and spinner
function AccessibleLoadingContent() {
  const { announce } = useAccessibility();

  // Announce loading state to screen readers
  useEffect(() => {
    announce('Loading employee data', 'polite');
  }, [announce]);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border w-full max-w-full relative z-0">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-40 mt-4 sm:mt-0"></div>
      </div>

      {/* Loading Spinner */}
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner
          size="lg"
          text="Loading employees..."
          className="text-blue-600"
        />
      </div>

      {/* Keep skeleton as fallback */}
      <div className="hidden">
        <EmployeeListSkeleton />
      </div>

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
      <LoadingSpinner
        size="md"
        text="Loading..."
        className="text-blue-600"
      />
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