'use client';
import { useMemo } from 'react';
import { useAuth } from '@/Auth/AuthContext';
import { RolePermissions } from '@/app/dashboard/user-management/roles/types/permissions';

interface EmployeePermissions {
  // Basic Access
  canViewList: boolean;
  canCreate: boolean;
  
  // Actions
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canViewDetails: boolean;
  
  // Field Visibility
  fields: {
    name: boolean;
    joinDate: boolean;
    serviceYears: boolean;
    gender: boolean;
    dob: boolean;
    phoneNo: boolean;
    position: boolean;
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
    
    // Field permissions
    const fields = {
      name: checkPermission(['employeeManagement', 'fields', 'name']),
      joinDate: checkPermission(['employeeManagement', 'fields', 'joinDate']),
      serviceYears: checkPermission(['employeeManagement', 'fields', 'serviceYears']),
      gender: checkPermission(['employeeManagement', 'fields', 'gender']),
      dob: checkPermission(['employeeManagement', 'fields', 'dob']),
      phoneNo: checkPermission(['employeeManagement', 'fields', 'phoneNo']),
      position: checkPermission(['employeeManagement', 'fields', 'position']),
    };
    
    // Count visible fields
    const visibleFieldCount = Object.values(fields).filter(Boolean).length;
    const hasAnyFieldAccess = visibleFieldCount > 0;
    
    // Action permissions
    const canView = checkPermission(['employeeManagement', 'actions', 'view']);
    const canEdit = checkPermission(['employeeManagement', 'actions', 'edit']);
    const canDelete = checkPermission(['employeeManagement', 'actions', 'delete']);
    const canViewDetails = checkPermission(['employeeManagement', 'actions', 'viewDetails']);
    
    const hasAnyActionAccess = canView || canEdit || canDelete;
    
    return {
      // Basic Access
      canViewList: checkPermission(['employeeManagement', 'list', 'view']),
      canCreate: checkPermission(['employeeManagement', 'list', 'create']),
      
      // Actions
      canView,
      canEdit,
      canDelete,
      canViewDetails,
      
      // Fields
      fields,
      
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
    };
  }, [permissions, userRole]);
};
