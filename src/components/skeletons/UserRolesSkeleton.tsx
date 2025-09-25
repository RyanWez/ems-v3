import React from 'react';

const UserRolesSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg animate-pulse">
      {/* Header */}
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded-md w-40"></div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="border bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>

              <div className="mb-4">
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-16 bg-white rounded-full"></div>
                  <div className="h-6 w-20 bg-white rounded-full"></div>
                  <div className="h-6 w-24 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex space-x-2">
                <div className="h-8 w-16 bg-white rounded"></div>
                <div className="h-8 w-16 bg-white rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRolesSkeleton;
