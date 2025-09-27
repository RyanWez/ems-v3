import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// GET /api/roles/[id] - Get a single role
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const role = await prisma.role.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the expected format
    const transformedRole = {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions as any,
      userCount: role._count.users,
      color: role.color,
      status: role.status,
      createdAt: role.createdAt.toISOString().split('T')[0]
    };

    return NextResponse.json(transformedRole);
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

// PUT /api/roles/[id] - Update a role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, permissions, color, status } = body;

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // If name is being changed, check if new name already exists
    if (name && name !== existingRole.name) {
      const nameExists = await prisma.role.findFirst({
        where: {
          name,
          id: { not: parseInt(params.id) }
        }
      });

      if (nameExists) {
        return NextResponse.json(
          { error: 'Role name already exists' },
          { status: 400 }
        );
      }
    }

    const role = await prisma.role.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(permissions && { permissions }),
        ...(color && { color }),
        ...(status && { status })
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

    return NextResponse.json(transformedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
}

// DELETE /api/roles/[id] - Delete a role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!existingRole) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // Check if role has users assigned
    const userCount = await prisma.user.count({
      where: { roleId: parseInt(params.id) }
    });

    if (userCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete role with ${userCount} user(s) assigned. Please reassign users first.` },
        { status: 400 }
      );
    }

    await prisma.role.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete role' },
      { status: 500 }
    );
  }
}