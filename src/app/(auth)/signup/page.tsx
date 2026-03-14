'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, ArrowLeft, AlertCircle } from 'lucide-react';
import { signUpAction } from '@/lib/auth-actions';

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await signUpAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-8">

            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-industrial text-white mb-4">
                    <Package className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-industrial tracking-tight">Job Card System</h1>
                <p className="text-industrial/60 mt-1">Create your account</p>
            </div>

            <div className="bg-white p-8 border-2 border-industrial/10 shadow-sm space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
                        <div className="flex items-center gap-3 text-red-700 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="font-bold">{error}</p>
                        </div>
                        {error.includes('invalid') && (
                            <p className="text-xs text-red-600/70 ml-8 italic">
                                Note: Use a standard domain like @gmail.com or @outlook.com
                            </p>
                        )}
                    </div>
                )}

                <div className="p-4 bg-industrial/5 border border-industrial/10 rounded-lg">
                    <p className="text-xs text-industrial/60 leading-relaxed italic">
                        <strong>Important:</strong> After signing up, please check your email for a verification link to activate your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="fullName"
                        type="text"
                        placeholder="John Doe"
                        required
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-industrial/60">Already have an account? </span>
                    <Link href="/login" className="font-semibold text-industrial hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
