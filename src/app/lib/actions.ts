'use server';

import { cookies } from 'next/headers';
import { createSession } from './session';
import { redirect } from 'next/navigation';
import { PrismaClient } from '../../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function authenticate(username: string, password: string): Promise<{ error?: string } | undefined> {
  try {
    // Find user in database by name (displayName)
    const user = await prisma.user.findFirst({
      where: {
        name: username.trim()
      },
      include: {
        role: true
      }
    });

    if (!user) {
      return { error: 'Invalid username or password' };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { error: 'Invalid username or password' };
    }

    // Credentials are correct, create a session
    await createSession({
      username: user.name,
      role: user.role.name,
      userId: user.id,
      permissions: user.role.permissions
    });

    // No need to redirect here, the client will do it
    return {};

  } catch (error) {
    console.error('Authentication error:', error);
    if (error instanceof Error) {
        return { error: 'An error occurred during authentication.' };
    }
    return { error: 'An unknown error occurred.' };
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}
