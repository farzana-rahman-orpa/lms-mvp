import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const isFree = searchParams.get('isFree');
    const publishedOnly = searchParams.get('all') !== 'true';

    const user = await getAuthUser();
    const isAdmin = user?.role === 'ADMIN';

    const where: any = {};

    if (!isAdmin || publishedOnly) {
      where.isPublished = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (isFree === 'true') {
      where.isFree = true;
    } else if (isFree === 'false') {
      where.isFree = false;
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        category: true,
        sections: {
          include: {
            lessons: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ courses, categories });
  } catch (error: any) {
    console.error('Courses GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, description, price, isFree, isPublished, thumbnailUrl, categoryId } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        slug,
        description: description.trim(),
        price: isFree ? 0 : parseFloat(price || '0'),
        isFree: Boolean(isFree),
        isPublished: Boolean(isPublished),
        thumbnailUrl: thumbnailUrl || null,
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    console.error('Course POST Error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
