import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        OR: search
          ? [
              { name: { contains: search } },
              { email: { contains: search } },
            ]
          : undefined,
      },
      include: {
        enrollments: {
          include: {
            course: { select: { title: true } },
          },
        },
        transactions: {
          select: { id: true, amount: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ students });
  } catch (error: any) {
    console.error('Admin Students GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { studentId, isBlocked } = await req.json();

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    const updatedStudent = await prisma.user.update({
      where: { id: studentId },
      data: { isBlocked: Boolean(isBlocked) },
    });

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update student status' }, { status: 500 });
  }
}
