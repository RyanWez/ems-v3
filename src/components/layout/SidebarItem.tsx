'use client';
import React, { useState, useRef, useEffect } from 'react';
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
  const [showFlyout, setShowFlyout] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      if (isCollapsed) {
        // For collapsed sidebar, clicking toggles flyout and sets active state
        setIsClicked(true);
        setShowFlyout(!showFlyout);
        // Reset clicked state after animation
        setTimeout(() => setIsClicked(false), 200);
      } else {
        onToggle?.();
      }
    } else {
      onNavigate?.(item.path);
      router.push(item.path);
    }
  };

  const handleMouseEnter = () => {
    if (isCollapsed && hasChildren) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Add delay before showing flyout for smoother UX
      hoverTimeoutRef.current = setTimeout(() => {
        setShowFlyout(true);
      }, 250); // 250ms delay for smoother hover experience
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed && hasChildren) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Delay hiding to allow mouse to move to flyout menu
      hoverTimeoutRef.current = setTimeout(() => {
        setShowFlyout(false);
      }, 200); // Slightly longer delay to allow smooth transition to flyout
    }
  };

  // Only show active state for direct path matches, not for parent items
  const isActive = pathname === item.path;
  const isParentActive = hasChildren && item.children?.some(child => pathname.startsWith(child.path));

  const itemBaseStyle = `
    flex items-center h-12 text-sm cursor-pointer relative
    transition-all duration-200 ease-in-out
    hover:bg-[#263445] hover:text-white
    ${isClicked ? 'bg-[#1e3a5f] scale-95' : ''}
    ${isParentActive && !isActive ? 'bg-[#263445]/50' : ''}
    ${isOpen && hasChildren && !isCollapsed ? 'bg-[#263445]/30 shadow-sm' : ''}
  `;

  // Only apply active style to direct matches, not parent items
  const activeStyle = isActive ? 'bg-[#409EFF] text-white' : '';

  const collapsedItemStyle = isCollapsed ? 'justify-center' : '';

  const getPaddingClass = () => {
    if (isCollapsed) return 'px-4';
    switch (depth) {
      case 0: return 'pl-6 pr-4';
      case 1: return 'pl-10 pr-4';
      case 2: return 'pl-14 pr-4';
      default: return 'pl-6 pr-4';
    }
  };

  const tooltipStyle = `
    absolute left-full ml-3 w-max px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0
    group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30
    shadow-lg border border-gray-700
  `;

  if (!item.icon) {
    return null;
  }
  const Icon = item.icon;

  const renderItem = () => (
    <div
      ref={itemRef}
      className={`${itemBaseStyle} ${activeStyle} ${collapsedItemStyle} ${getPaddingClass()}`}
      onClick={handleItemClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isActive && !isCollapsed && (
        <div className="absolute left-0 top-0 h-full w-1 bg-[#409EFF]"></div>
      )}
      {isParentActive && !isActive && !isCollapsed && (
        <div className="absolute left-0 top-0 h-full w-1 bg-[#409EFF]/40"></div>
      )}
      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : isParentActive ? 'text-[#409EFF]' : ''}`} />
      {!isCollapsed && (
        <span className={`ml-3 flex-1 font-medium ${isParentActive && !isActive ? 'text-[#BFCBD9]' : ''}`}>
          {item.name}
        </span>
      )}
      {!isCollapsed && isOpen && hasChildren && (
        <div className="w-2 h-2 bg-[#409EFF] rounded-full mr-2 animate-pulse"></div>
      )}
      {!isCollapsed && hasChildren && (
        <ChevronDownIcon
          className={`w-4 h-4 transition-all duration-300 ease-in-out ${isOpen ? 'rotate-180 text-[#409EFF]' : 'rotate-0'}`}
        />
      )}
      {isCollapsed && (
        <span className={tooltipStyle}>
          {item.name}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 rotate-45"></div>
        </span>
      )}
    </div>
  );

  const handleFlyoutMouseEnter = () => {
    if (isCollapsed && hasChildren) {
      // Clear any pending hide timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Ensure flyout stays visible when hovering over it
      setShowFlyout(true);
    }
  };

  const handleFlyoutMouseLeave = () => {
    if (isCollapsed && hasChildren) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      // Delay hiding to allow smooth transition
      hoverTimeoutRef.current = setTimeout(() => {
        setShowFlyout(false);
      }, 200); // Consistent delay with main hover
    }
  };

  const handleFlyoutItemClick = (childPath: string) => {
    setShowFlyout(false);
    onNavigate?.(childPath);
  };

  const getFlyoutPosition = () => {
    if (!itemRef.current) return { top: 0, left: 72 };

    const rect = itemRef.current.getBoundingClientRect();
    const sidebarWidth = 64;
    const flyoutHeight = 200; // Estimated flyout height
    const viewportHeight = window.innerHeight;
    const gap = 8; // Gap from sidebar

    // Calculate optimal top position to keep flyout in viewport
    let top = rect.top + rect.height / 2; // Center vertically with item

    // Adjust if flyout would go off-screen
    if (top + flyoutHeight / 2 > viewportHeight) {
      top = viewportHeight - flyoutHeight / 2 - 10; // Keep 10px from bottom
    } else if (top - flyoutHeight / 2 < 0) {
      top = flyoutHeight / 2 + 10; // Keep 10px from top
    }

    return {
      top: Math.max(10, Math.min(top, viewportHeight - flyoutHeight - 10)),
      left: sidebarWidth + gap,
    };
  };

  const renderFlyoutMenu = () => {
    if (!isCollapsed || !hasChildren || !showFlyout) return null;

    const position = getFlyoutPosition();

    return (
      <div
        className={`fixed z-[60] bg-[#1f2d3d]/95 backdrop-blur-sm border border-gray-600/80 rounded-lg shadow-2xl py-1 min-w-[220px] max-w-[280px] flyout-container ${
          showFlyout ? 'animate-flyout-enter' : 'animate-flyout-exit'
        }`}
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)',
        }}
        onMouseEnter={handleFlyoutMouseEnter}
        onMouseLeave={handleFlyoutMouseLeave}
      >
        {/* Header */}
        <div
          className="px-4 py-3 text-white text-sm font-semibold border-b border-gray-600/50 bg-gradient-to-r from-[#409EFF]/15 via-[#409EFF]/5 to-transparent cursor-pointer hover:from-[#409EFF]/25 hover:via-[#409EFF]/10 transition-all duration-200 group/header"
          onClick={() => setShowFlyout(false)}
          title="Click to close"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-md bg-[#409EFF]/20 flex items-center justify-center mr-2">
                <Icon className="w-3.5 h-3.5 text-[#409EFF]" />
              </div>
              <span className="text-gray-100">{item.name}</span>
            </div>
            <svg
              className="w-4 h-4 text-gray-400 group-hover/header:text-white group-hover/header:rotate-90 transition-all duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          {item.children?.map((child, index) => {
            const ChildIcon = child.icon;
            const isChildActive = pathname === child.path;

            return (
              <Link
                key={child.path}
                href={child.path}
                className={`
                  flyout-menu-item flex items-center px-4 py-2.5 text-sm transition-all duration-200
                  hover:bg-[#263445] hover:text-white cursor-pointer group
                  hover:translate-x-1 hover:shadow-sm
                  ${isChildActive ? 'bg-[#409EFF] text-white shadow-sm translate-x-1' : 'text-[#BFCBD9]'}
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                onClick={() => handleFlyoutItemClick(child.path)}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center mr-3 transition-all duration-200 ${isChildActive ? 'bg-white/20' : 'bg-gray-600/30 group-hover:bg-gray-500/40'
                  }`}>
                  {ChildIcon && (
                    <ChildIcon className={`w-3.5 h-3.5 transition-colors duration-200 ${isChildActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                      }`} />
                  )}
                </div>
                <span className="font-medium flex-1">{child.name}</span>
                {isChildActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

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
            bg-[#1f2d3d] overflow-hidden relative
            ${isOpen ? 'sidebar-enter-active' : 'sidebar-exit-active'}
          `}
          style={{
            transformOrigin: 'top'
          }}
        >
          {/* Removed Collapse Button */}

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
      {renderFlyoutMenu()}
    </li>
  );
};

export default SidebarItem;
