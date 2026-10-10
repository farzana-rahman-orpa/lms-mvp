import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const totalStudents = await prisma.user.count({
      where: { role: 'STUDENT' },
    });

    const totalCourses = await prisma.course.count();

    const transactions = await prisma.transaction.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true },
    });

    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

    const recentSignups = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const recentPurchases = await prisma.transaction.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    });

    return NextResponse.json({
      stats: {
        totalStudents,
        totalCourses,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalTransactions: transactions.length,
      },
      recentSignups,
      recentPurchases,
    });
  } catch (error: any) {
    console.error('Admin Dashboard Error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard metrics' }, { status: 500 });
  }
}
