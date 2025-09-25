import React from 'react';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg animate-pulse">
      {/* Header */}
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>

      {/* Placeholder for other content */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
