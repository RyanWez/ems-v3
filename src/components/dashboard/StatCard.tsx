import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo';
  subtitle?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    value: 'text-blue-600',
    icon: 'text-blue-500',
    hover: 'hover:bg-blue-100',
    shadow: 'hover:shadow-blue-200'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-800',
    value: 'text-green-600',
    icon: 'text-green-500',
    hover: 'hover:bg-green-100',
    shadow: 'hover:shadow-green-200'
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    value: 'text-yellow-600',
    icon: 'text-yellow-500',
    hover: 'hover:bg-yellow-100',
    shadow: 'hover:shadow-yellow-200'
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    value: 'text-purple-600',
    icon: 'text-purple-500',
    hover: 'hover:bg-purple-100',
    shadow: 'hover:shadow-purple-200'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    value: 'text-red-600',
    icon: 'text-red-500',
    hover: 'hover:bg-red-100',
    shadow: 'hover:shadow-red-200'
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    value: 'text-indigo-600',
    icon: 'text-indigo-500',
    hover: 'hover:bg-indigo-100',
    shadow: 'hover:shadow-indigo-200'
  }
};

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  subtitle 
}) => {
  const classes = colorClasses[color];
  
  return (
    <div className={`${classes.bg} ${classes.hover} p-6 rounded-lg border border-gray-100 
                    transition-all duration-300 ease-in-out transform hover:scale-105 
                    hover:shadow-lg ${classes.shadow} cursor-pointer group`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${classes.text} mb-1 transition-colors duration-200`}>
            {title}
          </h3>
          <p className={`text-2xl font-bold ${classes.value} transition-all duration-300 
                        group-hover:scale-110 transform-gpu`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs ${classes.text} mt-1 opacity-75 transition-opacity duration-200 
                          group-hover:opacity-100`}>
              {subtitle}
            </p>
          )}
        </div>
        <Icon className={`w-8 h-8 ${classes.icon} transition-all duration-300 
                         group-hover:scale-110 group-hover:rotate-6 transform-gpu`} />
      </div>
    </div>
  );
};