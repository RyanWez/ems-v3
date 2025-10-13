'use client';
import { useMemo } from 'react';
import { useAuth } from '@/Auth/AuthContext';

// Field-level CRUD permissions
export interface FieldPermission {
  read: boolean;   // ကြည့်လို့ရ/မရ
  write: boolean;  // ပြင်လို့ရ/မရ
}

// Enhanced Employee Field Permissions
export interface EnhancedEmployeeFieldPermissions {
  name: FieldPermission;
  joinDate: FieldPermission;
  serviceYears: FieldPermission;
  gender: FieldPermission;
  dob: FieldPermission;
  phoneNo: FieldPermission;
  position: FieldPermission;
  salary: FieldPermission;
  address: FieldPermission;
  emergencyContact: FieldPermission;
}

export const useFieldPermissions = (): EnhancedEmployeeFieldPermissions => {
  const { permissions, userRole } = useAuth();
  
  return useMemo(() => {
    const isAdmin = userRole === 'Administrator' || userRole === 'Super Admin';
    
    const getFieldPermission = (fieldName: string): FieldPermission => {
      if (isAdmin) {
        return { read: true, write: true };
      }
      
      // Default: no access
      const defaultPerm = { read: false, write: false };
      
      if (!permissions?.employeeManagement?.fields) {
        return defaultPerm;
      }
      
      const fieldPerm = permissions.employeeManagement.fields[fieldName];
      
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
      salary: getFieldPermission('salary'),
      address: getFieldPermission('address'),
      emergencyContact: getFieldPermission('emergencyContact'),
    };
  }, [permissions, userRole]);
};
