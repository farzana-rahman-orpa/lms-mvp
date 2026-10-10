import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, createSessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.isBlocked) {
      return NextResponse.json({ error: 'Your account has been suspended by an administrator.' }, { status: 403 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const role = user.role as 'STUDENT' | 'ADMIN';

    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role, photoUrl: user.photoUrl },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
