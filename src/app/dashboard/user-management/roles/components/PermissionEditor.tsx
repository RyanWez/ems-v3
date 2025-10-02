'use client';
import React from 'react';
import { RolePermissions } from '../types/permissions';
import { permissionConfig } from '../lib/permissionConfig';

interface PermissionEditorProps {
  permissions: RolePermissions;
  onPermissionsChange: (newPermissions: RolePermissions) => void;
  isReadOnly?: boolean;
}

export const PermissionEditor: React.FC<PermissionEditorProps> = ({ 
  permissions, 
  onPermissionsChange, 
  isReadOnly = false 
}) => {

  const handleSubModuleToggle = (module: keyof RolePermissions, subModule: string, isChecked: boolean) => {
    const newPermissions = { ...permissions };
    const subModulePermissions = permissionConfig[module].subModules[subModule].permissions;
    
    // Initialize the submodule if it doesn't exist
    if (!newPermissions[module][subModule]) {
      (newPermissions[module] as any)[subModule] = {};
    }
    
    for (const key in subModulePermissions) {
      (newPermissions[module] as any)[subModule][key] = isChecked;
    }
    onPermissionsChange(newPermissions);
  };

  const handlePermissionChange = (module: keyof RolePermissions, subModule: string, permission: string, isChecked: boolean) => {
    const newPermissions = { ...permissions };
    
    // Ensure the nested structure exists
    if (!newPermissions[module][subModule]) {
      (newPermissions[module] as any)[subModule] = {};
    }
    
    (newPermissions[module] as any)[subModule][permission] = isChecked;
    onPermissionsChange(newPermissions);
  };

  const getSubModuleCheckedState = (module: keyof RolePermissions, subModule: string): 'all' | 'some' | 'none' => {
    const subModulePermissions = (permissions[module] as any)?.[subModule];
    if (!subModulePermissions || typeof subModulePermissions !== 'object') {
      return 'none';
    }
    const permissionKeys = Object.keys(permissionConfig[module].subModules[subModule].permissions);
    const checkedCount = permissionKeys.filter(key => subModulePermissions[key]).length;

    if (checkedCount === 0) return 'none';
    if (checkedCount === permissionKeys.length) return 'all';
    return 'some';
  };

  return (
    <div className="space-y-6">
      {Object.entries(permissionConfig).map(([moduleKey, moduleData]) => (
        <div key={moduleKey} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{moduleData.title}</h3>
          <div className="space-y-4">
            {Object.entries(moduleData.subModules).map(([subModuleKey, subModuleData]) => {
              const checkedState = getSubModuleCheckedState(moduleKey as keyof RolePermissions, subModuleKey);
              return (
                <div key={subModuleKey} className="bg-white rounded-md p-4 border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-md font-semibold text-gray-700">{subModuleData.title}</h4>
                    {!isReadOnly && (
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                          ref={el => {
                            if (el) el.indeterminate = checkedState === 'some';
                          }}
                          checked={checkedState === 'all'}
                          onChange={(e) => handleSubModuleToggle(moduleKey as keyof RolePermissions, subModuleKey, e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-600">Select All</span>
                      </label>
                    )}
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-3 border-t">
                    {Object.entries(subModuleData.permissions).map(([permissionKey, permissionData]) => (
                      <label key={permissionKey} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                          checked={(permissions[moduleKey as keyof RolePermissions] as any)?.[subModuleKey]?.[permissionKey] ?? false}
                          disabled={isReadOnly}
                          onChange={(e) => handlePermissionChange(moduleKey as keyof RolePermissions, subModuleKey, permissionKey, e.target.checked)}
                        />
                        <div>
                          <span className="font-medium text-sm text-gray-800">{permissionData.title}</span>
                          <p className="text-xs text-gray-500">{permissionData.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
