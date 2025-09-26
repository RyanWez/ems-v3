'use client';
import { useState, useMemo } from 'react';
import { Employee } from '../types/employee';
import { calculateServiceYears } from '../utils/employeeUtils';

export const useFilters = (employees: Employee[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('All Positions');
  const [selectedGender, setSelectedGender] = useState('All Genders');
  const [selectedServiceYears, setSelectedServiceYears] = useState('Any Service Years');

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = searchTerm === '' ||
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm);

      const matchesPosition = selectedPosition === 'All Positions' || employee.position === selectedPosition;
      const matchesGender = selectedGender === 'All Genders' || employee.gender === selectedGender;

      let matchesServiceYears = true;
      if (selectedServiceYears !== 'Any Service Years') {
        const serviceYears = calculateServiceYears(employee.joinDate);
        if (selectedServiceYears === 'Less than 1 year') {
          matchesServiceYears = serviceYears.includes('M') && !serviceYears.includes('Y');
        } else if (selectedServiceYears === '1-3 years') {
          matchesServiceYears = serviceYears.includes('1 Y') || serviceYears.includes('2 Y');
        } else if (selectedServiceYears === '3-5 years') {
          matchesServiceYears = serviceYears.includes('3 Y') || serviceYears.includes('4 Y');
        } else if (selectedServiceYears === 'More than 5 years') {
          matchesServiceYears = parseInt(serviceYears.split(' Y')[0]) >= 5;
        }
      }

      return matchesSearch && matchesPosition && matchesGender && matchesServiceYears;
    });
  }, [employees, searchTerm, selectedPosition, selectedGender, selectedServiceYears]);

  return {
    searchTerm,
    setSearchTerm,
    selectedPosition,
    setSelectedPosition,
    selectedGender,
    setSelectedGender,
    selectedServiceYears,
    setSelectedServiceYears,
    filteredEmployees
  };
};