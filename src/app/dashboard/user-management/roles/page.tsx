'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import UserRoleIcon from '@/components/icons/UserRoleIcon';

interface UserRole {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  color: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

const UserRoles: React.FC = () => {
  const [roles, setRoles] = useState<UserRole[]>([
    {
      id: 1,
      name: 'Administrator',
      description: 'Full system access with all permissions',
      permissions: ['Read', 'Write', 'Delete', 'User Management', 'System Settings'],
      userCount: 2,
      color: 'purple',
      status: 'Active',
      createdAt: '2025-01-15'
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Manage team members and view reports',
      permissions: ['Read', 'Write', 'Team Management', 'Reports'],
      userCount: 8,
      color: 'blue',
      status: 'Active',
      createdAt: '2025-01-16'
    },
    {
      id: 3,
      name: 'Employee',
      description: 'Basic access for daily tasks',
      permissions: ['Read', 'Write Personal'],
      userCount: 125,
      color: 'green',
      status: 'Active',
      createdAt: '2025-01-17'
    },
    {
      id: 4,
      name: 'Contractor',
      description: 'Limited access for external contractors',
      permissions: ['Read Limited'],
      userCount: 15,
      color: 'yellow',
      status: 'Active',
      createdAt: '2025-01-18'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const addRole = () => {
    setIsLoading(true);
    const newRole: UserRole = {
      id: Math.max(...roles.map(r => r.id)) + 1,
      name: 'New Role',
      description: 'New role description',
      permissions: ['Read'],
      userCount: 0,
      color: 'gray',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTimeout(() => {
      setRoles([...roles, newRole]);
      setIsLoading(false);
      toast.success('New role added successfully!');
    }, 500);
  };

  const editRole = (id: number) => {
    const role = roles.find(r => r.id === id);
    if (role?.name === 'Administrator') {
      toast.error('Cannot edit Administrator role!');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setRoles(roles.map(r => r.id === id ? {...r, name: r.name} : r));
      setIsLoading(false);
      toast.info(`Role ${role?.name} has been updated!`);
    }, 500);
  };

  const managePermissions = (id: number) => {
    const role = roles.find(r => r.id === id);
    toast.info(`Managing permissions for role: ${role?.name}`);
  };

  const deleteRole = (id: number) => {
    const role = roles.find(r => r.id === id);
    if (role?.name === 'Administrator') {
      toast.warning('Cannot delete Administrator role!');
      return;
    }
    if (window.confirm(`Are you sure you want to delete role: ${role?.name}?`)) {
      setIsLoading(true);
      setTimeout(() => {
        setRoles(roles.filter(r => r.id !== id));
        setIsLoading(false);
        toast.success(`Role ${role?.name} has been deleted!`);
      }, 500);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          User Roles
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Manage user roles and permissions to control access to different system features.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white bg-opacity-20 p-1.5 sm:p-2 rounded-lg">
                <UserRoleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">Role Management</h3>
              <span className="bg-white bg-opacity-20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                {roles.length} roles
              </span>
            </div>
            <button
              className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start"
              onClick={addRole}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="text-sm sm:text-base">{isLoading ? 'Adding...' : 'Add New Role'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">No.</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.map((role, index) => (
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
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex flex-col justify-center space-y-1 sm:space-y-2">
                      <button
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                          role.name === 'Administrator'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                        }`}
                        onClick={() => editRole(role.id)}
                        disabled={role.name === 'Administrator' || isLoading}
                      >
                        Edit
                      </button>
                      <button
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                          role.name === 'Administrator'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                        }`}
                        onClick={() => managePermissions(role.id)}
                        disabled={role.name === 'Administrator' || isLoading}
                      >
                        Permissions
                      </button>
                      <button
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                          role.name === 'Administrator'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                        }`}
                        onClick={() => deleteRole(role.id)}
                        disabled={role.name === 'Administrator' || isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserRoles;
