'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';

interface Technology {
  name: string;
  description: string;
}

const technologies: Technology[] = [
  { name: 'Next.js', description: 'React Framework' },
  { name: 'React', description: 'UI Library' },
  { name: 'TypeScript', description: 'Type Safety' },
  { name: 'Tailwind CSS', description: 'Styling' },
  { name: 'Prisma', description: 'Database ORM' },
  { name: 'SQLite', description: 'Database' },
];

const benefits = [
  'Secure Authentication',
  'Fast Performance',
  'Data Privacy',
  'Regular Updates',
];

export const TechStackSection: React.FC = () => {
  const router = useRouter();

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12">
          {/* Section Header */}
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Enterprise-grade, secure, and reliable
            </p>
          </div>

          {/* Technology Badges */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in-delay">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl px-6 py-4 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {tech.name}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {tech.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-900 font-semibold">{benefit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="pt-12 animate-fade-in-delay">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 shadow-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Access your employee management dashboard now
              </p>
              <button
                onClick={() => router.push('/login')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Login to Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
