import React from 'react';

const UserListSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg animate-pulse">
      {/* Header */}
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded-md w-36"></div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <div className="min-w-full bg-white">
            {/* Table Header */}
            <div className="bg-gray-50 flex">
               {[...Array(6)].map((_, i) => (
                <div key={i} className="px-6 py-3 flex-1 h-5 bg-gray-200 rounded m-2"></div>
              ))}
            </div>
            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className="px-6 py-4 flex-1 h-5 bg-gray-200 rounded m-2"></div>
                  <div className="px-6 py-4 flex-1 h-5 bg-gray-200 rounded m-2"></div>
                  <div className="px-6 py-4 flex-1">
                    <div className="h-5 bg-gray-200 rounded-full w-24"></div>
                  </div>
                   <div className="px-6 py-4 flex-1">
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                  </div>
                  <div className="px-6 py-4 flex-1 h-5 bg-gray-200 rounded m-2"></div>
                  <div className="px-6 py-4 flex-1 h-5 bg-gray-200 rounded m-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserListSkeleton;
