'use client';
import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Employee } from '../types/employee';
import { getPositionColor, getGenderColor, calculateServiceYears } from '../utils/employeeUtils';
import { RolePermissions } from '@/app/dashboard/user-management/roles/types/permissions';
import { canViewField, getVisibleColumns, getAvailableActions } from '../utils/permissionHelpers';

interface EmployeeTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  permissions?: RolePermissions | null;
  userRole?: string | null;
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

import { InlineSpinner } from '@/components/LoadingSpinner';

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onView,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  permissions = null,
  userRole = null,
  canView = true,
  canEdit = true,
  canDelete = true
}) => {
  const [showFullTable, setShowFullTable] = useState(true);
  
  // Get visible columns based on permissions
  const visibleColumns = getVisibleColumns(permissions, userRole);
  const availableActions = getAvailableActions(permissions, userRole);
  
  // Check if specific fields are visible
  const showJoinDate = canViewField(permissions, 'joinDate', userRole);
  const showServiceYears = canViewField(permissions, 'serviceYears', userRole);
  const showGender = canViewField(permissions, 'gender', userRole);
  const showDob = canViewField(permissions, 'dob', userRole);
  const showPhoneNo = canViewField(permissions, 'phoneNo', userRole);
  const showPosition = canViewField(permissions, 'position', userRole);
  const showName = canViewField(permissions, 'name', userRole);

  // Detect screen size changes and update table visibility
  useEffect(() => {
    const checkScreenSize = () => {
      setShowFullTable(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm relative z-0">
      <table className="w-full bg-white text-sm table-fixed"
        style={{
          minWidth: showFullTable ? '900px' : '400px',
          width: '100%'
        }}>
        <thead>
          <tr className="text-left text-gray-600 border-b border-gray-200">
            {/* NAME - Show if permitted */}
            {showName && (
              <th
                className="px-3 py-2 font-semibold text-xs sticky left-0 z-10 border-r border-gray-200"
                style={{
                  width: showFullTable ? '16%' : '50%',
                  backgroundColor: 'rgb(248 250 252)',
                  boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                }}
              >
                NAME
              </th>
            )}

            {/* Show these columns only on larger screens and if permitted */}
            {showFullTable && (
              <>
                {showJoinDate && (
                  <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '11%', backgroundColor: 'rgb(248 250 252)' }}>JOIN DATE</th>
                )}
                {showServiceYears && (
                  <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '12%', backgroundColor: 'rgb(248 250 252)' }}>SERVICE YEARS</th>
                )}
                {showGender && (
                  <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '8%', backgroundColor: 'rgb(248 250 252)' }}>GENDER</th>
                )}
                {showDob && (
                  <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '10%', backgroundColor: 'rgb(248 250 252)' }}>DOB</th>
                )}
                {showPhoneNo && (
                  <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '11%', backgroundColor: 'rgb(248 250 252)' }}>PHONE NO.</th>
                )}
              </>
            )}

            {/* POSITION - Show if permitted */}
            {showPosition && (
              <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: showFullTable ? '14%' : '30%', backgroundColor: 'rgb(248 250 252)' }}>POSITION</th>
            )}

            {/* ACTION - Show if any action is available */}
            {availableActions.length > 0 && (
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
              {/* NAME - Show if permitted */}
              {showName && (
                <td
                  className="px-3 py-2 font-medium text-gray-900 sticky left-0 z-10 border-r border-gray-200"
                  style={{
                    width: showFullTable ? '16%' : '50%',
                    backgroundColor: 'rgb(248 250 252)',
                    boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                  }}
                  title={employee.name}
                >
                  <div className="truncate text-sm">{employee.name}</div>
                </td>
              )}

              {/* Show these columns only on larger screens and if permitted */}
              {showFullTable && (
                <>
                  {showJoinDate && (
                    <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '11%' }}>{employee.joinDate}</td>
                  )}
                  {showServiceYears && (
                    <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '12%' }}>{calculateServiceYears(employee.joinDate)}</td>
                  )}
                  {showGender && (
                    <td className="px-3 py-2" style={{ width: '8%' }}>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGenderColor(employee.gender)} block text-center`}>
                        {employee.gender}
                      </span>
                    </td>
                  )}
                  {showDob && (
                    <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '10%' }}>{employee.dob}</td>
                  )}
                  {showPhoneNo && (
                    <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '11%' }}>{employee.phone}</td>
                  )}
                </>
              )}

              {/* POSITION - Show if permitted */}
              {showPosition && (
                <td className="px-3 py-2" style={{ width: showFullTable ? '14%' : '30%' }}>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPositionColor(employee.position)} block text-center`}>
                    {employee.position}
                  </span>
                </td>
              )}

              {/* ACTION - Show if any action is available */}
              {availableActions.length > 0 && (
                <td
                  className="px-3 py-2 sticky right-0 z-10 border-l border-gray-200"
                  style={{
                    width: showFullTable ? '12%' : '20%',
                    backgroundColor: 'rgb(248 250 252)',
                    boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className={`flex items-center justify-center ${showFullTable ? 'space-x-1' : 'space-x-0.5'}`}>
                    {canView && availableActions.some(a => a.action === 'view') && (
                      <button
                        className={`${showFullTable ? 'p-2' : 'p-1.5'} text-blue-600 hover:bg-blue-50 rounded-lg transition-colors`}
                        onClick={() => onView(employee)}
                        title="View Employee"
                        disabled={isUpdating || isDeleting}
                      >
                        <Eye size={showFullTable ? 18 : 16} />
                      </button>
                    )}
                    {canEdit && availableActions.some(a => a.action === 'edit') && (
                      <button
                        className={`${showFullTable ? 'p-2' : 'p-1.5'} text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={() => onEdit(employee)}
                        title="Edit Employee"
                        disabled={isUpdating || isDeleting}
                      >
                        {isUpdating ? (
                          <InlineSpinner className="w-4 h-4" />
                        ) : (
                          <Pencil size={showFullTable ? 18 : 16} />
                        )}
                      </button>
                    )}
                    {canDelete && availableActions.some(a => a.action === 'delete') && (
                      <button
                        className={`${showFullTable ? 'p-2' : 'p-1.5'} text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={() => onDelete(employee)}
                        title="Delete Employee"
                        disabled={isUpdating || isDeleting}
                      >
                        {isDeleting ? (
                          <InlineSpinner className="w-4 h-4" />
                        ) : (
                          <Trash2 size={showFullTable ? 18 : 16} />
                        )}
                      </button>
                    )}
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