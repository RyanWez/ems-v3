/**
 * Breadcrumb Configuration
 * Maps route segments to human-readable labels
 */

export const breadcrumbLabels: Record<string, string> = {
  // Main sections
  dashboard: "Dashboard",
  
  // Employee Management
  "employee-management": "Employee Management",
  lists: "Employee Lists",
  list: "List",
  birthday: "Birthday",
  leave: "Annual Leave",
  
  // User Management
  "user-management": "User Management",
  roles: "Roles",
  
  // System Management
  "system-management": "System Management",
  broadcast: "Broadcast",
  logs: "System Logs",
  
  // Common
  details: "Details",
  edit: "Edit",
  create: "Create",
  view: "View",
};

/**
 * Get label for a route segment
 * Falls back to capitalized segment if not found in config
 */
export const getSegmentLabel = (segment: string): string => {
  // Check if it's in the config
  if (breadcrumbLabels[segment]) {
    return breadcrumbLabels[segment];
  }
  
  // Check if it's a dynamic route (UUID or number)
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
    return "Details";
  }
  
  if (/^\d+$/.test(segment)) {
    return `ID: ${segment}`;
  }
  
  // Fallback: capitalize and replace hyphens with spaces
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
