'use server';

import { createClient as createServerSideClient } from './supabase/server';
import { redirect } from 'next/navigation';

export async function signUpAction(formData: FormData) {
    const supabase = await createServerSideClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    redirect('/');
}

export async function signInAction(formData: FormData) {
    const supabase = await createServerSideClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect('/');
}

export async function signOutAction() {
    const supabase = await createServerSideClient();
    await supabase.auth.signOut();
    redirect('/login');
}
