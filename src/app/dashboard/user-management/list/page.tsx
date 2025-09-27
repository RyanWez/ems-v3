
'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import EmployeeListIcon from '@/components/icons/EmployeeListIcon';

interface User {
  id: number;
  name: string;
  password: string;
  role: string;
  status: string;
  lastLogin: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Admin',
      password: '******',
      role: 'Super Admin',
      status: 'Active',
      lastLogin: '2025-09-22 10:30 AM'
    },
    {
      id: 2,
      name: 'John Manager',
      password: '******',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2025-09-21 3:45 PM'
    },
    {
      id: 3,
      name: 'Sarah Employee',
      password: '******',
      role: 'Employee',
      status: 'Active',
      lastLogin: '2025-09-20 9:15 AM'
    },
    {
      id: 4,
      name: 'Mike Contractor',
      password: '******',
      role: 'Contractor',
      status: 'Inactive',
      lastLogin: '2025-09-15 11:20 AM'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const addUser = () => {
    setIsLoading(true);
    const newUser: User = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name: 'New User',
      password: '******',
      role: 'Employee',
      status: 'Active',
      lastLogin: new Date().toLocaleString()
    };
    setTimeout(() => {
      setUsers([...users, newUser]);
      setIsLoading(false);
      toast.success('New user added successfully!');
    }, 500);
  };

  const editUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user?.role === 'Super Admin') {
      toast.error('Cannot edit Super Admin user!');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setUsers(users.map(u => u.id === id ? {...u, name: u.name} : u));
      setIsLoading(false);
      toast.info(`User ${user?.name} has been updated!`);
    }, 500);
  };

  const deleteUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user?.role === 'Super Admin') {
      toast.warning('Cannot delete Super Admin user!');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user: ${user?.name}?`)) {
      setIsLoading(true);
      setTimeout(() => {
        setUsers(users.filter(u => u.id !== id));
        setIsLoading(false);
        toast.success(`User ${user?.name} has been deleted!`);
      }, 500);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'Administrator': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Employee': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Contractor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          User Management
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Manage system users, their roles, and access permissions with ease.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white bg-opacity-20 p-1.5 sm:p-2 rounded-lg">
                <EmployeeListIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white">System Users</h3>
              <span className="bg-white bg-opacity-20 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full">
                {users.length} users
              </span>
            </div>
            <button
              className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start"
              onClick={addUser}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="text-sm sm:text-base">{isLoading ? 'Adding...' : 'Add New User'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Password</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Role</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user, index) => (
                <tr key={user.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500">ID: {user.id}</div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="text-xs sm:text-sm text-gray-600 font-mono bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded text-center">
                      {user.password}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden md:table-cell">
                    <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                    {user.lastLogin}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-1 sm:space-x-2">
                      <button
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                          user.role === 'Super Admin'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                        }`}
                        onClick={() => editUser(user.id)}
                        disabled={user.role === 'Super Admin' || isLoading}
                      >
                        Edit
                      </button>
                      <button
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                          user.role === 'Super Admin'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                        }`}
                        onClick={() => deleteUser(user.id)}
                        disabled={user.role === 'Super Admin' || isLoading}
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

export default UserList;
