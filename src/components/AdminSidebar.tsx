'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  CreditCard,
  BarChart3,
  Settings,
  Mail,
  ArrowLeft,
  DollarSign,
  Code,
  Shield,
  Sparkles
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Course Management', href: '/admin/courses', icon: BookOpen },
    { name: 'Student List', href: '/admin/students', icon: Users },
    { name: 'Enrollments', href: '/admin/enrollments', icon: GraduationCap },
    { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
    { name: 'Sales Reports', href: '/admin/reports', icon: BarChart3 },
    { name: 'Payment Gateway', href: '/admin/settings/payment', icon: DollarSign },
    { name: 'Site Settings', href: '/admin/settings/site', icon: Settings },
    { name: 'Embed & Integration', href: '/admin/settings/embed', icon: Code },
    { name: 'Sent Email Logs', href: '/admin/emails', icon: Mail },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-300 min-h-screen p-4 flex flex-col justify-between border-r border-slate-800/80 shadow-xl shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-3 py-4 border-b border-slate-800/80 mb-6">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1">
              Admin Panel
              <Sparkles className="h-3 w-3 text-purple-400" />
            </div>
            <div className="text-[10px] text-slate-400 font-medium">LearnSphere Control</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white transition px-3 py-2 rounded-xl hover:bg-slate-900 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Exit to Student Portal</span>
        </Link>
      </div>
    </aside>
  );
}
