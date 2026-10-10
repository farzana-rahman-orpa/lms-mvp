import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LearnSphere LMS - Online Learning Platform',
  description: 'Master new skills with online courses, video lessons, and interactive learning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between antialiased">
        {children}
      </body>
    </html>
  );
}
