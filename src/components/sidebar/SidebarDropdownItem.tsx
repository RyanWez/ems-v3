'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarDropdownItemProps {
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
  isCollapsed?: boolean;
  index?: number;
}

const SidebarDropdownItem: React.FC<SidebarDropdownItemProps> = ({
  href,
  icon: Icon,
  children,
  isCollapsed = false,
  index = 0,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const itemStyle = `
    flex items-center h-12 text-sm cursor-pointer relative
    transition-all duration-200 ease-in-out
    hover:bg-[#263445] hover:text-white
    ${isActive ? 'bg-[#409EFF] text-white shadow-sm' : 'text-[#BFCBD9]'}
    ${isCollapsed ? 'px-4 justify-center' : 'pl-10 pr-4'}
  `;

  const flyoutItemStyle = `
    flyout-menu-item flex items-center px-4 py-2.5 text-sm transition-all duration-200
    hover:bg-[#263445] hover:text-white cursor-pointer group
    hover:translate-x-1 hover:shadow-sm
    ${isActive ? 'bg-[#409EFF] text-white shadow-sm translate-x-1' : 'text-[#BFCBD9]'}
  `;

  if (isCollapsed) {
    return (
      <Link
        href={href}
        className={flyoutItemStyle}
        style={{
          animationDelay: `${index * 50}ms`,
        }}
      >
        <div
          className={`w-6 h-6 rounded-md flex items-center justify-center mr-3 transition-all duration-200 ${
            isActive ? 'bg-white/20' : 'bg-gray-600/30 group-hover:bg-gray-500/40'
          }`}
        >
          {Icon && (
            <Icon
              className={`w-3.5 h-3.5 transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
              }`}
            />
          )}
        </div>
        <span className="font-medium flex-1">{children}</span>
        {isActive && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
      </Link>
    );
  }

  return (
    <Link href={href} className={itemStyle}>
      {isActive && (
        <div className="absolute left-0 top-0 h-full w-1 bg-[#409EFF]"></div>
      )}
      {Icon && <Icon className={`w-5 h-5 flex-shrink-0 mr-3 ${isActive ? 'text-white' : ''}`} />}
      <span className="font-medium">{children}</span>
      {isActive && <div className="w-2 h-2 bg-white rounded-full ml-auto animate-pulse"></div>}
    </Link>
  );
};

export default SidebarDropdownItem;
