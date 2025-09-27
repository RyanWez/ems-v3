import React from 'react';
import { Calendar, User } from 'lucide-react';
import { Employee } from '../../app/dashboard/employee-management/lists/types/employee';

interface RecentJoinersCardProps {
  recentJoiners: Employee[];
}

export const RecentJoinersCard: React.FC<RecentJoinersCardProps> = ({ recentJoiners }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getServiceDays = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - join.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <User className="w-5 h-5 text-green-500 mr-2 transition-transform duration-200 hover:scale-110" />
        <h3 className="text-lg font-semibold text-gray-800">Recent Joiners</h3>
      </div>
      
      {recentJoiners.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3 animate-pulse" />
          <p className="text-gray-500">No recent joiners in the last 6 months</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentJoiners.map((employee, index) => (
            <div 
              key={employee.id} 
              className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 
                         transition-all duration-300 transform hover:scale-102 hover:shadow-sm
                         group cursor-pointer"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 
                              transition-all duration-300 group-hover:bg-green-200 group-hover:scale-110">
                <User className="w-5 h-5 text-green-600 transition-colors duration-300 group-hover:text-green-700" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 text-sm transition-colors duration-200 group-hover:text-gray-900">
                  {employee.name}
                </h4>
                <p className="text-xs text-gray-600 transition-colors duration-200 group-hover:text-gray-700">
                  {employee.position}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-xs text-gray-500 mb-1 transition-colors duration-200 group-hover:text-gray-600">
                  <Calendar className="w-3 h-3 mr-1 transition-transform duration-200 group-hover:scale-110" />
                  {formatDate(employee.joinDate)}
                </div>
                <p className="text-xs text-green-600 font-medium transition-all duration-200 group-hover:text-green-700 group-hover:scale-105">
                  {getServiceDays(employee.joinDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};