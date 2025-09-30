import { RolePermissions } from '../types/permissions';

// Defines the structure for a single permission's metadata
interface PermissionMetadata {
  title: string;
  description: string;
}

// Defines the structure for a sub-module, containing multiple permissions
interface SubModuleMetadata {
  title: string;
  permissions: Record<string, PermissionMetadata>;
}

// Defines the structure for a main module, containing multiple sub-modules
interface ModuleMetadata {
  title: string;
  subModules: Record<string, SubModuleMetadata>;
}

// The complete configuration object for all role permissions
export const permissionConfig: Record<keyof RolePermissions, ModuleMetadata> = {
  dashboard: {
    title: 'Dashboard',
    subModules: {
      general: {
        title: 'General Access',
        permissions: {
          view: { title: 'View Dashboard', description: 'Can see the main dashboard page' },
        },
      },
      analytics: {
        title: 'Analytics',
        permissions: {
          view: { title: 'View Analytics', description: 'Can access and view performance analytics' },
        },
      },
    },
  },
  employeeManagement: {
    title: 'Employee Management',
    subModules: {
      list: {
        title: 'Employee List',
        permissions: {
          view: { title: 'View List', description: 'Can see the list of all employees' },
          create: { title: 'Create Employees', description: 'Can add new employees to the system' },
          edit: { title: 'Edit Employees', description: 'Can modify existing employee information' },
          delete: { title: 'Delete Employees', description: 'Can remove employees from the system' },
        },
      },
      details: {
        title: 'Employee Details',
        permissions: {
          view: { title: 'View Details', description: 'Can see the detailed profile page of an employee' },
        },
      },
      leave: {
        title: 'Leave Management',
        permissions: {
          manage: { title: 'Manage Leave', description: 'Can approve or reject employee leave requests' },
        },
      },
      birthday: {
        title: 'Birthday View',
        permissions: {
          view: { title: 'View Birthdays', description: 'Can see the upcoming birthdays list' },
        },
      },
    },
  },
  userManagement: {
    title: 'User Management',
    subModules: {
      list: {
        title: 'User List',
        permissions: {
          view: { title: 'View Users', description: 'Can see the list of all system users' },
          create: { title: 'Create Users', description: 'Can add new users' },
          edit: { title: 'Edit Users', description: 'Can modify existing user profiles' },
          delete: { title: 'Delete Users', description: 'Can remove users from the system' },
        },
      },
      roles: {
        title: 'Role & Permission Control',
        permissions: {
          manage: { title: 'Manage Roles', description: 'Can create, edit, delete roles and manage their permissions' },
        },
      },
    },
  },
};
