import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const emails = await prisma.emailNotification.findMany({
      orderBy: { sentAt: 'desc' },
    });

    return NextResponse.json({ emails });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch email logs' }, { status: 500 });
  }
}
