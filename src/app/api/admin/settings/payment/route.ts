import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getPaymentSettings } from '@/lib/payment';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const settings = await getPaymentSettings();
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch payment settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { activeGateway, testMode, stripePublicKey, stripeSecretKey } = await req.json();

    const updated = await prisma.paymentSetting.upsert({
      where: { id: 'default' },
      update: {
        activeGateway,
        testMode: Boolean(testMode),
        stripePublicKey: stripePublicKey || null,
        stripeSecretKey: stripeSecretKey || null,
      },
      create: {
        id: 'default',
        activeGateway,
        testMode: Boolean(testMode),
        stripePublicKey: stripePublicKey || null,
        stripeSecretKey: stripeSecretKey || null,
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update payment settings' }, { status: 500 });
  }
}
