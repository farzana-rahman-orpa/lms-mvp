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

    const { title, order } = await req.json();
    if (!title) {
      return NextResponse.json({ error: 'Section title is required' }, { status: 400 });
    }

    const section = await prisma.section.create({
      data: {
        title: title.trim(),
        order: order || 1,
        courseId: params.id,
      },
    });

    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    console.error('Section POST Error:', error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}
