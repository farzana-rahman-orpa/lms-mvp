'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, GraduationCap, Mail, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function SuccessContent() {
  const searchParams = useSearchParams();
  const courseSlug = searchParams.get('courseSlug');
  const txRef = searchParams.get('txRef');

  return (
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-xl text-center w-full">
      <div className="mx-auto h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <CheckCircle className="h-12 w-12" />
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        Payment Confirmed & Enrolled!
      </h1>

      <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
        Your transaction was processed successfully. You are now automatically enrolled in the course.
      </p>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left text-xs text-gray-600 space-y-2 mb-8 max-w-md mx-auto">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Transaction Reference:</span>
          <span className="font-mono text-gray-900">{txRef || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Status:</span>
          <span className="text-emerald-600 font-bold">Confirmed / Active</span>
        </div>
        <div className="flex items-center space-x-1.5 pt-2 border-t border-gray-200 text-blue-600">
          <Mail className="h-4 w-4 shrink-0" />
          <span>An automated purchase receipt has been logged & sent to your email.</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {courseSlug ? (
          <Link
            href={`/courses/${courseSlug}`}
            className="px-6 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md flex items-center justify-center space-x-2 text-sm"
          >
            <GraduationCap className="h-5 w-5" />
            <span>Start Learning Now</span>
          </Link>
        ) : null}

        <Link
          href="/my-courses"
          className="px-6 py-3.5 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition flex items-center justify-center space-x-2 text-sm"
        >
          <span>Go to My Enrolled Courses</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 flex items-center justify-center">
        <Suspense fallback={<div className="text-gray-500">Loading receipt...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
