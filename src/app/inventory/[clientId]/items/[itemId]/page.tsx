import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Boxes, FilePenLine, Package, PencilLine, Ruler, Printer } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getClients, getInventoryItemById } from '@/lib/storage';

export const revalidate = 30;

function displayValue(value?: string | number | boolean) {
    if (value === true) {
        return 'Yes';
    }

    if (value === false) {
        return 'No';
    }

    if (value == null || value === '') {
        return '-';
    }

    return String(value);
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export default async function InventoryItemDetailPage({
    params,
}: {
    params: Promise<{ clientId: string; itemId: string }>;
}) {
    const { clientId, itemId } = await params;
    const [client, item] = await Promise.all([
        getClients().then((clients) => clients.find((entry) => entry.id === clientId)),
        getInventoryItemById(itemId),
    ]);

    if (!client || !item || item.clientId !== clientId) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={`/inventory/${clientId}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-industrial/40">{client.name}</p>
                        <h1 className="text-3xl font-bold text-industrial tracking-tight">{item.name}</h1>
                        <p className="text-industrial/60 mt-1">Created {formatDate(item.createdAt)} and updated {formatDate(item.updatedAt)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href={`/inventory/${clientId}/items/${itemId}/print`}>
                        <Button variant="secondary">
                            <Printer className="w-5 h-5 mr-2" />
                            Print Job Card
                        </Button>
                    </Link>
                    <Link href={`/inventory/${clientId}/items/${itemId}/edit`}>
                        <Button>
                            <PencilLine className="w-5 h-5 mr-2" />
                            Edit Item
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 bg-kraft border border-kraft-dark/10 rounded-xl p-6 space-y-6 shadow-sm">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-industrial/40 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Item Overview
                        </h2>
                    </div>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <dt className="text-xs uppercase tracking-widest text-industrial/40">Item Code</dt>
                            <dd className="mt-1 font-semibold text-industrial">{displayValue(item.itemCode)}</dd>
                        </div>
                        <div>
                            <dt className="text-xs uppercase tracking-widest text-industrial/40">Stock</dt>
                            <dd className="mt-1 font-semibold text-industrial">{item.quantity} {item.unit}</dd>
                        </div>
                        <div className="md:col-span-2">
                            <dt className="text-xs uppercase tracking-widest text-industrial/40">Description</dt>
                            <dd className="mt-1 text-industrial">{displayValue(item.description)}</dd>
                        </div>
                    </dl>
                </section>

                <section className="bg-industrial text-kraft-lighter rounded-xl p-6 space-y-4 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-kraft/70 flex items-center gap-2">
                        <Boxes className="w-4 h-4" />
                        Quick Specs
                    </h2>
                    <div className="space-y-3 text-sm">
                        <p><span className="text-kraft/60">Dimensions:</span> {displayValue(item.boxSize ? `${item.boxSize.l} x ${item.boxSize.w} x ${item.boxSize.h} mm` : undefined)}</p>
                        <p><span className="text-kraft/60">Material:</span> {displayValue(item.ply)} / {displayValue(item.gsm)}</p>
                        <p><span className="text-kraft/60">Top Paper:</span> {displayValue(item.topPaper)}</p>
                        <p><span className="text-kraft/60">Liner:</span> {displayValue(item.liner)}</p>
                        <p><span className="text-kraft/60">Printing:</span> {displayValue(item.printing)}</p>
                        <p><span className="text-kraft/60">Stitching:</span> {displayValue(item.stitching)}</p>
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-kraft border border-kraft-dark/10 rounded-xl p-6 space-y-4 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-industrial/40 flex items-center gap-2">
                        <Ruler className="w-4 h-4" />
                        Dimensions
                    </h2>
                    <dl className="space-y-3 text-sm text-industrial">
                        <div className="flex justify-between gap-4">
                            <dt className="text-industrial/50">Box Size</dt>
                            <dd>{displayValue(item.boxSize ? `${item.boxSize.l} x ${item.boxSize.w} x ${item.boxSize.h} mm` : undefined)}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-industrial/50">Cutting Size</dt>
                            <dd>{displayValue(item.cuttingSize)}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-industrial/50">Decal Size</dt>
                            <dd>{displayValue(item.decalSize)}</dd>
                        </div>
                    </dl>
                </section>

                <section className="bg-kraft border border-kraft-dark/10 rounded-xl p-6 space-y-4 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-industrial/40 flex items-center gap-2">
                        <FilePenLine className="w-4 h-4" />
                        Production Notes
                    </h2>
                    <dl className="space-y-3 text-sm text-industrial">
                        <div className="flex justify-between gap-4">
                            <dt className="text-industrial/50">Printing</dt>
                            <dd>{displayValue(item.printing)}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-industrial/50">Stitching</dt>
                            <dd>{displayValue(item.stitching)}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                            <dt className="text-industrial/50">Quantity</dt>
                            <dd>{item.quantity} {item.unit}</dd>
                        </div>
                    </dl>
                </section>
            </div>
        </div>
    );
}
