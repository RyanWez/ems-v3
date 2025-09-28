'use server';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// GET /api/users - Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
      orderBy: [
        // First, sort by role name - Administrator comes first
        { role: { name: 'asc' } },
        // Then by creation date, newest first
        { createdAt: 'desc' }
      ],
    });

    // Transform the data to match the expected format
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      roleId: user.roleId,
      status: 'Active', // Default status, you can add this field to the schema if needed
      lastLogin: user.updatedAt.toLocaleDateString(), // Using updatedAt as lastLogin for now
      displayName: user.name, // Use the actual name field as displayName
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, roleId } = body;

    // Validate required fields
    if (!name || !email || !password || !roleId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, password, roleId' },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: parseInt(roleId) },
    });

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: parseInt(roleId),
      },
      include: {
        role: true,
      },
    });

    const transformedUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role.name,
      roleId: newUser.roleId,
      status: 'Active',
      lastLogin: newUser.createdAt.toLocaleDateString(),
      displayName: newUser.name, // Use the actual name field as displayName
    };

    return NextResponse.json(transformedUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}