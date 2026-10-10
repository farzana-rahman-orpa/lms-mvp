import AdminSidebar from '@/components/AdminSidebar';
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user || user.role !== 'ADMIN') {
    redirect('/login?redirect=/admin');
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
