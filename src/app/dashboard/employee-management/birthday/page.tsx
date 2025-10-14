'use client';
import React, { useState } from 'react';
import { useEmployees } from '../lists/hooks/useEmployees';
import {
  getTodayBirthdays,
  getUpcomingBirthdays,
  getBirthdaysByMonth,
  formatMonthlyBirthdayDate
} from './utils/birthdayUtils';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';

const EmployeeBirthday: React.FC = () => {
  const { employees, isLoading, error } = useEmployees();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<{ employee: any, month: string, monthIndex: number } | null>(null);

  const todayBirthdays = getTodayBirthdays(employees);
  const upcomingBirthdays = getUpcomingBirthdays(employees);
  const birthdaysByMonth = getBirthdaysByMonth(employees);

  // Search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResult(null);
      return;
    }

    // Search for employee by name
    for (let monthIndex = 0; monthIndex < birthdaysByMonth.length; monthIndex++) {
      const monthData = birthdaysByMonth[monthIndex];
      if (!monthData) continue;

      const foundEmployee = monthData.employees.find(emp =>
        emp.name.toLowerCase().includes(term.toLowerCase())
      );

      if (foundEmployee) {
        setSearchResult({
          employee: foundEmployee,
          month: monthData.month,
          monthIndex: monthIndex
        });
        setSelectedMonth(monthIndex); // Auto-select the month
        return;
      }
    }

    setSearchResult(null);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Show loading spinner while data is loading
  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Employee Birthdays</h2>
        <p className="text-gray-600 mb-6">
          Track and celebrate employee birthdays. Today&apos;s birthdays and upcoming birthdays within 15 days are highlighted for easy planning.
        </p>

        {/* Loading State */}
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner
            size="lg"
            text="Loading birthday data..."
            className="text-blue-600"
          />
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Employee Birthdays</h2>
        <p className="text-gray-600 mb-6">
          Track and celebrate employee birthdays. Today&apos;s birthdays and upcoming birthdays within 15 days are highlighted for easy planning.
        </p>

        {/* Error State */}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">⚠️ Error Loading Birthday Data</div>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800">Employee Birthdays</h2>
      <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
        Track and celebrate employee birthdays. Today&apos;s birthdays and upcoming birthdays within 15 days are highlighted for easy planning.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Today's Birthdays */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 sm:p-6 rounded-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-pink-800">🎉 Today&apos;s Birthdays</h3>
            {todayBirthdays.length > 5 && (
              <span className="text-xs bg-pink-200 text-pink-800 px-2 py-1 rounded-full">
                {todayBirthdays.length}
              </span>
            )}
          </div>
          <div className={`space-y-2 sm:space-y-3 ${todayBirthdays.length > 5 ? 'max-h-64 sm:max-h-80 overflow-y-auto' : ''}`}>
            {todayBirthdays.length > 0 ? (
              todayBirthdays.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-white rounded-md shadow-sm">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{person.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{person.position}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base sm:text-lg font-bold text-pink-600">{person.age}</p>
                    <p className="text-xs text-gray-500 whitespace-nowrap">years old</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <p className="text-sm">No birthdays today</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Birthdays */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-blue-800">📅 Upcoming Birthdays</h3>
            {upcomingBirthdays.length > 5 && (
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                {upcomingBirthdays.length}
              </span>
            )}
          </div>
          <div className={`space-y-2 sm:space-y-3 ${upcomingBirthdays.length > 5 ? 'max-h-64 sm:max-h-80 overflow-y-auto' : ''}`}>
            {upcomingBirthdays.length > 0 ? (
              upcomingBirthdays.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-2.5 sm:p-3 bg-white rounded-md shadow-sm">
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{person.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{person.position}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-bold text-blue-600 whitespace-nowrap">{person.birthdayDate}</p>
                    <p className="text-xs text-gray-500">{person.age} years</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <p className="text-sm">No upcoming birthdays</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Birthday Calendar */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-green-50 to-teal-50 p-4 sm:p-6 rounded-lg">
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-green-800">📅 Birthday Calendar by Month</h3>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSearchResult(null);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Search Result Display */}
        {searchResult && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-yellow-800">
                <span className="font-medium">{searchResult.employee.name}</span> has birthday in <span className="font-medium">{searchResult.month}</span> ({searchResult.employee.birthdayDate})
              </p>
            </div>
          </div>
        )}

        {searchTerm && !searchResult && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm text-red-800">
                No employee found with name &quot;<span className="font-medium">{searchTerm}</span>&quot;
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Month Selector */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm max-h-64 sm:max-h-96 overflow-y-auto">
              <h4 className="font-medium text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">Select Month</h4>
              <div className="space-y-1.5 sm:space-y-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(index)}
                    className={`w-full text-left px-2.5 sm:px-3 py-2 rounded-md transition-colors text-sm ${selectedMonth === index
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{month}</span>
                      <span className="text-xs bg-gray-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ml-2 flex-shrink-0">
                        {birthdaysByMonth[index]?.employees.length || 0}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Birthday List for Selected Month */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                {months[selectedMonth]} Birthdays ({birthdaysByMonth[selectedMonth]?.employees.length || 0})
              </h4>

              {(birthdaysByMonth[selectedMonth]?.employees || []).length > 0 ? (
                <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
                  {(birthdaysByMonth[selectedMonth]?.employees || []).map((employee) => (
                    <div
                      key={employee.id}
                      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-md transition-colors ${searchResult && searchResult.employee.id === employee.id
                          ? 'bg-yellow-100 border-2 border-yellow-300 shadow-md'
                          : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1 mr-2">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0 ${searchResult && searchResult.employee.id === employee.id
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                            : 'bg-gradient-to-r from-green-400 to-teal-400'
                          }`}>
                          {employee.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`font-medium text-sm sm:text-base truncate ${searchResult && searchResult.employee.id === employee.id
                              ? 'text-yellow-900'
                              : 'text-gray-800'
                            }`}>
                            {employee.name}
                            {searchResult && searchResult.employee.id === employee.id && (
                              <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded-full">
                                Found
                              </span>
                            )}
                          </p>
                          <p className={`text-xs sm:text-sm truncate ${searchResult && searchResult.employee.id === employee.id
                              ? 'text-yellow-700'
                              : 'text-gray-600'
                            }`}>
                            {employee.position}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-xs sm:text-sm font-bold whitespace-nowrap ${searchResult && searchResult.employee.id === employee.id
                            ? 'text-yellow-700'
                            : 'text-green-600'
                          }`}>
                          {employee.birthdayDate}
                        </p>
                        <p className="text-xs text-gray-500 whitespace-nowrap">{employee.age} yrs</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <p className="text-sm">No birthdays in {months[selectedMonth]}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EmployeeBirthday;
