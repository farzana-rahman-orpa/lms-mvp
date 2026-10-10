'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, Suspense } from 'react';
import {
  Search,
  User,
  LogOut,
  Shield,
  GraduationCap,
  CreditCard,
  Menu,
  X,
  ArrowLeft,
  ChevronDown,
  Globe,
  ShoppingCart,
  Heart,
  Bell,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
  photoUrl?: string | null;
}

function NavbarContent() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isEmbedded = searchParams.get('embed') === 'true' || searchParams.get('isEmbed') === 'true';
  const returnUrl = searchParams.get('returnUrl') || searchParams.get('parentUrl');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});

    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (catRef.current && !catRef.current.contains(event.target as Node)) {
        setCategoryDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/login';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let target = searchQuery.trim() ? `/courses?search=${encodeURIComponent(searchQuery.trim())}` : '/courses';
    if (returnUrl) target += `${target.includes('?') ? '&' : '?'}returnUrl=${encodeURIComponent(returnUrl)}`;
    if (isEmbedded) target += `${target.includes('?') ? '&' : '?'}embed=true`;
    router.push(target);
  };

  if (isEmbedded) {
    return (
      <div className="bg-slate-900 text-white px-4 py-2 text-xs font-semibold flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-purple-400" />
          <span>Future Light Global Academy</span>
        </div>
        {returnUrl && (
          <a
            href={returnUrl}
            target="_top"
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full flex items-center space-x-1 transition text-[11px]"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Return to Main Site</span>
          </a>
        )}
      </div>
    );
  }

  return (
    <>
      {returnUrl && (
        <div className="bg-slate-950 text-slate-300 text-xs px-4 py-2 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Referenced from parent site:</span>
            <span className="font-semibold text-purple-300 truncate max-w-xs">{returnUrl}</span>
          </div>
          <a
            href={returnUrl}
            className="px-3 py-1 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition flex items-center space-x-1 text-[11px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Main Website</span>
          </a>
        </div>
      )}

      {/* Udemy-Style Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs text-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-18 py-2.5 gap-4">
          
          {/* Logo & Category Button */}
          <div className="flex items-center space-x-4 shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:bg-purple-600 transition">
                FL
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                  Future Light
                </span>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest mt-0.5">
                  Global Academy
                </span>
              </div>
            </Link>

            {/* Udemy-style Categories Dropdown */}
            <div className="relative hidden lg:block" ref={catRef}>
              <button
                onClick={() => setCategoryDropdown(!categoryDropdown)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-purple-600 transition flex items-center space-x-1 rounded-md hover:bg-slate-50"
              >
                <span>Categories</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {categoryDropdown && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-2xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Top Course Categories
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/courses?category=${cat.slug}`}
                      onClick={() => setCategoryDropdown(false)}
                      className="block px-3 py-2 text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium rounded-lg transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar (Udemy Style) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Search for anything (e.g., Web Development, Leadership, Figma, Python)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100/80 border border-slate-300 rounded-full text-xs font-medium text-slate-900 placeholder-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              />
              <Search className="absolute left-4 h-4 w-4 text-slate-400" />
            </div>
          </form>

          {/* Right Links & Actions */}
          <div className="hidden md:flex items-center space-x-4 text-xs font-medium shrink-0">
            <Link href="/courses" className="text-slate-700 hover:text-purple-600 transition">
              Explore Catalog
            </Link>

            {user ? (
              <>
                <Link href="/my-courses" className="text-slate-700 hover:text-purple-600 font-bold transition flex items-center space-x-1">
                  <GraduationCap className="h-4 w-4 text-purple-600" />
                  <span>My Learning</span>
                </Link>

                <Link href="/transactions" className="text-slate-700 hover:text-purple-600 transition">
                  Purchases
                </Link>

                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-md hover:bg-slate-800 transition flex items-center space-x-1"
                  >
                    <Shield className="h-3.5 w-3.5 text-purple-400" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {/* Profile Avatar & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1.5 p-1 rounded-full hover:bg-slate-100 transition"
                  >
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover border-2 border-slate-900"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 text-xs space-y-1">
                      <div className="p-3 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                        <div className="font-bold text-slate-900 truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                        <div className="mt-1.5 inline-block px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[10px] rounded-md uppercase">
                          {user.role} Account
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl font-medium"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        <span>Edit Profile</span>
                      </Link>

                      <Link
                        href="/my-courses"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl font-medium"
                      >
                        <GraduationCap className="h-4 w-4 text-purple-600" />
                        <span>My Learning Dashboard</span>
                      </Link>

                      <Link
                        href="/transactions"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center space-x-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl font-medium"
                      >
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        <span>Purchase & Receipt Logs</span>
                      </Link>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-bold"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 border border-slate-900 text-slate-900 font-bold rounded-md hover:bg-slate-50 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-slate-900 text-white font-bold rounded-md hover:bg-slate-800 shadow-sm transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Drawer Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-slate-100 rounded-lg text-xs"
              />
            </form>

            <Link href="/courses" className="block text-slate-800 font-bold py-1 text-sm">
              Explore Course Catalog
            </Link>

            {user ? (
              <>
                <Link href="/my-courses" className="block text-slate-800 font-bold py-1 text-sm">
                  My Learning
                </Link>
                <Link href="/transactions" className="block text-slate-800 font-medium py-1 text-sm">
                  Purchase History
                </Link>
                <Link href="/profile" className="block text-slate-800 font-medium py-1 text-sm">
                  Edit Profile
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="block text-purple-700 font-bold py-1 text-sm">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 font-bold py-1 text-sm"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col space-y-2">
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 border border-slate-900 text-slate-900 font-bold rounded-md text-sm"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2.5 bg-slate-900 text-white font-bold rounded-md text-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 bg-white border-b" />}>
      <NavbarContent />
    </Suspense>
  );
}
