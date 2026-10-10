import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSessionToken } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: hashedPassword,
        role: 'STUDENT',
      },
    });

    const role = user.role as 'STUDENT' | 'ADMIN';

    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role,
    });

    // Log welcome email
    await sendEmail({
      to: user.email,
      subject: 'Welcome to LearnSphere LMS!',
      body: `Hello ${user.name},\n\nThank you for creating an account on LearnSphere. Explore our course catalog and start learning today!`,
      type: 'ENROLLMENT',
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Register API Error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
