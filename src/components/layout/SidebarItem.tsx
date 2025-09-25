
'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { NavItem } from '../../types';
import Link from 'next/link';

interface SidebarItemProps {
  item: NavItem;
  isCollapsed: boolean;
  shouldBeOpen?: boolean;
  onToggle?: () => void;
  onNavigate?: (path: string) => void;
  depth?: number;
}

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);


const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isCollapsed,
  shouldBeOpen = false,
  onToggle,
  onNavigate,
  depth = 0,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasChildren = item.children && item.children.length > 0;
  const isOpen = shouldBeOpen && !isCollapsed;

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle?.();
    } else {
      onNavigate?.(item.path);
      router.push(item.path);
    }
  };

  const isActive = pathname === item.path;

  const itemBaseStyle = `
    flex items-center h-12 text-sm cursor-pointer
    transition-all duration-300 ease-in-out
    hover:bg-[#263445] hover:text-white
  `;

  const activeStyle = isActive ? 'bg-[#409EFF] text-white' : '';

  const collapsedItemStyle = isCollapsed ? 'justify-center' : '';

  const getPaddingClass = () => {
    if (isCollapsed) return 'px-4';
    switch (depth) {
      case 0: return 'pl-6';
      case 1: return 'pl-10';
      case 2: return 'pl-14';
      default: return 'pl-6';
    }
  };

  const tooltipStyle = `
    absolute left-full ml-4 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0
    group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20
  `;

  if (!item.icon) {
    return null;
  }
  const Icon = item.icon;

  const renderItem = () => (
    <div
      className={`${itemBaseStyle} ${activeStyle} ${collapsedItemStyle} ${getPaddingClass()}`}
      onClick={handleItemClick}
    >
      {isActive && !isCollapsed && <div className="absolute left-0 top-0 h-full w-1 bg-[#409EFF]"></div>}
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && <span className="ml-3 flex-1">{item.name}</span>}
      {!isCollapsed && hasChildren && (
        <ChevronDownIcon
          className={`w-4 h-4 mr-4 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      )}
      {isCollapsed && <span className={tooltipStyle}>{item.name}</span>}
    </div>
  );

  return (
    <li className="relative group">
      {hasChildren ? (
        renderItem()
      ) : (
        <Link href={item.path} legacyBehavior>
          {renderItem()}
        </Link>
      )}
      {!isCollapsed && hasChildren && (
        <ul
          className={`
            bg-[#1f2d3d] overflow-hidden
            ${isOpen ? 'sidebar-enter-active' : 'sidebar-exit-active'}
          `}
          style={{
            transformOrigin: 'top'
          }}
        >
          {item.children?.map((child) => (
            <SidebarItem
              key={child.path}
              item={child}
              isCollapsed={isCollapsed}
              shouldBeOpen={shouldBeOpen}
              onNavigate={onNavigate}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
