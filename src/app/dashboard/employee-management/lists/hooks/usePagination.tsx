'use client';
import { useState, useMemo } from 'react';
import { Employee } from '../types/employee';

export const usePagination = (employees: Employee[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(employees.length / rowsPerPage);
  
  const paginatedEmployees = useMemo(() => {
    return employees.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [employees, currentPage, rowsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // Reset to page 1 when employees change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalPages,
    paginatedEmployees,
    handleNextPage,
    handlePrevPage,
    handleRowsPerPageChange,
    resetPagination
  };
};