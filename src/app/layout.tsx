import type { Metadata } from 'next';
import './globals.css';
import { PasswordRecoveryListener } from '@/components/PasswordRecoveryListener';

export const metadata: Metadata = {
  title: 'BOXCRAFT • Job Card System & Packaging OS',
  description: 'Complete Job Card & Production Management System for Corrugated Packaging Manufacturers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-kraft-lighter text-industrial font-sans antialiased">
        <PasswordRecoveryListener />
        {children}
      </body>
    </html>
  );
}
