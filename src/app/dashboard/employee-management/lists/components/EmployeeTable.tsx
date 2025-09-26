'use client';
import React, { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Employee } from '../types/employee';
import { getPositionColor, getGenderColor, calculateServiceYears } from '../utils/employeeUtils';

interface EmployeeTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onView,
  onEdit,
  onDelete
}) => {
  const [showFullTable, setShowFullTable] = useState(true);

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
            {/* NAME - Always show */}
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

            {/* Show these columns only on larger screens */}
            {showFullTable && (
              <>
                <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '11%', backgroundColor: 'rgb(248 250 252)' }}>JOIN DATE</th>
                <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '12%', backgroundColor: 'rgb(248 250 252)' }}>SERVICE YEARS</th>
                <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '8%', backgroundColor: 'rgb(248 250 252)' }}>GENDER</th>
                <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '10%', backgroundColor: 'rgb(248 250 252)' }}>DOB</th>
                <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '11%', backgroundColor: 'rgb(248 250 252)' }}>PHONE NO.</th>
              </>
            )}

            {/* POSITION - Always show */}
            <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: showFullTable ? '14%' : '30%', backgroundColor: 'rgb(248 250 252)' }}>POSITION</th>

            {/* ACTION - Always show */}
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
              {/* NAME - Always show */}
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

              {/* Show these columns only on larger screens */}
              {showFullTable && (
                <>
                  <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '11%' }}>{employee.joinDate}</td>
                  <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '12%' }}>{calculateServiceYears(employee.joinDate)}</td>
                  <td className="px-3 py-2" style={{ width: '8%' }}>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGenderColor(employee.gender)} block text-center`}>
                      {employee.gender}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '10%' }}>{employee.dob}</td>
                  <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '11%' }}>{employee.phone}</td>
                </>
              )}

              {/* POSITION - Always show */}
              <td className="px-3 py-2" style={{ width: showFullTable ? '14%' : '30%' }}>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPositionColor(employee.position)} block text-center`}>
                  {employee.position}
                </span>
              </td>

              {/* ACTION - Always show */}
              <td
                className="px-3 py-2 sticky right-0 z-10 border-l border-gray-200"
                style={{
                  width: showFullTable ? '12%' : '20%',
                  backgroundColor: 'rgb(248 250 252)',
                  boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
                }}
              >
                <div className={`flex items-center justify-center ${showFullTable ? 'space-x-1' : 'space-x-0.5'}`}>
                  <button
                    className={`${showFullTable ? 'p-2' : 'p-1.5'} text-blue-600 hover:bg-blue-50 rounded-lg transition-colors`}
                    onClick={() => onView(employee)}
                    title="View Employee"
                  >
                    <Eye size={showFullTable ? 18 : 16} />
                  </button>
                  <button
                    className={`${showFullTable ? 'p-2' : 'p-1.5'} text-green-600 hover:bg-green-50 rounded-lg transition-colors`}
                    onClick={() => onEdit(employee)}
                    title="Edit Employee"
                  >
                    <Pencil size={showFullTable ? 18 : 16} />
                  </button>
                  <button
                    className={`${showFullTable ? 'p-2' : 'p-1.5'} text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
                    onClick={() => onDelete(employee)}
                    title="Delete Employee"
                  >
                    <Trash2 size={showFullTable ? 18 : 16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};