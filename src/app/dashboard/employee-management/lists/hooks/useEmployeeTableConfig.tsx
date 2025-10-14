"use client";
import { useMemo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useEmployeePermissions } from "./useEmployeePermissions";
import { Employee } from "../types/employee";
import {
  getPositionColor,
  getGenderColor,
  calculateServiceYears,
} from "../utils/employeeUtils";

interface ColumnConfig {
  key: string;
  label: string;
  field: keyof Employee;
  width: string;
  mobileWidth?: string;
  render?: (value: any, employee: Employee) => React.ReactNode;
}

interface ActionConfig {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  hoverColor: string;
  onClick: (employee: Employee) => void;
  isVisible: boolean;
}

interface TableConfig {
  columns: ColumnConfig[];
  actions: ActionConfig[];
  actionWidth: string;
  totalColumns: number;
  hasActions: boolean;
}

export const useEmployeeTableConfig = (
  onView: (emp: Employee) => void,
  onEdit: (emp: Employee) => void,
  onDelete: (emp: Employee) => void
): TableConfig => {
  const perms = useEmployeePermissions();

  // Memoize visible columns - Enhanced with read permission check
  const visibleColumns = useMemo<ColumnConfig[]>(() => {
    const allColumns: ColumnConfig[] = [
      {
        key: "name",
        label: "NAME",
        field: "name",
        width: "16%",
        mobileWidth: "50%",
      },
      {
        key: "joinDate",
        label: "JOIN DATE",
        field: "joinDate",
        width: "11%",
      },
      {
        key: "serviceYears",
        label: "SERVICE YEARS",
        field: "joinDate", // We use joinDate to calculate service years
        width: "12%",
        render: (_, employee) => calculateServiceYears(employee.joinDate),
      },
      {
        key: "gender",
        label: "GENDER",
        field: "gender",
        width: "8%",
        render: (value) => (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getGenderColor(
              value
            )} block text-center`}
          >
            {value}
          </span>
        ),
      },
      {
        key: "dob",
        label: "DOB",
        field: "dob",
        width: "10%",
      },
      {
        key: "phoneNo",
        label: "PHONE NO.",
        field: "phone",
        width: "11%",
      },
      {
        key: "position",
        label: "POSITION",
        field: "position",
        width: "18%",
        mobileWidth: "30%",
        render: (value) => (
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${getPositionColor(
              value
            )}`}
          >
            {value}
          </span>
        ),
      },
    ];

    // Filter based on read permissions (Enhanced)
    return allColumns.filter((col) => {
      const fieldKey = col.key === "phoneNo" ? "phoneNo" : col.key;
      const fieldPerm = perms.fields[fieldKey as keyof typeof perms.fields];
      // Check if field is visible (read permission)
      return fieldPerm?.visible ?? false;
    });
  }, [perms]); // Only recalculate when permissions change

  // Memoize available actions (Enhanced with scope info)
  const availableActions = useMemo<ActionConfig[]>(() => {
    const allActions: ActionConfig[] = [
      {
        key: "view",
        label: `View${
          perms.view.scope !== "all" ? ` (${perms.view.scope})` : ""
        }`,
        icon: Eye,
        color: "text-blue-600",
        hoverColor: "hover:bg-blue-50",
        onClick: onView,
        isVisible: perms.view.enabled,
      },
      {
        key: "edit",
        label: `Edit${
          perms.edit.scope !== "all" ? ` (${perms.edit.scope})` : ""
        }`,
        icon: Pencil,
        color: "text-green-600",
        hoverColor: "hover:bg-green-50",
        onClick: onEdit,
        isVisible: perms.edit.enabled,
      },
      {
        key: "delete",
        label: `Delete${
          perms.delete.scope !== "all" ? ` (${perms.delete.scope})` : ""
        }`,
        icon: Trash2,
        color: "text-red-600",
        hoverColor: "hover:bg-red-50",
        onClick: onDelete,
        isVisible: perms.delete.enabled,
      },
    ];

    return allActions.filter((action) => action.isVisible);
  }, [perms.view, perms.edit, perms.delete, onView, onEdit, onDelete]);

  // Calculate column widths dynamically
  const tableConfig = useMemo<TableConfig>(() => {
    const totalColumns =
      visibleColumns.length + (availableActions.length > 0 ? 1 : 0);
    const actionWidth = availableActions.length > 0 ? "12%" : "0%";

    return {
      columns: visibleColumns,
      actions: availableActions,
      actionWidth,
      totalColumns,
      hasActions: availableActions.length > 0,
    };
  }, [visibleColumns, availableActions]);

  return tableConfig;
};
