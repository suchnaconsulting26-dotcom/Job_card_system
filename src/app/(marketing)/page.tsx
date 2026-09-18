import { HeroSection } from '@/components/marketing/HeroSection';
import { BoxCalculator } from '@/components/marketing/BoxCalculator';
import { WorkflowVisualizer } from '@/components/marketing/WorkflowVisualizer';
import { TicketPreviewModal } from '@/components/marketing/TicketPreviewModal';
import { FeatureGrid } from '@/components/marketing/FeatureGrid';
import { IndustrySolutions } from '@/components/marketing/IndustrySolutions';
import { RoiCalculator } from '@/components/marketing/RoiCalculator';
import { PricingSection } from '@/components/marketing/PricingSection';
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection';
import { FaqSection } from '@/components/marketing/FaqSection';
import { CtaBanner } from '@/components/marketing/CtaBanner';

import { getDashboardStats, getJobCards } from '@/lib/storage';
import { JobCard } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function MarketingHomePage() {
  let liveStats: {
    totalJobCards: number;
    totalClients: number;
    pendingJobCards: number;
    inProgressJobCards: number;
    completedJobCards: number;
  } | undefined = undefined;

  let latestJob: JobCard | undefined = undefined;

  try {
    const [stats, jobs] = await Promise.all([
      getDashboardStats(),
      getJobCards(),
    ]);

    if (stats && stats.totalJobCards > 0) {
      liveStats = {
        totalJobCards: stats.totalJobCards,
        totalClients: stats.totalClients,
        pendingJobCards: stats.pendingJobCards,
        inProgressJobCards: stats.inProgressJobCards,
        completedJobCards: stats.completedJobCards,
      };
    }

    if (jobs && jobs.length > 0) {
      latestJob = jobs[0];
    }
  } catch {
    // Gracefully falls back to sample demo data when database is unconfigured
  }

  return (
    <div className="space-y-0">
      <HeroSection liveStats={liveStats} latestJob={latestJob} />
      <BoxCalculator />
      <WorkflowVisualizer />
      <TicketPreviewModal />
      <FeatureGrid />
      <IndustrySolutions />
      <RoiCalculator />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBanner />
    </div>
  );
}
