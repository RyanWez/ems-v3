'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from '../../types/employee';
import { getPositionColor, getGenderColor, calculateServiceYears } from '../../utils/employeeUtils';
import { generateAvatarUrl } from '../../utils/avatarUtils';

interface ViewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (employee: Employee) => void;
}

export const ViewEmployeeModal: React.FC<ViewEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit
}) => {
  if (!employee) return null;

  const handleEdit = () => {
    onClose();
    onEdit(employee);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-lg rounded-xl">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900">Employee Details</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              View complete information about this employee.
            </DialogDescription>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Employee Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex-shrink-0">
              <img 
                src={generateAvatarUrl(employee.name, employee.gender)}
                alt={`${employee.name} avatar`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-full hidden items-center justify-center text-white font-bold text-lg sm:text-xl border-2 border-white shadow-md">
                {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{employee.name}</h3>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getPositionColor(employee.position)}`}>
                  {employee.position}
                </span>
                <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getGenderColor(employee.gender)}`}>
                  {employee.gender}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Employee ID:</span> EMP-{employee.id.toString().padStart(4, '0')}
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Personal Information Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Personal Information
              </h4>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Full Name</label>
                  <p className="text-gray-900 font-medium text-sm sm:text-base">{employee.name}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Gender</label>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getGenderColor(employee.gender)} self-start sm:self-center`}>
                    {employee.gender}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Date of Birth</label>
                  <p className="text-gray-900 text-sm sm:text-base">{employee.dob}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Phone Number</label>
                  <p className="text-gray-900 text-sm sm:text-base font-mono">{employee.phone}</p>
                </div>
              </div>
            </div>

            {/* Work Information Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Work Information
              </h4>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Position</label>
                  <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getPositionColor(employee.position)} self-start sm:self-center`}>
                    {employee.position}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Join Date</label>
                  <p className="text-gray-900 text-sm sm:text-base">{employee.joinDate}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Service Years</label>
                  <p className="text-gray-900 font-medium text-green-600 text-sm sm:text-base">{calculateServiceYears(employee.joinDate)}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Employee ID</label>
                  <p className="text-gray-900 font-mono text-sm sm:text-base">EMP-{employee.id.toString().padStart(4, '0')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(employee.nrc || employee.address) && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Additional Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {employee.nrc && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">NRC Number</label>
                    <p className="text-gray-900">{employee.nrc}</p>
                  </div>
                )}
                
                {employee.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                    <p className="text-gray-900">{employee.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
          >
            Close
          </Button>
          <Button
            onClick={handleEdit}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            Edit Employee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};