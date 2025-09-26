import React from 'react';

const EmployeeManagementIcon = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor" 
    className={`w-5 h-5 ${className}`.trim()}
    {...props}
  >
    {
      
    }
    <g transform="scale(0.95) translate(0.6, 0.6)">
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M16.5 12A2.5 2.5 0 0019 9.5a2.5 2.5 0 00-2.5-2.5A2.5 2.5 0 0014 9.5a2.5 2.5 0 002.5 2.5zM9 11a3 3 0 003-3 3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3zm7.5 2.25c-1.83 0-5.5.92-5.5 2.75V19h8.18c-.1-.33-.18-.67-.18-1.02 0-1.4.67-2.67 1.75-3.5C20.24 13.88 18.5 13.25 16.5 13.25zM9 13c-2.67 0-8 1.34-8 4v3h9.33c-.33-.67-.53-1.4-.6-2.18-.07-.75.03-1.5.25-2.2C9.5 13.68 9.25 13.5 9 13z" />
    </g>
  </svg>
);

export default EmployeeManagementIcon;