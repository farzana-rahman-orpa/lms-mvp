import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired password reset token' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword.trim());

    await prisma.user.update({
      where: { email: resetToken.email },
      data: { passwordHash: hashedPassword },
    });

    // Delete used reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return NextResponse.json({ success: true, message: 'Password reset successful! You can now log in.' });
  } catch (error: any) {
    console.error('Reset Password API Error:', error);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
