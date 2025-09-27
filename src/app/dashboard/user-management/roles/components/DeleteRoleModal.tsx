'use client';
import React from 'react';
import { AccessibleModal } from '@/components/AccessibleModal';
import { UserRole } from '../types/permissions';

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  role: UserRole | null;
  isLoading?: boolean;
}

const DeleteRoleModal: React.FC<DeleteRoleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  role,
  isLoading = false
}) => {
  const handleConfirm = () => {
    if (!role) return;
    onConfirm(role.id);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleConfirm();
    }
  };

  if (!role) return null;

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Role"
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              Are you sure you want to delete the role{' '}
              <span className="font-semibold text-gray-900">&ldquo;{role.name}&rdquo;</span>?
            </p>
            <p className="text-xs text-gray-500 mt-1">
              This action cannot be undone. All users with this role will be affected.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-xs text-yellow-800">
              <p className="font-medium">Warning:</p>
              <p>Deleting this role may affect {role.userCount} user(s). Consider reassigning users to a different role first.</p>
            </div>
          </div>
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
          onClick={handleConfirm}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Deleting...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>Delete Role</span>
            </>
          )}
        </button>
      </div>
    </AccessibleModal>
  );
};

export default DeleteRoleModal;