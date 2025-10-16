'use server';
import 'server-only';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SessionData, JWTPayload } from '@/types/auth';

const secretKey = process.env['SESSION_SECRET'];
if (!secretKey) {
  throw new Error('SESSION_SECRET environment variable is required');
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionData): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ''): Promise<JWTPayload | null> {
  try {
    if (!session) {
      return null;
    }
    
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    
    return payload as JWTPayload;
  } catch (error) {
    console.log('Failed to verify session');
    return null;
  }
}

export async function createSession(data: Omit<SessionData, 'expiresAt'>): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const sessionData: SessionData = { 
    username: data.username,
    role: data.role,
    userId: data.userId || 0, // Ensure userId is always a number
    permissions: data.permissions,
    expiresAt 
  };
  
  const session = await encrypt(sessionData);

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('session')?.value;
    const session = await decrypt(cookie);
    return session;
}


export async function updateSession(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return;
  }

  // Create new session with updated expiration
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const newSession = await encrypt({ ...payload, expiresAt: expires });
  
  cookieStore.set('session', newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
