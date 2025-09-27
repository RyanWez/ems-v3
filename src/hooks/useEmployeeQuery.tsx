'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Employee, EmployeeFormData } from '@/app/dashboard/employee-management/lists/types/employee';
import { toast } from 'sonner';
import { CheckCircle, XCircle } from 'lucide-react';

// Mock initial data
const initialEmployees: Employee[] = [
  { id: 1, name: 'SOE MOE HTUN', joinDate: '2021-07-01', position: 'Super', gender: 'Male', dob: '1998-04-21', phone: '09899947118' },
  { id: 2, name: 'AUNG SWE PHYO', joinDate: '2021-07-01', position: 'Leader', gender: 'Male', dob: '2001-05-24', phone: '09960476738' },
  { id: 3, name: 'AUNG KHANT', joinDate: '2021-09-21', position: 'Leader', gender: 'Male', dob: '1999-04-17', phone: '09762800400' },
  { id: 4, name: 'SITHU AUNG', joinDate: '2021-10-28', position: 'Leader', gender: 'Male', dob: '2000-03-14', phone: '09795343868' },
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

// Query keys
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters: string) => [...employeeKeys.lists(), { filters }] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
};

// Mock API functions
const employeeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get from localStorage or return initial data
    const stored = localStorage.getItem('employees');
    return stored ? JSON.parse(stored) : initialEmployees;
  },

  addEmployee: async (employee: EmployeeFormData): Promise<Employee> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employees = await employeeApi.getEmployees();
    const newId = Math.max(...employees.map(emp => emp.id)) + 1;
    const newEmployee: Employee = { ...employee, id: newId };
    
    const updatedEmployees = [...employees, newEmployee];
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    return newEmployee;
  },

  updateEmployee: async (employee: Employee): Promise<Employee> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const employees = await employeeApi.getEmployees();
    const updatedEmployees = employees.map(emp => 
      emp.id === employee.id ? employee : emp
    );
    
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    return employee;
  },

  deleteEmployee: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const employees = await employeeApi.getEmployees();
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  },
};

// Custom hooks
export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.lists(),
    queryFn: employeeApi.getEmployees,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAddEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.addEmployee,
    onSuccess: (newEmployee) => {
      // Update the cache
      queryClient.setQueryData(employeeKeys.lists(), (old: Employee[] = []) => {
        return [...old, newEmployee];
      });
      
      toast.success(`Employee ${newEmployee.name} added successfully!`, {
        icon: <CheckCircle className="w-5 h-5" />,
      });
    },
    onError: (error) => {
      toast.error('Failed to add employee. Please try again.', {
        icon: <XCircle className="w-5 h-5" />,
      });
      console.error('Add employee error:', error);
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.updateEmployee,
    onSuccess: (updatedEmployee) => {
      // Update the cache
      queryClient.setQueryData(employeeKeys.lists(), (old: Employee[] = []) => {
        return old.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp);
      });
      
      toast.success(`Employee ${updatedEmployee.name} updated successfully!`, {
        icon: <CheckCircle className="w-5 h-5" />,
      });
    },
    onError: (error) => {
      toast.error('Failed to update employee. Please try again.', {
        icon: <XCircle className="w-5 h-5" />,
      });
      console.error('Update employee error:', error);
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeApi.deleteEmployee,
    onSuccess: (_, deletedId) => {
      // Update the cache
      queryClient.setQueryData(employeeKeys.lists(), (old: Employee[] = []) => {
        return old.filter(emp => emp.id !== deletedId);
      });
      
      toast.success('Employee deleted successfully!', {
        icon: <CheckCircle className="w-5 h-5" />,
      });
    },
    onError: (error) => {
      toast.error('Failed to delete employee. Please try again.', {
        icon: <XCircle className="w-5 h-5" />,
      });
      console.error('Delete employee error:', error);
    },
  });
}