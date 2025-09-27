import Link from 'next/link';
import React from 'react';
import EmployeeListIcon from '../components/icons/EmployeeListIcon';

const NotFound: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go to Dashboard
          </Link>
          <Link
            href="/dashboard/employee-management/lists"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
          >
            <EmployeeListIcon className="mr-2" />
            Employee Lists
          </Link>
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact the administrator or try navigating to one of the available sections above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
