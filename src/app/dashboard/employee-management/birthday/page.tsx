'use client';
import React, { useState } from 'react';
import { useEmployees } from '../lists/hooks/useEmployees';
import { 
  getTodayBirthdays, 
  getUpcomingBirthdays, 
  getBirthdaysByMonth,
  formatMonthlyBirthdayDate
} from './utils/birthdayUtils';

const EmployeeBirthday: React.FC = () => {
  const { employees } = useEmployees();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  const todayBirthdays = getTodayBirthdays(employees);
  const upcomingBirthdays = getUpcomingBirthdays(employees);
  const birthdaysByMonth = getBirthdaysByMonth(employees);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Employee Birthdays</h2>
      <p className="text-gray-600 mb-6">
        Track and celebrate employee birthdays. Today's birthdays and upcoming birthdays within 15 days are highlighted for easy planning.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Birthdays */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-pink-800">🎉 Today's Birthdays</h3>
            {todayBirthdays.length > 5 && (
              <span className="text-xs bg-pink-200 text-pink-800 px-2 py-1 rounded-full">
                {todayBirthdays.length} total
              </span>
            )}
          </div>
          <div className={`space-y-3 ${todayBirthdays.length > 5 ? 'max-h-80 overflow-y-auto' : ''}`}>
            {todayBirthdays.length > 0 ? (
              todayBirthdays.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                  <div>
                    <p className="font-medium text-gray-800">{person.name}</p>
                    <p className="text-sm text-gray-600">{person.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-pink-600">{person.age}</p>
                    <p className="text-xs text-gray-500">years old</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No birthdays today</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Birthdays */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-800">📅 Upcoming Birthdays</h3>
            {upcomingBirthdays.length > 5 && (
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                {upcomingBirthdays.length} total
              </span>
            )}
          </div>
          <div className={`space-y-3 ${upcomingBirthdays.length > 5 ? 'max-h-80 overflow-y-auto' : ''}`}>
            {upcomingBirthdays.length > 0 ? (
              upcomingBirthdays.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                  <div>
                    <p className="font-medium text-gray-800">{person.name}</p>
                    <p className="text-sm text-gray-600">{person.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">{person.birthdayDate}</p>
                    <p className="text-xs text-gray-500">{person.age} years</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No upcoming birthdays</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Birthday Calendar */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-6">📅 Birthday Calendar by Month</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Month Selector */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-4 shadow-sm max-h-96 overflow-y-auto">
              <h4 className="font-medium text-gray-800 mb-3">Select Month</h4>
              <div className="space-y-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(index)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedMonth === index
                        ? 'bg-green-100 text-green-800 font-medium'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{month}</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                        {birthdaysByMonth[index].employees.length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Birthday List for Selected Month */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-800 mb-4">
                {months[selectedMonth]} Birthdays ({birthdaysByMonth[selectedMonth].employees.length})
              </h4>
              
              {birthdaysByMonth[selectedMonth].employees.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {birthdaysByMonth[selectedMonth].employees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-400 rounded-full flex items-center justify-center text-white font-bold">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{employee.name}</p>
                          <p className="text-sm text-gray-600">{employee.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">{employee.birthdayDate}</p>
                        <p className="text-xs text-gray-500">{employee.age} years old</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No birthdays in {months[selectedMonth]}</p>
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
