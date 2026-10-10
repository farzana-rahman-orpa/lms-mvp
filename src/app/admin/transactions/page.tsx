import { prisma } from '@/lib/prisma';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function AdminTransactionsPage() {
  const transactions = await prisma.transaction.findMany({
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Transaction History</h1>
        <p className="text-gray-500 text-sm">Payment status, amounts, gateway references, and dates.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Student</th>
                <th className="p-4">Course</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Gateway</th>
                <th className="p-4">Reference</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">
                    <div>{tx.user.name}</div>
                    <div className="text-xs text-gray-400 font-normal">{tx.user.email}</div>
                  </td>
                  <td className="p-4 font-semibold text-gray-800">
                    {tx.course?.title || 'Direct Enrollment'}
                  </td>
                  <td className="p-4 font-extrabold text-emerald-600">
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-xs font-bold uppercase text-gray-600">
                    {tx.gateway}
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-500">
                    {tx.gatewayRef || 'N/A'}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full inline-flex items-center space-x-1">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>{tx.status}</span>
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
