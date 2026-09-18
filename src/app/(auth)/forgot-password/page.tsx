'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Package, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { resetPasswordAction } from '@/lib/auth-actions';

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [sentEmail, setSentEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        formData.append('origin', window.location.origin);

        const result = await resetPasswordAction(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setSentEmail(email);
            setSuccess(true);
        }
        setIsLoading(false);
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
                <h1 className="text-2xl font-bold text-industrial tracking-tight">Reset Password</h1>
                <p className="text-industrial/60 mt-1">
                    {success ? 'Check your inbox' : 'We\'ll send you a password reset link'}
                </p>
            </div>

            <div className="bg-white p-8 border-2 border-industrial/10 shadow-sm space-y-6">
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

                {success ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700 text-sm">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Reset link sent!</p>
                                <p className="mt-1 text-green-600">
                                    We sent a password reset link to{' '}
                                    <span className="font-medium">{sentEmail}</span>. 
                                    Click the link in that email to create a new password.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3 text-blue-700 text-sm">
                            <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold">Didn't receive the email?</p>
                                <ul className="mt-1 text-blue-600 list-disc list-inside space-y-1">
                                    <li>Check your spam / junk folder</li>
                                    <li>The link expires in 1 hour</li>
                                    <li>
                                        <button
                                            onClick={() => setSuccess(false)}
                                            className="underline hover:no-underline font-medium"
                                        >
                                            Try sending again with a different email
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email address"
                            name="email"
                            type="email"
                            placeholder="admin@jobcardsystem.com"
                            required
                        />
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? 'Sending Reset Link…' : 'Send Reset Link'}
                        </Button>
                    </form>
                )}

                <div className="text-center text-sm">
                    <span className="text-industrial/60">Remember your password? </span>
                    <Link href="/login" className="font-semibold text-industrial hover:underline">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
