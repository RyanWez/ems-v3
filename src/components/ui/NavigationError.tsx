'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface NavigationErrorProps {
  error?: Error;
  reset?: () => void;
  showHomeButton?: boolean;
}

const NavigationError: React.FC<NavigationErrorProps> = ({
  error,
  reset,
  showHomeButton = true,
}) => {
  const handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  const handleRefresh = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Navigation Error
        </h2>
        
        <p className="text-gray-600 mb-6">
          {error?.message || 'Something went wrong while navigating. Please try again.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          {showHomeButton && (
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationError;