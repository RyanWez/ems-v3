import React from 'react';

const AnnualLeave: React.FC = () => {
  const leaveRequests = [
    {
      id: 1,
      employee: 'Emily Chen',
      department: 'Engineering',
      leaveType: 'Annual Leave',
      startDate: '2025-09-25',
      endDate: '2025-09-30',
      days: 5,
      status: 'Pending',
      reason: 'Family vacation'
    },
    {
      id: 2,
      employee: 'Robert Kim',
      department: 'Sales',
      leaveType: 'Sick Leave',
      startDate: '2025-09-23',
      endDate: '2025-09-24',
      days: 2,
      status: 'Approved',
      reason: 'Medical appointment'
    },
    {
      id: 3,
      employee: 'Jessica Liu',
      department: 'Marketing',
      leaveType: 'Annual Leave',
      startDate: '2025-10-01',
      endDate: '2025-10-05',
      days: 4,
      status: 'Pending',
      reason: 'Personal reasons'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Annual Leave Management</h2>
      <p className="text-gray-600 mb-6">
        Manage employee leave requests, track leave balances, and approve or reject leave applications.
      </p>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Leave Requests</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            New Leave Request
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.employee}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.leaveType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>{request.startDate} to {request.endDate}</div>
                      <div className="text-xs">({request.days} days)</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {request.status === 'Pending' && (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                        <button className="text-red-600 hover:text-red-900">Reject</button>
                      </>
                    )}
                    <button className="text-blue-600 hover:text-blue-900 ml-4">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AnnualLeave;
