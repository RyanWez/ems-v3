"use client";
import React, { useState } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Data structure interface
interface GrowthData {
  period: string;
  totalEmployees: number;
  newHires: number;
  terminations: number;
}

interface EmployeeGrowthChartProps {
  monthlyDataByYear: { [year: string]: GrowthData[] };
  yearlyData: GrowthData[];
  availableYears: number[];
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border-2 border-gray-200">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            <span className="font-medium">{entry.name}:</span>{" "}
            <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const EmployeeGrowthChart: React.FC<EmployeeGrowthChartProps> = ({
  monthlyDataByYear,
  yearlyData,
  availableYears,
}) => {
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("yearly");
  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears[availableYears.length - 1] || new Date().getFullYear()
  );
  const [animationKey, setAnimationKey] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const chartData =
    viewMode === "monthly" ? monthlyDataByYear[selectedYear] || [] : yearlyData;

  // Detect container width changes (sidebar toggle) and trigger re-animation
  React.useEffect(() => {
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

  // Trigger animation when view mode changes
  const handleViewModeChange = (mode: "monthly" | "yearly") => {
    setViewMode(mode);
    setAnimationKey((prev) => prev + 1);
  };

  // Handle year selection
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setAnimationKey((prev) => prev + 1);
    setIsDropdownOpen(false);
  };

  // Calculate growth percentage
  const calculateGrowth = () => {
    if (chartData.length < 2) return 0;
    const latest = chartData[chartData.length - 1].totalEmployees;
    const previous = chartData[chartData.length - 2].totalEmployees;
    return previous > 0
      ? (((latest - previous) / previous) * 100).toFixed(1)
      : 0;
  };

  const growthPercentage = calculateGrowth();
  const isPositiveGrowth = Number(growthPercentage) >= 0;

  return (
    <div
      ref={containerRef}
      className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-500 ease-out"
    >
      {/* Header with Toggle */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Employee Growth Trends
          </h3>
          <p className="text-sm text-gray-600">
            {viewMode === "monthly"
              ? `Showing monthly data for ${selectedYear}`
              : `Showing yearly data from ${availableYears[0]} to ${
                  availableYears[availableYears.length - 1]
                }`}
          </p>
        </div>

        {/* Controls: Toggle + Year Selector */}
        <div className="flex items-center gap-3">
          {/* Year Selector (only show in monthly mode) */}
          {viewMode === "monthly" && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <span>{selectedYear}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearChange(year)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                        year === selectedYear
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Toggle Button */}
          <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner">
            <button
              onClick={() => handleViewModeChange("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                viewMode === "monthly"
                  ? "bg-white text-blue-600 shadow-md scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleViewModeChange("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                viewMode === "yearly"
                  ? "bg-white text-blue-600 shadow-md scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-80 outline-none focus:outline-none">
        <ResponsiveContainer width="100%" height="100%" debounce={50}>
          <AreaChart
            key={animationKey}
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {/* Enhanced Gradient for Total Employees */}
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.05} />
              </linearGradient>

              {/* Enhanced Gradient for New Hires */}
              <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="50%" stopColor="#34d399" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0.05} />
              </linearGradient>

              {/* Glow effect for lines */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              opacity={0.3}
              vertical={false}
            />

            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={12}
              axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 500 }}
            />

            <YAxis
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb", strokeWidth: 1 }}
              tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 500 }}
              tickMargin={8}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#3b82f6",
                strokeWidth: 1,
                strokeDasharray: "5 5",
                opacity: 0.5,
              }}
            />

            <Legend
              wrapperStyle={{
                paddingTop: "24px",
              }}
              iconType="circle"
            />

            {/* Total Employees Area */}
            <Area
              type="monotone"
              dataKey="totalEmployees"
              name="Total Employees"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#colorTotal)"
              dot={{
                fill: "#3b82f6",
                strokeWidth: 2,
                r: 4,
                stroke: "#fff",
              }}
              activeDot={{
                r: 7,
                fill: "#3b82f6",
                stroke: "#fff",
                strokeWidth: 3,
                style: {
                  filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))",
                },
              }}
              animationDuration={1200}
              animationEasing="ease-in-out"
              isAnimationActive={true}
            />

            {/* New Hires Area */}
            <Area
              type="monotone"
              dataKey="newHires"
              name="New Hires"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#colorHires)"
              dot={{
                fill: "#10b981",
                strokeWidth: 2,
                r: 3,
                stroke: "#fff",
              }}
              activeDot={{
                r: 6,
                fill: "#10b981",
                stroke: "#fff",
                strokeWidth: 2,
                style: {
                  filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))",
                },
              }}
              animationDuration={1200}
              animationEasing="ease-in-out"
              isAnimationActive={true}
            />

            {/* Terminations Line (subtle) */}
            <Line
              type="monotone"
              dataKey="terminations"
              name="Terminations"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{
                fill: "#ef4444",
                strokeWidth: 2,
                r: 3,
                stroke: "#fff",
              }}
              activeDot={{
                r: 5,
                fill: "#ef4444",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              animationDuration={1200}
              animationEasing="ease-in-out"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Growth Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Trending {isPositiveGrowth ? "up" : "down"} by
            </span>
            <span
              className={`text-lg font-bold ${
                isPositiveGrowth ? "text-green-600" : "text-red-600"
              }`}
            >
              {Math.abs(Number(growthPercentage))}%
            </span>
            <span className="text-2xl">{isPositiveGrowth ? "📈" : "📉"}</span>
          </div>
          <div className="text-xs text-gray-500">
            {viewMode === "monthly"
              ? `${chartData[0]?.period} - ${
                  chartData[chartData.length - 1]?.period
                }`
              : `${chartData[0]?.period} - ${
                  chartData[chartData.length - 1]?.period
                }`}
          </div>
        </div>
      </div>
    </div>
  );
};
