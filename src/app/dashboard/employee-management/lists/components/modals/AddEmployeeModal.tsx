'use client';
import React, { useState } from 'react';
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
import { EmployeeFormData } from '../../types/employee';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: EmployeeFormData) => boolean;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [addForm, setAddForm] = useState<EmployeeFormData>({
    name: '',
    joinDate: '',
    position: 'Leader',
    gender: 'Male',
    dob: '',
    phone: ''
  });

  const handleFormChange = (field: keyof EmployeeFormData, value: string) => {
    setAddForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const success = onSave(addForm);
    if (success) {
      onClose();
      // Reset form
      setAddForm({
        name: '',
        joinDate: '',
        position: 'Leader',
        gender: 'Male',
        dob: '',
        phone: ''
      });
    }
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setAddForm({
      name: '',
      joinDate: '',
      position: 'Leader',
      gender: 'Male',
      dob: '',
      phone: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-lg rounded-xl">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div>
            <DialogTitle className="text-lg font-semibold text-gray-900">Add New Employee</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Enter the new employee's details below.
            </DialogDescription>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Full Name */}
          <div>
            <Label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </Label>
            <Input
              id="add-name"
              value={addForm.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              className="w-full"
              placeholder="Enter employee name"
            />
          </div>

          {/* Join Date and Position Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Join Date
              </Label>
              <div className="flex gap-1 sm:gap-2">
                <Select
                  value={addForm.joinDate.split('-')[0] || '2024'}
                  onValueChange={(year) => {
                    const [, month, day] = addForm.joinDate.split('-');
                    handleFormChange('joinDate', `${year}-${month || '01'}-${day || '01'}`);
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
                    const monthNum = addForm.joinDate.split('-')[1] || '01';
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
                    return monthNames[parseInt(monthNum) - 1] || 'January';
                  })()}
                  onValueChange={(month) => {
                    const [year, , day] = addForm.joinDate.split('-');
                    const monthMap: { [key: string]: string } = {
                      'January': '01', 'February': '02', 'March': '03', 'April': '04',
                      'May': '05', 'June': '06', 'July': '07', 'August': '08',
                      'September': '09', 'October': '10', 'November': '11', 'December': '12'
                    };
                    handleFormChange('joinDate', `${year || '2024'}-${monthMap[month] || '01'}-${day || '01'}`);
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
                    const dayNum = addForm.joinDate.split('-')[2] || '01';
                    return parseInt(dayNum).toString();
                  })()}
                  onValueChange={(day) => {
                    const [year, month] = addForm.joinDate.split('-');
                    handleFormChange('joinDate', `${year || '2024'}-${month || '01'}-${day.padStart(2, '0')}`);
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

            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </Label>
              <Select
                value={addForm.position}
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
          </div>

          {/* Gender and Date of Birth Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </Label>
              <Select
                value={addForm.gender}
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
                  value={addForm.dob.split('-')[0] || '2000'}
                  onValueChange={(year) => {
                    const [, month, day] = addForm.dob.split('-');
                    handleFormChange('dob', `${year}-${month || '01'}-${day || '01'}`);
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
                    const monthNum = addForm.dob.split('-')[1] || '01';
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
                    return monthNames[parseInt(monthNum) - 1] || 'January';
                  })()}
                  onValueChange={(month) => {
                    const [year, , day] = addForm.dob.split('-');
                    const monthMap: { [key: string]: string } = {
                      'January': '01', 'February': '02', 'March': '03', 'April': '04',
                      'May': '05', 'June': '06', 'July': '07', 'August': '08',
                      'September': '09', 'October': '10', 'November': '11', 'December': '12'
                    };
                    handleFormChange('dob', `${year || '2000'}-${monthMap[month] || '01'}-${day || '01'}`);
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
                    const dayNum = addForm.dob.split('-')[2] || '01';
                    return parseInt(dayNum).toString();
                  })()}
                  onValueChange={(day) => {
                    const [year, month] = addForm.dob.split('-');
                    handleFormChange('dob', `${year || '2000'}-${month || '01'}-${day.padStart(2, '0')}`);
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
            <Label htmlFor="add-phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-gray-400">(Optional)</span>
            </Label>
            <Input
              id="add-phone"
              value={addForm.phone}
              onChange={(e) => handleFormChange('phone', e.target.value)}
              placeholder="09xxxxxxxxx"
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
            Add Employee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};