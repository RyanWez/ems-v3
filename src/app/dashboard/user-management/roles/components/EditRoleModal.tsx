'use client';
import React from 'react';
import { AccessibleModal } from '@/components/AccessibleModal';
import { RoleForm } from './RoleForm';
import { UserRole } from '../types/permissions';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, data: { name: string; description: string }) => void;
  role: UserRole | null;
  isLoading?: boolean;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  role,
  isLoading = false,
}) => {
  if (!role) return null;

  const handleSave = (data: { name: string; description: string }) => {
    onSave(role.id, data);
    onClose();
  };

  return (
    <AccessibleModal isOpen={isOpen} onClose={onClose} title="Edit Role" size="sm">
      <RoleForm
        initialName={role.name}
        initialDescription={role.description || ''}
        onSave={handleSave}
        onCancel={onClose}
        isLoading={isLoading}
        submitButtonText="Update Role"
      />
    </AccessibleModal>
  );
};

export default EditRoleModal;
