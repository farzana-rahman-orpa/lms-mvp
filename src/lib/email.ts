import { prisma } from './prisma';

export async function sendEmail({
  to,
  subject,
  body,
  type,
}: {
  to: string;
  subject: string;
  body: string;
  type: 'PURCHASE_CONFIRMATION' | 'PASSWORD_RESET' | 'ENROLLMENT';
}) {
  // In MVP mode, we log sent emails to DB for audit and instant UI review
  console.log(`[EMAIL SENT - ${type}] To: ${to} | Subject: ${subject}`);

  const notification = await prisma.emailNotification.create({
    data: {
      toEmail: to,
      subject,
      body,
      type,
    },
  });

  return notification;
}
