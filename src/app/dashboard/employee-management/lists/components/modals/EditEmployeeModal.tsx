'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from '../../types/employee';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSave: (employee: Employee) => boolean;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onSave
}) => {
  const [editForm, setEditForm] = useState<Employee>({
    id: 0,
    name: '',
    joinDate: '',
    position: 'Leader',
    gender: 'Male',
    dob: '',
    phone: '',
    createdAt: '',
    updatedAt: ''
  });

  useEffect(() => {
    if (employee) {
      setEditForm({ ...employee });
    }
  }, [employee]);

  const handleFormChange = (field: keyof Employee, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const success = onSave(editForm);
    if (success) {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
    if (employee) {
      setEditForm({ ...employee });
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-lg rounded-xl">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900">Edit Employee</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Update the employee's details below.
            </DialogDescription>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </Label>
            <Input
              id="edit-name"
              value={editForm.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="w-full"
              placeholder="AUNG SWE PHYO"
            />
          </div>

          {/* Join Date */}
          <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Join Date
              </Label>
              <div className="flex gap-1 sm:gap-2">
                <Select
                  value={editForm.joinDate.split('-')[0] || new Date().getFullYear().toString()}
                  onValueChange={(year) => {
                    const [, month, day] = editForm.joinDate.split('-');
                    const currentMonth = month || String(new Date().getMonth() + 1).padStart(2, '0');
                    const currentDay = day || String(new Date().getDate()).padStart(2, '0');
                    handleFormChange('joinDate', `${year}-${currentMonth}-${currentDay}`);
                  }}
                >
                  <SelectTrigger className="w-20 sm:w-24">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={(() => {
                    const monthNum = editForm.joinDate.split('-')[1] || String(new Date().getMonth() + 1).padStart(2, '0');
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
                    return monthNames[parseInt(monthNum) - 1] || 'July';
                  })()}
                  onValueChange={(month) => {
                    const [year, , day] = editForm.joinDate.split('-');
                    const monthMap: { [key: string]: string } = {
                      'January': '01', 'February': '02', 'March': '03', 'April': '04',
                      'May': '05', 'June': '06', 'July': '07', 'August': '08',
                      'September': '09', 'October': '10', 'November': '11', 'December': '12'
                    };
                    const currentYear = year || new Date().getFullYear().toString();
                    const currentDay = day || String(new Date().getDate()).padStart(2, '0');
                    handleFormChange('joinDate', `${currentYear}-${monthMap[month] || String(new Date().getMonth() + 1).padStart(2, '0')}-${currentDay}`);
                  }}
                >
                  <SelectTrigger className="w-28 sm:w-32">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Select
                  value={(() => {
                    const dayNum = editForm.joinDate.split('-')[2] || String(new Date().getDate()).padStart(2, '0');
                    return parseInt(dayNum).toString();
                  })()}
                  onValueChange={(day) => {
                    const [year, month] = editForm.joinDate.split('-');
                    const currentYear = year || new Date().getFullYear().toString();
                    const currentMonth = month || String(new Date().getMonth() + 1).padStart(2, '0');
                    handleFormChange('joinDate', `${currentYear}-${currentMonth}-${day.padStart(2, '0')}`);
                  }}
                >
                  <SelectTrigger className="w-14 sm:w-16">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

          {/* Position */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </Label>
            <Select
              value={editForm.position}
              onValueChange={(value) => handleFormChange('position', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Super">Super</SelectItem>
                <SelectItem value="Leader">Leader</SelectItem>
                <SelectItem value="Account Department">Account Department</SelectItem>
                <SelectItem value="Operation">Operation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender and Date of Birth Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </Label>
              <Select
                value={editForm.gender}
                onValueChange={(value) => handleFormChange('gender', value as 'Male' | 'Female')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </Label>
              <div className="flex gap-1 sm:gap-2">
                <Select
                  value={editForm.dob.split('-')[0] || (new Date().getFullYear() - 25).toString()}
                  onValueChange={(year) => {
                    const [, month, day] = editForm.dob.split('-');
                    const currentMonth = month || '01';
                    const currentDay = day || '01';
                    handleFormChange('dob', `${year}-${currentMonth}-${currentDay}`);
                  }}
                >
                  <SelectTrigger className="w-20 sm:w-24">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 50 }, (_, i) => 1970 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={(() => {
                    const monthNum = editForm.dob.split('-')[1] || '01';
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
                    return monthNames[parseInt(monthNum) - 1] || 'April';
                  })()}
                  onValueChange={(month) => {
                    const [year, , day] = editForm.dob.split('-');
                    const monthMap: { [key: string]: string } = {
                      'January': '01', 'February': '02', 'March': '03', 'April': '04',
                      'May': '05', 'June': '06', 'July': '07', 'August': '08',
                      'September': '09', 'October': '10', 'November': '11', 'December': '12'
                    };
                    const currentYear = year || (new Date().getFullYear() - 25).toString();
                    const currentDay = day || '01';
                    handleFormChange('dob', `${currentYear}-${monthMap[month] || '01'}-${currentDay}`);
                  }}
                >
                  <SelectTrigger className="w-28 sm:w-32">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Select
                  value={(() => {
                    const dayNum = editForm.dob.split('-')[2] || '01';
                    return parseInt(dayNum).toString();
                  })()}
                  onValueChange={(day) => {
                    const [year, month] = editForm.dob.split('-');
                    const currentYear = year || (new Date().getFullYear() - 25).toString();
                    const currentMonth = month || '01';
                    handleFormChange('dob', `${currentYear}-${currentMonth}-${day.padStart(2, '0')}`);
                  }}
                >
                  <SelectTrigger className="w-14 sm:w-16">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-gray-400">(Optional)</span>
            </Label>
            <Input
              id="edit-phone"
              value={editForm.phone}
              onChange={(e) => handleFormChange('phone', e.target.value)}
              placeholder="09960476738"
              className="w-full"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};