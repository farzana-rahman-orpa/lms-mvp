import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { processPayment } from '@/lib/payment';

export async function GET(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');

    // Admin listing all enrollments
    if (user.role === 'ADMIN' && (courseId || studentId || searchParams.get('all') === 'true')) {
      const where: any = {};
      if (courseId) where.courseId = courseId;
      if (studentId) where.userId = studentId;

      const enrollments = await prisma.enrollment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, title: true, slug: true, price: true } },
        },
        orderBy: { enrolledAt: 'desc' },
      });

      return NextResponse.json({ enrollments });
    }

    // Student listing their own enrolled courses
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            category: true,
            sections: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
      orderBy: { lastAccessedAt: 'desc' },
    });

    return NextResponse.json({ enrollments });
  } catch (error: any) {
    console.error('Enrollments GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

// Manual Enrollment (Admin)
export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { studentId, courseId } = await req.json();

    if (!studentId || !courseId) {
      return NextResponse.json({ error: 'Student ID and Course ID are required' }, { status: 400 });
    }

    const { transaction, enrollment } = await processPayment({
      userId: studentId,
      courseId,
      amount: 0,
      gateway: 'MOCK',
      gatewayRef: `ADMIN_MANUAL_ENROLL_${Date.now()}`,
    });

    return NextResponse.json({ success: true, enrollment, transaction });
  } catch (error: any) {
    console.error('Enrollments POST Error:', error);
    return NextResponse.json({ error: 'Failed manual enrollment' }, { status: 500 });
  }
}
