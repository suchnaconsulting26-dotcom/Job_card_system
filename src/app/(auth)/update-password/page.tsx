'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';
import { updatePasswordAction } from '@/lib/auth-actions';
import { createClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // When Supabase redirects here after clicking the email link, the URL contains
    // either ?token_hash=...&type=recovery (PKCE) or a hash fragment with access_token.
    // We need to exchange that token for a session before we can call updateUser.
    useEffect(() => {
        async function exchangeToken() {
            const supabase = createClient();

            // Try PKCE flow (token_hash in query params)
            const tokenHash = searchParams.get('token_hash');
            const type = searchParams.get('type');

            if (tokenHash && type === 'recovery') {
                const { error } = await supabase.auth.verifyOtp({
                    type: 'recovery',
                    token_hash: tokenHash,
                });
                if (error) {
                    setError('This reset link has expired or is invalid. Please request a new one.');
                    setTokenValid(false);
                } else {
                    setTokenValid(true);
                }
                setIsVerifying(false);
                return;
            }

            // Fallback: check if there is already an active session (user arrived via hash fragment flow)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setTokenValid(true);
                setIsVerifying(false);
                return;
            }

            // No token and no session — link is missing or expired
            setError('No valid reset link found. Please request a new password reset.');
            setTokenValid(false);
            setIsVerifying(false);
        }

        exchangeToken();
    }, [searchParams]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setIsLoading(true);
        const result = await updatePasswordAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result?.redirectTo) {
            setSuccess(true);
            setTimeout(() => {
                router.push(result.redirectTo!);
                router.refresh();
            }, 2000);
        }
    }

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
                <h1 className="text-2xl font-bold text-industrial tracking-tight">Set New Password</h1>
                <p className="text-industrial/60 mt-1">Enter your new secure password below</p>
            </div>

            <div className="bg-white p-8 border-2 border-industrial/10 shadow-sm space-y-6">
                {isVerifying ? (
                    <div className="flex flex-col items-center gap-3 py-6 text-industrial/60">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p className="text-sm">Verifying reset link…</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p>{error}</p>
                                    {!tokenValid && (
                                        <a
                                            href="/forgot-password"
                                            className="mt-1 inline-block font-semibold underline hover:no-underline"
                                        >
                                            Request a new reset link →
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {success ? (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 text-sm">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                <p>Password updated successfully! Redirecting you to the app…</p>
                            </div>
                        ) : tokenValid ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="New Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
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
                                <Input
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    rightElement={
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="p-1 text-industrial/50 hover:text-industrial transition-colors focus:outline-none"
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                            title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    }
                                />
                                <Button className="w-full" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Updating Password…' : 'Update Password'}
                                </Button>
                            </form>
                        ) : null}
                    </>
                )}
            </div>
        </div>
    );
}
