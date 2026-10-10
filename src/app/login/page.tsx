'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, Lock, Mail, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data.user.role === 'ADMIN') {
        window.location.href = '/admin';
      } else {
        window.location.href = redirectUrl;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
      setLoading(false);
    }
  };

  const fillDemo = (role: 'student' | 'admin') => {
    if (role === 'student') {
      setEmail('student@futurelightglobal.com');
      setPassword('student123');
    } else {
      setEmail('admin@futurelightglobal.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center max-w-sm">
          <Link href="/" className="inline-flex items-center space-x-3 mb-8">
            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-slate-900 font-extrabold text-2xl shadow-lg">
              FL
            </div>
            <div className="text-left">
              <div className="text-white font-extrabold text-2xl leading-none">Future Light</div>
              <div className="text-purple-300 font-bold text-xs uppercase tracking-widest mt-0.5">Global Academy</div>
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Your Journey to Mastery Starts Here
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Access world-class courses in Web Development, Business Leadership, AI, and Design.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
            {['10,000+ Students', '50+ Courses', 'Expert Instructors', 'Lifetime Access'].map((s) => (
              <div key={s} className="flex items-center space-x-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                <Zap className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span className="text-white text-xs font-semibold">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-extrabold">FL</div>
              <span className="font-extrabold text-slate-900 text-lg">Future Light Global Academy</span>
            </Link>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-8">Sign in to continue your learning journey.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@futurelightglobal.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white transition"
                />
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-purple-600 hover:text-purple-700 font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white transition"
                />
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-purple-600 transition shadow-md text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-slate-900 font-bold hover:text-purple-600 transition">
              Sign up for free
            </Link>
          </p>

          {/* Demo Credentials Helper */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-3">
            <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Quick Demo Access</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('student')}
                className="flex flex-col items-start p-2.5 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition"
              >
                <span className="font-bold text-slate-800">Student Account</span>
                <span className="text-slate-500 truncate w-full text-[10px]">student@futurelightglobal.com</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="flex flex-col items-start p-2.5 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition"
              >
                <span className="font-bold text-slate-800">Admin Account</span>
                <span className="text-slate-500 truncate w-full text-[10px]">admin@futurelightglobal.com</span>
              </button>
            </div>
            <p className="text-slate-400 text-[10px]">Click a button above to auto-fill the credentials, then sign in.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
