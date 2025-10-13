'use client';
import { useMemo } from 'react';
import { useAuth } from '@/Auth/AuthContext';
import { FieldPermission } from '@/app/dashboard/user-management/roles/types/permissions';

// Enhanced Employee Field Permissions (လက်ရှိ fields တွေပဲ)
export interface EnhancedEmployeeFieldPermissions {
  name: FieldPermission;
  joinDate: FieldPermission;
  serviceYears: FieldPermission;
  gender: FieldPermission;
  dob: FieldPermission;
  phoneNo: FieldPermission;
  position: FieldPermission;
}

export const useFieldPermissions = (): EnhancedEmployeeFieldPermissions => {
  const { permissions, userRole } = useAuth();
  
  return useMemo(() => {
    const isAdmin = userRole === 'Administrator';
    
    const getFieldPermission = (fieldName: string): FieldPermission => {
      if (isAdmin) {
        return { read: true, write: true };
      }
      
      // Default: no access
      const defaultPerm = { read: false, write: false };
      
      if (!permissions?.employeeManagement?.fields) {
        return defaultPerm;
      }
      
      const fieldPerm = (permissions.employeeManagement.fields as any)[fieldName];
      
      // If it's boolean (old format), convert to new format
      if (typeof fieldPerm === 'boolean') {
        return { read: fieldPerm, write: fieldPerm };
      }
      
      // If it's object (new format), return as is
      if (typeof fieldPerm === 'object' && fieldPerm !== null) {
        return {
          read: fieldPerm.read ?? false,
          write: fieldPerm.write ?? false,
        };
      }
      
      return defaultPerm;
    };
    
    return {
      name: getFieldPermission('name'),
      joinDate: getFieldPermission('joinDate'),
      serviceYears: getFieldPermission('serviceYears'),
      gender: getFieldPermission('gender'),
      dob: getFieldPermission('dob'),
      phoneNo: getFieldPermission('phoneNo'),
      position: getFieldPermission('position'),
    };
  }, [permissions, userRole]);
};
