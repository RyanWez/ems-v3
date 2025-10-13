import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning up unused permissions from all roles...\n");

  const roles = await prisma.role.findMany();

  for (const role of roles) {
    const oldPermissions = role.permissions as any;

    // Remove quickActions and viewSystemLogs from dashboard
    const cleanedDashboard = {
      general: oldPermissions?.dashboard?.general || { view: false },
      overviewCards: oldPermissions?.dashboard?.overviewCards || {
        viewTotalEmployees: false,
        viewNewHires: false,
        viewDepartments: false,
        viewActiveProjects: false,
      },
      charts: oldPermissions?.dashboard?.charts || {
        viewEmployeeGrowth: false,
        viewDepartmentDistribution: false,
        viewAttendanceStats: false,
        viewPerformanceMetrics: false,
      },
      recentActivities: {
        viewRecentActivities:
          oldPermissions?.dashboard?.recentActivities?.viewRecentActivities ??
          false,
      },
    };

    const cleanedPermissions = {
      ...oldPermissions,
      dashboard: cleanedDashboard,
    };

    await prisma.role.update({
      where: { id: role.id },
      data: {
        permissions: cleanedPermissions,
      },
    });

    console.log(`✅ Cleaned permissions for: ${role.name}`);
  }

  console.log("\n🎉 All roles cleaned successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
