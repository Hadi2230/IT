import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IT Helpdesk',
  description: 'ITSM portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {children}
        </div>
      </body>
    </html>
  );
}

