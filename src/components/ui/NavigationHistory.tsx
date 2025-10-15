'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, History, X } from 'lucide-react';
import { useNavigationHistory } from '@/hooks/useNavigationHistory';
import NavigationLink from './NavigationLink';

const NavigationHistory: React.FC = () => {
  const {
    history,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    clearHistory,
    currentIndex,
  } = useNavigationHistory();

  const [showHistory, setShowHistory] = useState(false);

  if (history.length <= 1) return null;

  return (
    <div className="flex items-center space-x-2">
      {/* Back Button */}
      <button
        onClick={goBack}
        disabled={!canGoBack}
        className={`
          p-2 rounded-md transition-all duration-200
          ${canGoBack 
            ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 cursor-pointer' 
            : 'text-gray-300 cursor-not-allowed'
          }
        `}
        title="Go back"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Forward Button */}
      <button
        onClick={goForward}
        disabled={!canGoForward}
        className={`
          p-2 rounded-md transition-all duration-200
          ${canGoForward 
            ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 cursor-pointer' 
            : 'text-gray-300 cursor-not-allowed'
          }
        `}
        title="Go forward"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* History Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
          title="Navigation history"
        >
          <History className="w-4 h-4" />
        </button>

        {showHistory && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowHistory(false)}
            />
            
            {/* History Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800">Navigation History</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearHistory}
                    className="text-xs text-red-600 hover:text-red-800 transition-colors"
                    title="Clear history"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* History List */}
              <div className="max-h-80 overflow-y-auto">
                {history.map((item, index) => {
                  const isCurrent = index === currentIndex;
                  const relativeTime = getRelativeTime(item.timestamp);

                  return (
                    <NavigationLink
                      key={`${item.path}-${item.timestamp}`}
                      href={item.path}
                      className={`
                        block px-4 py-3 border-b border-gray-100 last:border-b-0
                        transition-all duration-200 hover:bg-gray-50
                        ${isCurrent ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
                      `}
                      onClick={() => setShowHistory(false)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${
                            isCurrent ? 'text-blue-700' : 'text-gray-800'
                          }`}>
                            {item.title}
                          </div>
                          <div className={`text-xs truncate ${
                            isCurrent ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {item.path}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-3">
                          {isCurrent && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          )}
                          <span className={`text-xs ${
                            isCurrent ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            {relativeTime}
                          </span>
                        </div>
                      </div>
                    </NavigationLink>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="text-xs text-gray-500 text-center">
                  {history.length} {history.length === 1 ? 'page' : 'pages'} in history
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Helper function to get relative time
const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString();
};

export default NavigationHistory;