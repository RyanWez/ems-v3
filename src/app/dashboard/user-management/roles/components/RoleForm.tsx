'use client';
import React, { useState, useEffect } from 'react';

interface RoleFormProps {
  initialName?: string;
  initialDescription?: string;
  onSave: (data: { name: string; description: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  initialName = '',
  initialDescription = '',
  onSave,
  onCancel,
  isLoading = false,
  submitButtonText = 'Save',
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialName, initialDescription]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Role name is required');
      return;
    }
    if (name.trim().length < 2) {
      setError('Role name must be at least 2 characters');
      return;
    }
    setError('');
    onSave({ name: name.trim(), description: description.trim() });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSave();
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-2">
            Role Name
          </label>
          <input
            id="roleName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter role name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
            autoFocus
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <div>
          <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="roleDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the role's purpose"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading || !name.trim()}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </>
  );
};
