export type Employee = {
  id: number;
  name: string;
  joinDate: string;
  position: string;
  gender: 'Male' | 'Female';
  dob: string;
  phone: string;
  nrc?: string;
  address?: string;
};

export type EmployeeFormData = Omit<Employee, 'id'>;