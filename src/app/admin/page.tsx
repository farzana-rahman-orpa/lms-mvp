import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  Users,
  BookOpen,
  DollarSign,
  GraduationCap,
  ArrowUpRight,
  UserPlus,
  ShoppingBag
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
  const totalCourses = await prisma.course.count();

  const transactions = await prisma.transaction.findMany({
    where: { status: 'SUCCESS' },
    select: { amount: true },
  });
  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const totalEnrollments = await prisma.enrollment.count();

  const recentSignups = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  const recentPurchases = await prisma.transaction.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

  return (
    <div className="p-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Overview of students, sales revenue, courses, and platform metrics.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Students</span>
            <div className="text-3xl font-extrabold text-gray-900 mt-1">{totalStudents}</div>
          </div>
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Courses</span>
            <div className="text-3xl font-extrabold text-gray-900 mt-1">{totalCourses}</div>
          </div>
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</span>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">${totalRevenue.toFixed(2)}</div>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Enrollments</span>
            <div className="text-3xl font-extrabold text-gray-900 mt-1">{totalEnrollments}</div>
          </div>
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Purchases */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900 text-base flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
              <span>Recent Purchases</span>
            </h2>
            <Link href="/admin/transactions" className="text-xs text-blue-600 font-bold hover:underline">
              View All
            </Link>
          </div>

          {recentPurchases.length === 0 ? (
            <p className="text-gray-400 text-xs py-4">No recent purchases recorded.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentPurchases.map((tx) => (
                <div key={tx.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-gray-900">{tx.user.name}</div>
                    <div className="text-gray-400">{tx.course.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-emerald-600 text-sm">${tx.amount.toFixed(2)}</div>
                    <div className="text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Signups */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900 text-base flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <span>Recent Student Signups</span>
            </h2>
            <Link href="/admin/students" className="text-xs text-blue-600 font-bold hover:underline">
              View All
            </Link>
          </div>

          {recentSignups.length === 0 ? (
            <p className="text-gray-400 text-xs py-4">No recent signups.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentSignups.map((st) => (
                <div key={st.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-gray-900">{st.name}</div>
                    <div className="text-gray-400">{st.email}</div>
                  </div>
                  <div className="text-gray-400">
                    Joined {new Date(st.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
