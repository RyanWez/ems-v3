'use client';
// Defines the granular permissions for each sub-module
export interface SubModulePermissions {
  [key: string]: boolean;
}

// Defines the structure for a main module, containing various sub-modules
export interface ModulePermissions {
  [subModule: string]: SubModulePermissions;
}

// Field-Level Permission (Read/Write separated)
export interface FieldPermission {
  read: boolean;   // ကြည့်လို့ရ/မရ
  write: boolean;  // ပြင်လို့ရ/မရ
}

// Employee List Field Visibility Permissions (Enhanced with Read/Write)
export interface EmployeeListFieldPermissions {
  name: FieldPermission | boolean;  // Support both old and new format
  joinDate: FieldPermission | boolean;
  serviceYears: FieldPermission | boolean;
  gender: FieldPermission | boolean;
  dob: FieldPermission | boolean;
  phoneNo: FieldPermission | boolean;
  position: FieldPermission | boolean;
}

// Action Scope Type
export type ActionScope = 'own' | 'team' | 'department' | 'all';

// Action Permission with Scope
export interface ActionPermission {
  enabled: boolean;
  scope: ActionScope;
}

// Employee List Action Permissions (Enhanced with Scope)
export interface EmployeeListActionPermissions {
  view: ActionPermission | boolean;  // Support both old and new format
  edit: ActionPermission | boolean;
  delete: ActionPermission | boolean;
  viewDetails: boolean;
}

// Bulk Operations Permissions
export interface BulkOperationsPermissions {
  export: boolean;
  import: boolean;
  delete: boolean;
}

// Dashboard Overview Cards Permissions
export interface DashboardOverviewCardsPermissions {
  viewTotalEmployees: boolean;
  viewNewHires: boolean;
  viewDepartments: boolean;
  viewActiveProjects: boolean;
}

// Dashboard Charts & Analytics Permissions
export interface DashboardChartsPermissions {
  viewEmployeeGrowth: boolean;
  viewDepartmentDistribution: boolean;
  viewAttendanceStats: boolean;
  viewPerformanceMetrics: boolean;
}

// Dashboard Analytics Permissions
export interface DashboardAnalyticsPermissions {
  view: boolean;
}

// This is the primary type for defining all permissions for a role
export interface RolePermissions {
  dashboard: {
    general: {
      view: boolean;
    };
    overviewCards: DashboardOverviewCardsPermissions;
    charts: DashboardChartsPermissions;
    analytics: DashboardAnalyticsPermissions;
    recentActivities: {
      viewRecentActivities: boolean;
    };
  };
  employeeManagement: {
    list: {
      view: boolean;
      create: boolean;
    };
    // Field visibility permissions (with Read/Write support)
    fields: EmployeeListFieldPermissions;
    // Action permissions for each employee (with Scope support)
    actions: EmployeeListActionPermissions;
    // Bulk operations
    bulk: BulkOperationsPermissions;
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
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
      managePermissions: boolean;
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
