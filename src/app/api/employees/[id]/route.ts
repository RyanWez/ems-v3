import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// GET /api/employees/[id] - Get a single employee
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

// PUT /api/employees/[id] - Update an employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, joinDate, position, gender, dob, phone } = body;

    // Validate required fields
    if (!name || !joinDate || !position || !gender || !dob || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.update({
      where: { id: parseInt(params.id) },
      data: {
        name,
        joinDate,
        position,
        gender,
        dob,
        phone
      }
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/[id] - Delete an employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.employee.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
}