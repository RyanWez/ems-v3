import { RolePermissions } from '@/app/dashboard/user-management/roles/types/permissions';

// Helper function to check if a field should be visible
export const canViewField = (permissions: RolePermissions | null, fieldName: keyof RolePermissions['employeeManagement']['fields']): boolean => {
  if (!permissions) return false;
  return permissions.employeeManagement?.fields?.[fieldName] ?? false;
};

// Helper function to check if an action should be available
export const canPerformAction = (permissions: RolePermissions | null, actionName: keyof RolePermissions['employeeManagement']['actions']): boolean => {
  if (!permissions) return false;
  return permissions.employeeManagement?.actions?.[actionName] ?? false;
};

// Helper function to check basic list permissions
export const canViewEmployeeList = (permissions: RolePermissions | null): boolean => {
  if (!permissions) return false;
  return permissions.employeeManagement?.list?.view ?? false;
};

export const canCreateEmployee = (permissions: RolePermissions | null): boolean => {
  if (!permissions) return false;
  return permissions.employeeManagement?.list?.create ?? false;
};

// Helper to get visible columns based on permissions
export const getVisibleColumns = (permissions: RolePermissions | null) => {
  const columns = [
    { key: 'name', label: 'Name', field: 'name' as const },
    { key: 'joinDate', label: 'Join Date', field: 'joinDate' as const },
    { key: 'serviceYears', label: 'Service Years', field: 'serviceYears' as const },
    { key: 'gender', label: 'Gender', field: 'gender' as const },
    { key: 'dob', label: 'DOB', field: 'dob' as const },
    { key: 'phoneNo', label: 'Phone No.', field: 'phoneNo' as const },
    { key: 'position', label: 'Position', field: 'position' as const },
  ];

  return columns.filter(column => canViewField(permissions, column.field));
};

// Helper to get available actions based on permissions
export const getAvailableActions = (permissions: RolePermissions | null) => {
  const actions = [
    { key: 'view', label: 'View', action: 'view' as const },
    { key: 'edit', label: 'Edit', action: 'edit' as const },
    { key: 'delete', label: 'Delete', action: 'delete' as const },
  ];

  return actions.filter(action => canPerformAction(permissions, action.action));
};