'use client';

import React from 'react';
import {
  BarChart3,
  Users,
  Shield,
  Lock,
  Smartphone,
  FileSpreadsheet,
} from 'lucide-react';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: BarChart3,
    title: 'Dashboard Analytics',
    description: 'Real-time employee statistics, visual charts and graphs, department breakdown',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Users,
    title: 'Employee Management',
    description: 'Add, edit, delete records with advanced filtering, search, and service year tracking',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description: 'Administrator, Manager, Employee roles with granular permission control',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Lock,
    title: 'Data Security',
    description: 'JWT authentication, encrypted passwords, and secure session management',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Works on all devices with touch-friendly interface and PWA support',
    color: 'from-indigo-600 to-purple-600',
  },
  {
    icon: FileSpreadsheet,
    title: 'Reports & Export',
    description: 'Excel export capability, employee reports, and data backup features',
    color: 'from-purple-600 to-pink-600',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            System Capabilities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your workforce efficiently
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Gradient border on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`}></div>
              
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover indicator */}
              <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
