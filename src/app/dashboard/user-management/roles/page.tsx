import React from 'react';

const UserRoles: React.FC = () => {
  const roles = [
    {
      id: 1,
      name: 'Administrator',
      description: 'Full system access with all permissions',
      permissions: ['Read', 'Write', 'Delete', 'User Management', 'System Settings'],
      userCount: 2,
      color: 'purple'
    },
    {
      id: 2,
      name: 'Manager',
      description: 'Manage team members and view reports',
      permissions: ['Read', 'Write', 'Team Management', 'Reports'],
      userCount: 8,
      color: 'blue'
    },
    {
      id: 3,
      name: 'Employee',
      description: 'Basic access for daily tasks',
      permissions: ['Read', 'Write Personal'],
      userCount: 125,
      color: 'green'
    },
    {
      id: 4,
      name: 'Contractor',
      description: 'Limited access for external contractors',
      permissions: ['Read Limited'],
      userCount: 15,
      color: 'yellow'
    }
  ];

  const getRoleColor = (color: string) => {
    switch (color) {
      case 'purple': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'green': return 'bg-green-100 text-green-800 border-green-200';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">User Roles</h2>
      <p className="text-gray-600 mb-6">
        Manage user roles and permissions to control access to different system features.
      </p>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Role Management</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Create New Role
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div key={role.id} className={`border rounded-lg p-6 ${getRoleColor(role.color)}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold">{role.name}</h4>
                  <p className="text-sm opacity-75">{role.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">{role.userCount}</span>
                  <p className="text-xs">users</p>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="font-medium mb-2">Permissions:</h5>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-white rounded-full border">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="text-sm bg-white px-3 py-1 rounded border hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <button className="text-sm text-red-600 px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default UserRoles;
