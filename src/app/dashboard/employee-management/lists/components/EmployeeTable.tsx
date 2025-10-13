'use client';
import React, { useState, useEffect } from 'react';
import { Employee } from '../types/employee';
import { InlineSpinner } from '@/components/LoadingSpinner';

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

interface EmployeeTableProps {
  employees: Employee[];
  tableConfig: TableConfig;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  tableConfig,
  isUpdating = false,
  isDeleting = false,
}) => {
  const [showFullTable, setShowFullTable] = useState(true);
  
  const { columns, actions, hasActions } = tableConfig;

  // Detect screen size changes and update table visibility
  useEffect(() => {
    const checkScreenSize = () => {
      setShowFullTable(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Show empty state when no employees
  if (employees.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 shadow-sm bg-white p-12 text-center">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Employees Found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          No employees match your current search and filter criteria. Try adjusting your filters or add some employees to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm relative z-0">
      <table className="w-full bg-white text-sm table-fixed"
        style={{
          minWidth: showFullTable ? '900px' : '400px',
          width: '100%'
        }}>
        <thead>
          <tr className="text-left text-gray-600 border-b border-gray-200">
            {/* Render columns dynamically based on permissions */}
            {columns.map((column, index) => {
              const isFirstColumn = index === 0;
              const width = showFullTable ? column.width : (column.mobileWidth || column.width);
              
              return (
                <th
                  key={column.key}
                  className={`px-3 py-2 font-semibold text-xs ${
                    isFirstColumn ? 'sticky left-0 z-10 border-r border-gray-200' : ''
                  }`}
                  style={{
                    width,
                    backgroundColor: 'rgb(248 250 252)',
                    ...(isFirstColumn && { boxShadow: '2px 0 4px rgba(0,0,0,0.1)' })
                  }}
                >
                  {column.label}
                </th>
              );
            })}

            {/* ACTION column - Show if any action is available */}
            {hasActions && (
              <th
                className="px-3 py-2 font-semibold text-xs text-center sticky right-0 z-10 border-l border-gray-200"
                style={{
                  width: showFullTable ? '12%' : '20%',
                  backgroundColor: 'rgb(248 250 252)',
                  boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
                }}
              >
                ACTION
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
              {/* Render cells dynamically based on columns */}
              {columns.map((column, index) => {
                const isFirstColumn = index === 0;
                const width = showFullTable ? column.width : (column.mobileWidth || column.width);
                const value = employee[column.field];
                const displayValue = column.render ? column.render(value, employee) : value;
                
                return (
                  <td
                    key={column.key}
                    className={`px-3 py-2 ${
                      isFirstColumn ? 'font-medium text-gray-900 sticky left-0 z-10 border-r border-gray-200' : 'text-gray-600'
                    } text-sm`}
                    style={{
                      width,
                      ...(isFirstColumn && {
                        backgroundColor: 'rgb(248 250 252)',
                        boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                      })
                    }}
                    title={isFirstColumn ? String(value) : undefined}
                  >
                    {isFirstColumn ? (
                      <div className="truncate">{displayValue}</div>
                    ) : (
                      displayValue
                    )}
                  </td>
                );
              })}

              {/* ACTION column - Show if any action is available */}
              {hasActions && (
                <td
                  className="px-3 py-2 sticky right-0 z-10 border-l border-gray-200"
                  style={{
                    width: showFullTable ? '12%' : '20%',
                    backgroundColor: 'rgb(248 250 252)',
                    boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className={`flex items-center justify-center ${showFullTable ? 'space-x-1' : 'space-x-0.5'}`}>
                    {actions.map((action) => {
                      const Icon = action.icon;
                      const isEditAction = action.key === 'edit';
                      const isDeleteAction = action.key === 'delete';
                      const showSpinner = (isEditAction && isUpdating) || (isDeleteAction && isDeleting);
                      
                      return (
                        <button
                          key={action.key}
                          className={`${showFullTable ? 'p-2' : 'p-1.5'} ${action.color} ${action.hoverColor} rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                          onClick={() => action.onClick(employee)}
                          title={action.label}
                          disabled={isUpdating || isDeleting}
                        >
                          {showSpinner ? (
                            <InlineSpinner className="w-4 h-4" />
                          ) : (
                            <Icon size={showFullTable ? 18 : 16} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};