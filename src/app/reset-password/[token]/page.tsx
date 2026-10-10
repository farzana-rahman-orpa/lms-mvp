'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Lock, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: params.token,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      setMsg(data.message);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Reset failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 font-extrabold text-2xl mb-2">
            <BookOpen className="h-8 w-8" />
            <span>LearnSphere</span>
          </Link>
          <h2 className="text-xl font-bold text-gray-900">Set New Password</h2>
          <p className="text-gray-500 text-xs mt-1">Type your new password below</p>
        </div>

        {msg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>{msg}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md text-sm disabled:opacity-50"
          >
            {loading ? 'Resetting Password...' : 'Save New Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
