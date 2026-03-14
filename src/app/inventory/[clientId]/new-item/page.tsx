'use client';

import { useState, use } from 'react';
import { createInventoryItemAction } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { InventoryItemForm } from '@/components/InventoryItemForm';
import type { CreateInventoryItemInput } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewItemPage({
    params,
}: {
    params: Promise<{ clientId: string }>;
}) {
    const { clientId } = use(params);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(data: CreateInventoryItemInput) {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await createInventoryItemAction(data);
        } catch (error) {
            console.error('Failed to create item:', error);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div className="flex items-center gap-4">
                <Link href={`/inventory/${clientId}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-industrial tracking-tight">Add Detailed Item</h1>
                    <p className="text-industrial/60 mt-1">Configure physical specifications for this client&apos;s item.</p>
                </div>
            </div>

            <InventoryItemForm
                cancelHref={`/inventory/${clientId}`}
                initialValues={{ clientId, unit: 'pcs' }}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                submitLabel="Save Item Details"
            />
        </div>
    );
}
