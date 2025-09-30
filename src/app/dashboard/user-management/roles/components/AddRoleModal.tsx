'use client';
import React from 'react';
import { AccessibleModal } from '@/components/AccessibleModal';
import { RoleForm } from './RoleForm';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => void;
  isLoading?: boolean;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const handleSave = (data: { name: string; description: string }) => {
    onSave(data);
    onClose();
  };

  return (
    <AccessibleModal isOpen={isOpen} onClose={onClose} title="Add New Role" size="sm">
      <RoleForm
        onSave={handleSave}
        onCancel={onClose}
        isLoading={isLoading}
        submitButtonText="Add Role"
      />
    </AccessibleModal>
  );
};

export default AddRoleModal;
