import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Award,
  Zap,
  Star,
  Users,
  CheckCircle2,
  Sparkles,
  Globe,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  const featuredCourses = await prisma.course.findMany({
    where: { isPublished: true },
    take: 6,
    include: {
      category: true,
      sections: {
        include: { lessons: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { courses: true } },
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      <Navbar />

      {/* Udemy-Style Hero Billboard Banner */}
      <section className="relative max-w-[1400px] mx-auto px-4 sm:px-6 py-6 w-full">
        <div className="relative h-[420px] sm:h-[480px] w-full rounded-2xl overflow-hidden shadow-2xl">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600"
            alt="Future Light Global Academy Learning"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent"></div>

          {/* Udemy Overlay Card */}
          <div className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-12 max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-200">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-[11px] font-extrabold rounded-full uppercase tracking-wider mb-3">
              Future Light Global Academy
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-3">
              Learn Without Limits. Master In-Demand Skills.
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
              Get world-class training in Web Development, Executive Business Leadership, AI, and Design. Start learning today.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="px-6 py-3 bg-slate-900 hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl transition"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Udemy Trust / Stats Bar */}
      <section className="border-b border-slate-200 py-6 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-wrap justify-around items-center gap-6 text-slate-600 text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-600" />
            <span>Over 10,000+ Enrolled Students</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-600" />
            <span>Expert Future Light Instructors</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-purple-600" />
            <span>Lifetime Access on Any Device</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-purple-600" />
            <span>30-Day Money-Back Guarantee</span>
          </div>
        </div>
      </section>

      {/* Udemy "A broad selection of courses" Section */}
      <section className="py-12 max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            A Broad Selection of Courses
          </h2>
          <p className="text-slate-600 text-sm">
            Choose from online video courses with new additions published every month.
          </p>
        </div>

        {/* Category Tabs Bar */}
        <div className="flex items-center space-x-4 border-b border-slate-200 pb-3 mb-8 overflow-x-auto text-sm font-bold">
          <Link href="/courses" className="text-slate-900 border-b-2 border-slate-900 pb-3 whitespace-nowrap">
            All Courses ({featuredCourses.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/courses?category=${cat.slug}`}
              className="text-slate-500 hover:text-slate-900 pb-3 whitespace-nowrap transition"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredCourses.map((course) => {
            const lessonCount = course.sections.reduce(
              (acc, sec) => acc + sec.lessons.length,
              0
            );
            return (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                slug={course.slug}
                description={course.description}
                price={course.price}
                isFree={course.isFree}
                thumbnailUrl={course.thumbnailUrl}
                categoryName={course.category?.name}
                sectionCount={course.sections.length}
                lessonCount={lessonCount}
              />
            );
          })}
        </div>
      </section>

      {/* Udemy-style Enterprise / Business Banner */}
      <section className="py-12 bg-slate-900 text-white my-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/30">
              <Briefcase className="h-4 w-4" />
              <span>Future Light Global for Business</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Upskill Your Enterprise Team with Future Light Global
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Get unlimited access to top Future Light Global courses for your team. Train employees in technology, leadership, project management, and data analytics.
            </p>
            <div className="pt-2">
              <Link
                href="/courses"
                className="px-6 py-3.5 bg-white text-slate-900 font-extrabold text-xs rounded-xl hover:bg-slate-100 transition inline-flex items-center space-x-2"
              >
                <span>Get Future Light Business</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800"
              alt="Team Training"
              className="w-full h-72 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Top Categories Grid */}
      {categories.length > 0 && (
        <section className="py-12 max-w-[1400px] mx-auto px-4 sm:px-6 w-full">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Top Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/courses?category=${cat.slug}`}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-900 transition group"
              >
                <div className="p-3 bg-white w-12 h-12 rounded-xl flex items-center justify-center text-slate-900 mb-4 shadow-xs group-hover:bg-slate-900 group-hover:text-white transition">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{cat._count.courses} Courses available</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
