import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function TermsPage() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 'default' } });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {settings?.termsText || 'Standard Terms of Service for LearnSphere LMS.'}
        </div>
      </main>

      <Footer />
    </div>
  );
}
