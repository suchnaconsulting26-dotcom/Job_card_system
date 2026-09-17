'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { signInAction } from '@/lib/auth-actions';

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

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
        <div className="space-y-8">

            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-industrial text-white mb-4">
                    <Package className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-industrial tracking-tight">Job Card System</h1>
                <p className="text-industrial/60 mt-1">Sign in to your account</p>
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
        </div>
    );
}
