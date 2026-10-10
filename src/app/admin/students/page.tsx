'use client';

import { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, GraduationCap, DollarSign, Plus } from 'lucide-react';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Manual Enrollment Modal State
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async (query = search) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/students?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBlock = async (studentId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, isBlocked: !currentStatus }),
      });
      if (res.ok) fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourseId) return;
    setEnrolling(true);

    try {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          courseId: selectedCourseId,
        }),
      });

      if (res.ok) {
        setSelectedStudent(null);
        setSelectedCourseId('');
        fetchStudents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Student List & Management</h1>
          <p className="text-gray-500 text-sm">View student profiles, progress, block/unblock, and manually enroll students.</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-w-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchStudents();
          }}
          className="relative"
        >
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchStudents(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </form>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Enrolled Courses</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {students.map((st) => {
                const totalSpent = st.transactions.reduce((acc: number, t: any) => acc + t.amount, 0);
                return (
                  <tr key={st.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{st.name}</div>
                      <div className="text-xs text-gray-400">{st.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-semibold text-gray-800">
                        {st.enrollments.length} Courses
                      </div>
                      <div className="text-[11px] text-gray-400 line-clamp-1">
                        {st.enrollments.map((e: any) => e.course?.title).join(', ') || 'No enrollments'}
                      </div>
                    </td>
                    <td className="p-4 font-extrabold text-emerald-600">
                      ${totalSpent.toFixed(2)}
                    </td>
                    <td className="p-4">
                      {st.isBlocked ? (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-full">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {new Date(st.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="px-3 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold transition inline-flex items-center space-x-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Enroll Course</span>
                      </button>

                      <button
                        onClick={() => handleToggleBlock(st.id, st.isBlocked)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition inline-flex items-center space-x-1 ${
                          st.isBlocked
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {st.isBlocked ? <UserCheck className="h-3.5 w-3.5" /> : <UserX className="h-3.5 w-3.5" />}
                        <span>{st.isBlocked ? 'Unblock' : 'Block'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Enrollment Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">
              Manual Course Enrollment
            </h3>

            <p className="text-xs text-gray-600">
              Enroll <strong className="text-gray-900">{selectedStudent.name}</strong> ({selectedStudent.email}) into a course for free.
            </p>

            <form onSubmit={handleManualEnroll} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Select Course</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                >
                  <option value="">Choose Course...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.isFree ? 'Free' : `$${c.price}`})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={enrolling}
                  className="px-5 py-2 bg-purple-600 text-white font-bold rounded-lg text-xs hover:bg-purple-700"
                >
                  {enrolling ? 'Enrolling...' : 'Confirm Manual Enrollment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
