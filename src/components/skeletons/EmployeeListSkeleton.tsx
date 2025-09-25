import React from 'react';

const EmployeeListSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-md w-48 mt-4 sm:mt-0"></div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="min-w-full bg-white">
          {/* Table Header */}
          <div className="bg-gray-50 flex">
            <div className="px-4 py-3 flex-1 h-6 bg-gray-200 rounded m-2"></div>
            <div className="px-4 py-3 flex-1 h-6 bg-gray-200 rounded m-2"></div>
            <div className="px-4 py-3 flex-1 h-6 bg-gray-200 rounded m-2"></div>
            <div className="px-4 py-3 flex-1 h-6 bg-gray-200 rounded m-2"></div>
            <div className="px-4 py-3 flex-1 h-6 bg-gray-200 rounded m-2"></div>
            <div className="px-4 py-3 flex-1 h-6 bg-gray-200 rounded m-2"></div>
            <div className="px-4 py-3 w-32 h-6 bg-gray-200 rounded m-2"></div>
          </div>
          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="px-4 py-3 flex-1 h-5 bg-gray-200 rounded m-2"></div>
                <div className="px-4 py-3 flex-1 h-5 bg-gray-200 rounded m-2"></div>
                <div className="px-4 py-3 flex-1 h-5 bg-gray-200 rounded m-2"></div>
                <div className="px-4 py-3 flex-1 h-5 bg-gray-200 rounded m-2"></div>
                <div className="px-4 py-3 flex-1 h-5 bg-gray-200 rounded m-2"></div>
                <div className="px-4 py-3 flex-1 h-5 bg-gray-200 rounded m-2"></div>
                <div className="px-4 py-3 w-32">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-2 sm:mb-0"></div>
        <div className="flex items-center space-x-4">
          <div className="h-9 bg-gray-200 rounded w-24"></div>
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="flex items-center space-x-1">
            <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListSkeleton;
