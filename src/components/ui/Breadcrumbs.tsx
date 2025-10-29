"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getSegmentLabel } from "@/config/breadcrumbConfig";
import { Home } from "lucide-react";

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

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm mb-4"
    >
      {/* Home Icon */}
      <Link
        href="/dashboard"
        className="flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors"
        aria-label="Go to Dashboard"
      >
        <Home className="w-4 h-4" />
      </Link>

      {/* Breadcrumb Items */}
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.href}>
          {/* Separator */}
          <span className="text-gray-400" aria-hidden="true">
            /
          </span>

          {/* Breadcrumb Link or Text */}
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
    </nav>
  );
};

export default Breadcrumbs;
