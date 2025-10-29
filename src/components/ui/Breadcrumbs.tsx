"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSegmentLabel } from "@/config/breadcrumbConfig";
import { Home, MoreHorizontal } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (!pathname || pathname === "/") {
      return [];
    }

    // Split path into segments and filter out empty strings
    const segments = pathname.split("/").filter((segment) => segment !== "");

    // Build breadcrumb items
    const breadcrumbs: BreadcrumbItem[] = segments.map((segment, index) => {
      // Build the href by joining segments up to current index
      const href = "/" + segments.slice(0, index + 1).join("/");

      // Get human-readable label
      const label = getSegmentLabel(segment);

      // Check if this is the current page (last segment)
      const isCurrentPage = index === segments.length - 1;

      return {
        label,
        href,
        isCurrentPage,
      };
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render if no breadcrumbs
  if (breadcrumbs.length === 0) {
    return null;
  }

  // Responsive breadcrumb rendering logic
  const renderResponsiveBreadcrumbs = () => {
    const totalItems = breadcrumbs.length;

    // If only 1-2 items, show all
    if (totalItems <= 2) {
      return breadcrumbs.map((item) => (
        <React.Fragment key={item.href}>
          <span className="text-gray-400 px-1" aria-hidden="true">
            /
          </span>
          {item.isCurrentPage ? (
            <span
              className="text-gray-700 font-semibold truncate max-w-[150px] sm:max-w-[200px] md:max-w-none"
              aria-current="page"
            >
              {item.label}
            </span>
          ) : (
            <Link
              href={item.href}
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate max-w-[150px] sm:max-w-[200px] md:max-w-none"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ));
    }

    // For 3+ items, use responsive collapsing
    const lastItem = breadcrumbs[totalItems - 1];
    const secondLastItem = totalItems > 1 ? breadcrumbs[totalItems - 2] : null;
    const firstItem = breadcrumbs[0];

    return (
      <>
        {/* Mobile: Show only last item */}
        <div className="flex items-center sm:hidden">
          <span className="text-gray-400" aria-hidden="true">
            /
          </span>
          <MoreHorizontal className="w-4 h-4 text-gray-400 mx-1" />
          <span className="text-gray-400" aria-hidden="true">
            /
          </span>
          <span
            className="text-gray-700 font-semibold truncate max-w-[150px]"
            aria-current="page"
          >
            {lastItem.label}
          </span>
        </div>

        {/* Tablet: Show first, ..., last two items */}
        <div className="hidden sm:flex md:hidden items-center">
          <span className="text-gray-400" aria-hidden="true">
            /
          </span>
          <Link
            href={firstItem.href}
            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate max-w-[120px]"
          >
            {firstItem.label}
          </Link>
          {totalItems > 3 && (
            <>
              <span className="text-gray-400 mx-1" aria-hidden="true">
                /
              </span>
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </>
          )}
          {secondLastItem && (
            <>
              <span className="text-gray-400 mx-1" aria-hidden="true">
                /
              </span>
              <Link
                href={secondLastItem.href}
                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors truncate max-w-[150px]"
              >
                {secondLastItem.label}
              </Link>
            </>
          )}
          <span className="text-gray-400 mx-1" aria-hidden="true">
            /
          </span>
          <span
            className="text-gray-700 font-semibold truncate max-w-[150px]"
            aria-current="page"
          >
            {lastItem.label}
          </span>
        </div>

        {/* Desktop: Show all items */}
        <div className="hidden md:flex items-center gap-3">
          {breadcrumbs.map((item) => (
            <React.Fragment key={item.href}>
              <span className="text-gray-400 px-1" aria-hidden="true">
                /
              </span>
              {item.isCurrentPage ? (
                <span
                  className="text-gray-700 font-semibold"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </>
    );
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 md:gap-3 text-sm overflow-hidden"
    >
      {/* Home Icon */}
      <Link
        href="/dashboard"
        className="flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors flex-shrink-0"
        aria-label="Go to Dashboard"
      >
        <Home className="w-4 h-4" />
      </Link>

      {/* Responsive Breadcrumb Items */}
      {renderResponsiveBreadcrumbs()}
    </nav>
  );
};

export default Breadcrumbs;
