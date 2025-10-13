'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { AccessibleModal } from '@/components/AccessibleModal';
import { RoleForm } from './RoleForm';
import { PermissionEditor } from './PermissionEditor';
import { RolePermissions } from '../types/permissions';

// Defines a default set of permissions for a new role
const getDefaultPermissions = (): RolePermissions => ({
  dashboard: {
    general: { view: true },
    overviewCards: {
      viewTotalEmployees: false,
      viewNewHires: false,
      viewDepartments: false,
      viewActiveProjects: false,
    },
    charts: {
      viewEmployeeGrowth: false,
      viewDepartmentDistribution: false,
      viewAttendanceStats: false,
      viewPerformanceMetrics: false,
    },
    analytics: { view: false },
    recentActivities: {
      viewRecentActivities: false,
    },
  },
  employeeManagement: {
    list: { 
      view: true, 
      create: false 
    },
    fields: {
      name: true,
      joinDate: false,
      serviceYears: false,
      gender: false,
      dob: false,
      phoneNo: false,
      position: true,
    },
    actions: {
      view: true,
      edit: false,
      delete: false,
      viewDetails: false,
    },
    bulk: {
      export: false,
    },
    details: { 
      view: false 
    },
    detailsFields: {
      personalInfo: false,
      contactInfo: false,
      workInfo: false,
    },
    leave: { 
      manage: false,
      view: false,
      approve: false,
    },
    birthday: { 
      view: true 
    },
  },
  userManagement: {
    list: { 
      view: false, 
      create: false, 
      edit: false, 
      delete: false 
    },
    roles: {
      view: false,
      create: false,
      edit: false,
      delete: false,
      managePermissions: false,
    },
  },
});

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; permissions: RolePermissions }) => void;
  isLoading?: boolean;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [step, setStep] = useState(1);
  const [roleData, setRoleData] = useState<{ name: string; description: string } | null>(null);
  const [permissions, setPermissions] = useState<RolePermissions>(getDefaultPermissions());

  const handleStep1Save = (data: { name: string; description: string }) => {
    setRoleData(data);
    setStep(2);
  };

  const handleFinalSave = () => {
    if (!roleData) {
      console.error('No role data available');
      return;
    }

    // Validate that we have all required fields
    if (!roleData.name || !roleData.description || !permissions) {
      console.error('Missing required fields:', { roleData, permissions });
      toast.error('Missing required fields. Please complete all steps.');
      return;
    }

    console.log('Saving role with data:', { ...roleData, permissions });
    onSave({ ...roleData, permissions });
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setRoleData(null);
    setPermissions(getDefaultPermissions());
    onClose();
  };

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? 'Add New Role (Step 1 of 2)' : 'Set Permissions (Step 2 of 2)'}
      size={step === 1 ? 'sm' : 'xl'}
    >
      {step === 1 ? (
        <RoleForm
          onSave={handleStep1Save}
          onCancel={handleClose}
          isLoading={isLoading}
          submitButtonText="Next: Set Permissions"
        />
      ) : (
        <>
          <div className="my-4">
            <PermissionEditor permissions={permissions} onPermissionsChange={setPermissions} />
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleFinalSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving Role...' : 'Create Role'}
            </button>
          </div>
        </>
      )}
    </AccessibleModal>
  );
};

export default AddRoleModal;