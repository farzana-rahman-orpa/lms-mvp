import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { notFound } from 'next/navigation';
import {
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  PlayCircle,
  Tag,
  ShieldCheck,
  Lock,
  GraduationCap,
  Star,
  Globe,
  Award,
  Download,
  Tv,
  Infinity
} from 'lucide-react';

export const revalidate = 0;

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getAuthUser();

  const course = await prisma.course.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
    include: {
      category: true,
      sections: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  let isEnrolled = false;
  if (user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });
    isEnrolled = !!enrollment || user.role === 'ADMIN';
  }

  const totalLessons = course.sections.reduce(
    (acc, sec) => acc + sec.lessons.length,
    0
  );

  const totalMinutes = course.sections.reduce((acc, sec) => {
    return acc + sec.lessons.reduce((lAcc, l) => lAcc + l.durationMinutes, 0);
  }, 0);

  const firstLessonId = course.sections[0]?.lessons[0]?.id;

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      <Navbar />

      {/* Udemy Dark Header Banner */}
      <section className="bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          
          {/* Main Title & Metadata */}
          <div className="lg:col-span-8 space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400">
              <Link href="/courses" className="hover:underline">Courses</Link>
              <span>&gt;</span>
              <span>{course.category?.name || 'General'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {course.description}
            </p>

            {/* Udemy Rating & Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <span className="bg-amber-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider">
                Bestseller
              </span>

              <div className="flex items-center text-amber-400 font-bold space-x-1">
                <span>4.8</span>
                <div className="flex text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                </div>
                <span className="text-slate-400 font-normal">(1,420 ratings)</span>
              </div>

              <span className="text-slate-400">•</span>
              <span className="text-slate-300 font-semibold">4,890 students enrolled</span>
            </div>

            <div className="text-xs text-slate-400 space-y-1 pt-2">
              <div>Created by <strong className="text-white">Future Light Global Academy Instructors</strong></div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Globe className="h-3.5 w-3.5 text-slate-400" />
                  <span>English</span>
                </span>
                <span>Last updated October 2026</span>
              </div>
            </div>
          </div>

          {/* Right Floating Udemy Purchase Card */}
          <div className="lg:col-span-4 bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 lg:sticky lg:top-24 z-20">
            <div className="relative h-48 w-full bg-slate-100 rounded-xl overflow-hidden mb-6">
              <img
                src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                <div className="h-14 w-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg text-slate-900 hover:scale-110 transition">
                  <PlayCircle className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="mb-6">
              {course.isFree || course.price === 0 ? (
                <div className="text-3xl font-extrabold text-emerald-600">FREE</div>
              ) : (
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl font-extrabold text-slate-900">${course.price.toFixed(2)}</div>
                  <div className="text-slate-400 line-through text-sm">${(course.price * 1.5).toFixed(2)}</div>
                  <div className="text-purple-600 text-xs font-bold">35% off</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEnrolled ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2 border border-emerald-200">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>You have full access to this course</span>
                </div>
                {firstLessonId ? (
                  <Link
                    href={`/learn/${course.slug}/${firstLessonId}`}
                    className="w-full py-3.5 bg-slate-900 text-white font-extrabold rounded-xl hover:bg-purple-600 transition shadow-md flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
                  >
                    <GraduationCap className="h-4 w-4" />
                    <span>Go to Course Player</span>
                  </Link>
                ) : null}
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href={`/checkout/${course.id}`}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl transition shadow-lg flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
                >
                  {course.isFree || course.price === 0 ? 'Enroll Now for Free' : 'Buy Now / Checkout'}
                </Link>
                <div className="text-center text-[11px] text-slate-500 font-medium pt-1">
                  30-Day Money-Back Guarantee
                </div>
              </div>
            )}

            {/* Included Features Checklist (Udemy Style) */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-xs space-y-3 text-slate-700">
              <div className="font-bold text-slate-900 uppercase text-[11px] tracking-wider mb-2">
                This course includes:
              </div>
              <div className="flex items-center space-x-2.5">
                <PlayCircle className="h-4 w-4 text-purple-600 shrink-0" />
                <span>~{totalMinutes} minutes on-demand video</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <FileText className="h-4 w-4 text-purple-600 shrink-0" />
                <span>{totalLessons} comprehensive lectures</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Download className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Downloadable PDF guides & materials</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Infinity className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Full lifetime access</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Tv className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Access on mobile, tablet, and desktop</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Award className="h-4 w-4 text-purple-600 shrink-0" />
                <span>Certificate of completion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="max-w-4xl space-y-10">
          
          {/* What You'll Learn Box (Udemy Style) */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
            <h2 className="text-lg font-extrabold text-slate-900 mb-4">What you'll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Build production-ready applications with modern frameworks.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Master database modeling, relations, and server architecture.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Implement secure authentication and role-based access control.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                <span>Earn a verified Future Light Global Academy Certificate.</span>
              </div>
            </div>
          </div>

          {/* Course Content Accordion (Udemy Style) */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Course content</h2>
                <p className="text-xs text-slate-500">
                  {course.sections.length} sections • {totalLessons} lectures • ~{totalMinutes}m total duration
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {course.sections.map((section, idx) => (
                <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-4 bg-slate-100/70 flex justify-between items-center font-bold text-xs text-slate-900">
                    <span>Section {idx + 1}: {section.title}</span>
                    <span className="text-slate-500 font-medium">{section.lessons.length} lectures</span>
                  </div>

                  <div className="divide-y divide-slate-100 bg-white">
                    {section.lessons.map((lesson) => (
                      <div key={lesson.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                        <div className="flex items-center space-x-3">
                          {lesson.type === 'VIDEO' ? (
                            <PlayCircle className="h-4 w-4 text-purple-600" />
                          ) : (
                            <FileText className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-semibold text-slate-800">{lesson.title}</span>
                        </div>
                        <span className="text-slate-400 text-[11px] font-mono">{lesson.durationMinutes}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
