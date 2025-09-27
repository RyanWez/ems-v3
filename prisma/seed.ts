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

  // Create additional default roles
  const defaultRoles = [
    {
      name: 'Manager',
      description: 'Manage team members and view reports',
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
          delete: false,
          viewDetails: true,
          manageLeave: true,
          viewBirthday: true,
        },
        userManagement: {
          view: false,
          create: false,
          edit: false,
          delete: false,
          manageRoles: false,
          managePermissions: false,
        },
      },
      color: 'blue',
    },
    {
      name: 'Employee',
      description: 'Basic access for daily tasks',
      permissions: {
        dashboard: {
          view: true,
          viewAnalytics: false,
          viewReports: false,
        },
        employeeManagement: {
          view: true,
          create: false,
          edit: false,
          delete: false,
          viewDetails: true,
          manageLeave: false,
          viewBirthday: true,
        },
        userManagement: {
          view: false,
          create: false,
          edit: false,
          delete: false,
          manageRoles: false,
          managePermissions: false,
        },
      },
      color: 'green',
    },
    {
      name: 'Contractor',
      description: 'Limited access for external contractors',
      permissions: {
        dashboard: {
          view: true,
          viewAnalytics: false,
          viewReports: false,
        },
        employeeManagement: {
          view: true,
          create: false,
          edit: false,
          delete: false,
          viewDetails: false,
          manageLeave: false,
          viewBirthday: false,
        },
        userManagement: {
          view: false,
          create: false,
          edit: false,
          delete: false,
          manageRoles: false,
          managePermissions: false,
        },
      },
      color: 'yellow',
    }
  ];

  for (const roleData of defaultRoles) {
    const existingRole = await prisma.role.findFirst({
      where: { name: roleData.name }
    });

    if (!existingRole) {
      await prisma.role.create({
        data: {
          ...roleData,
          userCount: 0,
          status: 'Active',
        }
      });
      console.log('✅ Created role:', roleData.name);
    } else {
      console.log('ℹ️ Role already exists:', roleData.name);
    }
  }

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