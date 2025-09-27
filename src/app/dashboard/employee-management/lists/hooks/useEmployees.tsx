'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';
import { Employee, EmployeeFormData } from '../types/employee';

const initialEmployees: Employee[] = [
  { id: 1, name: 'SOE MOE HTUN', joinDate: '2021-07-01', position: 'Super', gender: 'Male', dob: '1998-09-27', phone: '09899947118' },
  { id: 2, name: 'AUNG SWE PHYO', joinDate: '2021-07-01', position: 'Leader', gender: 'Male', dob: '2001-09-28', phone: '09960476738' },
  { id: 3, name: 'AUNG KHANT', joinDate: '2021-09-21', position: 'Leader', gender: 'Male', dob: '1999-09-29', phone: '09762800400' },
  { id: 4, name: 'SITHU AUNG', joinDate: '2021-10-28', position: 'Leader', gender: 'Male', dob: '2000-10-02', phone: '09795343868' },
  { id: 5, name: 'MIN HTET THAR', joinDate: '2022-01-30', position: 'Leader', gender: 'Male', dob: '2004-09-30', phone: '09965324618' },
  { id: 6, name: 'TIN HTUN WIN', joinDate: '2023-02-26', position: 'Leader', gender: 'Male', dob: '2002-07-13', phone: '09404035278' },
  { id: 7, name: 'TIN ZAR MAW', joinDate: '2021-07-23', position: 'Account Department', gender: 'Female', dob: '1997-07-12', phone: '09767864112' },
  { id: 8, name: 'SU PO PO SAN', joinDate: '2021-09-22', position: 'Account Department', gender: 'Female', dob: '1999-01-15', phone: '09767745868' },
  { id: 9, name: 'TIN THANDAR WIN', joinDate: '2021-09-29', position: 'Account Department', gender: 'Female', dob: '1999-04-17', phone: '09797851643' },
  { id: 10, name: 'TUE TUE AUNG', joinDate: '2021-10-06', position: 'Account Department', gender: 'Female', dob: '2000-05-12', phone: '0953988106' },
  { id: 11, name: 'KYAW KYAW', joinDate: '2021-08-15', position: 'Leader', gender: 'Male', dob: '1996-12-08', phone: '09876543210' },
  { id: 12, name: 'MYA MYA', joinDate: '2021-11-20', position: 'Account Department', gender: 'Female', dob: '1998-03-25', phone: '09712345678' },
  { id: 13, name: 'ZAW ZAW', joinDate: '2022-02-14', position: 'Leader', gender: 'Male', dob: '1997-09-30', phone: '09987654321' },
  { id: 14, name: 'HLA HLA', joinDate: '2022-05-10', position: 'Account Department', gender: 'Female', dob: '1999-11-22', phone: '09543219876' },
  { id: 15, name: 'THAN THAN', joinDate: '2022-08-30', position: 'Leader', gender: 'Male', dob: '1995-06-15', phone: '09811223344' },
];

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  const addEmployee = (employeeData: EmployeeFormData) => {
    // Validate required fields
    if (!employeeData.name.trim()) {
      toast.error('Please enter employee name', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    if (!employeeData.joinDate || employeeData.joinDate === '' || employeeData.joinDate.split('-').length !== 3) {
      toast.error('Please select a valid join date', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    if (!employeeData.dob || employeeData.dob === '' || employeeData.dob.split('-').length !== 3) {
      toast.error('Please select a valid date of birth', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    // Validate date formats
    const joinDate = new Date(employeeData.joinDate);
    const dobDate = new Date(employeeData.dob);
    const currentDate = new Date();

    if (isNaN(joinDate.getTime())) {
      toast.error('Please select a valid join date', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    if (isNaN(dobDate.getTime())) {
      toast.error('Please select a valid date of birth', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    // Validate logical dates
    if (dobDate >= currentDate) {
      toast.error('Date of birth cannot be in the future', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    if (joinDate > currentDate) {
      toast.error('Join date cannot be in the future', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    // Calculate age at join date
    const ageAtJoin = joinDate.getFullYear() - dobDate.getFullYear();
    if (ageAtJoin < 16) {
      toast.error('Employee must be at least 16 years old at join date', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    const newId = Math.max(...employees.map(emp => emp.id)) + 1;
    const newEmployee: Employee = {
      ...employeeData,
      id: newId
    };

    setEmployees(prev => [...prev, newEmployee]);
    toast.success(`Employee ${employeeData.name} added successfully!`, {
      icon: <CheckCircle className="w-5 h-5" />,
    });
    return true;
  };

  const editEmployee = (updatedEmployee: Employee) => {
    // Validate required fields
    if (!updatedEmployee.name.trim()) {
      toast.error('Please enter employee name', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    if (!updatedEmployee.joinDate || updatedEmployee.joinDate === '' || updatedEmployee.joinDate.split('-').length !== 3) {
      toast.error('Please select a valid join date', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    if (!updatedEmployee.dob || updatedEmployee.dob === '' || updatedEmployee.dob.split('-').length !== 3) {
      toast.error('Please select a valid date of birth', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    // Validate date formats
    const joinDate = new Date(updatedEmployee.joinDate);
    const dobDate = new Date(updatedEmployee.dob);
    const currentDate = new Date();

    if (isNaN(joinDate.getTime())) {
      toast.error('Please select a valid join date', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    if (isNaN(dobDate.getTime())) {
      toast.error('Please select a valid date of birth', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    // Validate logical dates
    if (dobDate >= currentDate) {
      toast.error('Date of birth cannot be in the future', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    if (joinDate > currentDate) {
      toast.error('Join date cannot be in the future', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    // Calculate age at join date
    const ageAtJoin = joinDate.getFullYear() - dobDate.getFullYear();
    if (ageAtJoin < 16) {
      toast.error('Employee must be at least 16 years old at join date', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return false;
    }

    setEmployees(prev =>
      prev.map(emp =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );

    toast.success(`Employee ${updatedEmployee.name} updated successfully!`, {
      icon: <CheckCircle className="w-5 h-5" />,
    });
    return true;
  };

  const deleteEmployee = (employee: Employee) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
    toast.success(`Employee ${employee.name} deleted successfully!`, {
      icon: <CheckCircle className="w-5 h-5" />,
    });
  };

  return {
    employees,
    addEmployee,
    editEmployee,
    deleteEmployee
  };
};