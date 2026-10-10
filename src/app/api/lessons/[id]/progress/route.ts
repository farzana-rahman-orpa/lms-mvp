import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { completed } = await req.json();
    const lessonId = params.id;

    // Verify lesson exists and get course ID
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        section: true,
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const courseId = lesson.section.courseId;

    // Verify student is enrolled or admin
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (!enrollment && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 403 });
    }

    // Upsert lesson progress record
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        completed: Boolean(completed),
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: user.id,
        lessonId,
        completed: Boolean(completed),
        completedAt: completed ? new Date() : null,
      },
    });

    // Recalculate Course Completion Percentage
    const allLessons = await prisma.lesson.findMany({
      where: {
        section: {
          courseId,
        },
      },
      select: { id: true },
    });

    const totalLessons = allLessons.length;

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: user.id,
        completed: true,
        lesson: {
          section: {
            courseId,
          },
        },
      },
    });

    const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    if (enrollment) {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          completionPercentage: Math.round(completionPercentage * 10) / 10,
          lastAccessedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      completed: Boolean(completed),
      completionPercentage: Math.round(completionPercentage * 10) / 10,
    });
  } catch (error: any) {
    console.error('Progress POST Error:', error);
    return NextResponse.json({ error: 'Failed to update lesson progress' }, { status: 500 });
  }
}
