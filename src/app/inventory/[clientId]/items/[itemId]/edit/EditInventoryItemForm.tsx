'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InventoryItemForm } from '@/components/InventoryItemForm';
import { updateInventoryItemAction } from '@/lib/actions';
import type { CreateInventoryItemInput, InventoryItem } from '@/lib/types';

interface EditInventoryItemFormProps {
    clientId: string;
    item: InventoryItem;
    itemId: string;
}

export function EditInventoryItemForm({
    clientId,
    item,
    itemId,
}: EditInventoryItemFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleSubmit(data: CreateInventoryItemInput) {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await updateInventoryItemAction(
                clientId,
                itemId,
                data,
                `/inventory/${clientId}/items/${itemId}`
            );
            if (result?.redirectTo) {
                router.push(result.redirectTo);
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to update item:', error);
            setIsSubmitting(false);
        }
    }

    return (
        <InventoryItemForm
            cancelHref={`/inventory/${clientId}/items/${itemId}`}
            initialValues={item}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitLabel="Update Item Details"
        />
    );
}
