import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET /api/roles - Get all roles
export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    // Transform the data to match the expected format
    const transformedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions as any,
      userCount: role._count.users,
      color: role.color,
      status: role.status,
      createdAt: role.createdAt.toISOString().split('T')[0]
    }));

    return NextResponse.json(transformedRoles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}

// POST /api/roles - Create a new role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, permissions, color } = body;

    // Validate required fields
    if (!name || !description || !permissions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if role name already exists
    const existingRole = await prisma.role.findFirst({
      where: { name }
    });

    if (existingRole) {
      return NextResponse.json(
        { error: 'Role name already exists' },
        { status: 400 }
      );
    }

    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions,
        color: color || 'blue',
        status: 'Active',
        userCount: 0
      }
    });

    // Transform the response to match expected format
    const transformedRole = {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions as any,
      userCount: role.userCount,
      color: role.color,
      status: role.status,
      createdAt: role.createdAt.toISOString().split('T')[0]
    };

    return NextResponse.json(transformedRole, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Failed to create role' },
      { status: 500 }
    );
  }
}