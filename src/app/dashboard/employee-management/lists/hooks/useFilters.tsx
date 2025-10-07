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
    // Position hierarchy for sorting
    const positionOrder = {
      'Super': 1,
      'Leader': 2,
      'Account Department': 3,
      'Operation': 4
    };

    const filtered = employees.filter((employee) => {
      const matchesSearch = searchTerm === '' ||
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm);

      const matchesPosition = selectedPosition === 'All Positions' || employee.position === selectedPosition;
      const matchesGender = selectedGender === 'All Genders' || employee.gender === selectedGender;

      let matchesServiceYears = true;
      if (selectedServiceYears !== 'Any Service Years') {
        const joinDate = new Date(employee.joinDate);
        const currentDate = new Date();
        const yearsDiff = currentDate.getFullYear() - joinDate.getFullYear();
        const monthsDiff = currentDate.getMonth() - joinDate.getMonth();
        const daysDiff = currentDate.getDate() - joinDate.getDate();
        
        // Calculate total months more accurately
        let totalMonths = yearsDiff * 12 + monthsDiff;
        if (daysDiff < 0) {
          totalMonths -= 1;
        }
        
        if (selectedServiceYears === 'Less than 6 months') {
          matchesServiceYears = totalMonths < 6;
        } else if (selectedServiceYears === '1-2 years') {
          matchesServiceYears = yearsDiff >= 1 && yearsDiff < 3;
        } else if (selectedServiceYears === '3-4 years') {
          matchesServiceYears = yearsDiff >= 3 && yearsDiff < 5;
        } else if (selectedServiceYears === '4-10 years') {
          matchesServiceYears = yearsDiff >= 4 && yearsDiff <= 10;
        }
      }

      return matchesSearch && matchesPosition && matchesGender && matchesServiceYears;
    });

    // Sort by position hierarchy first, then by join date (earliest first)
    return filtered.sort((a, b) => {
      // Get position order (lower number = higher priority)
      const aPositionOrder = positionOrder[a.position as keyof typeof positionOrder] || 999;
      const bPositionOrder = positionOrder[b.position as keyof typeof positionOrder] || 999;

      // If positions are different, sort by position hierarchy
      if (aPositionOrder !== bPositionOrder) {
        return aPositionOrder - bPositionOrder;
      }

      // If positions are the same, sort by join date (earliest first)
      const aJoinDate = new Date(a.joinDate);
      const bJoinDate = new Date(b.joinDate);
      return aJoinDate.getTime() - bJoinDate.getTime();
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