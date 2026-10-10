import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, type, contentUrl, contentText, durationMinutes, order } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Lesson title is required' }, { status: 400 });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        type: type || 'VIDEO',
        contentUrl: contentUrl || null,
        contentText: contentText || null,
        durationMinutes: parseInt(durationMinutes || '10', 10),
        order: order || 1,
        sectionId: params.id,
      },
    });

    return NextResponse.json({ success: true, lesson });
  } catch (error: any) {
    console.error('Lesson POST Error:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
