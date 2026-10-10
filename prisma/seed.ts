import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Future Light Global Academy...');

  // Clean old categories/sections/lessons/courses to avoid unique constraint issues
  await prisma.lessonProgress.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.category.deleteMany({});

  // 1. Seed Site Settings for Future Light Global
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {
      siteName: 'Future Light Global Academy',
      logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150',
      contactEmail: 'support@futurelightglobal.com',
      currency: 'USD',
      termsText: 'Welcome to Future Light Global Academy. By enrolling in our courses, you gain lifetime access to professional educational materials and certification resources.',
      refundPolicyText: 'Future Light Global offers a 30-day money-back guarantee for all paid courses.',
    },
    create: {
      id: 'default',
      siteName: 'Future Light Global Academy',
      logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150',
      contactEmail: 'support@futurelightglobal.com',
      currency: 'USD',
      termsText: 'Welcome to Future Light Global Academy. By enrolling in our courses, you gain lifetime access to professional educational materials and certification resources.',
      refundPolicyText: 'Future Light Global offers a 30-day money-back guarantee for all paid courses.',
    },
  });

  // 2. Seed Payment Settings
  await prisma.paymentSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      activeGateway: 'MOCK',
      testMode: true,
      stripePublicKey: 'pk_test_51FutureLightGlobalStripeKey999',
      stripeSecretKey: 'sk_test_51FutureLightGlobalStripeKey999',
    },
  });

  // 3. Seed Users (Admin & Student)
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const hashedStudentPassword = await bcrypt.hash('student123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@futurelightglobal.com' },
    update: {},
    create: {
      name: 'Future Light Administrator',
      email: 'admin@futurelightglobal.com',
      passwordHash: hashedAdminPassword,
      role: 'ADMIN',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@futurelightglobal.com' },
    update: {},
    create: {
      name: 'Sarah Johnson',
      email: 'student@futurelightglobal.com',
      passwordHash: hashedStudentPassword,
      role: 'STUDENT',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  // 4. Seed Categories
  const catWeb = await prisma.category.create({
    data: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Build modern websites and web apps with Next.js, React, Node.js, and TypeScript.',
    },
  });

  const catBusiness = await prisma.category.create({
    data: {
      name: 'Business & Leadership',
      slug: 'business-leadership',
      description: 'Master strategic management, project planning, and global business growth.',
    },
  });

  const catAI = await prisma.category.create({
    data: {
      name: 'Data Science & AI',
      slug: 'data-science-ai',
      description: 'Learn Python, Machine Learning, Data Analytics, and AI Automation.',
    },
  });

  const catDesign = await prisma.category.create({
    data: {
      name: 'Design & UX',
      slug: 'design-user-experience',
      description: 'User interface design, Figma prototyping, and digital product creation.',
    },
  });

  // 5. Seed Course 1: Full-Stack Web Development Bootcamp
  const course1 = await prisma.course.create({
    data: {
      title: 'The Complete Web Development Bootcamp 2026',
      slug: 'fullstack-web-mastery',
      description: 'Become a full-stack web developer. Learn Next.js 14, React, Node.js, TypeScript, Tailwind CSS, and Prisma ORM by building real projects.',
      price: 84.99,
      isFree: false,
      isPublished: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      categoryId: catWeb.id,
    },
  });

  await prisma.section.create({
    data: {
      title: 'Section 1: Introduction to Web Architecture & Next.js 14',
      order: 1,
      courseId: course1.id,
      lessons: {
        create: [
          {
            title: 'Welcome to Future Light Global Web Bootcamp',
            order: 1,
            type: 'VIDEO',
            contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            contentText: 'Course introduction, setup requirements, and learning methodology.',
            durationMinutes: 12,
          },
          {
            title: 'Next.js 14 Architecture Cheat Sheet (PDF Guide)',
            order: 2,
            type: 'PDF',
            contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            contentText: 'Downloadable PDF guide covering Server Components, App Router, and caching.',
            durationMinutes: 15,
          },
          {
            title: 'Database Schema & Prisma ORM Basics',
            order: 3,
            type: 'ARTICLE',
            contentUrl: null,
            contentText: `### Database Setup with Prisma

In this section, we set up SQLite and Prisma ORM for seamless database access.

\`\`\`bash
npx prisma init
npx prisma db push
\`\`\`
`,
            durationMinutes: 18,
          },
        ],
      },
    },
  });

  await prisma.section.create({
    data: {
      title: 'Section 2: Authentication & Payment Gateway Integration',
      order: 2,
      courseId: course1.id,
      lessons: {
        create: [
          {
            title: 'Implementing Secure Cookie Authentication',
            order: 1,
            type: 'VIDEO',
            contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            contentText: 'Building HTTP-only JWT sessions with Jose and Middleware.',
            durationMinutes: 22,
          },
        ],
      },
    },
  });

  // 6. Seed Course 2: Executive Business Leadership
  const course2 = await prisma.course.create({
    data: {
      title: 'Global Business Strategy & Executive Leadership',
      slug: 'executive-business-leadership',
      description: 'Master strategic leadership, team delegation, digital transformation, and global business management at Future Light Global.',
      price: 69.99,
      isFree: false,
      isPublished: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
      categoryId: catBusiness.id,
    },
  });

  await prisma.section.create({
    data: {
      title: 'Module 1: Principles of Modern Leadership',
      order: 1,
      courseId: course2.id,
      lessons: {
        create: [
          {
            title: 'Executive Vision & Strategic Decision Making',
            order: 1,
            type: 'VIDEO',
            contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            contentText: 'Frameworks for high-impact leadership in modern organizations.',
            durationMinutes: 16,
          },
        ],
      },
    },
  });

  // 7. Seed Course 3: Free Introduction to UI/UX Design
  const course3 = await prisma.course.create({
    data: {
      title: 'Figma UI/UX Design Essentials (Free Masterclass)',
      slug: 'intro-uiux-figma-design',
      description: 'Learn wireframing, component design systems, typography, and interactive prototyping in Figma from scratch.',
      price: 0.0,
      isFree: true,
      isPublished: true,
      thumbnailUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800',
      categoryId: catDesign.id,
    },
  });

  await prisma.section.create({
    data: {
      title: 'Getting Started with Figma Workspaces',
      order: 1,
      courseId: course3.id,
      lessons: {
        create: [
          {
            title: 'Figma Toolbars, Frames & Auto-Layout',
            order: 1,
            type: 'VIDEO',
            contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            contentText: 'Step by step Figma canvas introduction.',
            durationMinutes: 14,
          },
        ],
      },
    },
  });

  // 8. Seed Student Enrollment
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: course3.id,
      },
    },
    update: {},
    create: {
      userId: student.id,
      courseId: course3.id,
      completionPercentage: 50.0,
    },
  });

  console.log('✅ Future Light Global Academy seeded successfully!');
  console.log('🔑 Demo Admin: admin@futurelightglobal.com / admin123');
  console.log('🔑 Demo Student: student@futurelightglobal.com / student123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
