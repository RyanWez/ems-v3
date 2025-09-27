'use client';
import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('ErrorBoundary caught an error:', event.error);
      setHasError(true);
      setError(event.error);

      // Log error to external service in production
      if (process.env.NODE_ENV === 'production') {
        console.error('Production error logged:', {
          message: event.error?.message,
          stack: event.error?.stack,
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('ErrorBoundary caught unhandled promise rejection:', event.reason);
      setHasError(true);
      setError(new Error(event.reason?.toString() || 'Unhandled promise rejection'));

      if (process.env.NODE_ENV === 'production') {
        console.error('Production error logged:', {
          message: event.reason?.toString() || 'Unhandled promise rejection',
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-red-200">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-red-800 mb-2">Something went wrong</h1>
              <p className="text-red-600">
                We&apos;re sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <button
                onClick={handleReload}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8 8 0 1115.356 2M15 15v5h.582m-3.356-2A8.001 8.001 0 004.582 15m0 0V15a8 8 0 1115.356 2" />
                </svg>
                Reload Page
              </button>
              <Link
                href="/dashboard"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Dashboard
              </Link>
            </div>

            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="text-xs text-gray-600 space-y-2">
                  <div>
                    <strong>Error:</strong> {error.message}
                  </div>
                  {error.stack && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="whitespace-pre-wrap mt-1 p-2 bg-red-50 rounded text-xs overflow-auto max-h-32">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
