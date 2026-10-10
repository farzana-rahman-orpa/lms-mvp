import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = params.id;
    const user = await getAuthUser();

    const course = await prisma.course.findFirst({
      where: {
        OR: [{ id: param }, { slug: param }],
      },
      include: {
        category: true,
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    let isEnrolled = false;
    let userProgressMap: Record<string, boolean> = {};

    if (user) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      });

      isEnrolled = !!enrollment || user.role === 'ADMIN';

      const progressRecords = await prisma.lessonProgress.findMany({
        where: { userId: user.id },
      });

      progressRecords.forEach((p) => {
        userProgressMap[p.lessonId] = p.completed;
      });
    }

    return NextResponse.json({ course, isEnrolled, userProgressMap });
  } catch (error: any) {
    console.error('Course GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch course detail' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, description, price, isFree, isPublished, thumbnailUrl, categoryId } = await req.json();

    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        title: title?.trim(),
        description: description?.trim(),
        price: isFree ? 0 : parseFloat(price || '0'),
        isFree: Boolean(isFree),
        isPublished: Boolean(isPublished),
        thumbnailUrl: thumbnailUrl || null,
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    console.error('Course PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await prisma.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error: any) {
    console.error('Course DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
