'use client';
import React, { useState } from 'react';
import { AccessibleModal } from '@/components/AccessibleModal';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  isLoading?: boolean;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) => {
  const [roleName, setRoleName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!roleName.trim()) {
      setError('Role name is required');
      return;
    }
    if (roleName.trim().length < 2) {
      setError('Role name must be at least 2 characters');
      return;
    }
    setError('');
    onSave(roleName.trim());
    setRoleName('');
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

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Role"
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-2">
            Role Name
          </label>
          <input
            id="roleName"
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
          disabled={isLoading || !roleName.trim()}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Role'}
        </button>
      </div>
    </AccessibleModal>
  );
};

export default AddRoleModal;