'use client';
import { useMemo } from 'react';
import { Employee } from '../app/dashboard/employee-management/lists/types/employee';

export interface EmployeeStatistics {
  totalEmployees: number;
  departmentBreakdown: { department: string; count: number; percentage: number }[];
  genderDistribution: { gender: string; count: number; percentage: number }[];
  ageGroups: { ageGroup: string; count: number; percentage: number }[];
  serviceYears: { serviceGroup: string; count: number; percentage: number }[];
  recentJoiners: Employee[];
}

export const useEmployeeStatistics = (employees: Employee[]): EmployeeStatistics => {
  return useMemo(() => {
    const totalEmployees = employees.length;

    // Department breakdown
    const departmentCounts = employees.reduce((acc, emp) => {
      acc[emp.position] = (acc[emp.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const departmentBreakdown = Object.entries(departmentCounts).map(([department, count]) => ({
      department,
      count,
      percentage: Math.round((count / totalEmployees) * 100)
    }));

    // Gender distribution
    const genderCounts = employees.reduce((acc, emp) => {
      acc[emp.gender] = (acc[emp.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const genderDistribution = Object.entries(genderCounts).map(([gender, count]) => ({
      gender,
      count,
      percentage: Math.round((count / totalEmployees) * 100)
    }));

    // Age demographics
    const currentDate = new Date();
    const ageGroups = employees.reduce((acc, emp) => {
      const birthDate = new Date(emp.dob);
      const age = currentDate.getFullYear() - birthDate.getFullYear();

      let ageGroup: string;
      if (age < 18) ageGroup = 'Enter 18';
      else if (age < 24) ageGroup = '18-24';
      else if (age < 30) ageGroup = '24-30';
      else ageGroup = 'Over 30';

      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Define age group order
    const ageGroupOrder = ['Enter 18', '18-24', '24-30', 'Over 30'];
    const ageGroupsArray = ageGroupOrder
      .filter(group => ageGroups[group] > 0)
      .map(ageGroup => ({
        ageGroup,
        count: ageGroups[ageGroup],
        percentage: Math.round((ageGroups[ageGroup] / totalEmployees) * 100)
      }));

    // Service years statistics
    const serviceYears = employees.reduce((acc, emp) => {
      const joinDate = new Date(emp.joinDate);
      const yearsDiff = currentDate.getFullYear() - joinDate.getFullYear();
      const monthsDiff = currentDate.getMonth() - joinDate.getMonth();
      const totalMonths = yearsDiff * 12 + monthsDiff;

      let serviceGroup: string;
      if (totalMonths < 6) serviceGroup = 'Less than 6 months';
      else if (yearsDiff < 3) serviceGroup = '1-2 years';
      else if (yearsDiff < 5) serviceGroup = '3-4 years';
      else serviceGroup = '4-10 years';

      acc[serviceGroup] = (acc[serviceGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Define service years order
    const serviceYearsOrder = ['Less than 6 months', '1-2 years', '3-4 years', '4-10 years'];
    const serviceYearsArray = serviceYearsOrder
      .filter(group => serviceYears[group] > 0)
      .map(serviceGroup => ({
        serviceGroup,
        count: serviceYears[serviceGroup],
        percentage: Math.round((serviceYears[serviceGroup] / totalEmployees) * 100)
      }));

    // Recent joiners (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentJoiners = employees
      .filter(emp => new Date(emp.joinDate) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());

    return {
      totalEmployees,
      departmentBreakdown,
      genderDistribution,
      ageGroups: ageGroupsArray,
      serviceYears: serviceYearsArray,
      recentJoiners
    };
  }, [employees]);
};