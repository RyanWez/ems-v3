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
}

// Employee List Action Permissions
export interface EmployeeListActionPermissions {
  view: boolean;
  edit: boolean;
  delete: boolean;
  viewDetails: boolean;
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
