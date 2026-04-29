'use server';

import { z } from 'zod';
import { createClient as createServerSideClient } from './supabase/server';
import { redirect } from 'next/navigation';

// Validation schemas
const signUpSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(12, 'Password must be at least 12 characters').regex(/[A-Z]/, 'Password must contain uppercase').regex(/[0-9]/, 'Password must contain number').regex(/[!@#$%^&*]/, 'Password must contain special character'),
    fullName: z.string().min(2, 'Full name is required').max(255),
});

const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export async function signUpAction(formData: FormData) {
    try {
        const supabase = await createServerSideClient();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const fullName = formData.get('fullName') as string;

        // Validate input
        const validated = signUpSchema.parse({ email, password, fullName });

        const { error, data } = await supabase.auth.signUp({
            email: validated.email,
            password: validated.password,
            options: {
                data: {
                    full_name: validated.fullName,
                },
            },
        });

        if (error) {
            throw new Error(error.message);
        }

        // Check if email confirmation is required
        if (data.user && !data.user.email_confirmed_at) {
            return { success: false, message: 'Please check your email to verify your account before logging in.' };
        }

        return { redirectTo: '/' };
    } catch (error) {
        const message = error instanceof z.ZodError
            ? error.issues[0]?.message || 'Sign up failed'
            : error instanceof Error
                ? error.message
                : 'Sign up failed';
        return { error: message };
    }
}

export async function signInAction(formData: FormData) {
    try {
        const supabase = await createServerSideClient();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Validate input
        const validated = signInSchema.parse({ email, password });

        const { error, data } = await supabase.auth.signInWithPassword({
            email: validated.email,
            password: validated.password,
        });

        if (error) {
            throw new Error(error.message);
        }

        // Verify email is confirmed
        if (data.user && !data.user.email_confirmed_at) {
            await supabase.auth.signOut();
            return { error: 'Please verify your email before accessing the app. Check your email for verification link.' };
        }

        return { redirectTo: '/' };
    } catch (error) {
        const message = error instanceof z.ZodError
            ? error.issues[0]?.message || 'Sign in failed'
            : error instanceof Error
                ? error.message
                : 'Sign in failed';
        return { error: message };
    }
}

export async function signOutAction() {
    const supabase = await createServerSideClient();
    await supabase.auth.signOut();
    redirect('/login');
}

export async function resetPasswordAction(formData: FormData) {
    try {
        const supabase = await createServerSideClient();
        const email = formData.get('email') as string;
        const origin = formData.get('origin') as string || '';
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: origin ? `${origin}/update-password` : undefined,
        });

        if (error) {
            throw new Error(error.message);
        }

        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Reset failed' };
    }
}

export async function updatePasswordAction(formData: FormData) {
    try {
        const supabase = await createServerSideClient();
        const password = formData.get('password') as string;

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            throw new Error(error.message);
        }

        return { redirectTo: '/' };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Update failed' };
    }
}
