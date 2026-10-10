import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { processPayment } from '@/lib/payment';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to purchase or enroll' }, { status: 401 });
    }

    const { courseId, gateway = 'MOCK', paymentDetails } = await req.json();

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        alreadyEnrolled: true,
        message: 'You are already enrolled in this course!',
      });
    }

    // Process payment and enrollment
    const amount = course.isFree ? 0 : course.price;
    const { transaction, enrollment } = await processPayment({
      userId: user.id,
      courseId: course.id,
      amount,
      gateway,
      gatewayRef: paymentDetails?.reference,
    });

    // Send confirmation email
    await sendEmail({
      to: user.email,
      subject: `Order Confirmation: Enrolled in ${course.title}`,
      body: `Hello ${user.name},\n\nThank you for your purchase! You have successfully enrolled in "${course.title}".\n\nTransaction ID: ${transaction.gatewayRef}\nAmount Paid: $${amount.toFixed(2)}\nGateway: ${gateway}\n\nYou can access your course anytime from your "My Courses" dashboard.`,
      type: 'PURCHASE_CONFIRMATION',
    });

    return NextResponse.json({
      success: true,
      transaction,
      enrollment,
    });
  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}
