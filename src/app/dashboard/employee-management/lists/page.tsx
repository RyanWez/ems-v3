'use client';
import React, { useState } from 'react';
import { PlusCircle, Download } from 'lucide-react';
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
import { LoadingSpinner, InlineSpinner } from '../../../../components/LoadingSpinner';
import { useAuth } from '@/Auth';
import { canViewEmployeeList, canCreateEmployee, canPerformAction } from './utils/permissionHelpers';
import { exportEmployeesToCSV } from './utils/exportHelpers';

const EmployeeLists: React.FC = () => {
  // Auth and permissions
  const { permissions, userRole } = useAuth();
  
  // Permission checks
  const canViewList = canViewEmployeeList(permissions, userRole);
  const canCreate = canCreateEmployee(permissions, userRole);
  const canEdit = canPerformAction(permissions, 'edit', userRole);
  const canDelete = canPerformAction(permissions, 'delete', userRole);
  const canView = canPerformAction(permissions, 'view', userRole);

  // Custom hooks
  const { employees, addEmployee, editEmployee, deleteEmployee, isLoading, error, isCreating, isUpdating, isDeleting } = useEmployees();
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
    if (!canView) {
      return;
    }
    setViewingEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    if (!canEdit) {
      return;
    }
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    if (!canDelete) {
      return;
    }
    setDeletingEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleAddNew = () => {
    if (!canCreate) {
      return;
    }
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

  // Export Handler
  const handleExport = () => {
    exportEmployeesToCSV(filteredEmployees);
  };

  // Check permissions first
  if (!canViewList) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border w-full max-w-full relative z-0">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to view employee list.</p>
        </div>
      </div>
    );
  }

  // Show loading spinner while data is loading
  if (isLoading) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border w-full max-w-full relative z-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Employee List</h2>
            <p className="text-gray-600 text-sm mt-1">Manage all employees in your organization.</p>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner
            size="lg"
            text="Loading employees..."
            className="text-blue-600"
          />
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border w-full max-w-full relative z-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Employee List</h2>
            <p className="text-gray-600 text-sm mt-1">Manage all employees in your organization.</p>
          </div>
        </div>

        {/* Error State */}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">⚠️ Error Loading Employees</div>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border w-full max-w-full relative z-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Employee List</h2>
          <p className="text-gray-600 text-sm mt-1">Manage all employees in your organization.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
          <button
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleExport}
            disabled={isLoading || filteredEmployees.length === 0}
            title="Export to CSV"
          >
            <Download size={18} className="mr-2" />
            Export
          </button>
          {canCreate && (
            <button
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddNew}
              disabled={isLoading || isCreating}
            >
              {isCreating ? (
                <InlineSpinner className="mr-2" />
              ) : (
                <PlusCircle size={18} className="mr-2" />
              )}
              {isCreating ? 'Adding Employee...' : 'Add New Employee'}
            </button>
          )}
        </div>
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
        isUpdating={isUpdating}
        isDeleting={isDeleting}
        permissions={permissions}
        userRole={userRole}
        canView={canView}
        canEdit={canEdit}
        canDelete={canDelete}
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
        permissions={permissions}
        userRole={userRole}
        canEdit={canEdit}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        employee={editingEmployee}
        onSave={handleSaveEdit}
        permissions={permissions}
        userRole={userRole}
      />

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAdd}
        onSave={handleSaveAdd}
        permissions={permissions}
        userRole={userRole}
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