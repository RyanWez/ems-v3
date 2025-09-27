'use client';
import React, { useState, useEffect } from 'react';
import { AccessibleModal } from '@/components/AccessibleModal';
import { UserRole } from '../types/permissions';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, name: string) => void;
  role: UserRole | null;
  isLoading?: boolean;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  role,
  isLoading = false
}) => {
  const [roleName, setRoleName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (role && isOpen) {
      setRoleName(role.name);
      setError('');
    }
  }, [role, isOpen]);

  const handleSave = () => {
    if (!role) return;

    if (!roleName.trim()) {
      setError('Role name is required');
      return;
    }
    if (roleName.trim().length < 2) {
      setError('Role name must be at least 2 characters');
      return;
    }
    if (roleName.trim() === role.name) {
      setError('No changes made');
      return;
    }
    setError('');
    onSave(role.id, roleName.trim());
    onClose();
  };

  const handleClose = () => {
    setRoleName('');
    setError('');
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSave();
    }
  };

  if (!role) return null;

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Role"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="editRoleName" className="block text-sm font-medium text-gray-700 mb-2">
            Role Name
          </label>
          <input
            id="editRoleName"
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter role name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
            autoFocus
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Current: <span className="font-medium">{role.name}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={handleClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading || !roleName.trim() || roleName.trim() === role.name}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : 'Update Role'}
        </button>
      </div>
    </AccessibleModal>
  );
};

export default EditRoleModal;