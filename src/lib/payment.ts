import { prisma } from './prisma';

export async function getPaymentSettings() {
  let settings = await prisma.paymentSetting.findUnique({
    where: { id: 'default' },
  });

  if (!settings) {
    settings = await prisma.paymentSetting.create({
      data: {
        id: 'default',
        activeGateway: 'MOCK',
        testMode: true,
        stripePublicKey: 'pk_test_sample_key_123',
        stripeSecretKey: 'sk_test_sample_key_123',
      },
    });
  }

  return settings;
}

export async function processPayment({
  userId,
  courseId,
  amount,
  gateway = 'MOCK',
  gatewayRef,
}: {
  userId: string;
  courseId: string;
  amount: number;
  gateway?: 'MOCK' | 'STRIPE';
  gatewayRef?: string;
}) {
  const transactionRef = gatewayRef || `${gateway.toLowerCase()}_tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Create Transaction
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      courseId,
      amount,
      currency: 'USD',
      status: 'SUCCESS',
      gateway,
      gatewayRef: transactionRef,
    },
  });

  // Automatically Enroll Student
  const enrollment = await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {
      lastAccessedAt: new Date(),
    },
    create: {
      userId,
      courseId,
      completionPercentage: 0.0,
    },
  });

  return { transaction, enrollment };
}
