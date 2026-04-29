import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getClients, getInventoryItems } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { SearchBar } from '@/components/SearchBar';
import { Eye, Package, PencilLine, Plus, Trash2, ArrowLeft, Printer } from 'lucide-react';
import { deleteInventoryItemAction } from '@/lib/actions';

export const revalidate = 30;

function normalizeSearchValue(value: string) {
    return value.trim().toLowerCase();
}

function matchesItemQuery(item: Awaited<ReturnType<typeof getInventoryItems>>[number], query: string) {
    if (!query) {
        return true;
    }

    const haystack = [
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

    return haystack.includes(query);
}

export default async function ClientInventoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ clientId: string }>;
    searchParams?: Promise<{ query?: string }>;
}) {
    const clientId = (await params).clientId;
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    const query = normalizeSearchValue(resolvedSearchParams?.query ?? '');
    const clients = await getClients();
    const client = clients.find(c => c.id === clientId);

    if (!client) {
        notFound();
    }

    const items = await getInventoryItems(clientId);
    const filteredItems = items.filter((item) => matchesItemQuery(item, query));

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/inventory">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-industrial tracking-tight">{client.name}</h1>
                        <p className="text-industrial/60 mt-1">Inventory Management</p>
                    </div>
                </div>
                <Link href={`/inventory/${clientId}/new-item`}>
                    <Button>
                        <Plus className="w-5 h-5 mr-2" />
                        Add Item
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <SearchBar placeholder="Search this client's items..." />
                {query ? (
                    <p className="text-sm text-industrial/50">
                        {filteredItems.length} result{filteredItems.length === 1 ? '' : 's'} for &quot;{resolvedSearchParams?.query?.trim()}&quot;
                    </p>
                ) : null}
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-kraft-dark/20 rounded-lg bg-kraft/10">
                    <p className="text-industrial/40 mb-4">No inventory items found for this client.</p>
                    <Link href={`/inventory/${clientId}/new-item`}>
                        <Button variant="secondary">Add first item</Button>
                    </Link>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-kraft-dark/20 rounded-lg bg-kraft/10">
                    <p className="text-industrial/40 mb-4">No items match &quot;{resolvedSearchParams?.query?.trim()}&quot;.</p>
                    <Link href={`/inventory/${clientId}`}>
                        <Button variant="secondary">Clear Search</Button>
                    </Link>
                </div>
            ) : (
                <div className="bg-kraft border border-kraft-dark/10 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-industrial text-kraft-lighter">
                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Item Details</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider text-center">Spec</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider text-center">Material</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider text-center">Stock</th>
                                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-kraft-dark/10">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-kraft-dark/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-industrial/40" />
                                                <Link href={`/inventory/${clientId}/items/${item.id}`} className="font-bold text-industrial hover:underline">
                                                    {item.name}
                                                </Link>
                                            </div>
                                            {item.itemCode && (
                                                <span className="text-[10px] font-mono text-industrial/50 ml-6 uppercase">{item.itemCode}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.boxSize ? (
                                            <div className="text-xs font-medium text-industrial">
                                                {item.boxSize.l}x{item.boxSize.w}x{item.boxSize.h}
                                            </div>
                                        ) : (
                                            <span className="text-industrial/30">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col gap-1 items-center">
                                            <span className="text-[10px] font-bold text-industrial/60 uppercase">
                                                {item.ply || '-'} / {item.gsm || '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-industrial/10 text-industrial">
                                            {item.quantity} {item.unit}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <Link href={`/inventory/${clientId}/items/${item.id}/print`}>
                                                <Button variant="ghost" size="icon" aria-label={`Print ${item.name}`}>
                                                    <Printer className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/inventory/${clientId}/items/${item.id}`}>
                                                <Button variant="ghost" size="icon" aria-label={`View ${item.name}`}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/inventory/${clientId}/items/${item.id}/edit`}>
                                                <Button variant="ghost" size="icon" aria-label={`Edit ${item.name}`}>
                                                    <PencilLine className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                'use server';
                                                await deleteInventoryItemAction(clientId, item.id);
                                            }}>
                                                <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" aria-label={`Delete ${item.name}`}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
