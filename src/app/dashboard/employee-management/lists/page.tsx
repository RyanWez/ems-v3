
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


type Employee = {
  id: number;
  name: string;
  joinDate: string;
  position: string;
  gender: 'Male' | 'Female';
  dob: string;
  phone: string;
};

const employees: Employee[] = [
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('All Positions');
  const [selectedGender, setSelectedGender] = useState('All Genders');
  const [selectedServiceYears, setSelectedServiceYears] = useState('Any Service Years');
  const [showFullTable, setShowFullTable] = useState(true);

  // Detect screen size changes and update table visibility
  useEffect(() => {
    const checkScreenSize = () => {
      setShowFullTable(window.innerWidth >= 768); // md breakpoint
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
    <div className="bg-background p-6 md:p-8 rounded-lg shadow-lg w-full max-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Employee List</h2>
          <p className="text-muted-foreground mt-1">Manage all employees in your organization.</p>
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
      <div className="mb-6 p-4 bg-muted/20 rounded-lg border border-border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Search Bar */}
          <div className="flex-1 min-w-0">
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                id="search"
                placeholder="Search by name, position, phone, NRC..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Position Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-foreground mb-2">Position</label>
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
                    className="cursor-pointer"
                  >
                    {position}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Gender Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
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
                    className="cursor-pointer"
                  >
                    {gender}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Service Years Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-foreground mb-2">Service Years</label>
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
                    className="cursor-pointer"
                  >
                    {years}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
        <table className="w-full bg-background text-xs table-auto"
          style={{
            minWidth: '800px',
            width: '100%',
            tableLayout: 'auto'
          }}>
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              {showFullTable && (
                <th
                  className="px-4 py-3 font-semibold text-xs sticky left-0 z-50 border-r border-border"
                  style={{
                    width: '18%',
                    minWidth: '180px',
                    backgroundColor: 'rgb(248 250 252)',
                    boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                  }}
                >
                  NAME
                </th>
              )}
              <th className="px-4 py-3 font-semibold text-xs border-b border-border" style={{ width: '10%', minWidth: '100px', backgroundColor: 'rgb(248 250 252)' }}>JOIN DATE</th>
              <th className="px-4 py-3 font-semibold text-xs border-b border-border" style={{ width: '12%', minWidth: '120px', backgroundColor: 'rgb(248 250 252)' }}>SERVICE YEARS</th>
              <th className="px-4 py-3 font-semibold text-xs border-b border-border" style={{ width: '16%', minWidth: '160px', backgroundColor: 'rgb(248 250 252)' }}>POSITION</th>
              <th className="px-4 py-3 font-semibold text-xs border-b border-border" style={{ width: '8%', minWidth: '80px', backgroundColor: 'rgb(248 250 252)' }}>GENDER</th>
              <th className="px-4 py-3 font-semibold text-xs border-b border-border" style={{ width: '10%', minWidth: '100px', backgroundColor: 'rgb(248 250 252)' }}>DOB</th>
              <th className="px-4 py-3 font-semibold text-xs border-b border-border" style={{ width: '12%', minWidth: '120px', backgroundColor: 'rgb(248 250 252)' }}>PHONE NO.</th>
              {showFullTable && (
                <th
                  className="px-4 py-3 font-semibold text-xs text-center sticky right-0 z-50 border-l border-border"
                  style={{
                    width: '14%',
                    minWidth: '140px',
                    backgroundColor: 'rgb(248 250 252)',
                    boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
                  }}
                >
                  ACTION
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-muted/30 transition-colors">
                {showFullTable && (
                  <td
                    className="px-4 py-3 font-medium text-foreground sticky left-0 z-40 border-r border-border"
                    style={{
                      width: '18%',
                      minWidth: '180px',
                      backgroundColor: 'rgb(248 250 252)',
                      boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
                    }}
                    title={employee.name}
                  >
                    <div className="truncate">{employee.name}</div>
                  </td>
                )}
                <td className="px-4 py-3 text-muted-foreground" style={{ width: '10%', minWidth: '100px' }}>{employee.joinDate}</td>
                <td className="px-4 py-3 text-muted-foreground" style={{ width: '12%', minWidth: '120px' }}>{calculateServiceYears(employee.joinDate)}</td>
                <td className="px-4 py-3" style={{ width: '16%', minWidth: '160px' }}>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPositionColor(employee.position)} block text-center`}>
                    {employee.position}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ width: '8%', minWidth: '80px' }}>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGenderColor(employee.gender)} block text-center`}>
                    {employee.gender}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground" style={{ width: '10%', minWidth: '100px' }}>{employee.dob}</td>
                <td className="px-4 py-3 text-muted-foreground" style={{ width: '12%', minWidth: '120px' }}>{employee.phone}</td>
                {showFullTable && (
                  <td
                    className="px-4 py-3 sticky right-0 z-40 border-l border-border"
                    style={{
                      width: '14%',
                      minWidth: '140px',
                      backgroundColor: 'rgb(248 250 252)',
                      boxShadow: '-2px 0 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <button className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => toast.info(`Viewing employee: ${employee.name}`)}>
                        <Eye size={22} />
                      </button>
                      <button className="p-2.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" onClick={() => toast.info(`Editing employee: ${employee.name}`)}>
                        <Pencil size={22} />
                      </button>
                      <button className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => toast.error(`Failed to delete employee: ${employee.name}`)}>
                        <Trash2 size={22} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-2 py-3 bg-muted/20 rounded-lg">
        <div className="mb-3 sm:mb-0 text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{paginatedEmployees.length}</span> of{' '}
          <span className="font-semibold text-foreground">{filteredEmployees.length}</span> employees.
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="rows-per-page" className="text-sm text-muted-foreground">Rows per page:</label>
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
                    className="cursor-pointer"
                  >
                    {value}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{currentPage}</span> of <span className="font-semibold text-foreground">{totalPages}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
              aria-label="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLists;