import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

// GET /api/employees - Get all employees
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST /api/employees - Create a new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, joinDate, position, gender, dob, phone, nrc, address } = body;

    // Validate required fields
    if (!name || !joinDate || !position || !gender || !dob || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        joinDate,
        position,
        gender,
        dob,
        phone,
        nrc,
        address
      }
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}