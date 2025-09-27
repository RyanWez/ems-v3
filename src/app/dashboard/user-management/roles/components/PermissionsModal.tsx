'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RolePermissions, UserRole } from '../types/permissions';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole | null;
  onSave: (roleId: number, permissions: RolePermissions) => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  role,
  onSave
}) => {
  const [permissions, setPermissions] = useState<RolePermissions>({
    dashboard: {
      view: false,
      viewAnalytics: false,
      viewReports: false,
    },
    employeeManagement: {
      view: false,
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
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (role) {
      // If Administrator role, set all permissions to true
      if (role.name === 'Administrator') {
        setPermissions({
          dashboard: {
            view: true,
            viewAnalytics: true,
            viewReports: true,
          },
          employeeManagement: {
            view: true,
            create: true,
            edit: true,
            delete: true,
            viewDetails: true,
            manageLeave: true,
            viewBirthday: true,
          },
          userManagement: {
            view: true,
            create: true,
            edit: true,
            delete: true,
            manageRoles: true,
            managePermissions: true,
          },
        });
      } else {
        setPermissions(role.permissions);
      }
    }
  }, [role]);

  const handlePermissionChange = (module: keyof RolePermissions, permission: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: value,
      },
    }));
  };

  const handleModuleToggle = (module: keyof RolePermissions, allPermissions: boolean) => {
    const modulePermissions = permissions[module];
    const updatedModulePermissions = Object.keys(modulePermissions).reduce((acc, key) => {
      acc[key] = allPermissions;
      return acc;
    }, {} as any);

    setPermissions(prev => ({
      ...prev,
      [module]: updatedModulePermissions,
    }));
  };

  const isModuleFullyChecked = (module: keyof RolePermissions) => {
    const modulePermissions = permissions[module];
    return Object.values(modulePermissions).every(Boolean);
  };

  const isModulePartiallyChecked = (module: keyof RolePermissions) => {
    const modulePermissions = permissions[module];
    const values = Object.values(modulePermissions);
    return values.some(Boolean) && !values.every(Boolean);
  };

  const handleSave = async () => {
    if (!role) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(role.id, permissions);
      toast.success(`Permissions updated for role: ${role.name}`);
      onClose();
    } catch (error) {
      toast.error('Failed to update permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const getModuleIcon = (moduleName: string) => {
    switch (moduleName) {
      case 'dashboard':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
          </svg>
        );
      case 'employeeManagement':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
        );
      case 'userManagement':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-1 sm:p-2 md:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-[95vw] sm:max-w-5xl h-auto max-h-[85vh] sm:max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-blue-600 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white bg-opacity-20 p-1.5 sm:p-2 rounded-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">Manage Permissions</h2>
                <p className="text-blue-100 text-xs sm:text-sm">Role: {role.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 sm:p-2 transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {Object.entries(permissions).map(([moduleKey, modulePermissions]) => (
            <div key={moduleKey} className="mb-4 sm:mb-6 bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="text-blue-600">
                    {getModuleIcon(moduleKey)}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 capitalize">
                    {moduleKey === 'employeeManagement' ? 'Employee Management' :
                     moduleKey === 'userManagement' ? 'User Management' : 'Dashboard'}
                  </h3>
                </div>
                {role.name !== 'Administrator' && (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isModuleFullyChecked(moduleKey as keyof RolePermissions)}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = isModulePartiallyChecked(moduleKey as keyof RolePermissions);
                        }
                      }}
                      onChange={(e) => handleModuleToggle(moduleKey as keyof RolePermissions, e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Select All</span>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {Object.entries(modulePermissions).map(([permissionKey, permissionValue]) => (
                  <label
                    key={permissionKey}
                    className={`flex items-start space-x-3 p-2 sm:p-3 rounded-lg border transition-colors ${
                      role.name === 'Administrator'
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={permissionValue as boolean}
                      disabled={role.name === 'Administrator'}
                      onChange={(e) => handlePermissionChange(
                        moduleKey as keyof RolePermissions,
                        permissionKey,
                        e.target.checked
                      )}
                      className={`w-4 h-4 mt-0.5 rounded focus:ring-blue-500 ${
                        role.name === 'Administrator'
                          ? 'text-gray-400'
                          : 'text-blue-600'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 capitalize">
                        {permissionKey === 'view' ? 'View' :
                         permissionKey === 'viewAnalytics' ? 'View Analytics' :
                         permissionKey === 'viewReports' ? 'View Reports' :
                         permissionKey === 'create' ? 'Create' :
                         permissionKey === 'edit' ? 'Edit' :
                         permissionKey === 'delete' ? 'Delete' :
                         permissionKey === 'viewDetails' ? 'View Details' :
                         permissionKey === 'manageLeave' ? 'Manage Leave' :
                         permissionKey === 'viewBirthday' ? 'View Birthday' :
                         permissionKey === 'manageRoles' ? 'Manage Roles' :
                         permissionKey === 'managePermissions' ? 'Manage Permissions' :
                         permissionKey}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {permissionKey === 'view' ? 'Can view module content' :
                         permissionKey === 'viewAnalytics' ? 'Can view analytics and statistics' :
                         permissionKey === 'viewReports' ? 'Can view system reports' :
                         permissionKey === 'create' ? 'Can create new records' :
                         permissionKey === 'edit' ? 'Can modify existing records' :
                         permissionKey === 'delete' ? 'Can delete records' :
                         permissionKey === 'viewDetails' ? 'Can view detailed information' :
                         permissionKey === 'manageLeave' ? 'Can manage employee leave requests' :
                         permissionKey === 'viewBirthday' ? 'Can view birthday information' :
                         permissionKey === 'manageRoles' ? 'Can create and edit user roles' :
                         permissionKey === 'managePermissions' ? 'Can manage role permissions' :
                         ''}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 flex flex-row justify-end space-x-2 sm:space-x-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium min-w-[80px] sm:min-w-[100px]"
          >
            Cancel
          </button>
          {role.name !== 'Administrator' && (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 min-w-[120px] sm:min-w-[140px]"
            >
              {isLoading ? 'Saving...' : 'Save Permissions'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;