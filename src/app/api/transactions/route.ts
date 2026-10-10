import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const courseId = searchParams.get('courseId');

    const where: any = {};

    if (user.role !== 'ADMIN') {
      where.userId = user.id;
    } else {
      if (status) where.status = status;
      if (courseId) where.courseId = courseId;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ transactions });
  } catch (error: any) {
    console.error('Transactions GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
