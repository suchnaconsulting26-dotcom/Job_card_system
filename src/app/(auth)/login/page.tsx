'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { signInAction } from '@/lib/auth-actions';

function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/dashboard';
    const isFromEstimator = redirectTo.includes('/create');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await signInAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
            return;
        }

        if (result?.redirectTo) {
            router.push(result.redirectTo);
            router.refresh();
        }
    }

    return (
        <div className="bg-white p-8 border-2 border-industrial/10 shadow-sm space-y-6">
            {isFromEstimator && (
                <div className="p-3.5 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3 text-yellow-800 text-xs font-semibold">
                    <Sparkles className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    <p>Sign in to automatically load your box calculation into the live factory job card system.</p>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-semibold">{error}</p>
                        {error.includes('.env.local') && (
                            <p className="text-xs text-red-600 font-normal mt-1">
                                Please replace the placeholder values in your <span className="font-mono font-bold bg-red-100 px-1 py-0.5 rounded">.env.local</span> file with your actual Supabase Project URL and Anon Key.
                            </p>
                        )}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="admin@jobcardsystem.com"
                    required
                />
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-industrial">Password</label>
                        <Link href="/forgot-password" className="text-xs font-semibold text-industrial/80 hover:text-industrial hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        required
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="p-1 text-industrial/50 hover:text-industrial transition-colors focus:outline-none"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                title={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        }
                    />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
            </form>

            <div className="text-center text-sm">
                <span className="text-industrial/60">Don&apos;t have an account? </span>
                <Link href="/signup" className="font-semibold text-industrial hover:underline">
                    Sign up
                </Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-industrial text-white mb-4 hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-md group cursor-pointer"
                    title="Return to Website"
                    aria-label="Return to Website"
                >
                    <Package className="w-8 h-8 group-hover:rotate-6 transition-transform" />
                </Link>
                <h1 className="text-2xl font-bold text-industrial tracking-tight">
                    <Link href="/" className="hover:underline">
                        Job Card System
                    </Link>
                </h1>
                <p className="text-industrial/60 mt-1">Sign in to your account</p>
            </div>

            <Suspense fallback={<div className="bg-white p-8 border-2 border-industrial/10 text-center font-mono text-xs text-industrial/60">Loading authentication...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
