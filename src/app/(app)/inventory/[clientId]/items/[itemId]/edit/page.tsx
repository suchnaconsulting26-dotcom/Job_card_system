import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getClients, getInventoryItemById } from '@/lib/storage';
import { EditInventoryItemForm } from './EditInventoryItemForm';

export const revalidate = 30;

export default async function EditInventoryItemPage({
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
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <Link href={`/inventory/${clientId}/items/${itemId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-industrial tracking-tight">Edit Item</h1>
                    <p className="text-industrial/60 mt-1 flex items-center gap-2">
                        <PencilLine className="w-4 h-4" />
                        Update specifications for {item.name} in {client.name}.
                    </p>
                </div>
            </div>

            <EditInventoryItemForm clientId={clientId} itemId={itemId} item={item} />
        </div>
    );
}
