'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, Zap, Lock } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Employee Management
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                System
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Modern & Secure Workforce Solution
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Streamline your employee records and management with our
            comprehensive internal system. Built for efficiency, security, and
            ease of use.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Secure</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Fast</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Lock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Private</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={() => router.push('/login')}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Login to Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Dashboard Preview */}
          <div className="pt-16 animate-fade-in-delay">
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 text-center text-gray-400 text-sm font-mono">
                    Employee Management System
                  </div>
                </div>
                <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600 mb-1">Total Employees</div>
                      <div className="text-3xl font-bold text-blue-600">248</div>
                      <div className="text-xs text-green-600 mt-1">↑ 12% this month</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600 mb-1">Departments</div>
                      <div className="text-3xl font-bold text-indigo-600">12</div>
                      <div className="text-xs text-gray-500 mt-1">Across organization</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="text-sm text-gray-600 mb-1">Active Today</div>
                      <div className="text-3xl font-bold text-purple-600">186</div>
                      <div className="text-xs text-blue-600 mt-1">75% attendance</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-700">Employee Growth</h3>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      </div>
                    </div>
                    <div className="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Simulated chart bars */}
                      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around px-8 pb-6 gap-2">
                        <div className="w-full h-20 bg-blue-400/50 rounded-t"></div>
                        <div className="w-full h-32 bg-blue-500/50 rounded-t"></div>
                        <div className="w-full h-24 bg-indigo-400/50 rounded-t"></div>
                        <div className="w-full h-36 bg-indigo-500/50 rounded-t"></div>
                        <div className="w-full h-28 bg-purple-400/50 rounded-t"></div>
                        <div className="w-full h-40 bg-purple-500/50 rounded-t"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
