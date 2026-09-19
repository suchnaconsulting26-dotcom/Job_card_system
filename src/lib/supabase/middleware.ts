import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })
    const isServerAction = request.headers.has('next-action')

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Redirect root / directly to dashboard (or login for guests)
    if (request.nextUrl.pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = user ? '/dashboard' : '/login';
        return NextResponse.redirect(url);
    }

    const isPublicRoute =
        request.nextUrl.pathname.startsWith('/website') ||
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup') ||
        request.nextUrl.pathname.startsWith('/forgot-password') ||
        request.nextUrl.pathname.startsWith('/update-password') ||
        request.nextUrl.pathname.startsWith('/auth');

    // Guest-only routes: users who are already logged in should be redirected to /dashboard.
    // NOTE: /update-password is intentionally NOT guest-only, because users resetting their
    // password have a recovery session and MUST be allowed to stay on /update-password!
    const isGuestOnlyRoute =
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup') ||
        request.nextUrl.pathname.startsWith('/forgot-password');

    // If there's no user and the route is NOT public (meaning it's a protected app route)
    if (!user && !isPublicRoute) {
        if (isServerAction) {
            return supabaseResponse
        }
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        const fullDestination = request.nextUrl.pathname + request.nextUrl.search;
        if (fullDestination && fullDestination !== '/') {
            url.searchParams.set('redirectTo', fullDestination);
        }
        return NextResponse.redirect(url)
    }

    // If there IS a user and they try to go to a guest-only route (like /login or /signup)
    if (user && isGuestOnlyRoute) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}

