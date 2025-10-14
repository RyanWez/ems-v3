"use client";
import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SidebarDropdownProps {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
  children: React.ReactNode;
  isCollapsed: boolean;
  defaultOpen?: boolean;
  onNavigate?: (path: string) => void;
}

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  title,
  icon: Icon,
  path,
  children,
  isCollapsed,
  defaultOpen = false,
  onNavigate,
}) => {
  const pathname = usePathname();
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(defaultOpen);
  const [showFlyout, setShowFlyout] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  // Check if any child is active
  const isParentActive = pathname.startsWith(path);

  // Determine if dropdown should be open
  const isOpen = !isCollapsed && (isManuallyExpanded || isParentActive);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCollapsed) {
      setIsClicked(true);
      setShowFlyout(!showFlyout);
      setTimeout(() => setIsClicked(false), 200);
    } else {
      setIsManuallyExpanded(!isManuallyExpanded);
    }
  };

  const handleMouseEnter = () => {
    if (isCollapsed) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setShowFlyout(true);
      }, 250);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setShowFlyout(false);
      }, 200);
    }
  };

  const handleFlyoutMouseEnter = () => {
    if (isCollapsed) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setShowFlyout(true);
    }
  };

  const handleFlyoutMouseLeave = () => {
    if (isCollapsed) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setShowFlyout(false);
      }, 200);
    }
  };

  const getFlyoutPosition = () => {
    if (!itemRef.current) return { top: 0, left: 72 };

    const rect = itemRef.current.getBoundingClientRect();
    const sidebarWidth = 64;
    const flyoutHeight = 200;
    const viewportHeight = window.innerHeight;
    const gap = 8;

    let top = rect.top + rect.height / 2;

    if (top + flyoutHeight / 2 > viewportHeight) {
      top = viewportHeight - flyoutHeight / 2 - 10;
    } else if (top - flyoutHeight / 2 < 0) {
      top = flyoutHeight / 2 + 10;
    }

    return {
      top: Math.max(10, Math.min(top, viewportHeight - flyoutHeight - 10)),
      left: sidebarWidth + gap,
    };
  };

  const itemBaseStyle = `
    flex items-center h-12 text-sm cursor-pointer relative
    transition-all duration-200 ease-in-out
    hover:bg-[#263445] hover:text-white
    ${isClicked ? "bg-[#1e3a5f] scale-95" : ""}
    ${isParentActive ? "bg-[#263445]/50" : ""}
    ${isOpen ? "bg-[#263445]/30 shadow-sm" : ""}
  `;

  const collapsedItemStyle = isCollapsed ? "justify-center px-4" : "pl-6 pr-4";

  const tooltipStyle = `
    absolute left-full ml-3 w-max px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0
    group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30
    shadow-lg border border-gray-700
  `;

  return (
    <li className="relative group">
      <div
        ref={itemRef}
        className={`${itemBaseStyle} ${collapsedItemStyle}`}
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {isParentActive && !isCollapsed && (
          <div className="absolute left-0 top-0 h-full w-1 bg-[#409EFF]/40"></div>
        )}
        <Icon
          className={`w-5 h-5 flex-shrink-0 ${
            isParentActive ? "text-[#409EFF]" : ""
          }`}
        />
        {!isCollapsed && (
          <>
            <span className="ml-3 flex-1 font-medium text-[#BFCBD9]">
              {title}
            </span>
            {isOpen && (
              <div className="w-2 h-2 bg-[#409EFF] rounded-full mr-2 animate-pulse"></div>
            )}
            <ChevronDownIcon
              className={`w-4 h-4 transition-all duration-300 ease-in-out ${
                isOpen ? "rotate-180 text-[#409EFF]" : "rotate-0"
              }`}
            />
          </>
        )}
        {isCollapsed && (
          <span className={tooltipStyle}>
            {title}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 border-l border-b border-gray-700 rotate-45"></div>
          </span>
        )}
      </div>

      {/* Expanded dropdown content */}
      {!isCollapsed && (
        <ul
          className={`
            bg-[#1f2d3d] overflow-hidden
            transition-all duration-300 ease-in-out
            ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
          `}
          style={{
            transformOrigin: "top",
          }}
        >
          {children}
        </ul>
      )}

      {/* Flyout menu for collapsed sidebar */}
      {isCollapsed && showFlyout && (
        <div
          className={`fixed z-[60] bg-[#1f2d3d]/95 backdrop-blur-sm border border-gray-600/80 rounded-lg shadow-2xl py-1 min-w-[220px] max-w-[280px] flyout-container ${
            showFlyout ? "animate-flyout-enter" : "animate-flyout-exit"
          }`}
          style={{
            top: `${getFlyoutPosition().top}px`,
            left: `${getFlyoutPosition().left}px`,
            boxShadow:
              "0 10px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)",
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
                <span className="text-gray-100">{title}</span>
              </div>
              <CloseIcon className="w-4 h-4 text-gray-400 group-hover/header:text-white group-hover/header:rotate-90 transition-all duration-200" />
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">{children}</div>
        </div>
      )}
    </li>
  );
};

export default SidebarDropdown;
