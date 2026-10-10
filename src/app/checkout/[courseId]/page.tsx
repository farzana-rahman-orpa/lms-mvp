'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CreditCard, ShieldCheck, CheckCircle, ArrowRight, Lock, DollarSign } from 'lucide-react';

export default function CheckoutPage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [selectedGateway, setSelectedGateway] = useState<'MOCK' | 'STRIPE'>('MOCK');
  const [user, setUser] = useState<any>(null);

  // Mock Card Fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  useEffect(() => {
    fetchUserAndCourse();
  }, [params.courseId]);

  const fetchUserAndCourse = async () => {
    try {
      // Fetch current user
      const userRes = await fetch('/api/auth/me');
      if (!userRes.ok) {
        router.push(`/login?redirect=/checkout/${params.courseId}`);
        return;
      }
      const userData = await userRes.json();
      setUser(userData.user);

      // Fetch course details
      const courseRes = await fetch(`/api/courses/${params.courseId}`);
      if (!courseRes.ok) throw new Error('Course not found');
      const courseData = await courseRes.json();

      setCourse(courseData.course);
      if (courseData.isEnrolled) {
        router.push(`/courses/${courseData.course.slug}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load checkout');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          gateway: selectedGateway,
          paymentDetails: {
            cardNumber,
            reference: `${selectedGateway.toLowerCase()}_ref_${Date.now()}`,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment failed');

      router.push(`/checkout/success?courseSlug=${course.slug}&txRef=${data.transaction?.gatewayRef || 'mock_ref'}`);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">Loading checkout details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">Course not found.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Checkout & Order Review</h1>
          <p className="text-gray-600 text-sm">
            Complete your enrollment and get instant access to all video lessons and materials.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Payment Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span>Select Payment Gateway</span>
            </h2>

            {/* Gateway Toggle Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setSelectedGateway('MOCK')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition ${
                  selectedGateway === 'MOCK'
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-gray-900">Instant Mock Gateway</span>
                  {selectedGateway === 'MOCK' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                </div>
                <span className="text-xs text-gray-500">1-Click instant test checkout without real card details</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGateway('STRIPE')}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition ${
                  selectedGateway === 'STRIPE'
                    ? 'border-purple-600 bg-purple-50/50 ring-2 ring-purple-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-sm text-gray-900">Stripe Payment</span>
                  {selectedGateway === 'STRIPE' && <CheckCircle className="h-4 w-4 text-purple-600" />}
                </div>
                <span className="text-xs text-gray-500">Stripe Test / Live Card Gateway Mode</span>
              </button>
            </div>

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={user?.name || ''}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    CVC Code
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                >
                  <Lock className="h-4 w-4" />
                  <span>
                    {processing
                      ? 'Processing Payment...'
                      : course.isFree || course.price === 0
                      ? 'Confirm Free Enrollment'
                      : `Pay $${course.price.toFixed(2)} via ${selectedGateway}`}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
              Order Summary
            </h3>

            <div className="flex space-x-3 mb-4">
              <img
                src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'}
                alt={course.title}
                className="h-16 w-20 object-cover rounded-lg shrink-0"
              />
              <div>
                <h4 className="font-bold text-sm text-gray-900 line-clamp-2">{course.title}</h4>
                <span className="text-xs text-gray-500">Lifetime Access</span>
              </div>
            </div>

            <div className="space-y-2 py-3 border-t border-b border-gray-100 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Original Price</span>
                <span>${course.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxes & Fees</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Due</span>
                <span className="text-blue-600 text-lg">
                  {course.isFree || course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 flex items-center space-x-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>An automated receipt will be logged to your account upon checkout.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
