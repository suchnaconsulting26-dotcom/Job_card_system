'use client';

import { useState } from 'react';
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

    async function handleSubmit(data: CreateInventoryItemInput) {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            await updateInventoryItemAction(
                clientId,
                itemId,
                data,
                `/inventory/${clientId}/items/${itemId}`
            );
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
