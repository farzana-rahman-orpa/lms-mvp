import { prisma } from '@/lib/prisma';
import { GraduationCap, BookOpen, Calendar, User } from 'lucide-react';

export const revalidate = 0;

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true, price: true, isFree: true } },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Enrollments Record</h1>
        <p className="text-gray-500 text-sm">Full log of student enrollments, completion rates, and active dates.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Course Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Enrolled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {enrollments.map((enr) => (
                <tr key={enr.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">
                    <div>{enr.user.name}</div>
                    <div className="text-xs text-gray-400 font-normal">{enr.user.email}</div>
                  </td>
                  <td className="p-4 font-bold text-gray-900">
                    {enr.course.title}
                  </td>
                  <td className="p-4 text-xs">
                    {enr.course.isFree || enr.course.price === 0 ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold rounded">Free</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold rounded">Paid (${enr.course.price.toFixed(2)})</span>
                    )}
                  </td>
                  <td className="p-4 text-xs font-bold text-blue-600">
                    {enr.completionPercentage}% Completed
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(enr.enrolledAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
