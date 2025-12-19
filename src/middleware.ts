import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Supported languages - English is default (no prefix), NL and FR use prefixes
const locales = ['nl', 'fr'] // Only non-default locales
const defaultLocale = 'en'

/**
 * Get locale from pathname
 * Returns 'en' if no locale prefix, otherwise returns the locale
 */
function getLocale(pathname: string): string {
    const segments = pathname.split('/')
    const potentialLocale = segments[1]

    if (locales.includes(potentialLocale)) {
        return potentialLocale
    }

    return defaultLocale // English is default (no prefix)
}

/**
 * Remove locale prefix from pathname
 */
function removeLocalePrefix(pathname: string): string {
    const locale = getLocale(pathname)
    if (locale !== defaultLocale) {
        return pathname.replace(`/${locale}`, '') || '/'
    }
    return pathname
}

/**
 * Middleware to handle i18n routing and refresh Supabase auth session
 */
export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Check if pathname has a locale prefix (nl or fr)
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    // Get locale from URL or cookie
    let locale = getLocale(pathname)

    // If no locale in URL and not English, check cookie for language preference
    if (!pathnameHasLocale) {
        const cookieLocale = request.cookies.get('preferredLanguage')?.value?.toLowerCase()
        // Only redirect to /nl or /fr if user has that preference
        // English users stay at root URLs (no /en prefix)
        if (cookieLocale && locales.includes(cookieLocale)) {
            locale = cookieLocale
            // Redirect to localized URL
            const newUrl = new URL(`/${locale}${pathname}`, request.url)
            newUrl.search = request.nextUrl.search
            return NextResponse.redirect(newUrl)
        }
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Set locale cookie
    response.cookies.set('NEXT_LOCALE', locale, {
        path: '/',
        sameSite: 'lax',
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Refresh session if expired - required for Server Components
    const { data: { user } } = await supabase.auth.getUser()

    // Remove locale prefix for admin route checking
    const pathWithoutLocale = removeLocalePrefix(pathname)

    // Protect admin routes
    if (pathWithoutLocale.startsWith('/admin')) {
        // Allow access to login page
        if (pathWithoutLocale === '/admin/login') {
            // If already logged in, redirect to admin dashboard
            if (user) {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
            return response
        }

        // For all other admin routes, require authentication
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // Check if user is actually an admin
        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single()

        if (!adminUser) {
            // User is authenticated but not an admin
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
