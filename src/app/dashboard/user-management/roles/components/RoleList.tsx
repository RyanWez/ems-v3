'use client';
import React from 'react';
import { UserRole } from '../types/permissions';
import UserRoleIcon from '@/components/icons/UserRoleIcon';

interface RoleListProps {
  roles: UserRole[];
  isLoading: boolean;
  canManagePermissions: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onManagePermissions: (id: number) => void;
}

export const RoleList: React.FC<RoleListProps> = ({
  roles,
  isLoading,
  canManagePermissions,
  onEdit,
  onDelete,
  onManagePermissions,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">No.</th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
            <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {roles.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-3 sm:px-6 py-12 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <UserRoleIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">No roles found</p>
                    <p className="text-gray-400 text-sm">Get started by creating your first role</p>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            roles.map((role, index) => (
              <tr key={role.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{index + 1}</div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{role.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500">ID: {role.id}</div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{role.description || 'N/A'}</div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                        role.name === 'Administrator'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                      }`}
                      onClick={() => onEdit(role.id)}
                      disabled={role.name === 'Administrator' || isLoading}
                    >
                      Edit
                    </button>
                    {canManagePermissions && (
                      <button
                        className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                          role.name === 'Administrator'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                        }`}
                        onClick={() => onManagePermissions(role.id)}
                        disabled={role.name === 'Administrator' || isLoading}
                      >
                        Permissions
                      </button>
                    )}
                    <button
                      className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                        role.name === 'Administrator'
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                      }`}
                      onClick={() => onDelete(role.id)}
                      disabled={role.name === 'Administrator' || isLoading}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
