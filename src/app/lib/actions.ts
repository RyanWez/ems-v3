'use server';

import { cookies } from 'next/headers';
import { createSession } from './session';
import { redirect } from 'next/navigation';

export async function authenticate(username: string, password: string): Promise<{ error?: string } | undefined> {
  try {
    const correctUsername = process.env.ADMIN_USERNAME;
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctUsername || !correctPassword) {
      console.error('Server configuration error: Admin credentials are not set in .env');
      return { error: 'Server configuration error. Please contact administrator.' };
    }

    if (username !== correctUsername || password !== correctPassword) {
      return { error: 'Invalid username or password' };
    }
    
    // Credentials are correct, create a session
    await createSession({
        username: username,
        role: 'admin'
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
  cookies().delete('session');
  redirect('/login');
}
