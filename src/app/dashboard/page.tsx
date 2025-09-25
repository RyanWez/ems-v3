import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h2>
      <p className="text-gray-600 mb-6">
        Welcome to your Employee Management System dashboard. Here you can manage employees, track birthdays, and handle leave requests.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600">150</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Today's Birthdays</h3>
          <p className="text-3xl font-bold text-green-600">3</p>
        </div>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Pending Leave Requests</h3>
          <p className="text-3xl font-bold text-yellow-600">7</p>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
