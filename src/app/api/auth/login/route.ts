import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';
import bcrypt from 'bcrypt';
import { createSession } from '../../../lib/session';
import type { 
  LoginRequest, 
  LoginResponse, 
  LoginSuccessResponse, 
  LoginErrorResponse,
  Permission 
} from '@/types/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      const errorResponse: LoginErrorResponse = {
        error: 'Username and password are required'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Find user in database
    const user = await prisma.user.findFirst({
      where: {
        name: username.trim()
      },
      include: {
        role: true
      }
    });

    if (!user) {
      const errorResponse: LoginErrorResponse = {
        error: 'Invalid username or password'
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const errorResponse: LoginErrorResponse = {
        error: 'Invalid username or password'
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    // Create session
    await createSession({
      username: user.name,
      role: user.role.name,
      userId: user.id,
      permissions: user.role.permissions as Permission
    });

    const successResponse: LoginSuccessResponse = {
      success: true,
      user: {
        username: user.name,
        role: user.role.name,
        permissions: user.role.permissions as Permission
      }
    };

    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('Login API error:', error);
    const errorResponse: LoginErrorResponse = {
      error: 'Internal server error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}