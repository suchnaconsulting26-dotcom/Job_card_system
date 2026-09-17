import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/update-password';
    const errorDescription = searchParams.get('error_description');

    if (errorDescription) {
        return NextResponse.redirect(`${origin}/update-password?error=${encodeURIComponent(errorDescription)}`);
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        } else {
            return NextResponse.redirect(`${origin}/update-password?error=${encodeURIComponent(error.message)}`);
        }
    }

    // Fallback if no code is present
    return NextResponse.redirect(`${origin}${next}`);
}
