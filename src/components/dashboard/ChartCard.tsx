import React, { useState } from 'react';

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
                    className={`h-3 rounded-full transition-all duration-500 ease-out transform ${
                      hoveredIndex === index ? 'scale-y-110' : ''
                    }`}
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color,
                      boxShadow: hoveredIndex === index ? `0 0 10px ${item.color}40` : 'none'
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right">
                <span className={`text-sm font-medium transition-all duration-200 ${
                  hoveredIndex === index ? 'text-gray-900 scale-105' : 'text-gray-800'
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

  // Pie chart representation with animations
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
                  className={`w-3 h-3 rounded-full mr-2 transition-all duration-200 ${
                    hoveredIndex === index ? 'scale-125 shadow-lg' : ''
                  }`}
                  style={{ 
                    backgroundColor: item.color,
                    boxShadow: hoveredIndex === index ? `0 0 8px ${item.color}60` : 'none'
                  }}
                />
                <span className={`text-sm text-gray-600 flex-1 transition-colors duration-200 ${
                  hoveredIndex === index ? 'text-gray-800 font-medium' : ''
                }`}>
                  {item.label}
                </span>
                <span className={`text-sm font-medium text-gray-800 transition-all duration-200 ${
                  hoveredIndex === index ? 'scale-105' : ''
                }`}>
                  {item.value} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="ml-6">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {data.reduce((acc, item, index) => {
                const startAngle = acc.currentAngle;
                const angle = (item.percentage / 100) * 360;
                const endAngle = startAngle + angle;
                
                const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                
                const largeArcFlag = angle > 180 ? 1 : 0;
                
                const pathData = [
                  `M 50 50`,
                  `L ${x1} ${y1}`,
                  `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                acc.paths.push(
                  <path
                    key={index}
                    d={pathData}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="1"
                    className={`transition-all duration-300 cursor-pointer ${
                      hoveredIndex === index ? 'opacity-90 drop-shadow-lg' : 'opacity-100'
                    }`}
                    style={{
                      filter: hoveredIndex === index ? `drop-shadow(0 0 6px ${item.color}60)` : 'none',
                      transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                      transformOrigin: '50px 50px'
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                );
                
                acc.currentAngle = endAngle;
                return acc;
              }, { paths: [] as React.ReactNode[], currentAngle: 0 }).paths}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};