'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from '../../types/employee';

interface DeleteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onConfirm: (employee: Employee) => void;
}

export const DeleteEmployeeModal: React.FC<DeleteEmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  onConfirm
}) => {
  if (!employee) return null;

  const handleConfirm = () => {
    onConfirm(employee);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Delete Employee</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this employee? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">Employee Details:</h4>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Name:</span> {employee.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Position:</span> {employee.position}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Phone:</span> {employee.phone}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white shadow-sm"
          >
            Delete Employee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};