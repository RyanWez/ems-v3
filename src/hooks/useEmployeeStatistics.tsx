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
      if (age < 25) ageGroup = 'Under 25';
      else if (age < 35) ageGroup = '25-34';
      else if (age < 45) ageGroup = '35-44';
      else if (age < 55) ageGroup = '45-54';
      else ageGroup = '55+';
      
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const ageGroupsArray = Object.entries(ageGroups).map(([ageGroup, count]) => ({
      ageGroup,
      count,
      percentage: Math.round((count / totalEmployees) * 100)
    }));

    // Service years statistics
    const serviceYears = employees.reduce((acc, emp) => {
      const joinDate = new Date(emp.joinDate);
      const serviceYears = currentDate.getFullYear() - joinDate.getFullYear();
      
      let serviceGroup: string;
      if (serviceYears < 1) serviceGroup = 'Less than 1 year';
      else if (serviceYears < 3) serviceGroup = '1-2 years';
      else if (serviceYears < 5) serviceGroup = '3-4 years';
      else if (serviceYears < 10) serviceGroup = '5-9 years';
      else serviceGroup = '10+ years';
      
      acc[serviceGroup] = (acc[serviceGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const serviceYearsArray = Object.entries(serviceYears).map(([serviceGroup, count]) => ({
      serviceGroup,
      count,
      percentage: Math.round((count / totalEmployees) * 100)
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