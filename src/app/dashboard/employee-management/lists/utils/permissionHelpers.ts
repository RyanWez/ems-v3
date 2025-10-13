import { RolePermissions, FieldPermission, ActionPermission, ActionScope } from '@/app/dashboard/user-management/roles/types/permissions';

// Enhanced Field Permission Result
export interface FieldPermissionResult {
  read: boolean;
  write: boolean;
  visible: boolean;
}

// Enhanced Action Permission Result
export interface ActionPermissionResult {
  enabled: boolean;
  scope: ActionScope;
  canAccessOwn: boolean;
  canAccessTeam: boolean;
  canAccessDepartment: boolean;
  canAccessAll: boolean;
}

// Helper function to parse field permission (supports both old and new format)
export const getFieldPermission = (
  permissions: RolePermissions | null, 
  fieldName: keyof RolePermissions['employeeManagement']['fields'], 
  userRole?: string | null
): FieldPermissionResult => {
  // Administrator always has full access
  if (userRole === 'Administrator') {
    return { read: true, write: true, visible: true };
  }
  
  if (!permissions) {
    return { read: false, write: false, visible: false };
  }
  
  const fieldPerm = permissions.employeeManagement?.fields?.[fieldName];
  
  // Old format: boolean
  if (typeof fieldPerm === 'boolean') {
    return { read: fieldPerm, write: fieldPerm, visible: fieldPerm };
  }
  
  // New format: { read, write }
  if (typeof fieldPerm === 'object' && fieldPerm !== null) {
    const fp = fieldPerm as FieldPermission;
    return { 
      read: fp.read ?? false, 
      write: fp.write ?? false,
      visible: fp.read ?? false 
    };
  }
  
  return { read: false, write: false, visible: false };
};

// Helper function to check if a field should be visible (backward compatibility)
export const canViewField = (
  permissions: RolePermissions | null, 
  fieldName: keyof RolePermissions['employeeManagement']['fields'], 
  userRole?: string | null
): boolean => {
  return getFieldPermission(permissions, fieldName, userRole).visible;
};

// Helper function to parse action permission (supports both old and new format)
export const getActionPermission = (
  permissions: RolePermissions | null, 
  actionName: keyof RolePermissions['employeeManagement']['actions'], 
  userRole?: string | null
): ActionPermissionResult => {
  // Administrator always has full access
  if (userRole === 'Administrator') {
    return {
      enabled: true,
      scope: 'all',
      canAccessOwn: true,
      canAccessTeam: true,
      canAccessDepartment: true,
      canAccessAll: true,
    };
  }
  
  if (!permissions) {
    return {
      enabled: false,
      scope: 'own',
      canAccessOwn: false,
      canAccessTeam: false,
      canAccessDepartment: false,
      canAccessAll: false,
    };
  }
  
  const actionPerm = permissions.employeeManagement?.actions?.[actionName];
  
  // Old format: boolean
  if (typeof actionPerm === 'boolean') {
    return {
      enabled: actionPerm,
      scope: actionPerm ? 'all' : 'own',
      canAccessOwn: actionPerm,
      canAccessTeam: actionPerm,
      canAccessDepartment: actionPerm,
      canAccessAll: actionPerm,
    };
  }
  
  // New format: { enabled, scope }
  if (typeof actionPerm === 'object' && actionPerm !== null) {
    const ap = actionPerm as ActionPermission;
    const scope = ap.scope ?? 'own';
    return {
      enabled: ap.enabled ?? false,
      scope,
      canAccessOwn: ap.enabled && ['own', 'team', 'department', 'all'].includes(scope),
      canAccessTeam: ap.enabled && ['team', 'department', 'all'].includes(scope),
      canAccessDepartment: ap.enabled && ['department', 'all'].includes(scope),
      canAccessAll: ap.enabled && scope === 'all',
    };
  }
  
  return {
    enabled: false,
    scope: 'own',
    canAccessOwn: false,
    canAccessTeam: false,
    canAccessDepartment: false,
    canAccessAll: false,
  };
};

// Helper function to check if an action should be available (backward compatibility)
export const canPerformAction = (
  permissions: RolePermissions | null, 
  actionName: keyof RolePermissions['employeeManagement']['actions'], 
  userRole?: string | null
): boolean => {
  return getActionPermission(permissions, actionName, userRole).enabled;
};

// Helper function to check basic list permissions
export const canViewEmployeeList = (permissions: RolePermissions | null, userRole?: string | null): boolean => {
  // Administrator always has access
  if (userRole === 'Administrator') return true;
  if (!permissions) return false;
  return permissions.employeeManagement?.list?.view ?? false;
};

export const canCreateEmployee = (permissions: RolePermissions | null, userRole?: string | null): boolean => {
  // Administrator always has access
  if (userRole === 'Administrator') return true;
  if (!permissions) return false;
  return permissions.employeeManagement?.list?.create ?? false;
};

// Helper to get visible columns based on permissions (Enhanced)
export const getVisibleColumns = (permissions: RolePermissions | null, userRole?: string | null) => {
  const columns = [
    { key: 'name', label: 'Name', field: 'name' as const },
    { key: 'joinDate', label: 'Join Date', field: 'joinDate' as const },
    { key: 'serviceYears', label: 'Service Years', field: 'serviceYears' as const },
    { key: 'gender', label: 'Gender', field: 'gender' as const },
    { key: 'dob', label: 'DOB', field: 'dob' as const },
    { key: 'phoneNo', label: 'Phone No.', field: 'phoneNo' as const },
    { key: 'position', label: 'Position', field: 'position' as const },
  ];

  return columns
    .map(column => ({
      ...column,
      permission: getFieldPermission(permissions, column.field, userRole),
    }))
    .filter(column => column.permission.visible);
};

// Helper to get available actions based on permissions (Enhanced)
export const getAvailableActions = (permissions: RolePermissions | null, userRole?: string | null) => {
  const actions = [
    { key: 'view', label: 'View', action: 'view' as const },
    { key: 'edit', label: 'Edit', action: 'edit' as const },
    { key: 'delete', label: 'Delete', action: 'delete' as const },
  ];

  return actions
    .map(action => ({
      ...action,
      permission: getActionPermission(permissions, action.action, userRole),
    }))
    .filter(action => action.permission.enabled);
};

// Helper to check bulk operation permissions
export const canPerformBulkOperation = (
  permissions: RolePermissions | null, 
  operation: 'export' | 'import' | 'delete',
  userRole?: string | null
): boolean => {
  if (userRole === 'Administrator') return true;
  if (!permissions) return false;
  return permissions.employeeManagement?.bulk?.[operation] ?? false;
};

// Helper to check if details field groups should be visible
export const canViewDetailsField = (permissions: RolePermissions | null, fieldGroup: keyof RolePermissions['employeeManagement']['detailsFields'], userRole?: string | null): boolean => {
  // Administrator always has access
  if (userRole === 'Administrator') return true;
  if (!permissions) return false;
  return permissions.employeeManagement?.detailsFields?.[fieldGroup] ?? false;
};

// Helper to check if employee details page can be accessed
export const canViewEmployeeDetails = (permissions: RolePermissions | null, userRole?: string | null): boolean => {
  // Administrator always has access
  if (userRole === 'Administrator') return true;
  if (!permissions) return false;
  return permissions.employeeManagement?.details?.view ?? false;
};