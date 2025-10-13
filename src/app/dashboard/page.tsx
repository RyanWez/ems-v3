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
import { useAuth } from "@/Auth";

const Dashboard: React.FC = () => {
  const { permissions } = useAuth();
  const { employees, isLoading, error } = useEmployees();
  const statistics = useEmployeeStatistics(employees);

  // Check dashboard permissions
  const dashboardPerms = permissions?.dashboard || {};
  const canViewDashboard = dashboardPerms?.general?.view ?? false;

  // Overview Cards permissions
  const overviewPerms = dashboardPerms?.overviewCards || {};
  const canViewTotalEmployees = overviewPerms?.viewTotalEmployees ?? false;
  const canViewNewHires = overviewPerms?.viewNewHires ?? false;
  const canViewDepartments = overviewPerms?.viewDepartments ?? false;

  // Charts permissions
  const chartsPerms = dashboardPerms?.charts || {};
  const canViewEmployeeGrowth = chartsPerms?.viewEmployeeGrowth ?? false;
  const canViewDepartmentDistribution =
    chartsPerms?.viewDepartmentDistribution ?? false;
  const canViewAttendanceStats = chartsPerms?.viewAttendanceStats ?? false;
  const canViewPerformanceMetrics =
    chartsPerms?.viewPerformanceMetrics ?? false;

  // Recent Activities permissions
  const recentActivitiesPerms = dashboardPerms?.recentActivities || {};
  const canViewRecentActivities =
    recentActivitiesPerms?.viewRecentActivities ?? false;

  // If no dashboard view permission, show access denied
  if (!canViewDashboard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">🔒 Access Denied</div>
          <p className="text-gray-600">
            You do not have permission to view the dashboard.
          </p>
        </div>
      </div>
    );
  }

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

  // Generate monthly growth data by year
  const generateMonthlyGrowthDataByYear = () => {
    const monthlyDataByYear: { [year: string]: any[] } = {};

    // Find all years that have employees
    const yearsWithEmployees = new Set<number>();
    employees.forEach((emp) => {
      const joinYear = new Date(emp.joinDate).getFullYear();
      yearsWithEmployees.add(joinYear);
    });

    // Get earliest and latest years
    const currentYear = new Date().getFullYear();
    let earliestYear = currentYear;
    if (employees.length > 0) {
      const joinYears = employees.map((emp) =>
        new Date(emp.joinDate).getFullYear()
      );
      earliestYear = Math.min(...joinYears);
    }

    // Generate monthly data for each year from earliest to current
    for (let year = earliestYear; year <= currentYear; year++) {
      const monthlyData = [];

      for (let month = 0; month < 12; month++) {
        const monthDate = new Date(year, month, 1);
        const monthName = monthDate.toLocaleDateString("en-US", {
          month: "short",
        });

        // Get the end of the month for accurate counting
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

        // Count employees joined up to end of this month
        const employeesUpToMonth = employees.filter((emp) => {
          const joinDate = new Date(emp.joinDate);
          return joinDate <= endOfMonth;
        }).length;

        // Count new hires in this specific month
        const newHires = employees.filter((emp) => {
          const joinDate = new Date(emp.joinDate);
          return (
            joinDate.getMonth() === month && joinDate.getFullYear() === year
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

      monthlyDataByYear[year] = monthlyData;
    }

    return monthlyDataByYear;
  };

  // Generate yearly growth data (from first employee join year to current year)
  const generateYearlyGrowthData = () => {
    const yearlyData = [];
    const currentYear = new Date().getFullYear();

    // Find the earliest join date from all employees
    let earliestYear = currentYear;
    if (employees.length > 0) {
      const joinDates = employees.map((emp) =>
        new Date(emp.joinDate).getFullYear()
      );
      earliestYear = Math.min(...joinDates);
    }

    // Generate data from earliest year to current year
    for (let year = earliestYear; year <= currentYear; year++) {
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

  const monthlyGrowthDataByYear = generateMonthlyGrowthDataByYear();
  const yearlyGrowthData = generateYearlyGrowthData();

  // Get available years for the dropdown
  const availableYears = Object.keys(monthlyGrowthDataByYear)
    .map(Number)
    .sort((a, b) => a - b);

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

      {/* Statistics Cards - Show only cards with permission */}
      {(canViewTotalEmployees ||
        canViewNewHires ||
        canViewDepartments) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canViewTotalEmployees && (
            <StatCard
              title="Total Employees"
              value={statistics.totalEmployees}
              icon={Users}
              color="blue"
            />
          )}
          {canViewNewHires && (
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
          )}
          {canViewDepartments && (
            <StatCard
              title="Departments"
              value={statistics.departmentBreakdown.length}
              icon={Building}
              color="purple"
            />
          )}
        </div>
      )}

      {/* Empty State for No Employees */}
      {statistics.totalEmployees === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Employees Yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Start building your team by adding your first employee. Once you have employees in the system, you will see statistics, charts, and insights here.
          </p>
          <button
            onClick={() => window.location.href = '/dashboard/employee-management/lists'}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Users className="w-4 h-4 mr-2" />
            Add Your First Employee
          </button>
        </div>
      )}

      {/* Employee Growth Chart - Show only if permission exists */}
      {canViewEmployeeGrowth && statistics.totalEmployees > 0 && (
        <EmployeeGrowthChart
          monthlyDataByYear={monthlyGrowthDataByYear}
          yearlyData={yearlyGrowthData}
          availableYears={availableYears}
        />
      )}

      {/* Charts Section - Show only charts with permission */}
      {(canViewDepartmentDistribution || canViewAttendanceStats) && statistics.totalEmployees > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {canViewDepartmentDistribution && (
            <ChartCard
              title="Department Breakdown"
              data={departmentChartData}
              type="bar"
            />
          )}
          {canViewAttendanceStats && (
            <ChartCard
              title="Gender Distribution"
              data={genderChartData}
              type="pie"
            />
          )}
        </div>
      )}

      {canViewPerformanceMetrics && statistics.totalEmployees > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Age Demographics" data={ageChartData} type="bar" />
          <ChartCard title="Service Years" data={serviceChartData} type="bar" />
        </div>
      )}

      {/* Recent Joiners - Show only if permission exists */}
      {canViewRecentActivities && (
        <RecentJoinersCard recentJoiners={statistics.recentJoiners} />
      )}
    </div>
  );
};

export default Dashboard;
