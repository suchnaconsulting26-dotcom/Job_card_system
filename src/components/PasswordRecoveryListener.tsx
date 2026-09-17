'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function PasswordRecoveryListener() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if the current URL has hash fragments indicating a password recovery flow
        const hash = window.location.hash;
        if (hash) {
            // Supabase implicit recovery flow: #access_token=...&type=recovery
            if (hash.includes('type=recovery') || hash.includes('type%3Drecovery')) {
                if (!window.location.pathname.startsWith('/update-password')) {
                    router.replace(`/update-password${hash}`);
                    return;
                }
            }
        }

        // Check if query params have type=recovery
        const search = window.location.search;
        if (search) {
            const params = new URLSearchParams(search);
            if (params.get('type') === 'recovery') {
                if (!window.location.pathname.startsWith('/update-password')) {
                    router.replace(`/update-password${search}${hash}`);
                    return;
                }
            }
        }

        // Listen for Supabase PASSWORD_RECOVERY event
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                if (!window.location.pathname.startsWith('/update-password')) {
                    router.replace('/update-password');
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    return null;
}
