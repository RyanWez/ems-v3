import React from 'react';

const EmployeeBirthday: React.FC = () => {
  const todayBirthdays = [
    { name: 'Alice Cooper', department: 'Marketing', age: 28 },
    { name: 'David Wilson', department: 'Sales', age: 32 },
    { name: 'Sarah Brown', department: 'HR', age: 26 }
  ];

  const upcomingBirthdays = [
    { name: 'Mike Johnson', department: 'Engineering', date: 'Sep 25', age: 29 },
    { name: 'Lisa Davis', department: 'Finance', date: 'Sep 28', age: 31 },
    { name: 'Tom Anderson', department: 'Operations', date: 'Oct 2', age: 35 }
  ];

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Employee Birthdays</h2>
      <p className="text-gray-600 mb-6">
        Track and celebrate employee birthdays. Never miss an important date again!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Birthdays */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-pink-800 mb-4">🎉 Today's Birthdays</h3>
          <div className="space-y-3">
            {todayBirthdays.map((person, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                <div>
                  <p className="font-medium text-gray-800">{person.name}</p>
                  <p className="text-sm text-gray-600">{person.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-pink-600">{person.age}</p>
                  <p className="text-xs text-gray-500">years old</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Birthdays */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">📅 Upcoming Birthdays</h3>
          <div className="space-y-3">
            {upcomingBirthdays.map((person, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                <div>
                  <p className="font-medium text-gray-800">{person.name}</p>
                  <p className="text-sm text-gray-600">{person.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">{person.date}</p>
                  <p className="text-xs text-gray-500">{person.age} years</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default EmployeeBirthday;
