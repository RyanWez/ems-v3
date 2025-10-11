
'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ChevronsUpDown } from 'lucide-react';
import EmployeeListIcon from '@/components/icons/EmployeeListIcon';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/Auth';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  roleId: number;
  status: string;
  displayName: string;
}

const UserList: React.FC = () => {
  const { permissions, userRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    roleId: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Permission checking functions
  const canViewUsers = permissions?.userManagement?.list?.view || userRole === 'Administrator';
  const canCreateUsers = permissions?.userManagement?.list?.create || userRole === 'Administrator';
  const canEditUsers = permissions?.userManagement?.list?.edit || userRole === 'Administrator';
  const canDeleteUsers = permissions?.userManagement?.list?.delete || userRole === 'Administrator';

  // Redirect if no view permission
  useEffect(() => {
    if (!canViewUsers) {
      toast.error('You do not have permission to view user management');
      // Could redirect to dashboard or show error
    }
  }, [canViewUsers]);

  // Fetch users and roles from API
  useEffect(() => {
    if (canViewUsers) {
      fetchUsers();
      fetchRoles();
    }
  }, [canViewUsers]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const addUser = () => {
    // Reset form data
    setFormData({
      name: '',
      password: '',
      roleId: roles.length > 0 ? roles[0].id.toString() : ''
    });
    setFormErrors({});
    setIsAddDialogOpen(true);
  };

  const handleAddUser = async () => {
    // Validation
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errors.name = 'Username is required';
    } else {
      // Check if username already exists
      const existingUser = users.find(user => user.displayName.toLowerCase() === formData.name.toLowerCase());
      if (existingUser) {
        errors.name = 'Username already exists';
      }
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.roleId) {
      errors.roleId = 'Role is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: `${formData.name.trim().toLowerCase()}@example.com`,
          password: formData.password.trim(),
          roleId: parseInt(formData.roleId),
        }),
      });

      if (response.ok) {
        const newUser = await response.json();
        fetchUsers();
        setIsAddDialogOpen(false);
        toast.success('New user added successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error adding user');
    } finally {
      setIsLoading(false);
    }
  };

  const editUser = (id: number) => {
    if (!canEditUsers) {
      toast.error('You do not have permission to edit users!');
      return;
    }

    const user = users.find(u => u.id === id);
    if (user?.displayName === 'Admin') {
      toast.error('Cannot edit Admin user!');
      return;
    }

    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.displayName,
        password: '', // Don't populate password for security
        roleId: user.roleId.toString()
      });
      setFormErrors({});
      setIsEditDialogOpen(true);
    }
  };

  const deleteUser = (id: number) => {
    if (!canDeleteUsers) {
      toast.error('You do not have permission to delete users!');
      return;
    }

    const user = users.find(u => u.id === id);
    if (user?.displayName === 'Admin') {
      toast.warning('Cannot delete Admin user!');
      return;
    }

    if (user) {
      setDeletingUser(user);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    // Validation
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errors.name = 'Username is required';
    } else {
      // Check if username already exists (excluding current user)
      const existingUser = users.find(user =>
        user.email.toLowerCase() === `${formData.name.trim().toLowerCase()}@example.com` && user.id !== editingUser.id
      );
      if (existingUser) {
        errors.name = 'Username already exists';
      }
    }

    if (!formData.roleId) {
      errors.roleId = 'Role is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const updateData: any = {
        name: formData.name.trim(),
        email: `${formData.name.trim().toLowerCase()}@example.com`,
        roleId: parseInt(formData.roleId),
      };

      console.log('Updating user with data:', updateData);

      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Updated user response:', updatedUser);
        fetchUsers();
        setIsEditDialogOpen(false);
        setEditingUser(null);
        toast.success('User updated successfully!');
      } else {
        const error = await response.json();
        console.error('Update error:', error);
        toast.error(error.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${deletingUser.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
        setIsDeleteDialogOpen(false);
        setDeletingUser(null);
        toast.success(`User ${deletingUser.displayName} has been deleted!`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrator': return 'bg-red-100 text-red-800 border-red-200';
      case 'Administrator': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Employee': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Contractor': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!canViewUsers) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to view user management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200" style={{backgroundColor: '#DCFCE7'}}>
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
            {canCreateUsers && (
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
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="w-1/5 px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">UserName</th>
                <th className="w-1/5 px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Password</th>
                <th className="w-1/5 px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="w-1/5 px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="w-1/5 px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user, index) => (
                <tr key={user.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                  <td className="w-1/5 px-3 sm:px-6 py-3 sm:py-4 text-center">
                    <div className="text-sm font-semibold text-gray-900 truncate">{user.displayName}</div>
                  </td>
                  <td className="w-1/5 px-3 sm:px-6 py-3 sm:py-4 text-center">
                    <div className="text-xs sm:text-sm text-gray-600 font-mono bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 rounded mx-auto inline-block">
                      ******
                    </div>
                  </td>
                  <td className="w-1/5 px-3 sm:px-6 py-3 sm:py-4 text-center">
                    <div className="flex justify-center">
                      <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="w-1/5 px-3 sm:px-6 py-3 sm:py-4 text-center">
                    <div className="flex justify-center">
                      <span className={`px-2 sm:px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="w-1/5 px-3 sm:px-6 py-3 sm:py-4 text-center">
                    <div className="flex justify-center space-x-1 sm:space-x-2">
                      {canEditUsers && (
                        <button
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                            user.displayName === 'Admin'
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                          }`}
                          onClick={() => editUser(user.id)}
                          disabled={user.displayName === 'Admin' || isLoading}
                        >
                          Edit
                        </button>
                      )}
                      {canDeleteUsers && (
                        <button
                          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                            user.displayName === 'Admin'
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                          }`}
                          onClick={() => deleteUser(user.id)}
                          disabled={user.displayName === 'Admin' || isLoading}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New User</h3>

            <div className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UserName *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter username"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter password"
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-between ${
                        formErrors.roleId ? 'border-red-500' : ''
                      }`}
                    >
                      {formData.roleId ?
                        roles.find(role => role.id.toString() === formData.roleId)?.name || 'Select a role'
                        : 'Select a role'
                      }
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[300px]">
                    {roles.map((role) => (
                      <DropdownMenuItem
                        key={role.id}
                        onSelect={() => setFormData({...formData, roleId: role.id.toString()})}
                        className="cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:bg-gray-100 focus:text-gray-900"
                      >
                        {role.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {formErrors.roleId && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.roleId}</p>
                )}
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Dialog */}
      {isEditDialogOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Edit User</h3>

            <div className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UserName *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter username"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>


              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-between ${
                        formErrors.roleId ? 'border-red-500' : ''
                      }`}
                    >
                      {formData.roleId ?
                        roles.find(role => role.id.toString() === formData.roleId)?.name || 'Select a role'
                        : 'Select a role'
                      }
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full min-w-[300px]">
                    {roles.map((role) => (
                      <DropdownMenuItem
                        key={role.id}
                        onSelect={() => setFormData({...formData, roleId: role.id.toString()})}
                        className="cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:bg-gray-100 focus:text-gray-900"
                      >
                        {role.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {formErrors.roleId && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.roleId}</p>
                )}
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Dialog */}
      {isDeleteDialogOpen && deletingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Delete User</h3>

            <div className="mb-4">
              <p className="text-gray-600">
                Are you sure you want to delete user <strong>{deletingUser.displayName}</strong>?
              </p>
              <p className="text-gray-500 text-sm mt-2">This action cannot be undone.</p>
            </div>

            {/* Dialog Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
