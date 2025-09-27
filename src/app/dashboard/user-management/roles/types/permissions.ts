export interface PermissionItem {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface ModulePermissions {
  module: string;
  moduleName: string;
  icon: string;
  permissions: PermissionItem[];
}

export interface RolePermissions {
  dashboard: {
    view: boolean;
    viewAnalytics: boolean;
    viewReports: boolean;
  };
  employeeManagement: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    viewDetails: boolean;
    manageLeave: boolean;
    viewBirthday: boolean;
  };
  userManagement: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    manageRoles: boolean;
    managePermissions: boolean;
  };
}

export interface UserRole {
  id: number;
  name: string;
  description: string;
  permissions: RolePermissions;
  userCount: number;
  color: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}