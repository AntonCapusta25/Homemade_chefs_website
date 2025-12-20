import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface RateLimitConfig {
    windowMs: number;  // Time window in milliseconds
    maxRequests: number;  // Max requests per window
}

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store for rate limiting
// Note: This resets when the function cold-starts, but provides basic protection
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

/**
 * Rate limiter using in-memory store
 * For production, consider using Redis or Supabase for distributed rate limiting
 */
export async function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || entry.resetTime < now) {
        // New window
        const resetTime = now + config.windowMs;
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime
        });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime
        };
    }

    if (entry.count >= config.maxRequests) {
        // Rate limit exceeded
        return {
            allowed: false,
            remaining: 0,
            resetTime: entry.resetTime
        };
    }

    // Increment count
    entry.count++;
    rateLimitStore.set(identifier, entry);

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetTime: entry.resetTime
    };
}

/**
 * Database-backed rate limiter for more robust protection
 * Stores rate limit data in Supabase
 */
export async function checkRateLimitDB(
    supabaseUrl: string,
    supabaseKey: string,
    identifier: string,
    config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get recent requests from this identifier
    const { data: recentRequests, error } = await supabase
        .from('rate_limits')
        .select('id, created_at')
        .eq('identifier', identifier)
        .gte('created_at', new Date(windowStart).toISOString())
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Rate limit DB error:', error);
        // Fallback to allowing request if DB fails
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetTime: now + config.windowMs
        };
    }

    const requestCount = recentRequests?.length || 0;

    if (requestCount >= config.maxRequests) {
        // Rate limit exceeded
        const oldestRequest = recentRequests?.[recentRequests.length - 1];
        const resetTime = oldestRequest
            ? new Date(oldestRequest.created_at).getTime() + config.windowMs
            : now + config.windowMs;

        return {
            allowed: false,
            remaining: 0,
            resetTime
        };
    }

    // Log this request
    await supabase
        .from('rate_limits')
        .insert([{
            identifier,
            endpoint: 'newsletter-subscribe',
            created_at: new Date().toISOString()
        }]);

    return {
        allowed: true,
        remaining: config.maxRequests - requestCount - 1,
        resetTime: now + config.windowMs
    };
}

/**
 * Get client IP from request headers
 */
export function getClientIP(req: Request): string {
    // Try various headers that might contain the real IP
    const headers = req.headers;

    return (
        headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        headers.get('x-real-ip') ||
        headers.get('cf-connecting-ip') || // Cloudflare
        headers.get('x-client-ip') ||
        'unknown'
    );
}

/**
 * Create rate limit response
 */
export function createRateLimitResponse(resetTime: number) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

    return new Response(
        JSON.stringify({
            error: 'Too many requests. Please try again later.',
            retryAfter: retryAfter
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': retryAfter.toString(),
                'X-RateLimit-Reset': new Date(resetTime).toISOString(),
                'Access-Control-Allow-Origin': '*'
            }
        }
    );
}
