import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DollarSign, CheckCircle, CreditCard, Calendar } from 'lucide-react';

export const revalidate = 0;

export default async function TransactionsPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect('/login?redirect=/transactions');
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    include: {
      course: { select: { title: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Purchase & Payment History</h1>
          <p className="text-gray-600 text-sm">
            Review all completed transactions, digital receipts, and payment references.
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-8 shadow-sm">
            <div className="mx-auto h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-500 text-sm">
              You haven't made any course purchases yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Course</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Gateway</th>
                    <th className="p-4">Reference ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 font-bold text-gray-900">
                        {tx.course?.title || 'Course Purchase'}
                      </td>
                      <td className="p-4 font-extrabold text-gray-900">
                        ${tx.amount.toFixed(2)}
                      </td>
                      <td className="p-4 uppercase text-xs font-semibold text-gray-600">
                        {tx.gateway}
                      </td>
                      <td className="p-4 font-mono text-xs text-gray-500">
                        {tx.gatewayRef || 'N/A'}
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>SUCCESS</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
