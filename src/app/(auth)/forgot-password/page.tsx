'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import { resetPasswordAction } from '@/lib/auth-actions';

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append('origin', window.location.origin);
        const result = await resetPasswordAction(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setSuccess(true);
        }
        setIsLoading(false);
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-industrial text-white mb-4">
                    <Package className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-industrial tracking-tight">Reset Password</h1>
                <p className="text-industrial/60 mt-1">We will send you a recovery link</p>
            </div>

            <div className="bg-white p-8 border-2 border-industrial/10 shadow-sm space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}
                
                {success ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 text-sm">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <p>Password reset link has been sent to your email.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="admin@jobcardsystem.com"
                            required
                        />
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                        </Button>
                    </form>
                )}

                <div className="text-center text-sm">
                    <span className="text-industrial/60">Remember your password? </span>
                    <Link href="/login" className="font-semibold text-industrial hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
