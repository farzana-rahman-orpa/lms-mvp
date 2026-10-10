import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      // Return success even if user not found for security privacy
      return NextResponse.json({ success: true, message: 'If an account exists, a password reset email has been sent.' });
    }

    const resetToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token: resetToken,
        expiresAt,
      },
    });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset Your LearnSphere Password',
      body: `Hi ${user.name},\n\nYou requested a password reset. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour.`,
      type: 'PASSWORD_RESET',
    });

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a password reset link has been sent.',
      debugTokenUrl: resetUrl, // Helpful for local testing
    });
  } catch (error: any) {
    console.error('Forgot Password API Error:', error);
    return NextResponse.json({ error: 'Failed to request password reset' }, { status: 500 });
  }
}
