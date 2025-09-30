'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useRoles } from './hooks/useRoles';
import { useAuth } from '@/Auth';
import { UserRole, RolePermissions } from './types/permissions';

// Import decomposed components
import { RoleList } from './components/RoleList';
import { RolePageHeader } from './components/RolePageHeader';

// Import modals
import PermissionsModal from './components/PermissionsModal';
import AddRoleModal from './components/AddRoleModal';
import EditRoleModal from './components/EditRoleModal';
import DeleteRoleModal from './components/DeleteRoleModal';

// Define modal states
type ModalState = 
  | { type: 'add'; data?: null }
  | { type: 'edit'; data: UserRole }
  | { type: 'delete'; data: UserRole }
  | { type: 'permissions'; data: UserRole }
  | { type: 'closed'; data?: null };

const UserRolesPage: React.FC = () => {
  const { permissions, userRole } = useAuth();
  const { roles, isLoading, error, createRole, updateRole, deleteRole, updateRolePermissions } = useRoles();

  const [modalState, setModalState] = useState<ModalState>({ type: 'closed' });

  // Permission checking
  // For the new granular permissions, we check the specific permission for managing roles
  const canManageRoles = permissions?.userManagement?.roles?.manage || userRole === 'Administrator';

  // --- Data Handlers ---
  const handleAddRole = async (data: { name: string; description: string; permissions: RolePermissions }) => {
    await createRole({ 
      name: data.name, 
      description: data.description, 
      permissions: data.permissions,
    });
  };

  const handleEditRole = async (id: number, data: { name: string; description: string }) => {
    await updateRole(id, { name: data.name, description: data.description });
  };

  const handleDeleteRole = async (id: number) => {
    await deleteRole(id);
    setModalState({ type: 'closed' });
  };

  const handlePermissionsSave = async (roleId: number, permissions: RolePermissions) => {
    await updateRolePermissions(roleId, permissions);
    setModalState({ type: 'closed' });
  };

  // --- Modal Triggers ---
  const openEditModal = (role: UserRole) => {
    if (!canManageRoles) {
      toast.error('You do not have permission to edit roles!');
      return;
    }
    if (role.name === 'Administrator') {
      toast.error('Cannot edit Administrator role!');
      return;
    }
    setModalState({ type: 'edit', data: role });
  };

  const openDeleteModal = (role: UserRole) => {
    if (!canManageRoles) {
      toast.error('You do not have permission to delete roles!');
      return;
    }
    if (role.name === 'Administrator') {
      toast.warning('Cannot delete Administrator role!');
      return;
    }
    setModalState({ type: 'delete', data: role });
  };

  // --- Render Logic ---
  if (!canManageRoles) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg border">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to manage user roles.</p>
        </div>
      </div>
    );
  }

  if (isLoading && !roles.length) {
    return <div>Loading...</div>; // Replace with a proper skeleton loader if desired
  }

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-gray-200">
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">User Roles</h2>
        <p className="text-gray-600 text-lg">Manage user roles and their permissions for system access control.</p>
        {error && <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-lg">Error: {error}</div>}
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <RolePageHeader
          roleCount={roles.length}
          onAddRole={() => setModalState({ type: 'add' })}
          isLoading={isLoading}
          canManageRoles={canManageRoles}
        />
        <RoleList
          roles={roles}
          isLoading={isLoading}
          canManagePermissions={canManageRoles}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
          onManagePermissions={(role) => setModalState({ type: 'permissions', data: role })}
        />
      </div>

      {/* --- Modals --- */}
      <AddRoleModal
        isOpen={modalState.type === 'add'}
        onClose={() => setModalState({ type: 'closed' })}
        onSave={handleAddRole}
        isLoading={isLoading}
      />

      <EditRoleModal
        isOpen={modalState.type === 'edit'}
        onClose={() => setModalState({ type: 'closed' })}
        onSave={handleEditRole}
        role={modalState.type === 'edit' ? modalState.data : null}
        isLoading={isLoading}
      />

      <DeleteRoleModal
        isOpen={modalState.type === 'delete'}
        onClose={() => setModalState({ type: 'closed' })}
        onConfirm={() => modalState.type === 'delete' && handleDeleteRole(modalState.data.id)}
        role={modalState.type === 'delete' ? modalState.data : null}
        isLoading={isLoading}
      />

      <PermissionsModal
        isOpen={modalState.type === 'permissions'}
        onClose={() => setModalState({ type: 'closed' })}
        role={modalState.type === 'permissions' ? modalState.data : null}
        onSave={handlePermissionsSave}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserRolesPage;
