
'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Eye, Pencil, Trash2, PlusCircle, ChevronLeft, ChevronRight, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


type Employee = {
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
  // Add more employees to match the "113 employees" shown in the image
  { id: 11, name: 'KYAW KYAW', joinDate: '2021-08-15', position: 'Leader', gender: 'Male', dob: '1996-12-08', phone: '09876543210' },
  { id: 12, name: 'MYA MYA', joinDate: '2021-11-20', position: 'Account Department', gender: 'Female', dob: '1998-03-25', phone: '09712345678' },
  { id: 13, name: 'ZAW ZAW', joinDate: '2022-02-14', position: 'Leader', gender: 'Male', dob: '1997-09-30', phone: '09987654321' },
  { id: 14, name: 'HLA HLA', joinDate: '2022-05-10', position: 'Account Department', gender: 'Female', dob: '1999-11-22', phone: '09543219876' },
  { id: 15, name: 'THAN THAN', joinDate: '2022-08-30', position: 'Leader', gender: 'Male', dob: '1995-06-15', phone: '09811223344' },
];

const getPositionColor = (position: string) => {
  switch (position) {
    case 'Super': return 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'Leader': return 'bg-green-100 text-green-800 border border-green-200';
    case 'Account Department': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    default: return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

const getGenderColor = (gender: string) => {
  return gender === 'Male' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-pink-100 text-pink-800 border border-pink-200';
};

const calculateServiceYears = (joinDate: string) => {
  const start = new Date(joinDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  let result = '';
  if (years > 0) result += `${years} Y, `;
  if (months > 0) result += `${months} M, `;
  if (days >= 0) result += `${days} D`;

  if (result.endsWith(', ')) {
    result = result.slice(0, -2);
  }

  return result || '0 D';
};

const EmployeeLists: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('All Positions');
  const [selectedGender, setSelectedGender] = useState('All Genders');
  const [selectedServiceYears, setSelectedServiceYears] = useState('Any Service Years');
  const [showFullTable, setShowFullTable] = useState(true);

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Employee>({
    id: 0,
    name: '',
    joinDate: '',
    position: 'Leader',
    gender: 'Male',
    dob: '',
    phone: '',
    nrc: '',
    address: ''
  });

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // Detect screen size changes and update table visibility
  useEffect(() => {
    const checkScreenSize = () => {
      setShowFullTable(window.innerWidth >= 1024); // lg breakpoint - show all columns on larger screens
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePositionChange = (position: string) => {
    setSelectedPosition(position);
    setCurrentPage(1);
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender);
    setCurrentPage(1);
  };

  const handleServiceYearsChange = (serviceYears: string) => {
    setSelectedServiceYears(serviceYears);
    setCurrentPage(1);
  };

  // Edit Employee Functions
  const handleEditEmployee = (employee: Employee) => {
    setEditForm({ ...employee, nrc: employee.nrc || '', address: employee.address || '' });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (field: keyof Employee, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEdit = () => {
    if (!editForm.name.trim() || !editForm.joinDate) {
      toast.error('Please fill in all required fields (Name and Join Date)');
      return;
    }

    setEmployees(prev =>
      prev.map(emp =>
        emp.id === editForm.id ? editForm : emp
      )
    );

    setIsEditModalOpen(false);
    toast.success(`Employee ${editForm.name} updated successfully!`);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditForm({
      id: 0,
      name: '',
      joinDate: '',
      position: 'Leader',
      gender: 'Male',
      dob: '',
      phone: '',
      nrc: '',
      address: ''
    });
  };

  // Delete Employee Functions
  const handleDeleteEmployee = (employee: Employee) => {
    setDeletingEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingEmployee) {
      setEmployees(prev => prev.filter(emp => emp.id !== deletingEmployee.id));
      toast.success(`Employee ${deletingEmployee.name} deleted successfully!`);
      setIsDeleteModalOpen(false);
      setDeletingEmployee(null);

      // Reset to first page if current page becomes empty
      const newFilteredEmployees = employees.filter(emp => emp.id !== deletingEmployee.id);
      const newTotalPages = Math.ceil(newFilteredEmployees.length / rowsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(1);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingEmployee(null);
  };

  // Filter employees based on search and filter criteria
  const filteredEmployees = employees.filter((employee) => {
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

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border w-full max-w-full relative z-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee List</h2>
          <p className="text-gray-600 mt-1">Manage all employees in your organization.</p>
        </div>
        <button
          className="mt-4 sm:mt-0 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          onClick={() => toast.success('Add New Employee form opened!')}
        >
          <PlusCircle size={18} className="mr-2" />
          Add New Employee
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Search Bar */}
          <div className="flex-1 min-w-0">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                id="search"
                placeholder="Search by name, position, phone, NRC..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Position Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedPosition}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {['All Positions', 'Super', 'Leader', 'Account Department'].map((position) => (
                  <DropdownMenuItem
                    key={position}
                    onSelect={() => handlePositionChange(position)}
                    className="cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:bg-gray-100 focus:text-gray-900"
                  >
                    {position}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Gender Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedGender}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {['All Genders', 'Male', 'Female'].map((gender) => (
                  <DropdownMenuItem
                    key={gender}
                    onSelect={() => handleGenderChange(gender)}
                    className="cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:bg-gray-100 focus:text-gray-900"
                  >
                    {gender}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Service Years Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Years</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedServiceYears}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {['Any Service Years', 'Less than 1 year', '1-3 years', '3-5 years', 'More than 5 years'].map((years) => (
                  <DropdownMenuItem
                    key={years}
                    onSelect={() => handleServiceYearsChange(years)}
                    className="cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:bg-gray-100 focus:text-gray-900"
                  >
                    {years}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm relative z-0">
        <table className="w-full bg-white text-sm table-auto"
          style={{
            minWidth: showFullTable ? '800px' : '400px',
            width: '100%',
            tableLayout: 'auto'
          }}>
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-200">
              {/* NAME - Always show */}
              <th
                className="px-4 py-3 font-semibold text-sm sticky left-0 z-10 border-r border-gray-200"
                style={{
                  width: showFullTable ? '18%' : '50%',
                  minWidth: showFullTable ? '180px' : '200px',
                  backgroundColor: 'rgb(248 250 252)',
                  boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                }}
              >
                NAME
              </th>

              {/* Show these columns only on larger screens */}
              {showFullTable && (
                <>
                  <th className="px-4 py-3 font-semibold text-sm border-b border-gray-200" style={{ width: '12%', minWidth: '130px', backgroundColor: 'rgb(248 250 252)' }}>JOIN DATE</th>
                  <th className="px-4 py-3 font-semibold text-sm border-b border-gray-200" style={{ width: '14%', minWidth: '140px', backgroundColor: 'rgb(248 250 252)' }}>SERVICE YEARS</th>
                  <th className="px-4 py-3 font-semibold text-sm border-b border-gray-200" style={{ width: '8%', minWidth: '80px', backgroundColor: 'rgb(248 250 252)' }}>GENDER</th>
                  <th className="px-4 py-3 font-semibold text-sm border-b border-gray-200" style={{ width: '12%', minWidth: '130px', backgroundColor: 'rgb(248 250 252)' }}>DOB</th>
                  <th className="px-4 py-3 font-semibold text-sm border-b border-gray-200" style={{ width: '12%', minWidth: '120px', backgroundColor: 'rgb(248 250 252)' }}>PHONE NO.</th>
                </>
              )}

              {/* POSITION - Always show */}
              <th className="px-4 py-3 font-semibold text-sm border-b border-gray-200" style={{ width: showFullTable ? '16%' : '30%', minWidth: '160px', backgroundColor: 'rgb(248 250 252)' }}>POSITION</th>

              {/* ACTION - Always show */}
              <th
                className="px-4 py-3 font-semibold text-sm text-center sticky right-0 z-10 border-l border-gray-200"
                style={{
                  width: showFullTable ? '14%' : '20%',
                  minWidth: '120px',
                  backgroundColor: 'rgb(248 250 252)',
                  boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
                }}
              >
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                {/* NAME - Always show */}
                <td
                  className="px-4 py-3 font-medium text-gray-900 sticky left-0 z-10 border-r border-gray-200"
                  style={{
                    width: showFullTable ? '18%' : '50%',
                    minWidth: showFullTable ? '180px' : '200px',
                    backgroundColor: 'rgb(248 250 252)',
                    boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                  }}
                  title={employee.name}
                >
                  <div className="truncate">{employee.name}</div>
                </td>

                {/* Show these columns only on larger screens */}
                {showFullTable && (
                  <>
                    <td className="px-4 py-3 text-gray-600" style={{ width: '12%', minWidth: '130px' }}>{employee.joinDate}</td>
                    <td className="px-4 py-3 text-gray-600" style={{ width: '14%', minWidth: '140px' }}>{calculateServiceYears(employee.joinDate)}</td>
                    <td className="px-4 py-3" style={{ width: '8%', minWidth: '80px' }}>
                      <span className={`px-2 py-1 text-sm font-medium rounded-full ${getGenderColor(employee.gender)} block text-center`}>
                        {employee.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600" style={{ width: '12%', minWidth: '130px' }}>{employee.dob}</td>
                    <td className="px-4 py-3 text-gray-600" style={{ width: '12%', minWidth: '120px' }}>{employee.phone}</td>
                  </>
                )}

                {/* POSITION - Always show */}
                <td className="px-4 py-3" style={{ width: showFullTable ? '16%' : '30%', minWidth: '160px' }}>
                  <span className={`px-2 py-1 text-sm font-medium rounded-full ${getPositionColor(employee.position)} block text-center`}>
                    {employee.position}
                  </span>
                </td>

                {/* ACTION - Always show */}
                <td
                  className="px-4 py-3 sticky right-0 z-10 border-l border-gray-200"
                  style={{
                    width: showFullTable ? '14%' : '20%',
                    minWidth: '120px',
                    backgroundColor: 'rgb(248 250 252)',
                    boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className={`flex items-center justify-center ${showFullTable ? 'space-x-1' : 'space-x-0.5'}`}>
                    <button
                      className={`${showFullTable ? 'p-2.5' : 'p-1.5'} text-blue-600 hover:bg-blue-50 rounded-lg transition-colors`}
                      onClick={() => toast.info(`Viewing employee: ${employee.name}`)}
                      title="View Employee"
                    >
                      <Eye size={showFullTable ? 22 : 16} />
                    </button>
                    <button
                      className={`${showFullTable ? 'p-2.5' : 'p-1.5'} text-green-600 hover:bg-green-50 rounded-lg transition-colors`}
                      onClick={() => handleEditEmployee(employee)}
                      title="Edit Employee"
                    >
                      <Pencil size={showFullTable ? 22 : 16} />
                    </button>
                    <button
                      className={`${showFullTable ? 'p-2.5' : 'p-1.5'} text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
                      onClick={() => handleDeleteEmployee(employee)}
                      title="Delete Employee"
                    >
                      <Trash2 size={showFullTable ? 22 : 16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-2 py-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="mb-3 sm:mb-0 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{paginatedEmployees.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> employees.
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="rows-per-page" className="text-sm text-gray-600">Rows per page:</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-[70px] justify-between">
                  {rowsPerPage}
                  <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[10, 20, 50, 100].map((value) => (
                  <DropdownMenuItem
                    key={value}
                    onSelect={() => handleRowsPerPageChange(value)}
                    className="cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 focus:bg-gray-100 focus:text-gray-900"
                  >
                    {value}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Employee Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white border-0 shadow-lg">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">Edit Employee</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Update the employee's details below.
              </DialogDescription>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => handleEditFormChange('name', e.target.value)}
                className="w-full"
                placeholder="AUNG SWE PHYO"
              />
            </div>

            {/* Join Date and Position Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-joinDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={editForm.joinDate.split('-')[0] || '2021'}
                    onValueChange={(year) => {
                      const [, month, day] = editForm.joinDate.split('-');
                      handleEditFormChange('joinDate', `${year}-${month || '07'}-${day || '01'}`);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={(() => {
                      const monthNum = editForm.joinDate.split('-')[1] || '07';
                      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
                      return monthNames[parseInt(monthNum) - 1] || 'July';
                    })()}
                    onValueChange={(month) => {
                      const [year, , day] = editForm.joinDate.split('-');
                      const monthMap: { [key: string]: string } = {
                        'January': '01', 'February': '02', 'March': '03', 'April': '04',
                        'May': '05', 'June': '06', 'July': '07', 'August': '08',
                        'September': '09', 'October': '10', 'November': '11', 'December': '12'
                      };
                      handleEditFormChange('joinDate', `${year || '2021'}-${monthMap[month] || '07'}-${day || '01'}`);
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={editForm.joinDate.split('-')[2] || '1'}
                    onValueChange={(day) => {
                      const [year, month] = editForm.joinDate.split('-');
                      handleEditFormChange('joinDate', `${year || '2021'}-${month || '07'}-${day.padStart(2, '0')}`);
                    }}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-position" className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </Label>
                <Select
                  value={editForm.position}
                  onValueChange={(value) => handleEditFormChange('position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super">Super</SelectItem>
                    <SelectItem value="Leader">Leader</SelectItem>
                    <SelectItem value="Account Department">Account Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Gender and Date of Birth Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </Label>
                <Select
                  value={editForm.gender}
                  onValueChange={(value) => handleEditFormChange('gender', value as 'Male' | 'Female')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-dob" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={editForm.dob.split('-')[0] || '2001'}
                    onValueChange={(year) => {
                      const [, month, day] = editForm.dob.split('-');
                      handleEditFormChange('dob', `${year}-${month || '05'}-${day || '24'}`);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 50 }, (_, i) => 1970 + i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={(() => {
                      const monthNum = editForm.dob.split('-')[1] || '05';
                      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
                      return monthNames[parseInt(monthNum) - 1] || 'May';
                    })()}
                    onValueChange={(month) => {
                      const [year, , day] = editForm.dob.split('-');
                      const monthMap: { [key: string]: string } = {
                        'January': '01', 'February': '02', 'March': '03', 'April': '04',
                        'May': '05', 'June': '06', 'July': '07', 'August': '08',
                        'September': '09', 'October': '10', 'November': '11', 'December': '12'
                      };
                      handleEditFormChange('dob', `${year || '2001'}-${monthMap[month] || '05'}-${day || '24'}`);
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={editForm.dob.split('-')[2] || '24'}
                    onValueChange={(day) => {
                      const [year, month] = editForm.dob.split('-');
                      handleEditFormChange('dob', `${year || '2001'}-${month || '05'}-${day.padStart(2, '0')}`);
                    }}
                  >
                    <SelectTrigger className="w-16">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Phone Number and NRC Number Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">(Optional)</span>
                </Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone}
                  onChange={(e) => handleEditFormChange('phone', e.target.value)}
                  placeholder="09960476738"
                />
              </div>

              <div>
                <Label htmlFor="edit-nrc" className="block text-sm font-medium text-gray-700 mb-2">
                  NRC Number <span className="text-red-500">(Optional)</span>
                </Label>
                <Input
                  id="edit-nrc"
                  value={editForm.nrc || ''}
                  onChange={(e) => handleEditFormChange('nrc', e.target.value)}
                  placeholder="****"
                  className="text-center"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">(Optional)</span>
              </Label>
              <Input
                id="edit-address"
                value={editForm.address || ''}
                onChange={(e) => handleEditFormChange('address', e.target.value)}
                placeholder="YAMETHIN"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <Button variant="outline" onClick={handleCancelEdit} className="px-6">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="px-6 bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingEmployee && (
            <div className="py-4">
              <div className="bg-muted/20 p-4 rounded-lg border">
                <h4 className="font-semibold text-foreground mb-2">Employee Details:</h4>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Name:</span> {deletingEmployee.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Position:</span> {deletingEmployee.position}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Phone:</span> {deletingEmployee.phone}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeLists;