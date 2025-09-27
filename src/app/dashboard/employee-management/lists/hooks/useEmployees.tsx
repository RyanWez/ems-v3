'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';
import { Employee, EmployeeFormData } from '../types/employee';

const EMPLOYEES_QUERY_KEY = ['employees'];

export const useEmployees = () => {
  const queryClient = useQueryClient();

  // Fetch employees
  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: async (): Promise<Employee[]> => {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      return response.json();
    },
  });

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: EmployeeFormData): Promise<Employee> => {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create employee');
      }

      return response.json();
    },
    onSuccess: (newEmployee) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      toast.success(`Employee ${newEmployee.name} added successfully!`, {
        icon: <CheckCircle className="w-5 h-5" />,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        icon: <XCircle className="w-5 h-5" />,
      });
    },
  });

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: async (employee: Employee): Promise<Employee> => {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update employee');
      }

      return response.json();
    },
    onSuccess: (updatedEmployee) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      toast.success(`Employee ${updatedEmployee.name} updated successfully!`, {
        icon: <CheckCircle className="w-5 h-5" />,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        icon: <XCircle className="w-5 h-5" />,
      });
    },
  });

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (employee: Employee): Promise<void> => {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete employee');
      }
    },
    onSuccess: (_, employee) => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      toast.success(`Employee ${employee.name} deleted successfully!`, {
        icon: <CheckCircle className="w-5 h-5" />,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message, {
        icon: <XCircle className="w-5 h-5" />,
      });
    },
  });

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

    // Check for duplicate employees (Name + Join Date + Phone Number)
    const existingEmployees = employees.filter(emp => {
      // Normalize names for comparison (remove spaces and convert to uppercase)
      const normalizeName = (name: string) => name.replace(/\s+/g, '').toUpperCase();

      const normalizedNewName = normalizeName(employeeData.name);
      const normalizedExistingName = normalizeName(emp.name);

      const sameName = normalizedNewName === normalizedExistingName;
      const sameJoinDate = employeeData.joinDate === emp.joinDate;
      const samePhone = employeeData.phone && emp.phone ?
        employeeData.phone.replace(/[\s\-\(\)]/g, '') === emp.phone.replace(/[\s\-\(\)]/g, '') : false;

      // If all three match, it's a duplicate
      if (sameName && sameJoinDate && samePhone) {
        return true;
      }

      // If name and join date match (and phone is empty for both), it's a duplicate
      if (sameName && sameJoinDate && !employeeData.phone && !emp.phone) {
        return true;
      }

      return false;
    });

    if (existingEmployees.length > 0) {
      toast.error(`Employee "${employeeData.name}" with the same join date and phone number already exists!`, {
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

    createEmployeeMutation.mutate(employeeData);
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

    // Check for duplicate employees (Name + Join Date + Phone Number) - exclude current employee
    const existingEmployees = employees.filter(emp => {
      if (emp.id === updatedEmployee.id) return false; // Skip current employee

      // Normalize names for comparison (remove spaces and convert to uppercase)
      const normalizeName = (name: string) => name.replace(/\s+/g, '').toUpperCase();

      const normalizedUpdatedName = normalizeName(updatedEmployee.name);
      const normalizedExistingName = normalizeName(emp.name);

      const sameName = normalizedUpdatedName === normalizedExistingName;
      const sameJoinDate = updatedEmployee.joinDate === emp.joinDate;
      const samePhone = updatedEmployee.phone && emp.phone ?
        updatedEmployee.phone.replace(/[\s\-\(\)]/g, '') === emp.phone.replace(/[\s\-\(\)]/g, '') : false;

      // If all three match, it's a duplicate
      if (sameName && sameJoinDate && samePhone) {
        return true;
      }

      // If name and join date match (and phone is empty for both), it's a duplicate
      if (sameName && sameJoinDate && !updatedEmployee.phone && !emp.phone) {
        return true;
      }

      return false;
    });

    if (existingEmployees.length > 0) {
      toast.error(`Employee "${updatedEmployee.name}" with the same join date and phone number already exists!`, {
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

    updateEmployeeMutation.mutate(updatedEmployee);
    return true;
  };

  const deleteEmployee = (employee: Employee) => {
    deleteEmployeeMutation.mutate(employee);
  };

  return {
    employees,
    addEmployee,
    editEmployee,
    deleteEmployee,
    isLoading,
    error,
    // Mutation loading states
    isCreating: createEmployeeMutation.isPending,
    isUpdating: updateEmployeeMutation.isPending,
    isDeleting: deleteEmployeeMutation.isPending
  };
};