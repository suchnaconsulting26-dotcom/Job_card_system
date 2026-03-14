import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Job Card System',
  description: 'Job card management system',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-kraft-lighter flex">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 print:ml-0 print:p-0">
          {children}
        </main>
      </body>
    </html>
  );
}
