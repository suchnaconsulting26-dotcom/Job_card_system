import Link from 'next/link';
import { getClients, getInventoryItems } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/SearchBar';
import { Building2, ChevronRight, Package, Plus } from 'lucide-react';

export const revalidate = 30;

function normalizeSearchValue(value: string) {
    return value.trim().toLowerCase();
}

function createItemSearchText(item: Awaited<ReturnType<typeof getInventoryItems>>[number], clientName: string) {
    return [
        clientName,
        item.name,
        item.itemCode,
        item.description,
        item.ply,
        item.gsm,
        item.topPaper,
        item.liner,
        item.cuttingSize,
        item.decalSize,
        item.printing,
        item.boxSize ? `${item.boxSize.l} ${item.boxSize.w} ${item.boxSize.h}` : '',
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

export default async function InventoryPage({
    searchParams,
}: {
    searchParams?: Promise<{ query?: string }>;
}) {
    const clients = await getClients();
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    const rawQuery = resolvedSearchParams?.query ?? '';
    const query = normalizeSearchValue(rawQuery);
    const items = query ? await getInventoryItems() : [];
    const clientNameById = new Map(clients.map((client) => [client.id, client.name]));
    const matchingItems = items.filter((item) =>
        createItemSearchText(item, clientNameById.get(item.clientId) ?? '').includes(query)
    );
    const matchedClientIds = new Set(matchingItems.map((item) => item.clientId));
    const filteredClients = query
        ? clients.filter((client) => client.name.toLowerCase().includes(query) || matchedClientIds.has(client.id))
        : clients;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-industrial tracking-tight">Inventory</h1>
                    <p className="text-industrial/60 mt-1">Manage items categorized by client.</p>
                </div>
                <Link href="/inventory/new-client">
                    <Button>
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Client
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <SearchBar placeholder="Search clients or their items..." />
                {query ? (
                    <p className="text-sm text-industrial/50">
                        {filteredClients.length} client result{filteredClients.length === 1 ? '' : 's'} and {matchingItems.length} item result{matchingItems.length === 1 ? '' : 's'} for &quot;{rawQuery.trim()}&quot;
                    </p>
                ) : null}
            </div>

            {clients.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-kraft-dark/20 rounded-lg bg-kraft/10">
                    <p className="text-industrial/40 mb-4">No client companies found.</p>
                    <Link href="/inventory/new-client">
                        <Button variant="secondary">Add your first client</Button>
                    </Link>
                </div>
            ) : query && filteredClients.length === 0 && matchingItems.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-kraft-dark/20 rounded-lg bg-kraft/10">
                    <p className="text-industrial/40 mb-4">No clients or items match &quot;{rawQuery.trim()}&quot;.</p>
                    <Link href="/inventory">
                        <Button variant="secondary">Clear Search</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-lg font-bold text-industrial">Clients</h2>
                            {query ? <span className="text-xs uppercase tracking-widest text-industrial/40">{filteredClients.length} matching</span> : null}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredClients.map((client) => {
                                const clientMatchCount = matchingItems.filter((item) => item.clientId === client.id).length;

                                return (
                                    <Link
                                        key={client.id}
                                        href={`/inventory/${client.id}`}
                                        className="group p-6 bg-kraft border border-kraft-dark/10 rounded-xl hover:shadow-lg hover:border-industrial/20 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-industrial/5 rounded-lg group-hover:bg-industrial/10 transition-colors">
                                                    <Building2 className="w-6 h-6 text-industrial" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-industrial">{client.name}</h3>
                                                    <p className="text-xs text-industrial/40 uppercase tracking-wider">
                                                        {query && clientMatchCount > 0 ? `${clientMatchCount} matching item${clientMatchCount === 1 ? '' : 's'}` : 'Client Category'}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-industrial/20 group-hover:text-industrial/40 transition-colors" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    {query ? (
                        <section className="space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-lg font-bold text-industrial">Matching Items</h2>
                                <span className="text-xs uppercase tracking-widest text-industrial/40">{matchingItems.length} found</span>
                            </div>
                            {matchingItems.length === 0 ? (
                                <div className="bg-kraft/30 border border-dashed border-kraft-dark/20 rounded-xl p-8 text-center text-industrial/40">
                                    No item names, codes, or specs matched your search.
                                </div>
                            ) : (
                                <div className="bg-kraft border border-kraft-dark/10 rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-industrial text-kraft-lighter">
                                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Client</th>
                                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Item</th>
                                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider text-center">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-kraft-dark/10">
                                            {matchingItems.map((item) => (
                                                <tr key={item.id} className="hover:bg-kraft-dark/5 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-industrial/70">{clientNameById.get(item.clientId) ?? 'Unknown client'}</td>
                                                    <td className="px-6 py-4">
                                                        <Link href={`/inventory/${item.clientId}/items/${item.id}`} className="flex items-center gap-3 hover:underline">
                                                            <Package className="w-4 h-4 text-industrial/40" />
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-industrial">{item.name}</span>
                                                                <span className="text-xs text-industrial/40 uppercase tracking-wide">{item.itemCode || 'No item code'}</span>
                                                            </div>
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-sm font-semibold text-industrial">{item.quantity} {item.unit}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    ) : null}
                </div>
            )}
        </div>
    );
}
