'use client';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Sector, Tooltip, ResponsiveContainer } from 'recharts';

// Data structure interfaces
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

// Custom Active Shape for Pie Chart Hover Effect
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      {/* The main sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6} // Makes the hovered slice pop out
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: `drop-shadow(0 4px 10px ${fill}90)`, // Softer shadow
          cursor: 'pointer',
        }}
      />
      {/* You can add connector lines and text here if needed, but we use a tooltip instead */}
    </g>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border"
        style={{ borderColor: data.fill }}
      >
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p style={{ color: data.fill }}>
          <span className="font-bold">{data.value}</span>
          <span className="text-xs ml-1">({(data.percent * 100).toFixed(1)}%)</span>
        </p>
      </div>
    );
  }
  return null;
};


export const ChartCard: React.FC<ChartCardProps> = ({ title, data, type }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [data]);

  // Bar Chart Implementation
  if (type === 'bar') {
    const maxValue = Math.max(...data.map(item => item.value));
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
                    className={`h-3 rounded-full transition-all duration-1000 ease-out ${hoveredIndex === index ? 'scale-y-110' : ''
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

  // --- Refined Pie Chart Implementation ---
  const chartData = data.map(item => ({
    name: item.label,
    value: item.value,
    fill: item.color,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Pie Chart */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                isAnimationActive={true}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke={entry.fill}
                    strokeWidth={hoveredIndex === index ? 1 : 0}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center space-y-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 cursor-pointer p-2 rounded-md transition-colors duration-200 hover:bg-gray-50"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-4 h-4 rounded-full transition-all duration-300 flex-shrink-0"
                style={{
                  backgroundColor: item.color,
                  transform: hoveredIndex === index ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: hoveredIndex === index ? `0 0 12px ${item.color}80` : 'none'
                }}
              />
              <div className="flex justify-between items-baseline w-full">
                <span className={`text-sm font-medium transition-colors duration-200 ${hoveredIndex === index ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                  {item.label}
                </span>
                <span className={`text-xs font-semibold tabular-nums ${hoveredIndex === index ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};