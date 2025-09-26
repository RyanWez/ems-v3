'use client';
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Employee } from './types/employee';
import { useEmployees } from './hooks/useEmployees';
import { useFilters } from './hooks/useFilters';
import { usePagination } from './hooks/usePagination';
import { SearchFilters } from './components/SearchFilters';
import { EmployeeTable } from './components/EmployeeTable';
import { Pagination } from './components/Pagination';
import { ViewEmployeeModal } from './components/modals/ViewEmployeeModal';
import { EditEmployeeModal } from './components/modals/EditEmployeeModal';
import { AddEmployeeModal } from './components/modals/AddEmployeeModal';
import { DeleteEmployeeModal } from './components/modals/DeleteEmployeeModal';

const EmployeeLists: React.FC = () => {
  // Custom hooks
  const { employees, addEmployee, editEmployee, deleteEmployee } = useEmployees();
  const {
    searchTerm,
    setSearchTerm,
    selectedPosition,
    setSelectedPosition,
    selectedGender,
    setSelectedGender,
    selectedServiceYears,
    setSelectedServiceYears,
    filteredEmployees
  } = useFilters(employees);

  const {
    currentPage,
    rowsPerPage,
    totalPages,
    paginatedEmployees,
    handleNextPage,
    handlePrevPage,
    handleRowsPerPageChange,
    resetPagination
  } = usePagination(filteredEmployees);

  // Modal States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected Employee States
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // Handler Functions
  const handleView = (employee: Employee) => {
    setViewingEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setDeletingEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  // Modal Close Handlers
  const handleCloseView = () => {
    setIsViewModalOpen(false);
    setViewingEmployee(null);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  const handleCloseAdd = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingEmployee(null);
  };

  // Save Handlers
  const handleSaveEdit = (updatedEmployee: Employee) => {
    const success = editEmployee(updatedEmployee);
    if (success) {
      resetPagination();
    }
    return success;
  };

  const handleSaveAdd = (newEmployeeData: any) => {
    const success = addEmployee(newEmployeeData);
    if (success) {
      resetPagination();
    }
    return success;
  };

  const handleConfirmDelete = (employee: Employee) => {
    deleteEmployee(employee);
    resetPagination();
  };

  // Filter Change Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPagination();
  };

  const handlePositionChange = (position: string) => {
    setSelectedPosition(position);
    resetPagination();
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    resetPagination();
  };

  const handleServiceYearsChange = (serviceYears: string) => {
    setSelectedServiceYears(serviceYears);
    resetPagination();
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border w-full max-w-full relative z-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Employee List</h2>
          <p className="text-gray-600 text-sm mt-1">Manage all employees in your organization.</p>
        </div>
        <button
          className="mt-4 sm:mt-0 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          onClick={handleAddNew}
        >
          <PlusCircle size={18} className="mr-2" />
          Add New Employee
        </button>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedPosition={selectedPosition}
        onPositionChange={handlePositionChange}
        selectedGender={selectedGender}
        onGenderChange={handleGenderChange}
        selectedServiceYears={selectedServiceYears}
        onServiceYearsChange={handleServiceYearsChange}
      />

      {/* Employee Table */}
      <EmployeeTable
        employees={paginatedEmployees}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalEmployees={filteredEmployees.length}
        displayedEmployees={paginatedEmployees.length}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Modals */}
      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={handleCloseView}
        employee={viewingEmployee}
        onEdit={handleEdit}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        employee={editingEmployee}
        onSave={handleSaveEdit}
      />

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAdd}
        onSave={handleSaveAdd}
      />

      <DeleteEmployeeModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDelete}
        employee={deletingEmployee}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default EmployeeLists;