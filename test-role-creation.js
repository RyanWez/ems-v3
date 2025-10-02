import { PrismaClient } from './src/generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestRole() {
    try {
        // Check if Manager role already exists
        const existingRole = await prisma.role.findFirst({
            where: { name: 'Manager' }
        });

        if (existingRole) {
            console.log('Manager role already exists');
            return;
        }

        // Create Manager role with limited permissions
        const managerRole = await prisma.role.create({
            data: {
                name: 'Manager',
                description: 'Manager with limited access to employee and user management',
                permissions: {
                    dashboard: {
                        general: {
                            view: true,
                        },
                        analytics: {
                            view: true,
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
                            dob: false, // Manager cannot see DOB
                            phoneNo: true,
                            position: true,
                            nrc: false, // Manager cannot see NRC
                            address: false, // Manager cannot see address
                        },
                        actions: {
                            view: true,
                            edit: true,
                            delete: false, // Manager cannot delete employees
                            viewDetails: true,
                        },
                        details: {
                            view: true,
                        },
                        detailsFields: {
                            personalInfo: true,
                            contactInfo: false, // Manager cannot see contact info
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
                            create: false, // Manager cannot create users
                            edit: false, // Manager cannot edit users
                            delete: false, // Manager cannot delete users
                        },
                        roles: {
                            manage: false, // Manager cannot manage roles
                        },
                    },
                },
                userCount: 0,
                color: 'blue',
                status: 'Active',
            }
        });

        console.log('✅ Created Manager role:', managerRole.name);

        // Create a test manager user
        const hashedPassword = await bcrypt.hash('manager123', 10);

        const managerUser = await prisma.user.create({
            data: {
                name: 'Manager',
                email: 'manager@company.com',
                password: hashedPassword,
                roleId: managerRole.id,
            }
        });

        console.log('✅ Created Manager user:', managerUser.email);

    } catch (error) {
        console.error('Error creating test role:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestRole();