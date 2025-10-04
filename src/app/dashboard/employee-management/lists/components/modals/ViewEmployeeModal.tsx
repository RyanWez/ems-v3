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
import { generateAvatarUrl, getAvatarFallback } from '../../utils/avatarUtils';
import { RolePermissions } from '@/app/dashboard/user-management/roles/types/permissions';
import { canViewField, canViewDetailsField, canPerformAction } from '../../utils/permissionHelpers';

interface ViewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (employee: Employee) => void;
  permissions?: RolePermissions | null;
  userRole?: string | null;
  canEdit?: boolean;
}

export const ViewEmployeeModal: React.FC<ViewEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit,
  permissions = null,
  userRole = null,
  canEdit = true
}) => {
  if (!employee) return null;

  const handleEdit = () => {
    if (!canEdit) return;
    onClose();
    onEdit(employee);
  };

  // Check field permissions
  const showName = canViewField(permissions, 'name', userRole);
  const showGender = canViewField(permissions, 'gender', userRole);
  const showDob = canViewField(permissions, 'dob', userRole);
  const showPhoneNo = canViewField(permissions, 'phoneNo', userRole);
  const showPosition = canViewField(permissions, 'position', userRole);
  const showJoinDate = canViewField(permissions, 'joinDate', userRole);
  const showServiceYears = canViewField(permissions, 'serviceYears', userRole);

  // Check details field group permissions
  const showPersonalInfo = canViewDetailsField(permissions, 'personalInfo', userRole);
  const showContactInfo = canViewDetailsField(permissions, 'contactInfo', userRole);
  const showWorkInfo = canViewDetailsField(permissions, 'workInfo', userRole);

  const avatarFallback = getAvatarFallback(employee.name, employee.gender, employee.position);

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
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generateAvatarUrl(employee.name, employee.gender, employee.position)}
                  alt={`${employee.name} avatar`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className={`${avatarFallback.className} ${avatarFallback.bgColor} hidden w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {avatarFallback.initials}
                </div>
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              {showName && (
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{employee.name}</h3>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {showPosition && (
                  <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getPositionColor(employee.position)}`}>
                    {employee.position}
                  </span>
                )}
                {showGender && (
                  <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getGenderColor(employee.gender)}`}>
                    {employee.gender}
                  </span>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Employee ID:</span> EMP-{employee.id.toString().padStart(4, '0')}
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="space-y-6">
            {/* Personal Information Card */}
            {showPersonalInfo && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 border-b border-blue-200 pb-3 mb-5 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  Personal Information
                </h4>
                
                <div className="space-y-4">
                  {showName && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-blue-100">
                      <label className="text-sm font-semibold text-blue-600 mb-1 sm:mb-0">Full Name</label>
                      <p className="text-gray-900 font-bold text-lg">{employee.name}</p>
                    </div>
                  )}
                  
                  {showGender && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-blue-100">
                      <label className="text-sm font-semibold text-blue-600 mb-1 sm:mb-0">Gender</label>
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getGenderColor(employee.gender)} self-start sm:self-center`}>
                        {employee.gender === 'Male' ? '👨' : '👩'} {employee.gender}
                      </span>
                    </div>
                  )}
                  
                  {showDob && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-blue-100">
                      <label className="text-sm font-semibold text-blue-600 mb-1 sm:mb-0">Date of Birth</label>
                      <p className="text-gray-900 font-semibold text-base flex items-center">
                        🎂 {employee.dob}
                      </p>
                    </div>
                  )}

                  {/* Calculate and show age */}
                  {showDob && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
                      <label className="text-sm font-semibold text-blue-600 mb-1 sm:mb-0">Age</label>
                      <p className="text-gray-900 font-semibold text-base flex items-center">
                        🕐 {(() => {
                          const today = new Date();
                          const birthDate = new Date(employee.dob);
                          let age = today.getFullYear() - birthDate.getFullYear();
                          const monthDiff = today.getMonth() - birthDate.getMonth();
                          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                          }
                          return age;
                        })()} years old
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work Information Card */}
            {showWorkInfo && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 border-b border-green-200 pb-3 mb-5 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  Work Information
                </h4>
                
                <div className="space-y-4">
                  {showPosition && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-green-100">
                      <label className="text-sm font-semibold text-green-600 mb-1 sm:mb-0">Position</label>
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getPositionColor(employee.position)} self-start sm:self-center`}>
                        💼 {employee.position}
                      </span>
                    </div>
                  )}
                  
                  {showJoinDate && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-green-100">
                      <label className="text-sm font-semibold text-green-600 mb-1 sm:mb-0">Join Date</label>
                      <p className="text-gray-900 font-semibold text-base flex items-center">
                        📅 {employee.joinDate}
                      </p>
                    </div>
                  )}
                  
                  {showServiceYears && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-green-100">
                      <label className="text-sm font-semibold text-green-600 mb-1 sm:mb-0">Service Years</label>
                      <p className="text-green-600 font-bold text-lg flex items-center">
                        ⏰ {calculateServiceYears(employee.joinDate)}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
                    <label className="text-sm font-semibold text-green-600 mb-1 sm:mb-0">Employee ID</label>
                    <p className="text-gray-900 font-mono font-bold text-base flex items-center">
                      🆔 EMP-{employee.id.toString().padStart(4, '0')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information Card */}
          {showContactInfo && showPhoneNo && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 border-b border-purple-200 pb-3 mb-5 flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                Contact Information
              </h4>
              
              <div className="space-y-4">
                {showPhoneNo && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3">
                    <label className="text-sm font-semibold text-purple-600 mb-1 sm:mb-0">Phone Number</label>
                    <p className="text-gray-900 font-semibold text-base font-mono flex items-center">
                      📱 {employee.phone}
                    </p>
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
          {canEdit && (
            <Button
              onClick={handleEdit}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              Edit Employee
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};