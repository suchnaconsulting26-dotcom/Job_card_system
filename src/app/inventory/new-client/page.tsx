'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientAction } from '@/lib/actions';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewClientPage() {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const result = await createClientAction(name.trim());
            if (result?.redirectTo) {
                router.push(result.redirectTo);
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to create client:', error);
            setIsSubmitting(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/inventory">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-industrial tracking-tight">New Client Category</h1>
                    <p className="text-industrial/60 mt-1">Add a company to categorize your inventory.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-kraft p-8 border border-kraft-dark/10 rounded-xl shadow-sm space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-industrial/70 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Company Name
                    </label>
                    <Input
                        required
                        placeholder="e.g. Job Card System"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-kraft-lighter border-kraft-dark/10 focus:border-industrial/30"
                        autoFocus
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Link href="/inventory">
                        <Button type="button" variant="secondary">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting || !name.trim()}>
                        <Save className="w-5 h-5 mr-2" />
                        {isSubmitting ? 'Creating...' : 'Create Client'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
