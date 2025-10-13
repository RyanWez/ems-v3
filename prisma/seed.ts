import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcrypt';

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
            general: {
              view: true,
            },
            overviewCards: {
              viewTotalEmployees: true,
              viewNewHires: true,
              viewDepartments: true,
              viewActiveProjects: true,
            },
            charts: {
              viewEmployeeGrowth: true,
              viewDepartmentDistribution: true,
              viewAttendanceStats: true,
              viewPerformanceMetrics: true,
            },
            recentActivities: {
              viewRecentActivities: true,
            },
          },
          employeeManagement: {
            list: {
              view: true,
              create: true,
            },
            fields: {
              name: true,
              joinDate: true,
              serviceYears: true,
              gender: true,
              dob: true,
              phoneNo: true,
              position: true,
            },
            actions: {
              view: true,
              edit: true,
              delete: true,
              viewDetails: true,
            },
            details: {
              view: true,
            },
            detailsFields: {
              personalInfo: true,
              contactInfo: true,
              workInfo: true,
            },
            leave: {
              manage: true,
              view: true,
              approve: true,
            },
            birthday: {
              view: true,
            },
          },
          userManagement: {
            list: {
              view: true,
              create: true,
              edit: true,
              delete: true,
            },
            roles: {
              view: true,
              create: true,
              edit: true,
              delete: true,
              managePermissions: true,
            },
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

  // Get the Administrator role
  const adminRole = await prisma.role.findFirst({
    where: { name: 'Administrator' }
  });

  if (adminRole) {
    const adminUsername = process.env['ADMIN_USERNAME'] || 'Admin';
    const adminEmail = `${adminUsername}@company.com`;

    // Check if admin user already exists
    const existingAdminUser = await prisma.user.findFirst({
      where: { name: adminUsername }
    });

    if (!existingAdminUser) {
      // Create admin user from environment variables
      const adminUser = await prisma.user.create({
        data: {
          name: adminUsername,
          email: adminEmail,
          password: await bcrypt.hash(process.env['ADMIN_PASSWORD'] || '137245', 10),
          roleId: adminRole.id,
        }
      });

      console.log('✅ Created admin user:', adminUser.email);
    } else {
      // Update existing admin user with correct password from environment
      const adminUser = await prisma.user.update({
        where: { id: existingAdminUser.id },
        data: {
          name: adminUsername,
          email: adminEmail,
          password: await bcrypt.hash(process.env['ADMIN_PASSWORD'] || '137245', 10),
          roleId: adminRole.id,
        }
      });

      console.log('✅ Updated admin user:', adminUser.email);
    }
  } else {
    console.log('❌ Administrator role not found, cannot create admin user');
  }

  // Note: Only Administrator role and admin user are auto-generated
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