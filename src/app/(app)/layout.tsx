import { Sidebar } from '@/components/Sidebar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-kraft-lighter flex">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 print:ml-0 print:p-0">
        {children}
      </main>
    </div>
  );
}
