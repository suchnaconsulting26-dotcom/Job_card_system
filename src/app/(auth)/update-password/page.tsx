'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, AlertCircle } from 'lucide-react';
import { updatePasswordAction } from '@/lib/auth-actions';

export default function UpdatePasswordPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await updatePasswordAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result?.redirectTo) {
            router.push(result.redirectTo);
            router.refresh();
        }
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-industrial text-white mb-4">
                    <Package className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-industrial tracking-tight">Set New Password</h1>
                <p className="text-industrial/60 mt-1">Enter your new secure password</p>
            </div>

            <div className="bg-white p-8 border-2 border-industrial/10 shadow-sm space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="New Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        minLength={6}
                    />
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
