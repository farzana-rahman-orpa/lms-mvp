import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, type, contentUrl, contentText, durationMinutes, order } = await req.json();

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        title: title?.trim(),
        type,
        contentUrl: contentUrl !== undefined ? contentUrl : undefined,
        contentText: contentText !== undefined ? contentText : undefined,
        durationMinutes: durationMinutes !== undefined ? parseInt(durationMinutes, 10) : undefined,
        order: order !== undefined ? order : undefined,
      },
    });

    return NextResponse.json({ success: true, lesson });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
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

    await prisma.lesson.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
