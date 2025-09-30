'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AccessibleModal } from '@/components/AccessibleModal';
import { PermissionEditor } from './PermissionEditor';
import { RolePermissions, UserRole } from '../types/permissions';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole | null;
  onSave: (roleId: number, permissions: RolePermissions) => void;
  isLoading?: boolean;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  role,
  onSave,
  isLoading = false,
}) => {
  const [currentPermissions, setCurrentPermissions] = useState<RolePermissions | null>(null);

  useEffect(() => {
    if (role) {
      setCurrentPermissions(role.permissions);
    }
  }, [role]);

  const handleSave = () => {
    if (!role || !currentPermissions) return;
    onSave(role.id, currentPermissions);
  };

  if (!role) return null;

  const isAdministrator = role.name === 'Administrator';

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Permissions for: ${role.name}`}
      size="xl"
    >
      <div className="my-4">
        <PermissionEditor 
          permissions={currentPermissions || role.permissions} 
          onPermissionsChange={setCurrentPermissions}
          isReadOnly={isAdministrator}
        />
      </div>
      
      {!isAdministrator && (
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {isAdministrator && (
         <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-700">The Administrator role always has all permissions enabled.</p>
        </div>
      )}
    </AccessibleModal>
  );
};

export default PermissionsModal;
