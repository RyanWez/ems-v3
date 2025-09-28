import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if Administrator role already exists
  const existingAdminRole = await prisma.role.findFirst({
    where: { name: 'Administrator' }
  });

  if (!existingAdminRole) {
    // Create Administrator role with full permissions
    const adminRole = await prisma.role.create({
      data: {
        name: 'Administrator',
        description: 'Full system access with all permissions',
        permissions: {
          dashboard: {
            view: true,
            viewAnalytics: true,
            viewReports: true,
          },
          employeeManagement: {
            view: true,
            create: true,
            edit: true,
            delete: true,
            viewDetails: true,
            manageLeave: true,
            viewBirthday: true,
          },
          userManagement: {
            view: true,
            create: true,
            edit: true,
            delete: true,
            manageRoles: true,
            managePermissions: true,
          },
        },
        userCount: 0,
        color: 'purple',
        status: 'Active',
      }
    });

    console.log('✅ Created Administrator role:', adminRole.name);
  } else {
    console.log('ℹ️ Administrator role already exists');
  }

  // Note: Only Administrator role is auto-generated
  // Manager, Employee, and Contractor roles will be created manually by users

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });