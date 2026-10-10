import { prisma } from '@/lib/prisma';
import { Mail, Calendar, CheckCircle } from 'lucide-react';

export const revalidate = 0;

export default async function AdminEmailsPage() {
  const emails = await prisma.emailNotification.findMany({
    orderBy: { sentAt: 'desc' },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Sent Email Notification Audit Logs</h1>
        <p className="text-gray-500 text-sm">System audit log of purchase receipts, password reset links, and enrollment emails.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Recipient</th>
                <th className="p-4">Type</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Body Preview</th>
                <th className="p-4">Sent Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {emails.map((email) => (
                <tr key={email.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-bold text-gray-900">
                    {email.toEmail}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-800 font-bold text-xs rounded-full uppercase">
                      {email.type}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-gray-800">
                    {email.subject}
                  </td>
                  <td className="p-4 text-xs text-gray-500 font-mono max-w-xs truncate">
                    {email.body}
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {new Date(email.sentAt).toLocaleString()}
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
