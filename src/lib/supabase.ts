/**
 * LEGACY: Shared Supabase client configuration.
 * Avoid importing this in Client Components to prevent build errors related to server-only modules.
 */
import { createClient as createLegacyClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createLegacyClient(supabaseUrl, supabaseAnonKey, {
    global: {
        fetch: (url, options) => {
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                console.error(`Fetch timeout for URL: ${url}`);
                controller.abort();
            }, 10000);
            return fetch(url, {
                ...options,
                signal: controller.signal,
            }).finally(() => clearTimeout(timeout));
        },
    },
});

// Re-exports for convenience, but use separate client/server files where possible
export { createClient as createBrowserClient } from './supabase/client';
export { createClient as createServerSideClient } from './supabase/server';
