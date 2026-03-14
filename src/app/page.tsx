import Link from 'next/link';
import { getJobCards } from '@/lib/storage';
import { JobCardItem } from '@/components/JobCardItem';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';

export const revalidate = 30; // Cache for 30 seconds

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  const cards = await getJobCards();

  const filteredCards = query ? cards.filter((card) => {
    const term = query.toLowerCase();
    return (
      card.partyName.toLowerCase().includes(term) ||
      card.boxName.toLowerCase().includes(term) ||
      card.jobNo.toString().includes(term)
    );
  }) : cards;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-industrial tracking-tight">Dashboard</h1>
          <p className="text-industrial/60 mt-1">Manage your active job cards.</p>
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

      {filteredCards.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-kraft-dark/20 rounded-lg">
          <p className="text-industrial/40 mb-4">
            {query ? `No job cards found matching "${query}"` : "No job cards found."}
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
    </div>
  );
}
