'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Mail, Send, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [debugUrl, setDebugUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to request reset');

      setMsg(data.message);
      if (data.debugTokenUrl) {
        setDebugUrl(data.debugTokenUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Request failed');
    } finally {
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
          <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-gray-500 text-xs mt-1">Enter your email to receive a password reset link</p>
        </div>

        {msg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>{msg}</span>
            </div>
            {debugUrl && (
              <div className="mt-2 pt-2 border-t border-emerald-200 text-[11px] font-mono break-all text-emerald-800">
                <span className="font-bold">Local Test Direct Reset Link:</span>
                <br />
                <a href={debugUrl} className="underline text-blue-700 hover:text-blue-900">
                  {debugUrl}
                </a>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@learnsphere.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{loading ? 'Sending Link...' : 'Send Reset Link'}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
