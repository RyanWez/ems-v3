"use client";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Sector,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

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
  type: "bar" | "pie";
}

// Custom Active Shape for Pie Chart Hover Effect with Enhanced Glow
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <g>
      {/* Outer glow effect */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 12}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          opacity: 0.3,
          filter: `blur(8px)`,
        }}
      />
      {/* Main sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: `drop-shadow(0 6px 20px ${fill}90)`,
          cursor: "pointer",
        }}
      />
      {/* Shine gradient overlay */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="url(#pieShine)"
        style={{
          cursor: "pointer",
          pointerEvents: "none",
        }}
      />
    </g>
  );
};

// Simple Bar Shape with Hover Effect
const SimpleBar = (props: any) => {
  const { fill, x, y, width, height } = props;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <g>
      {/* Glow effect on hover */}
      {isHovered && (
        <rect
          x={x - 2}
          y={y - 2}
          width={width + 4}
          height={height + 4}
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
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={8}
        style={{
          filter: isHovered
            ? `drop-shadow(0 8px 20px ${fill}70)`
            : `drop-shadow(0 2px 4px ${fill}30)`,
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.3s ease",
          cursor: "pointer",
          transformOrigin: "bottom",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {/* Shine effect */}
      <defs>
        <linearGradient id={`shine-bar`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={`url(#shine-bar)`}
        rx={8}
        style={{
          pointerEvents: "none",
        }}
      />
    </g>
  );
};

// Custom Tooltip Component with Enhanced Positioning
const CustomTooltip = ({ active, payload, coordinate }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Calculate percentage from value and total
    const total = payload[0].payload.value;
    const percentage = payload[0].percent
      ? (payload[0].percent * 100).toFixed(1)
      : (
          (total /
            payload.reduce((sum: number, item: any) => sum + item.value, 0)) *
          100
        ).toFixed(1);

    // Calculate position to avoid clipping
    const x = coordinate?.x || 0;
    const y = coordinate?.y || 0;

    return (
      <div
        className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-2xl border z-[9999] absolute"
        style={{
          borderColor: data.fill,
          left: x,
          top: y - 10,
          transform: 'translateX(-50%)',
          pointerEvents: 'none'
        }}
      >
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p style={{ color: data.fill }}>
          <span className="font-bold">{data.value}</span>
          <span className="text-xs ml-1">({percentage}%)</span>
        </p>
      </div>
    );
  }
  return null;
};

// Add keyframes for legend animation
const styles = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export const ChartCard: React.FC<ChartCardProps> = ({ title, data, type }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Trigger re-animation on data change
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [data]);

  // Detect container width changes (sidebar toggle) and trigger re-animation
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        if (containerWidth !== 0 && Math.abs(newWidth - containerWidth) > 50) {
          // Significant width change detected (sidebar toggle)
          setAnimationKey((prev) => prev + 1);
        }
        setContainerWidth(newWidth);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerWidth]);

  // Enhanced Bar Chart Implementation with Advanced Animations
  if (type === "bar") {
    const chartData = data.map((item, index) => ({
      name: item.label,
      value: item.value,
      fill: item.color,
      index,
    }));

    return (
      <div
        ref={containerRef}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:z-50 relative transition-all duration-300 ease-out"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="w-full h-80 outline-none focus:outline-none overflow-visible relative">
          <ResponsiveContainer width="100%" height="100%" debounce={50}>
            <BarChart
              key={animationKey}
              data={chartData}
              margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
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
                axisLine={{ stroke: "#e5e7eb" }}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.05)", radius: 8 }}
                content={({ active, payload, coordinate }) => {
                  if (active && payload && payload.length) {
                    const x = coordinate?.x || 0;
                    const y = coordinate?.y || 0;

                    return (
                      <div
                        className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-2xl border-2 z-[9999] absolute"
                        style={{
                          borderColor: payload[0].payload.fill,
                          left: x,
                          top: y - 10,
                          transform: 'translateX(-50%)',
                          pointerEvents: 'none'
                        }}
                      >
                        <p className="font-semibold text-gray-800 text-sm">
                          {payload[0].payload.name}
                        </p>
                        <p
                          style={{ color: payload[0].payload.fill }}
                          className="text-lg font-bold mt-1"
                        >
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
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
                shape={(props: any) => <SimpleBar {...props} />}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // --- Enhanced Pie Chart Implementation ---
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
    fill: item.color,
  }));

  return (
    <>
      <style>{styles}</style>
      <div
        ref={containerRef}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:z-50 relative transition-all duration-300 ease-out"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Pie Chart */}
          <div className="w-full h-64 outline-none focus:outline-none overflow-visible relative">
            <ResponsiveContainer width="100%" height="100%" debounce={50}>
              <PieChart key={animationKey}>
                <defs>
                  <linearGradient
                    id="pieShine"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.1" />
                    <stop
                      offset="100%"
                      stopColor="transparent"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  activeShape={renderActiveShape}
                  onMouseEnter={(_: any, index: number) =>
                    setHoveredIndex(index)
                  }
                  onMouseLeave={() => setHoveredIndex(null)}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationBegin={0}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke="white"
                      strokeWidth={2}
                      style={{
                        filter:
                          hoveredIndex === index
                            ? `drop-shadow(0 4px 12px ${entry.fill}80)`
                            : `drop-shadow(0 2px 4px ${entry.fill}40)`,
                        transition: "filter 0.3s ease",
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend with Enhanced Animations */}
          <div className="flex flex-col justify-center space-y-3">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 cursor-pointer p-2 rounded-md transition-all duration-200 hover:bg-gray-50"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 100}ms both`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full transition-all duration-300 flex-shrink-0"
                  style={{
                    backgroundColor: item.color,
                    transform:
                      hoveredIndex === index ? "scale(1.3)" : "scale(1)",
                    boxShadow:
                      hoveredIndex === index
                        ? `0 0 16px ${item.color}90, 0 0 8px ${item.color}60`
                        : `0 0 4px ${item.color}30`,
                  }}
                />
                <div className="flex justify-between items-baseline w-full">
                  <span
                    className={`text-sm font-medium transition-all duration-200 ${
                      hoveredIndex === index
                        ? "text-gray-900 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span
                    className={`text-xs font-semibold tabular-nums transition-all duration-200 ${
                      hoveredIndex === index
                        ? "text-gray-800 scale-110"
                        : "text-gray-500"
                    }`}
                  >
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
