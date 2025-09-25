
'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { menuItems } from '../../constants';
import SidebarItem from './SidebarItem';
import type { NavItem } from '../../types';

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
  const [manuallyExpandedDropdown, setManuallyExpandedDropdown] = useState<string | null>(null);

  const handleBackdropClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleDropdownToggle = (itemPath: string) => {
    setManuallyExpandedDropdown(
      manuallyExpandedDropdown === itemPath ? null : itemPath
    );
  };

  const getShouldBeOpen = (itemPath: string) => {
    if (isCollapsed) return false;
    return manuallyExpandedDropdown === itemPath || pathname.startsWith(itemPath);
  };
  
  const handleNavigation = (path: string) => {
    const currentParent = menuItems.find(item =>
      item.children?.some(child => pathname.startsWith(child.path))
    );

    const newParent = menuItems.find(item =>
      item.children?.some(child => path.startsWith(child.path))
    );

    if (currentParent && newParent && currentParent.path !== newParent.path) {
      setManuallyExpandedDropdown(newParent.path);
    }
    else if (newParent && manuallyExpandedDropdown !== newParent.path) {
      setManuallyExpandedDropdown(newParent.path);
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
          transition-all duration-300 ease-in-out z-50
          ${isMobileOpen ? 'open' : ''}
          md:relative md:translate-x-0
          ${isMobileOpen ? 'mobile-sidebar-container' : ''}
        `}
        style={{
          width: isCollapsed && !isMobileOpen ? '64px' : '256px'
        }}
      >
      <div className={`flex items-center justify-between h-16 border-b border-gray-700 px-4 ${isMobileOpen ? 'mobile-sidebar-header' : ''}`}>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-white"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
          </svg>
          {!isCollapsed && <span className="ml-3 text-white text-xl font-semibold">Admin Panel</span>}
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
           {menuItems.map((item: NavItem) => (
             <SidebarItem
               key={item.path}
               item={item}
               isCollapsed={isCollapsed}
               shouldBeOpen={getShouldBeOpen(item.path)}
               onToggle={() => handleDropdownToggle(item.path)}
               onNavigate={handleNavigation}
             />
           ))}
         </ul>
       </nav>
     </div>
   </>
 );
};

export default Sidebar;
