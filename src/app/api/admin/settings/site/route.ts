import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: { id: 'default' },
      });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { siteName, logoUrl, contactEmail, currency, termsText, refundPolicyText } = await req.json();

    const updated = await prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: {
        siteName: siteName?.trim(),
        logoUrl: logoUrl || null,
        contactEmail: contactEmail?.trim(),
        currency: currency?.trim(),
        termsText: termsText?.trim(),
        refundPolicyText: refundPolicyText?.trim(),
      },
      create: {
        id: 'default',
        siteName: siteName?.trim() || 'LearnSphere LMS',
        logoUrl: logoUrl || null,
        contactEmail: contactEmail?.trim() || 'support@learnsphere.com',
        currency: currency?.trim() || 'USD',
        termsText: termsText?.trim() || 'Terms...',
        refundPolicyText: refundPolicyText?.trim() || 'Refund...',
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 });
  }
}
