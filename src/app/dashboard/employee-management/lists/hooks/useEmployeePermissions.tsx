'use client';
import { useMemo } from 'react';
import { useAuth } from '@/Auth/AuthContext';
import { RolePermissions, ActionScope, FieldPermission } from '@/app/dashboard/user-management/roles/types/permissions';

// Enhanced Action Permission with Scope
interface ActionPermissionResult {
  enabled: boolean;
  scope: ActionScope;
  canAccessOwn: boolean;
  canAccessTeam: boolean;
  canAccessDepartment: boolean;
  canAccessAll: boolean;
}

// Enhanced Field Permission Result
interface FieldPermissionResult extends FieldPermission {
  visible: boolean;  // Shorthand for read permission
}

interface EmployeePermissions {
  // Basic Access
  canViewList: boolean;
  canCreate: boolean;
  
  // Actions (Enhanced with Scope)
  view: ActionPermissionResult;
  edit: ActionPermissionResult;
  delete: ActionPermissionResult;
  canViewDetails: boolean;
  
  // Legacy action flags (for backward compatibility)
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  
  // Field Visibility (Enhanced with Read/Write)
  fields: {
    name: FieldPermissionResult;
    joinDate: FieldPermissionResult;
    serviceYears: FieldPermissionResult;
    gender: FieldPermissionResult;
    dob: FieldPermissionResult;
    phoneNo: FieldPermissionResult;
    position: FieldPermissionResult;
  };
  
  // Bulk Operations
  bulk: {
    canExport: boolean;
    canImport: boolean;
    canDelete: boolean;
  };
  
  // Details Page Fields
  detailsFields: {
    personalInfo: boolean;
    contactInfo: boolean;
    workInfo: boolean;
  };
  
  // Leave Management
  leave: {
    canManage: boolean;
    canView: boolean;
    canApprove: boolean;
  };
  
  // Birthday View
  canViewBirthdays: boolean;
  
  // Helper Methods
  hasAnyFieldAccess: boolean;
  hasAnyActionAccess: boolean;
  visibleFieldCount: number;
  readableFieldCount: number;
  writableFieldCount: number;
}

const isAdministrator = (userRole: string | null): boolean => {
  return userRole === 'Administrator';
};

export const useEmployeePermissions = (): EmployeePermissions => {
  const { permissions, userRole } = useAuth();
  
  return useMemo(() => {
    const isAdmin = isAdministrator(userRole);
    const perms = permissions as RolePermissions | null;
    
    // Helper function to check nested permissions
    const checkPermission = (path: string[]): boolean => {
      if (isAdmin) return true;
      if (!perms) return false;
      
      let current: any = perms;
      for (const key of path) {
        current = current?.[key];
        if (current === undefined) return false;
      }
      return current === true;
    };
    
    // Helper to parse field permission (supports both old boolean and new object format)
    const parseFieldPermission = (fieldName: string): FieldPermissionResult => {
      if (isAdmin) {
        return { read: true, write: true, visible: true };
      }
      
      const fieldPerm = perms?.employeeManagement?.fields?.[fieldName as keyof typeof perms.employeeManagement.fields];
      
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
    
    // Helper to parse action permission (supports both old boolean and new object format)
    const parseActionPermission = (actionName: string): ActionPermissionResult => {
      if (isAdmin) {
        return {
          enabled: true,
          scope: 'all',
          canAccessOwn: true,
          canAccessTeam: true,
          canAccessDepartment: true,
          canAccessAll: true,
        };
      }
      
      const actionPerm = perms?.employeeManagement?.actions?.[actionName as keyof typeof perms.employeeManagement.actions];
      
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
        const ap = actionPerm as { enabled: boolean; scope: ActionScope };
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
    
    // Field permissions (Enhanced)
    const fields = {
      name: parseFieldPermission('name'),
      joinDate: parseFieldPermission('joinDate'),
      serviceYears: parseFieldPermission('serviceYears'),
      gender: parseFieldPermission('gender'),
      dob: parseFieldPermission('dob'),
      phoneNo: parseFieldPermission('phoneNo'),
      position: parseFieldPermission('position'),
    };
    
    // Count field access
    const visibleFieldCount = Object.values(fields).filter(f => f.visible).length;
    const readableFieldCount = Object.values(fields).filter(f => f.read).length;
    const writableFieldCount = Object.values(fields).filter(f => f.write).length;
    const hasAnyFieldAccess = visibleFieldCount > 0;
    
    // Action permissions (Enhanced)
    const viewAction = parseActionPermission('view');
    const editAction = parseActionPermission('edit');
    const deleteAction = parseActionPermission('delete');
    
    const hasAnyActionAccess = viewAction.enabled || editAction.enabled || deleteAction.enabled;
    
    // Bulk operations
    const bulk = {
      canExport: checkPermission(['employeeManagement', 'bulk', 'export']),
      canImport: checkPermission(['employeeManagement', 'bulk', 'import']),
      canDelete: checkPermission(['employeeManagement', 'bulk', 'delete']),
    };
    
    return {
      // Basic Access
      canViewList: checkPermission(['employeeManagement', 'list', 'view']),
      canCreate: checkPermission(['employeeManagement', 'list', 'create']),
      
      // Actions (Enhanced)
      view: viewAction,
      edit: editAction,
      delete: deleteAction,
      canViewDetails: checkPermission(['employeeManagement', 'actions', 'viewDetails']),
      
      // Legacy action flags (backward compatibility)
      canView: viewAction.enabled,
      canEdit: editAction.enabled,
      canDelete: deleteAction.enabled,
      
      // Fields (Enhanced)
      fields,
      
      // Bulk Operations
      bulk,
      
      // Details Fields
      detailsFields: {
        personalInfo: checkPermission(['employeeManagement', 'detailsFields', 'personalInfo']),
        contactInfo: checkPermission(['employeeManagement', 'detailsFields', 'contactInfo']),
        workInfo: checkPermission(['employeeManagement', 'detailsFields', 'workInfo']),
      },
      
      // Leave
      leave: {
        canManage: checkPermission(['employeeManagement', 'leave', 'manage']),
        canView: checkPermission(['employeeManagement', 'leave', 'view']),
        canApprove: checkPermission(['employeeManagement', 'leave', 'approve']),
      },
      
      // Birthday
      canViewBirthdays: checkPermission(['employeeManagement', 'birthday', 'view']),
      
      // Helpers
      hasAnyFieldAccess,
      hasAnyActionAccess,
      visibleFieldCount,
      readableFieldCount,
      writableFieldCount,
    };
  }, [permissions, userRole]);
};
