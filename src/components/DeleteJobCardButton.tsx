'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';
import { deleteJobCardAction } from '@/lib/actions';

interface DeleteJobCardButtonProps {
    id: string;
}

export function DeleteJobCardButton({ id }: DeleteJobCardButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        try {
            await deleteJobCardAction(id);
        } catch (error) {
            console.error('Error deleting job card:', error);
            alert('Failed to delete job card. Please try again.');
        } finally {
            setIsDeleting(false);
            setShowConfirm(false);
        }
    }

    if (showConfirm) {
        return (
            <div className="flex w-full flex-wrap justify-end gap-1 sm:w-auto">
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Confirm'}
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                >
                    Cancel
                </Button>
            </div>
        );
    }

    return (
        <Button
            size="sm"
            variant="ghost"
            className="w-full text-red-600 hover:bg-red-50 sm:w-auto"
            onClick={() => setShowConfirm(true)}
            title="Delete job card"
            aria-label="Delete job card"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
}
