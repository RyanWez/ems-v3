'use client';
import React, { useState, useEffect } from 'react';
import { Pie, PieChart, Cell } from 'recharts';

interface ChartData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface ChartCardProps {
  title: string;
  data: ChartData[];
  type: 'bar' | 'pie';
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, data, type }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(false);
    setAnimationKey(prev => prev + 1);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [data]);

  if (type === 'bar') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="w-24 text-sm text-gray-600 truncate transition-colors duration-200 group-hover:text-gray-800">
                {item.label}
              </div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ease-out transform ${hoveredIndex === index ? 'scale-y-110' : ''
                      }`}
                    style={{
                      width: isVisible ? `${(item.value / maxValue) * 100}%` : '0%',
                      backgroundColor: item.color,
                      boxShadow: hoveredIndex === index ? `0 0 10px ${item.color}40` : 'none',
                      transitionDelay: `${index * 100}ms`
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right">
                <span className={`text-sm font-medium transition-all duration-200 ${hoveredIndex === index ? 'text-gray-900 scale-105' : 'text-gray-800'
                  }`}>
                  {item.value}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Pie chart with Recharts and smooth animations
  const chartData = data.map(item => ({
    name: item.label,
    value: item.value,
    fill: item.color
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="space-y-2">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex items-center group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-2 transition-all duration-200 ${hoveredIndex === index ? 'scale-125 shadow-lg' : ''
                    }`}
                  style={{
                    backgroundColor: item.color,
                    boxShadow: hoveredIndex === index ? `0 0 8px ${item.color}60` : 'none'
                  }}
                />
                <span className={`text-sm text-gray-600 flex-1 transition-colors duration-200 ${hoveredIndex === index ? 'text-gray-800 font-medium' : ''
                  }`}>
                  {item.label}
                </span>
                <span className={`text-sm font-medium text-gray-800 transition-all duration-200 ${hoveredIndex === index ? 'scale-105' : ''
                  }`}>
                  {item.value} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="ml-6">
          <div className="relative w-32 h-32">
            <PieChart width={128} height={128} key={animationKey}>
              <Pie
                data={chartData}
                cx={64}
                cy={64}
                innerRadius={0}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke="white"
                    strokeWidth={2}
                    className={`transition-all duration-300 cursor-pointer ${hoveredIndex === index ? 'opacity-80' : 'opacity-100'
                      }`}
                    style={{
                      filter: hoveredIndex === index ? `drop-shadow(0 0 8px ${entry.fill}80)` : 'none',
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};