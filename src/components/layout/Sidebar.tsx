
'use client';
import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from '../../constants';
import SidebarItem from './SidebarItem';
import SidebarDropdown from '../sidebar/SidebarDropdown';
import SidebarDropdownItem from '../sidebar/SidebarDropdownItem';
import type { NavItem } from '../../types';
import { useAuth } from '../../Auth';
import Image from 'next/image';

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-6 h-6"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  isMobileOpen = false,
  onMobileClose
}) => {
  const pathname = usePathname();
  const { permissions, userRole } = useAuth();

  // Filter menu items based on permissions
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      // Always show dashboard
      if (item.path === '/dashboard') return true;

      // Check permissions for user management
      if (item.path === '/dashboard/user-management') {
        return permissions?.userManagement?.list?.view || userRole === 'Administrator';
      }

      // Check permissions for employee management
      if (item.path === '/dashboard/employee-management') {
        return permissions?.employeeManagement?.list?.view || userRole === 'Administrator';
      }

      // Filter children of parent items
      if (item.children) {
        const filteredChildren = item.children.filter(child => {
          if (child.path.includes('user-management')) {
            return permissions?.userManagement?.list?.view || userRole === 'Administrator';
          }
          if (child.path.includes('employee-management')) {
            return permissions?.employeeManagement?.list?.view || userRole === 'Administrator';
          }
          return true;
        });

        // Only show parent if it has children or if user has access to the main section
        item.children = filteredChildren;
        return filteredChildren.length > 0;
      }

      return true;
    });
  }, [permissions, userRole]);

  const handleBackdropClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleNavigation = (path: string) => {
    // Navigation is handled by Next.js Link component
    if (onMobileClose && isMobileOpen) {
      onMobileClose();
    }
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'visible' : ''} md:hidden`}
        onClick={handleBackdropClick}
      />

      <div
        className={`
          sidebar-container flex flex-col bg-[#304156] text-[#BFCBD9] shadow-lg
          z-50
          ${isMobileOpen ? 'open' : ''}
          md:relative md:translate-x-0
          ${isMobileOpen ? 'mobile-sidebar-container' : ''}
          ${isCollapsed && !isMobileOpen ? 'sidebar-collapsed' : 'sidebar-expanded'}
        `}
      >
        <div className={`flex items-center justify-between h-16 border-b border-gray-700 px-4 ${isMobileOpen ? 'mobile-sidebar-header' : ''}`}>
          <div className="flex items-center">
            <Image
              src="/images/ems.svg"
              alt="EMS Logo"
              width={32}
              height={32}
              className="w-8 h-8"
              unoptimized
            />
            {!isCollapsed && <span className="ml-3 text-white text-xl font-semibold">EMS</span>}
          </div>
          <button
            onClick={onMobileClose}
            className="md:hidden p-2 text-white hover:bg-gray-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${isMobileOpen ? 'mobile-sidebar-content' : ''}`}>
          <ul>
            {filteredMenuItems.map((item: NavItem) => {
              // Use new SidebarDropdown for items with children
              if (item.children && item.children.length > 0) {
                return (
                  <SidebarDropdown
                    key={item.path}
                    title={item.name}
                    icon={item.icon}
                    path={item.path}
                    isCollapsed={isCollapsed}
                    onNavigate={handleNavigation}
                  >
                    {item.children.map((child, index) => (
                      <SidebarDropdownItem
                        key={child.path}
                        href={child.path}
                        icon={child.icon}
                        isCollapsed={isCollapsed}
                        index={index}
                      >
                        {child.name}
                      </SidebarDropdownItem>
                    ))}
                  </SidebarDropdown>
                );
              }
              
              // Use old SidebarItem for items without children
              return (
                <SidebarItem
                  key={item.path}
                  item={item}
                  isCollapsed={isCollapsed}
                  onNavigate={handleNavigation}
                />
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
