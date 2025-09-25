
import React from 'react';

interface HamburgerProps {
  isActive: boolean;
  onClick: () => void;
}

const Hamburger: React.FC<HamburgerProps> = ({ isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-12 h-12 flex flex-col items-center justify-center rounded-xl bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm hover:shadow-md"
      aria-label={isActive ? 'Close menu' : 'Open menu'}
    >
      {/* Animated hamburger lines */}
      <span
        className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ease-in-out ${
          isActive ? 'rotate-45 translate-y-1.5' : ''
        }`}
      ></span>
      <span
        className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ease-in-out mt-1 ${
          isActive ? 'opacity-0 scale-0' : ''
        }`}
      ></span>
      <span
        className={`block w-5 h-0.5 bg-gray-600 transition-all duration-300 ease-in-out mt-1 ${
          isActive ? '-rotate-45 -translate-y-1.5' : ''
        }`}
      ></span>

      {/* Enhanced indicator dot */}
      <div
        className={`indicator-dot absolute -top-1 -right-1 w-4 h-4 rounded-full transition-all duration-300 border-2 border-white z-10 shadow-lg ${
          isActive ? 'bg-red-500 scale-125 active' : 'bg-green-500 scale-100'
        }`}
      ></div>
    </button>
  );
};

export default Hamburger;
