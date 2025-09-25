'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Eye, Pencil, Trash2, PlusCircle, ChevronLeft, ChevronRight, ChevronsUpDown, Search, CheckCircle, XCircle } from 'lucide-react';
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
    case 'Operation': return 'bg-orange-100 text-orange-800 border border-orange-200';
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

const generateAvatarUrl = (name: string, gender: 'Male' | 'Female') => {
  // Use DiceBear API with lorelei style
  const seed = encodeURIComponent(name);
  const style = 'lorelei';

  // Generate gender-appropriate avatar
  const genderParam = gender === 'Female' ? 'female' : 'male';

  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&gender=${genderParam}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=64`;
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
    phone: ''
  });

  // Add Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<Omit<Employee, 'id'>>({
    name: '',
    joinDate: '',
    position: 'Leader',
    gender: 'Male',
    dob: '',
    phone: ''
  });

  // Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // View Modal States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  // Detect screen size changes and update table visibility
  useEffect(() => {
    const checkScreenSize = () => {
      setShowFullTable(window.innerWidth >= 1024);
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
    setEditForm({ ...employee });
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
      toast.error('Please fill in all required fields (Name and Join Date)', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return;
    }

    setEmployees(prev =>
      prev.map(emp =>
        emp.id === editForm.id ? editForm : emp
      )
    );

    setIsEditModalOpen(false);
    toast.success(`Employee ${editForm.name} updated successfully!`, {
      icon: <CheckCircle className="w-5 h-5" />,
    });
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
      phone: ''
    });
  };

  // Add Employee Functions
  const handleAddEmployee = () => {
    setIsAddModalOpen(true);
  };

  const handleAddFormChange = (field: keyof Omit<Employee, 'id'>, value: string) => {
    setAddForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAdd = () => {
    if (!addForm.name.trim() || !addForm.joinDate) {
      toast.error('Please fill in all required fields (Name and Join Date)', {
        icon: <XCircle className="w-5 h-5" />,
      });
      return;
    }

    // Generate new ID
    const newId = Math.max(...employees.map(emp => emp.id)) + 1;
    const newEmployee: Employee = {
      ...addForm,
      id: newId
    };

    setEmployees(prev => [...prev, newEmployee]);
    setIsAddModalOpen(false);
    setAddForm({
      name: '',
      joinDate: '',
      position: 'Leader',
      gender: 'Male',
      dob: '',
      phone: ''
    });
    toast.success(`Employee ${addForm.name} added successfully!`, {
      icon: <CheckCircle className="w-5 h-5" />,
    });
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
    setAddForm({
      name: '',
      joinDate: '',
      position: 'Leader',
      gender: 'Male',
      dob: '',
      phone: ''
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
      toast.success(`Employee ${deletingEmployee.name} deleted successfully!`, {
        icon: <CheckCircle className="w-5 h-5" />,
      });
      setIsDeleteModalOpen(false);
      setDeletingEmployee(null);

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

  // View Employee Functions
  const handleViewEmployee = (employee: Employee) => {
    setViewingEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleCloseView = () => {
    setIsViewModalOpen(false);
    setViewingEmployee(null);
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
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border w-full max-w-full relative z-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Employee List</h2>
          <p className="text-gray-600 text-sm mt-1">Manage all employees in your organization.</p>
        </div>
        <button
          className="mt-4 sm:mt-0 flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          onClick={handleAddEmployee}
        >
          <PlusCircle size={18} className="mr-2" />
          Add New Employee
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Search Bar */}
          <div className="flex-1 min-w-0">
            <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </Label>
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
                {['All Positions', 'Super', 'Leader', 'Account Department', 'Operation'].map((position) => (
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
        <table className="w-full bg-white text-sm table-fixed"
          style={{
            minWidth: showFullTable ? '900px' : '400px',
            width: '100%'
          }}>
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-200">
              {/* NAME - Always show */}
              <th
                className="px-3 py-2 font-semibold text-xs sticky left-0 z-10 border-r border-gray-200"
                style={{
                  width: showFullTable ? '16%' : '50%',
                  backgroundColor: 'rgb(248 250 252)',
                  boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                }}
              >
                NAME
              </th>

              {/* Show these columns only on larger screens */}
              {showFullTable && (
                <>
                  <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '11%', backgroundColor: 'rgb(248 250 252)' }}>JOIN DATE</th>
                  <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '12%', backgroundColor: 'rgb(248 250 252)' }}>SERVICE YEARS</th>
                  <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '8%', backgroundColor: 'rgb(248 250 252)' }}>GENDER</th>
                  <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '10%', backgroundColor: 'rgb(248 250 252)' }}>DOB</th>
                  <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: '11%', backgroundColor: 'rgb(248 250 252)' }}>PHONE NO.</th>
                </>
              )}

              {/* POSITION - Always show */}
              <th className="px-3 py-2 font-semibold text-xs border-b border-gray-200" style={{ width: showFullTable ? '14%' : '30%', backgroundColor: 'rgb(248 250 252)' }}>POSITION</th>

              {/* ACTION - Always show */}
              <th
                className="px-3 py-2 font-semibold text-xs text-center sticky right-0 z-10 border-l border-gray-200"
                style={{
                  width: showFullTable ? '12%' : '20%',
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
                  className="px-3 py-2 font-medium text-gray-900 sticky left-0 z-10 border-r border-gray-200"
                  style={{
                    width: showFullTable ? '16%' : '50%',
                    backgroundColor: 'rgb(248 250 252)',
                    boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                  }}
                  title={employee.name}
                >
                  <div className="truncate text-sm">{employee.name}</div>
                </td>

                {/* Show these columns only on larger screens */}
                {showFullTable && (
                  <>
                    <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '11%' }}>{employee.joinDate}</td>
                    <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '12%' }}>{calculateServiceYears(employee.joinDate)}</td>
                    <td className="px-3 py-2" style={{ width: '8%' }}>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGenderColor(employee.gender)} block text-center`}>
                        {employee.gender}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '10%' }}>{employee.dob}</td>
                    <td className="px-3 py-2 text-gray-600 text-sm" style={{ width: '11%' }}>{employee.phone}</td>
                  </>
                )}

                {/* POSITION - Always show */}
                <td className="px-3 py-2" style={{ width: showFullTable ? '14%' : '30%' }}>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPositionColor(employee.position)} block text-center`}>
                    {employee.position}
                  </span>
                </td>

                {/* ACTION - Always show */}
                <td
                  className="px-3 py-2 sticky right-0 z-10 border-l border-gray-200"
                  style={{
                    width: showFullTable ? '12%' : '20%',
                    backgroundColor: 'rgb(248 250 252)',
                    boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className={`flex items-center justify-center ${showFullTable ? 'space-x-1' : 'space-x-0.5'}`}>
                    <button
                      className={`${showFullTable ? 'p-2' : 'p-1.5'} text-blue-600 hover:bg-blue-50 rounded-lg transition-colors`}
                      onClick={() => handleViewEmployee(employee)}
                      title="View Employee"
                    >
                      <Eye size={showFullTable ? 18 : 16} />
                    </button>
                    <button
                      className={`${showFullTable ? 'p-2' : 'p-1.5'} text-green-600 hover:bg-green-50 rounded-lg transition-colors`}
                      onClick={() => handleEditEmployee(employee)}
                      title="Edit Employee"
                    >
                      <Pencil size={showFullTable ? 18 : 16} />
                    </button>
                    <button
                      className={`${showFullTable ? 'p-2' : 'p-1.5'} text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
                      onClick={() => handleDeleteEmployee(employee)}
                      title="Delete Employee"
                    >
                      <Trash2 size={showFullTable ? 18 : 16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
        <div className="mb-3 sm:mb-0 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{paginatedEmployees.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{filteredEmployees.length}</span> employees.
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Rows per page:</label>
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
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-lg">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">Edit Employee</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Update the employee's details below.
              </DialogDescription>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date
                </Label>
                <div className="flex gap-1 sm:gap-2">
                  <Select
                    value={editForm.joinDate.split('-')[0] || '2021'}
                    onValueChange={(year) => {
                      const [, month, day] = editForm.joinDate.split('-');
                      handleEditFormChange('joinDate', `${year}-${month || '07'}-${day || '01'}`);
                    }}
                  >
                    <SelectTrigger className="w-20 sm:w-24">
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
                    <SelectTrigger className="w-28 sm:w-32">
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
                    value={(() => {
                      const dayNum = editForm.joinDate.split('-')[2] || '01';
                      return parseInt(dayNum).toString();
                    })()}
                    onValueChange={(day) => {
                      const [year, month] = editForm.joinDate.split('-');
                      handleEditFormChange('joinDate', `${year || '2021'}-${month || '07'}-${day.padStart(2, '0')}`);
                    }}
                  >
                    <SelectTrigger className="w-14 sm:w-16">
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
                <Label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <SelectItem value="Operation">Operation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Gender and Date of Birth Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
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
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </Label>
                <div className="flex gap-1 sm:gap-2">
                  <Select
                    value={editForm.dob.split('-')[0] || '1998'}
                    onValueChange={(year) => {
                      const [, month, day] = editForm.dob.split('-');
                      handleEditFormChange('dob', `${year}-${month || '04'}-${day || '21'}`);
                    }}
                  >
                    <SelectTrigger className="w-20 sm:w-24">
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
                      const monthNum = editForm.dob.split('-')[1] || '04';
                      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
                      return monthNames[parseInt(monthNum) - 1] || 'April';
                    })()}
                    onValueChange={(month) => {
                      const [year, , day] = editForm.dob.split('-');
                      const monthMap: { [key: string]: string } = {
                        'January': '01', 'February': '02', 'March': '03', 'April': '04',
                        'May': '05', 'June': '06', 'July': '07', 'August': '08',
                        'September': '09', 'October': '10', 'November': '11', 'December': '12'
                      };
                      handleEditFormChange('dob', `${year || '1998'}-${monthMap[month] || '04'}-${day || '21'}`);
                    }}
                  >
                    <SelectTrigger className="w-28 sm:w-32">
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
                    value={(() => {
                      const dayNum = editForm.dob.split('-')[2] || '21';
                      return parseInt(dayNum).toString();
                    })()}
                    onValueChange={(day) => {
                      const [year, month] = editForm.dob.split('-');
                      handleEditFormChange('dob', `${year || '1998'}-${month || '04'}-${day.padStart(2, '0')}`);
                    }}
                  >
                    <SelectTrigger className="w-14 sm:w-16">
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

            {/* Phone Number */}
            <div>
              <Label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => handleEditFormChange('phone', e.target.value)}
                placeholder="09960476738"
                className="w-full"
              />
            </div>
          </div>

          {/* Footer with improved button styling */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              className="w-full sm:w-auto px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Employee Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-lg">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">Add New Employee</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Enter the new employee's details below.
              </DialogDescription>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Label>
              <Input
                id="add-name"
                value={addForm.name}
                onChange={(e) => handleAddFormChange('name', e.target.value)}
                className="w-full"
                placeholder="Enter employee name"
              />
            </div>

            {/* Join Date and Position Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date
                </Label>
                <div className="flex gap-1 sm:gap-2">
                  <Select
                    value={addForm.joinDate.split('-')[0] || '2024'}
                    onValueChange={(year) => {
                      const [, month, day] = addForm.joinDate.split('-');
                      handleAddFormChange('joinDate', `${year}-${month || '01'}-${day || '01'}`);
                    }}
                  >
                    <SelectTrigger className="w-20 sm:w-24">
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
                      const monthNum = addForm.joinDate.split('-')[1] || '01';
                      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
                      return monthNames[parseInt(monthNum) - 1] || 'January';
                    })()}
                    onValueChange={(month) => {
                      const [year, , day] = addForm.joinDate.split('-');
                      const monthMap: { [key: string]: string } = {
                        'January': '01', 'February': '02', 'March': '03', 'April': '04',
                        'May': '05', 'June': '06', 'July': '07', 'August': '08',
                        'September': '09', 'October': '10', 'November': '11', 'December': '12'
                      };
                      handleAddFormChange('joinDate', `${year || '2024'}-${monthMap[month] || '01'}-${day || '01'}`);
                    }}
                  >
                    <SelectTrigger className="w-28 sm:w-32">
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
                    value={(() => {
                      const dayNum = addForm.joinDate.split('-')[2] || '01';
                      return parseInt(dayNum).toString();
                    })()}
                    onValueChange={(day) => {
                      const [year, month] = addForm.joinDate.split('-');
                      handleAddFormChange('joinDate', `${year || '2024'}-${month || '01'}-${day.padStart(2, '0')}`);
                    }}
                  >
                    <SelectTrigger className="w-14 sm:w-16">
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
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </Label>
                <Select
                  value={addForm.position}
                  onValueChange={(value) => handleAddFormChange('position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super">Super</SelectItem>
                    <SelectItem value="Leader">Leader</SelectItem>
                    <SelectItem value="Account Department">Account Department</SelectItem>
                    <SelectItem value="Operation">Operation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Gender and Date of Birth Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </Label>
                <Select
                  value={addForm.gender}
                  onValueChange={(value) => handleAddFormChange('gender', value as 'Male' | 'Female')}
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
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </Label>
                <div className="flex gap-1 sm:gap-2">
                  <Select
                    value={addForm.dob.split('-')[0] || '2000'}
                    onValueChange={(year) => {
                      const [, month, day] = addForm.dob.split('-');
                      handleAddFormChange('dob', `${year}-${month || '01'}-${day || '01'}`);
                    }}
                  >
                    <SelectTrigger className="w-20 sm:w-24">
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
                      const monthNum = addForm.dob.split('-')[1] || '01';
                      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
                      return monthNames[parseInt(monthNum) - 1] || 'January';
                    })()}
                    onValueChange={(month) => {
                      const [year, , day] = addForm.dob.split('-');
                      const monthMap: { [key: string]: string } = {
                        'January': '01', 'February': '02', 'March': '03', 'April': '04',
                        'May': '05', 'June': '06', 'July': '07', 'August': '08',
                        'September': '09', 'October': '10', 'November': '11', 'December': '12'
                      };
                      handleAddFormChange('dob', `${year || '2000'}-${monthMap[month] || '01'}-${day || '01'}`);
                    }}
                  >
                    <SelectTrigger className="w-28 sm:w-32">
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
                    value={(() => {
                      const dayNum = addForm.dob.split('-')[2] || '01';
                      return parseInt(dayNum).toString();
                    })()}
                    onValueChange={(day) => {
                      const [year, month] = addForm.dob.split('-');
                      handleAddFormChange('dob', `${year || '2000'}-${month || '01'}-${day.padStart(2, '0')}`);
                    }}
                  >
                    <SelectTrigger className="w-14 sm:w-16">
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

            {/* Phone Number */}
            <div>
              <Label htmlFor="add-phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </Label>
              <Input
                id="add-phone"
                value={addForm.phone}
                onChange={(e) => handleAddFormChange('phone', e.target.value)}
                placeholder="09xxxxxxxxx"
                className="w-full"
              />
            </div>
          </div>

          {/* Footer with improved button styling */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={handleCancelAdd}
              className="w-full sm:w-auto px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAdd}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              Add Employee
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
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-gray-900 mb-2">Employee Details:</h4>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Name:</span> {deletingEmployee.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Position:</span> {deletingEmployee.position}
                </p>
                <p className="text-sm text-gray-600">
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

      {/* View Employee Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-lg">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b">
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">Employee Details</DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                View complete information about this employee.
              </DialogDescription>
            </div>
          </div>

          {viewingEmployee && (
            <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* Employee Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex-shrink-0">
                  <img
                    src={generateAvatarUrl(viewingEmployee.name, viewingEmployee.gender)}
                    alt={`${viewingEmployee.name} avatar`}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white shadow-md"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-full hidden items-center justify-center text-white font-bold text-lg sm:text-xl border-2 border-white shadow-md">
                    {viewingEmployee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{viewingEmployee.name}</h3>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getPositionColor(viewingEmployee.position)}`}>
                      {viewingEmployee.position}
                    </span>
                    <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getGenderColor(viewingEmployee.gender)}`}>
                      {viewingEmployee.gender}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Employee ID:</span> EMP-{viewingEmployee.id.toString().padStart(4, '0')}
                  </div>
                </div>
              </div>

              {/* Information Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Personal Information Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Personal Information
                  </h4>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Full Name</label>
                      <p className="text-gray-900 font-medium text-sm sm:text-base">{viewingEmployee.name}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Gender</label>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getGenderColor(viewingEmployee.gender)} self-start sm:self-center`}>
                        {viewingEmployee.gender}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Date of Birth</label>
                      <p className="text-gray-900 text-sm sm:text-base">{viewingEmployee.dob}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Phone Number</label>
                      <p className="text-gray-900 text-sm sm:text-base font-mono">{viewingEmployee.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Work Information Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Work Information
                  </h4>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Position</label>
                      <span className={`inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${getPositionColor(viewingEmployee.position)} self-start sm:self-center`}>
                        {viewingEmployee.position}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Join Date</label>
                      <p className="text-gray-900 text-sm sm:text-base">{viewingEmployee.joinDate}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Service Years</label>
                      <p className="text-gray-900 font-medium text-green-600 text-sm sm:text-base">{calculateServiceYears(viewingEmployee.joinDate)}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Employee ID</label>
                      <p className="text-gray-900 font-mono text-sm sm:text-base">EMP-{viewingEmployee.id.toString().padStart(4, '0')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(viewingEmployee.nrc || viewingEmployee.address) && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Additional Information</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {viewingEmployee.nrc && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">NRC Number</label>
                        <p className="text-gray-900">{viewingEmployee.nrc}</p>
                      </div>
                    )}

                    {viewingEmployee.address && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                        <p className="text-gray-900">{viewingEmployee.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={handleCloseView}
              className="w-full sm:w-auto px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                handleCloseView();
                if (viewingEmployee) {
                  handleEditEmployee(viewingEmployee);
                }
              }}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              Edit Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeLists;