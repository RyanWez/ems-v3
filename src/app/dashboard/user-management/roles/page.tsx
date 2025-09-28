'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import UserRoleIcon from '@/components/icons/UserRoleIcon';
import PermissionsModal from './components/PermissionsModal';
import AddRoleModal from './components/AddRoleModal';
import EditRoleModal from './components/EditRoleModal';
import DeleteRoleModal from './components/DeleteRoleModal';
import { useRoles } from './hooks/useRoles';
import { UserRole, RolePermissions } from './types/permissions';
import { useAuth } from '@/Auth';

const UserRoles: React.FC = () => {
  const { permissions, userRole } = useAuth();
  const { roles, isLoading, error, createRole, updateRole, deleteRole, updateRolePermissions } = useRoles();

  // Permission checking
  const canManageRoles = permissions?.userManagement?.manageRoles || userRole === 'Administrator';
  const canManagePermissions = permissions?.userManagement?.managePermissions || userRole === 'Administrator';

  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Modal states
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<UserRole | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<UserRole | null>(null);

  const handleAddRole = async (name: string) => {
    try {
      await createRole({
        name,
        description: 'New role description',
        permissions: {
          dashboard: {
            view: true,
            viewAnalytics: false,
            viewReports: false,
          },
          employeeManagement: {
            view: true,
            create: false,
            edit: false,
            delete: false,
            viewDetails: false,
            manageLeave: false,
            viewBirthday: false,
          },
          userManagement: {
            view: false,
            create: false,
            edit: false,
            delete: false,
            manageRoles: false,
            managePermissions: false,
          },
        },
        color: 'gray',
      });
      setIsAddRoleModalOpen(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEditRole = async (id: number, name: string) => {
    try {
      await updateRole(id, { name });
      setIsEditRoleModalOpen(false);
      setRoleToEdit(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const managePermissions = (id: number) => {
    const role = roles.find(r => r.id === id);
    if (role) {
      setSelectedRole(role);
      setIsPermissionsModalOpen(true);
    }
  };

  const handlePermissionsSave = async (roleId: number, permissions: RolePermissions) => {
    try {
      await updateRolePermissions(roleId, permissions);
      setIsPermissionsModalOpen(false);
      setSelectedRole(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const closePermissionsModal = () => {
    setIsPermissionsModalOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = async (id: number) => {
    try {
      await deleteRole(id);
      setIsDeleteRoleModalOpen(false);
      setRoleToDelete(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const openAddModal = () => {
    setIsAddRoleModalOpen(true);
  };

  const openEditModal = (id: number) => {
    if (!canManageRoles) {
      toast.error('You do not have permission to edit roles!');
      return;
    }

    const role = roles.find(r => r.id === id);
    if (role?.name === 'Administrator') {
      toast.error('Cannot edit Administrator role!');
      return;
    }
    setRoleToEdit(role || null);
    setIsEditRoleModalOpen(true);
  };

  const openDeleteModal = (id: number) => {
    if (!canManageRoles) {
      toast.error('You do not have permission to delete roles!');
      return;
    }

    const role = roles.find(r => r.id === id);
    if (role?.name === 'Administrator') {
      toast.warning('Cannot delete Administrator role!');
      return;
    }
    setRoleToDelete(role || null);
    setIsDeleteRoleModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  // Check permissions
  if (!canManageRoles) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to manage user roles.</p>
        </div>
      </div>
    );
  }

  // Show loading spinner while fetching initial data
  if (isLoading && roles.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading roles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          User Roles
        </h2>
        <p className="text-gray-600 text-base sm:text-lg">
          Manage user roles and permissions to control access to different system features.
        </p>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-[#DCFCE7] px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
                <UserRoleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Role Management</h3>
              <span className="bg-white text-gray-900 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full shadow-sm font-medium">
                {roles.length} roles
              </span>
            </div>
            <button
              className="bg-white text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start"
              onClick={openAddModal}
              disabled={isLoading || !canManageRoles}
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
               {roles.length === 0 ? (
                 <tr>
                   <td colSpan={3} className="px-3 sm:px-6 py-12 text-center">
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
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex flex-col justify-center space-y-1 sm:space-y-2">
                      <button
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                          role.name === 'Administrator'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                        }`}
                        onClick={() => openEditModal(role.id)}
                        disabled={role.name === 'Administrator' || isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Edit</span>
                          </div>
                        ) : (
                          'Edit'
                        )}
                      </button>
                      {canManagePermissions && (
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
                      )}
                      <button
                        className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                          role.name === 'Administrator'
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                        }`}
                        onClick={() => openDeleteModal(role.id)}
                        disabled={role.name === 'Administrator' || isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Delete</span>
                          </div>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={closePermissionsModal}
        role={selectedRole}
        onSave={handlePermissionsSave}
      />

      <AddRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        onSave={handleAddRole}
        isLoading={isLoading}
      />

      <EditRoleModal
        isOpen={isEditRoleModalOpen}
        onClose={() => {
          setIsEditRoleModalOpen(false);
          setRoleToEdit(null);
        }}
        onSave={handleEditRole}
        role={roleToEdit}
        isLoading={isLoading}
      />

      <DeleteRoleModal
        isOpen={isDeleteRoleModalOpen}
        onClose={() => {
          setIsDeleteRoleModalOpen(false);
          setRoleToDelete(null);
        }}
        onConfirm={handleDeleteRole}
        role={roleToDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserRoles;
