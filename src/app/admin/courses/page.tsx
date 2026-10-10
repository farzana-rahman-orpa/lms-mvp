import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BookOpen, Plus, Edit, Trash2, Tag, Eye, EyeOff } from 'lucide-react';

export const revalidate = 0;

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      category: true,
      sections: {
        include: { lessons: true },
      },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Course Management</h1>
          <p className="text-gray-500 text-sm">Create, edit, manage structure, and configure pricing.</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-md flex items-center space-x-2 text-sm"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Course</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Course</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Structure</th>
                <th className="p-4">Students</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {courses.map((course) => {
                const lessonCount = course.sections.reduce((acc, sec) => acc + sec.lessons.length, 0);
                return (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{course.title}</div>
                      <div className="text-xs text-gray-400 line-clamp-1">{course.slug}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                        <Tag className="h-3 w-3" />
                        <span>{course.category?.name || 'Uncategorized'}</span>
                      </span>
                    </td>
                    <td className="p-4 font-bold">
                      {course.isFree || course.price === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        <span>${course.price.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {course.isPublished ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                          <Eye className="h-3.5 w-3.5" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                          <EyeOff className="h-3.5 w-3.5" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {course.sections.length} Sections • {lessonCount} Lessons
                    </td>
                    <td className="p-4 text-xs font-bold text-gray-900">
                      {course._count.enrollments} Enrolled
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold transition"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit / Builder</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
