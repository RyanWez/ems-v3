'use client';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Sector, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';

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
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: `drop-shadow(0 4px 10px ${fill}90)`,
          cursor: 'pointer',
        }}
      />
    </g>
  );
};

// Custom Animated Bar Shape
const AnimatedBar = (props: any) => {
  const { fill, x, y, width, height, index } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState(0);
  const [animatedY, setAnimatedY] = useState(y + height);

  useEffect(() => {
    const delay = index * 100; // Stagger animation
    const timer = setTimeout(() => {
      setAnimatedHeight(height);
      setAnimatedY(y);
    }, delay);

    return () => clearTimeout(timer);
  }, [height, y, index]);

  return (
    <g>
      {/* Glow effect on hover */}
      {isHovered && (
        <rect
          x={x - 2}
          y={animatedY - 2}
          width={width + 4}
          height={animatedHeight + 4}
          fill={fill}
          rx={10}
          style={{
            opacity: 0.2,
            filter: `blur(10px)`,
          }}
        />
      )}
      {/* Main bar */}
      <rect
        x={x}
        y={animatedY}
        width={width}
        height={animatedHeight}
        fill={fill}
        rx={8}
        style={{
          filter: isHovered ? `drop-shadow(0 8px 20px ${fill}70)` : `drop-shadow(0 2px 4px ${fill}30)`,
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), y 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: 'pointer',
          transformOrigin: 'bottom',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {/* Shine effect */}
      <defs>
        <linearGradient id={`shine-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={animatedY}
        width={width}
        height={animatedHeight}
        fill={`url(#shine-${index})`}
        rx={8}
        style={{
          pointerEvents: 'none',
        }}
      />
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

  // Enhanced Bar Chart Implementation with Advanced Animations
  if (type === 'bar') {
    const chartData = data.map((item, index) => ({
      name: item.label,
      value: item.value,
      fill: item.color,
      index,
    }));

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={{ stroke: '#e5e7eb' }}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)', radius: 8 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border-2" style={{ borderColor: payload[0].payload.fill }}>
                        <p className="font-semibold text-gray-800 text-sm">{payload[0].payload.name}</p>
                        <p style={{ color: payload[0].payload.fill }} className="text-lg font-bold mt-1">
                          {payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                isAnimationActive={false}
                shape={(props: any) => <AnimatedBar {...props} />}
              />
            </BarChart>
          </ResponsiveContainer>
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
                onMouseEnter={(_: any, index: number) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                isAnimationActive={true}
                animationDuration={1000}
                animationBegin={0}
                animationEasing="ease-out"
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