import type { Metadata } from 'next';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'BOXCRAFT • Job Card System for Corrugated Packaging Plants',
  description:
    'The modern SaaS operating system for corrugated box manufacturers and sheet converters. Instant flute & GSM calculations, 9-stage shop floor tracking, and millimeter-accurate A4 printable job tickets.',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-kraft-lighter texture-paper text-industrial selection:bg-industrial selection:text-kraft-lighter">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
