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
          view: { title: 'View Dashboard', description: 'Can access the main dashboard page' },
        },
      },
      overviewCards: {
        title: 'Overview Cards',
        permissions: {
          viewTotalEmployees: { title: 'Total Employees', description: 'Can see total employee count on dashboard' },
          viewNewHires: { title: 'New Hires', description: 'Can see monthly new hire statistics' },
          viewDepartments: { title: 'Departments', description: 'Can see total department count' },
        },
      },
      charts: {
        title: 'Charts & Analytics',
        permissions: {
          viewEmployeeGrowth: { title: 'Employee Growth Chart', description: 'Can view employee growth trends over time' },
          viewDepartmentDistribution: { title: 'Department Distribution', description: 'Can view employee distribution by department' },
          viewAttendanceStats: { title: 'Attendance Statistics', description: 'Can view attendance and leave statistics' },
          viewPerformanceMetrics: { title: 'Performance Metrics', description: 'Can view team performance analytics' },
        },
      },
      recentActivities: {
        title: 'Recent Activities',
        permissions: {
          viewRecentActivities: { title: 'View Recent Activities', description: 'Can see recent joiners and system activities' },
        },
      },
    },
  },
  employeeManagement: {
    title: 'Employee Management',
    subModules: {
      list: {
        title: 'Employee List - Basic Access',
        permissions: {
          view: { title: 'View List', description: 'Can see the list of all employees' },
          create: { title: 'Create Employees', description: 'Can add new employees to the system' },
        },
      },
      fields: {
        title: 'Employee List - Field Permissions (Read/Write)',
        permissions: {
          name: { title: 'Employee Name', description: 'Read: View name | Write: Edit name' },
          joinDate: { title: 'Join Date', description: 'Read: View join date | Write: Edit join date' },
          serviceYears: { title: 'Service Years', description: 'Read: View service years | Write: Edit service years' },
          gender: { title: 'Gender', description: 'Read: View gender | Write: Edit gender' },
          dob: { title: 'Date of Birth', description: 'Read: View DOB | Write: Edit DOB' },
          phoneNo: { title: 'Phone Number', description: 'Read: View phone | Write: Edit phone' },
          position: { title: 'Position', description: 'Read: View position | Write: Edit position' },
        },
      },
      actions: {
        title: 'Employee List - Actions (with Scope)',
        permissions: {
          view: { title: 'View Action', description: 'Can view employees (Scope: own/team/department/all)' },
          edit: { title: 'Edit Action', description: 'Can edit employees (Scope: own/team/department/all)' },
          delete: { title: 'Delete Action', description: 'Can delete employees (Scope: own/team/department/all)' },
          viewDetails: { title: 'View Details Page', description: 'Can access detailed employee profile page' },
        },
      },
      bulk: {
        title: 'Bulk Operations',
        permissions: {
          export: { title: 'Export Data', description: 'Can export employee list to Excel/CSV' },
        },
      },
      details: {
        title: 'Employee Details Page',
        permissions: {
          view: { title: 'View Details', description: 'Can see the detailed profile page of an employee' },
        },
      },
      detailsFields: {
        title: 'Employee Details - Field Groups',
        permissions: {
          personalInfo: { title: 'Personal Information', description: 'Can see personal details like name, DOB, gender' },
          contactInfo: { title: 'Contact Information', description: 'Can see phone, address, emergency contacts' },
          workInfo: { title: 'Work Information', description: 'Can see position, department, salary details' },
        },
      },
      leave: {
        title: 'Leave Management',
        permissions: {
          manage: { title: 'Manage Leave', description: 'Can approve or reject employee leave requests' },
          view: { title: 'View Leave', description: 'Can see leave requests and history' },
          approve: { title: 'Approve Leave', description: 'Can approve leave requests' },
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
          view: { title: 'View Roles', description: 'Can see the list of all roles' },
          create: { title: 'Add Roles', description: 'Can create new roles' },
          edit: { title: 'Edit Roles', description: 'Can modify existing roles' },
          delete: { title: 'Delete Roles', description: 'Can remove roles from the system' },
          managePermissions: { title: 'Manage Permissions', description: 'Can assign and modify role permissions' },
        },
      },
    },
  },
};
