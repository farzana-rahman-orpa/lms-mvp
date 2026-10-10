import { prisma } from '@/lib/prisma';
import { BarChart3, DollarSign, BookOpen, TrendingUp } from 'lucide-react';

export const revalidate = 0;

export default async function AdminReportsPage() {
  const courses = await prisma.course.findMany({
    include: {
      transactions: {
        where: { status: 'SUCCESS' },
      },
      _count: { select: { enrollments: true } },
    },
  });

  const totalRevenue = courses.reduce((acc, c) => {
    return acc + c.transactions.reduce((tAcc, t) => tAcc + t.amount, 0);
  }, 0);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Sales & Revenue Reports</h1>
        <p className="text-gray-500 text-sm">Detailed revenue breakdown per course and enrollment stats.</p>
      </div>

      {/* Overview Stat Card */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200">Total Gross Platform Revenue</span>
          <div className="text-4xl font-extrabold mt-1">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
          <TrendingUp className="h-10 w-10 text-purple-200" />
        </div>
      </div>

      {/* Revenue Breakdown Per Course Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-900 text-sm">
          Course Sales Breakdown
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Course Title</th>
                <th className="p-4">Course Price</th>
                <th className="p-4">Total Purchases</th>
                <th className="p-4">Total Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {courses.map((course) => {
                const revenue = course.transactions.reduce((acc, t) => acc + t.amount, 0);
                return (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-900">{course.title}</td>
                    <td className="p-4 text-xs font-semibold">
                      {course.isFree || course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
                    </td>
                    <td className="p-4 text-xs font-bold text-gray-800">
                      {course.transactions.length} Sales ({course._count.enrollments} Total Students)
                    </td>
                    <td className="p-4 font-extrabold text-emerald-600">
                      ${revenue.toFixed(2)}
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
