'use client';
// Defines the granular permissions for each sub-module
export interface SubModulePermissions {
  [key: string]: boolean;
}

// Defines the structure for a main module, containing various sub-modules
export interface ModulePermissions {
  [subModule: string]: SubModulePermissions;
}

// Employee List Field Visibility Permissions
export interface EmployeeListFieldPermissions {
  name: boolean;
  joinDate: boolean;
  serviceYears: boolean;
  gender: boolean;
  dob: boolean;
  phoneNo: boolean;
  position: boolean;
  nrc: boolean;
  address: boolean;
}

// Employee List Action Permissions
export interface EmployeeListActionPermissions {
  view: boolean;
  edit: boolean;
  delete: boolean;
  viewDetails: boolean;
}

// This is the primary type for defining all permissions for a role
export interface RolePermissions {
  dashboard: {
    general: {
      view: boolean;
    };
    analytics: {
      view: boolean;
    };
  };
  employeeManagement: {
    list: {
      view: boolean;
      create: boolean;
    };
    // Field visibility permissions
    fields: EmployeeListFieldPermissions;
    // Action permissions for each employee
    actions: EmployeeListActionPermissions;
    details: {
      view: boolean;
    };
    // Field visibility in details page
    detailsFields: {
      personalInfo: boolean;
      contactInfo: boolean;
      workInfo: boolean;
    };
    leave: {
      manage: boolean;
      view: boolean;
      approve: boolean;
    };
    birthday: {
      view: boolean;
    };
  };
  userManagement: {
    list: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    roles: {
      manage: boolean;
    };
  };
}

// Represents a user role within the system
export interface UserRole {
  id: number;
  name: string;
  description: string;
  permissions: RolePermissions;
  userCount?: number; // Optional as it might not always be fetched
  color?: string; // Optional styling property
}
