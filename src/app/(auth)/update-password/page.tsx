'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react';
import { updatePasswordAction } from '@/lib/auth-actions';
import { createClient } from '@/lib/supabase/client';

function UpdatePasswordForm() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        let isMounted = true;
        const supabase = createClient();

        // 1. Check for query param errors from Supabase / Auth callback
        const errParam = searchParams.get('error_description') || searchParams.get('error');
        if (errParam) {
            if (isMounted) {
                setError(decodeURIComponent(errParam));
                setTokenValid(false);
                setIsVerifying(false);
            }
            return;
        }

        // 2. Check for hash fragment errors: #error_description=...
        if (typeof window !== 'undefined' && window.location.hash.includes('error=')) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const hashError = hashParams.get('error_description') || hashParams.get('error');
            if (hashError && isMounted) {
                setError(decodeURIComponent(hashError));
                setTokenValid(false);
                setIsVerifying(false);
                return;
            }
        }

        // 3. Listen for Supabase auth state changes (e.g. PASSWORD_RECOVERY or SIGNED_IN)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!isMounted) return;
            if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
                setTokenValid(true);
                setIsVerifying(false);
                setError(null);
            }
        });

        async function verifySession() {
            // A. Try PKCE code exchange if code query param is present
            const code = searchParams.get('code');
            if (code) {
                const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
                if (codeError) {
                    if (isMounted) {
                        setError(codeError.message);
                        setTokenValid(false);
                        setIsVerifying(false);
                    }
                    return;
                }
                if (isMounted) {
                    setTokenValid(true);
                    setIsVerifying(false);
                }
                return;
            }

            // B. Try OTP verification if token_hash is present
            const tokenHash = searchParams.get('token_hash');
            const type = searchParams.get('type');
            if (tokenHash && type === 'recovery') {
                const { error: otpError } = await supabase.auth.verifyOtp({
                    type: 'recovery',
                    token_hash: tokenHash,
                });
                if (otpError) {
                    if (isMounted) {
                        setError('This reset link has expired or is invalid. Please request a new one.');
                        setTokenValid(false);
                        setIsVerifying(false);
                    }
                    return;
                }
                if (isMounted) {
                    setTokenValid(true);
                    setIsVerifying(false);
                }
                return;
            }

            // C. Try hash tokens (implicit flow: #access_token=...&refresh_token=...)
            if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');

                if (accessToken && refreshToken) {
                    const { error: setSessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });
                    if (!setSessionError && isMounted) {
                        setTokenValid(true);
                        setIsVerifying(false);
                        return;
                    }
                }
            }

            // D. Check existing active session (already exchanged by middleware / client)
            const { data: { session } } = await supabase.auth.getSession();
            if (session && isMounted) {
                setTokenValid(true);
                setIsVerifying(false);
                return;
            }

            // Wait a brief tick for any async hash processing
            setTimeout(async () => {
                if (!isMounted) return;
                const { data: { session: delayedSession } } = await supabase.auth.getSession();
                if (delayedSession) {
                    setTokenValid(true);
                    setIsVerifying(false);
                } else {
                    setError('No valid reset link found or the link has expired. Please request a new password reset.');
                    setTokenValid(false);
                    setIsVerifying(false);
                }
            }, 1200);
        }

        verifySession();

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
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

        try {
            // Update password directly using client session
            const supabase = createClient();
            const { error: clientError } = await supabase.auth.updateUser({
                password: password,
            });

            if (clientError) {
                // Try server action fallback
                const result = await updatePasswordAction(formData);
                if (result?.error) {
                    setError(result.error);
                    setIsLoading(false);
                    return;
                }
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update password');
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white p-8 border-2 border-industrial/10 shadow-sm space-y-6">
            {isVerifying ? (
                <div className="flex flex-col items-center gap-3 py-6 text-industrial/60">
                    <Loader2 className="w-8 h-8 animate-spin text-industrial" />
                    <p className="text-sm font-medium">Verifying reset authorization…</p>
                </div>
            ) : (
                <>
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">{error}</p>
                                {!tokenValid && (
                                    <Link
                                        href="/forgot-password"
                                        className="mt-2 inline-block text-xs font-bold text-red-800 underline hover:no-underline"
                                    >
                                        Request a new password reset link →
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    {success ? (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700 text-sm">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-600" />
                            <p className="font-semibold">Password updated successfully! Redirecting you to the app…</p>
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
    );
}

export default function UpdatePasswordPage() {
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

            <Suspense fallback={<div className="bg-white p-8 border-2 border-industrial/10 text-center font-mono text-xs text-industrial/60">Loading verification…</div>}>
                <UpdatePasswordForm />
            </Suspense>
        </div>
    );
}
