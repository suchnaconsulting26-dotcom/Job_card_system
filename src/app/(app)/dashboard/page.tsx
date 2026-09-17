import Link from 'next/link';
import { getJobCards, getDashboardStats } from '@/lib/storage';
import { JobCardItem } from '@/components/JobCardItem';
import { Button } from '@/components/ui/Button';
import { Plus, Layers, Users, Package } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';

export const revalidate = 30;

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  sub,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-sm border border-kraft-dark/20 shadow-sm px-6 py-5 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${accent}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-industrial/50 truncate">{label}</p>
        <p className="text-3xl font-bold text-industrial font-mono leading-tight">{value}</p>
        {sub && <p className="text-xs text-industrial/40 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Status pill ──────────────────────────────────────────────────────────────
function StatusPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
      <span className="text-sm text-industrial/70">{label}</span>
      <span className="ml-auto text-sm font-bold font-mono text-industrial">{count}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;

  // Parallel fetches — stats + full card list
  const [stats, cards] = await Promise.all([
    getDashboardStats(),
    getJobCards(),
  ]);

  const filteredCards = query
    ? cards.filter((card) => {
        const term = query.toLowerCase();
        return (
          card.partyName.toLowerCase().includes(term) ||
          card.boxName.toLowerCase().includes(term)
        );
      })
    : cards;

  return (
    <div className="space-y-8">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-industrial tracking-tight">Dashboard</h1>
          <p className="text-industrial/60 mt-1">Overview & active job cards</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <SearchBar />
          <Link href="/create">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              New Job Card
            </Button>
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          UPPER PART — Summary Stats
      ══════════════════════════════════════════════════════════════════════ */}
      <section aria-label="Summary statistics">
        {/* Primary counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <StatCard
            label="Total Job Cards"
            value={stats.totalJobCards}
            icon={Layers}
            accent="bg-industrial"
            sub="Dashboard + Industries"
          />
          <StatCard
            label="Total Clients"
            value={stats.totalClients}
            icon={Users}
            accent="bg-kraft-dark"
          />
          <StatCard
            label="Industry Items"
            value={stats.totalInventoryItems}
            icon={Package}
            accent="bg-[#6B7280]"
            sub="Across all industries"
          />
        </div>

        {/* Status breakdown bar */}
        <div className="bg-white rounded-sm border border-kraft-dark/20 shadow-sm px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-industrial/50 mb-4">
            Job Card Status Breakdown
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatusPill label="Pending"     count={stats.pendingJobCards}    color="bg-yellow-400" />
            <StatusPill label="In Progress" count={stats.inProgressJobCards} color="bg-blue-500"   />
            <StatusPill label="Completed"   count={stats.completedJobCards}  color="bg-green-500"  />
          </div>

          {/* Visual progress bar */}
          {stats.totalJobCards > 0 && (
            <div className="mt-4 flex h-2.5 rounded-full overflow-hidden gap-px">
              {stats.pendingJobCards > 0 && (
                <div
                  className="bg-yellow-400 transition-all"
                  style={{ width: `${(stats.pendingJobCards / stats.totalJobCards) * 100}%` }}
                />
              )}
              {stats.inProgressJobCards > 0 && (
                <div
                  className="bg-blue-500 transition-all"
                  style={{ width: `${(stats.inProgressJobCards / stats.totalJobCards) * 100}%` }}
                />
              )}
              {stats.completedJobCards > 0 && (
                <div
                  className="bg-green-500 transition-all"
                  style={{ width: `${(stats.completedJobCards / stats.totalJobCards) * 100}%` }}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LOWER PART — Job Cards Grid
      ══════════════════════════════════════════════════════════════════════ */}
      <section aria-label="Job cards list">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-industrial">
            {query ? `Results for "${query}"` : 'Recent Job Cards'}
            <span className="ml-2 text-sm font-normal text-industrial/50">
              ({filteredCards.length})
            </span>
          </h2>
        </div>

        {filteredCards.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-kraft-dark/20 rounded-lg">
            <p className="text-industrial/40 mb-4">
              {query ? `No job cards found matching "${query}"` : 'No job cards found.'}
            </p>
            {!query && (
              <Link href="/create">
                <Button variant="secondary">Create your first job card</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <JobCardItem key={card.id} card={card} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
