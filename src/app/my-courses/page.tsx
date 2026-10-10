import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { GraduationCap, PlayCircle, BookOpen, Clock, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function MyCoursesPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect('/login?redirect=/my-courses');
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
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
      },
    },
    orderBy: { lastAccessedAt: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">My Enrolled Courses</h1>
            <p className="text-gray-600 text-sm">
              Track your learning progress and resume your courses right where you left off.
            </p>
          </div>
          <Link
            href="/courses"
            className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 text-sm flex items-center space-x-1"
          >
            <span>Explore More</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-8 shadow-sm">
            <div className="mx-auto h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Enrolled Courses Yet</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              You have not enrolled in any courses yet. Browse our course catalog to get started.
            </p>
            <Link
              href="/courses"
              className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md inline-block"
            >
              Browse Course Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrollments.map((enr) => {
              const course = enr.course;
              const firstLessonId = course.sections[0]?.lessons[0]?.id;
              const totalLessons = course.sections.reduce(
                (acc, sec) => acc + sec.lessons.length,
                0
              );

              return (
                <div
                  key={enr.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden"
                >
                  <div className="relative h-44 w-full bg-gray-100">
                    <img
                      src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    {course.category && (
                      <span className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-md font-medium">
                        {course.category.name}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-4">
                        {course.description}
                      </p>
                    </div>

                    <div>
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span>Course Completion</span>
                          <span className="text-blue-600 font-bold">{enr.completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200">
                          <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${enr.completionPercentage}%` }}
                          />
                        </div>
                      </div>

                      {firstLessonId ? (
                        <Link
                          href={`/learn/${course.slug}/${firstLessonId}`}
                          className="w-full py-2.5 px-4 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center justify-center space-x-2"
                        >
                          <PlayCircle className="h-4 w-4" />
                          <span>Resume Where You Left Off</span>
                        </Link>
                      ) : (
                        <div className="text-xs text-gray-400 text-center py-2">
                          Content update in progress
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
