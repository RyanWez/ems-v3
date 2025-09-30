'use client';
// Defines the granular permissions for each sub-module
export interface SubModulePermissions {
  [key: string]: boolean;
}

// Defines the structure for a main module, containing various sub-modules
export interface ModulePermissions {
  [subModule: string]: SubModulePermissions;
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
      edit: boolean;
      delete: boolean;
    };
    details: {
      view: boolean;
    };
    leave: {
      manage: boolean;
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
