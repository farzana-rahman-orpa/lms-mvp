import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lms-super-secret-key-change-in-production-2026'
);

export interface JWTPayload {
  id: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  if (!session) return null;

  // Check if user is blocked or deleted
  const dbUser = await prisma.user.findUnique({
    where: { id: session.id },
    select: { isBlocked: true, role: true, name: true, email: true }
  });

  if (!dbUser || dbUser.isBlocked) {
    return null;
  }

  return {
    ...session,
    role: dbUser.role as 'STUDENT' | 'ADMIN',
    name: dbUser.name,
    email: dbUser.email
  };
}

export async function requireAuthUser(): Promise<JWTPayload> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin(): Promise<JWTPayload> {
  const user = await getAuthUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }
  return user;
}
