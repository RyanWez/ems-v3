"use client";
import React from "react";
import { Users, Calendar, Building, TrendingUp } from "lucide-react";
import { useEmployees } from "./employee-management/lists/hooks/useEmployees";
import { useEmployeeStatistics } from "../../hooks/useEmployeeStatistics";
import { StatCard } from "../../components/dashboard/StatCard";
import { ChartCard } from "../../components/dashboard/ChartCard";
import { EmployeeGrowthChart } from "../../components/dashboard/EmployeeGrowthChart";
import { RecentJoinersCard } from "../../components/dashboard/RecentJoinersCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const Dashboard: React.FC = () => {
  const { employees, isLoading, error } = useEmployees();
  const statistics = useEmployeeStatistics(employees);

  // Get today's birthdays
  const today = new Date();
  const todaysBirthdays = employees.filter((emp) => {
    const birthDate = new Date(emp.dob);
    return (
      birthDate.getMonth() === today.getMonth() &&
      birthDate.getDate() === today.getDate()
    );
  });

  // Department colors
  const departmentColors = [
    "#3B82F6", // blue
    "#10B981", // green
    "#F59E0B", // yellow
    "#8B5CF6", // purple
    "#EF4444", // red
    "#6366F1", // indigo
    "#EC4899", // pink
    "#14B8A6", // teal
  ];

  // Gender colors
  const genderColors = {
    Male: "#3B82F6",
    Female: "#EC4899",
  };

  // Age group colors
  const ageColors = [
    "#10B981", // green
    "#3B82F6", // blue
    "#F59E0B", // yellow
    "#8B5CF6", // purple
    "#EF4444", // red
  ];

  // Service years colors
  const serviceColors = [
    "#6366F1", // indigo
    "#3B82F6", // blue
    "#10B981", // green
    "#F59E0B", // yellow
    "#EF4444", // red
  ];

  const departmentChartData = statistics.departmentBreakdown.map(
    (dept, index) => ({
      label: dept.department,
      value: dept.count,
      percentage: dept.percentage,
      color: departmentColors[index % departmentColors.length] || "#3B82F6",
    })
  );

  const genderChartData = statistics.genderDistribution.map((gender) => ({
    label: gender.gender,
    value: gender.count,
    percentage: gender.percentage,
    color:
      genderColors[gender.gender as keyof typeof genderColors] || "#6B7280",
  }));

  const ageChartData = statistics.ageGroups.map((age, index) => ({
    label: age.ageGroup,
    value: age.count,
    percentage: age.percentage,
    color: ageColors[index % ageColors.length] || "#10B981",
  }));

  const serviceChartData = statistics.serviceYears.map((service, index) => ({
    label: service.serviceGroup,
    value: service.count,
    percentage: service.percentage,
    color: serviceColors[index % serviceColors.length] || "#6366F1",
  }));

  // Generate monthly growth data (last 12 months)
  const generateMonthlyGrowthData = () => {
    const monthlyData = [];
    const currentDate = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      // Get the end of the month for accurate counting
      const endOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      // Count employees joined up to end of this month
      const employeesUpToMonth = employees.filter((emp) => {
        const joinDate = new Date(emp.joinDate);
        return joinDate <= endOfMonth;
      }).length;

      // Count new hires in this specific month
      const newHires = employees.filter((emp) => {
        const joinDate = new Date(emp.joinDate);
        return (
          joinDate.getMonth() === date.getMonth() &&
          joinDate.getFullYear() === date.getFullYear()
        );
      }).length;

      // Terminations set to 0 (will be implemented later with actual data)
      const terminations = 0;

      monthlyData.push({
        period: monthName,
        totalEmployees: employeesUpToMonth,
        newHires: newHires,
        terminations: terminations,
      });
    }

    return monthlyData;
  };

  // Generate yearly growth data (last 5 years)
  const generateYearlyGrowthData = () => {
    const yearlyData = [];
    const currentYear = new Date().getFullYear();

    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;

      // Get the end of the year for accurate counting
      const endOfYear = new Date(year, 11, 31, 23, 59, 59);

      // Count employees joined up to end of this year
      const employeesUpToYear = employees.filter((emp) => {
        const joinDate = new Date(emp.joinDate);
        return joinDate <= endOfYear;
      }).length;

      // Count new hires in this specific year
      const newHires = employees.filter((emp) => {
        const joinDate = new Date(emp.joinDate);
        return joinDate.getFullYear() === year;
      }).length;

      // Terminations set to 0 (will be implemented later with actual data)
      const terminations = 0;

      yearlyData.push({
        period: year.toString(),
        totalEmployees: employeesUpToYear,
        newHires: newHires,
        terminations: terminations,
      });
    }

    return yearlyData;
  };

  const monthlyGrowthData = generateMonthlyGrowthData();
  const yearlyGrowthData = generateYearlyGrowthData();

  // Show loading spinner while data is loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Employee Dashboard 📊
          </h1>
          <p className="text-gray-600">
            Overview and statistics of your employee management system
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner
            size="lg"
            text="Loading dashboard data..."
            className="text-blue-600"
          />
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Employee Dashboard 📊
          </h1>
          <p className="text-gray-600">
            Overview and statistics of your employee management system
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">
              ⚠️ Error Loading Dashboard
            </div>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-gray-100
                      hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
          Employee Dashboard 📊
        </h1>
        <p className="text-gray-600 animate-fade-in-delay">
          Overview and statistics of your employee management system
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={statistics.totalEmployees}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Today's Birthdays"
          value={todaysBirthdays.length}
          icon={Calendar}
          color="green"
          subtitle={
            todaysBirthdays.length > 0
              ? `${todaysBirthdays.map((emp) => emp.name).join(", ")}`
              : "No birthdays today"
          }
        />
        <StatCard
          title="Departments"
          value={statistics.departmentBreakdown.length}
          icon={Building}
          color="purple"
        />
        <StatCard
          title="Recent Joiners"
          value={statistics.recentJoiners.length}
          icon={TrendingUp}
          color="indigo"
          subtitle="Last 30 days"
        />
      </div>

      {/* Employee Growth Chart - Full Width */}
      <EmployeeGrowthChart
        monthlyData={monthlyGrowthData}
        yearlyData={yearlyGrowthData}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Department Breakdown"
          data={departmentChartData}
          type="bar"
        />
        <ChartCard
          title="Gender Distribution"
          data={genderChartData}
          type="pie"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Age Demographics" data={ageChartData} type="bar" />
        <ChartCard title="Service Years" data={serviceChartData} type="bar" />
      </div>

      {/* Recent Joiners */}
      <RecentJoinersCard recentJoiners={statistics.recentJoiners} />
    </div>
  );
};

export default Dashboard;
