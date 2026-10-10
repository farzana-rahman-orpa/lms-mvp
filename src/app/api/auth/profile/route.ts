import { NextResponse } from 'next/server';
import { getAuthUser, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const userSession = await getAuthUser();
    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, photoUrl, newPassword } = await req.json();

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl.trim();
    if (newPassword && newPassword.trim().length >= 6) {
      updateData.passwordHash = await hashPassword(newPassword.trim());
    }

    const updatedUser = await prisma.user.update({
      where: { id: userSession.id },
      data: updateData,
      select: { id: true, name: true, email: true, photoUrl: true, role: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Update Profile API Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
