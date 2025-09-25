
'use client';
import React from 'react';
import { toast } from 'sonner';

const UserList: React.FC = () => {
  const users = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@company.com',
      role: 'Administrator',
      status: 'Active',
      lastLogin: '2025-09-22 10:30 AM'
    },
    {
      id: 2,
      name: 'John Manager',
      email: 'john.manager@company.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2025-09-21 3:45 PM'
    },
    {
      id: 3,
      name: 'Sarah Employee',
      email: 'sarah.employee@company.com',
      role: 'Employee',
      status: 'Active',
      lastLogin: '2025-09-20 9:15 AM'
    },
    {
      id: 4,
      name: 'Mike Contractor',
      email: 'mike.contractor@company.com',
      role: 'Contractor',
      status: 'Inactive',
      lastLogin: '2025-09-15 11:20 AM'
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator': return 'bg-purple-100 text-purple-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Employee': return 'bg-gray-100 text-gray-800';
      case 'Contractor': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">User List</h2>
      <p className="text-gray-600 mb-6">
        Manage system users, their roles, and access permissions.
      </p>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">System Users</h3>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => toast.success('New user added successfully!')}
          >
            Add New User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4" onClick={() => toast.info(`Editing user: ${user.name}`)}>Edit</button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => {
                        if (user.role === 'Administrator') {
                            toast.warning('Administrator user cannot be deleted.');
                        } else {
                            toast.error(`Failed to delete user: ${user.name}`);
                        }
                    }}>Delete</button>
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

export default UserList;
