'use client';
import React from 'react';
import UserRoleIcon from '@/components/icons/UserRoleIcon';

interface RolePageHeaderProps {
  roleCount: number;
  onAddRole: () => void;
  isLoading: boolean;
  canManageRoles: boolean;
}

export const RolePageHeader: React.FC<RolePageHeaderProps> = ({
  roleCount,
  onAddRole,
  isLoading,
  canManageRoles,
}) => {
  return (
    <div className="bg-[#DCFCE7] px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
            <UserRoleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Role Management</h3>
          <span className="bg-white text-gray-900 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full shadow-sm font-medium">
            {roleCount} roles
          </span>
        </div>
        <button
          className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start"
          onClick={onAddRole}
          disabled={isLoading || !canManageRoles}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span className="text-sm sm:text-base">Add New Role</span>
        </button>
      </div>
    </div>
  );
};
