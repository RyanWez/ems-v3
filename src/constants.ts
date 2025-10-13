
import type { NavItem } from './types';
import {
  DashboardIcon,
  EmployeeListIcon,
  BirthdayIcon,
  LeaveIcon,
  UserListIcon,
  UserRoleIcon,
  EmployeeManagementIcon,
  UserManagementIcon
} from './components/icons';

export const menuItems: NavItem[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: DashboardIcon,
  },
  {
    path: '/dashboard/employee-management',
    name: 'Employee Management',
    icon: EmployeeManagementIcon,
    children: [
      {
        path: '/dashboard/employee-management/lists',
        name: 'Employee Lists',
        icon: EmployeeListIcon,
      },
      {
        path: '/dashboard/employee-management/birthday',
        name: 'Employee Birthday',
        icon: BirthdayIcon,
      },
      {
        path: '/dashboard/employee-management/leave',
        name: 'Annual Leave',
        icon: LeaveIcon,
      },
    ],
  },
  {
    path: '/dashboard/user-management',
    name: 'User Management',
    icon: UserManagementIcon,
    children: [
      {
        path: '/dashboard/user-management/list',
        name: 'User List',
        icon: UserListIcon,
      },
      {
        path: '/dashboard/user-management/roles',
        name: 'User Roles',
        icon: UserRoleIcon,
      },
    ],
  },
];
