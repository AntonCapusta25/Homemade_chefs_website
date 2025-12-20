# Rate Limiting Documentation

## Overview

Rate limiting has been implemented to protect API endpoints from abuse, spam, and DDoS attacks. The system uses IP-based tracking to limit the number of requests from a single source.

## Implementation

### Rate Limiter Module

Location: `supabase/functions/_shared/rate-limiter.ts`

This shared module provides:
- **In-memory rate limiting** (default, resets on cold start)
- **Database-backed rate limiting** (optional, for distributed systems)
- **IP extraction** from various headers
- **Rate limit response** formatting

### Protected Endpoints

#### 1. Newsletter Subscribe (`/newsletter-subscribe`)

**Limits:**
- **5 requests per IP per 15 minutes**
- Prevents spam subscriptions
- Protects SendGrid quota

**Response when rate limited:**
```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 900
}
```

**Headers:**
- `Retry-After`: Seconds until reset
- `X-RateLimit-Reset`: ISO timestamp of reset time
- Status Code: `429 Too Many Requests`

## How It Works

### 1. IP Detection

The system checks multiple headers to find the real client IP:
```typescript
x-forwarded-for (first IP in chain)
x-real-ip
cf-connecting-ip (Cloudflare)
x-client-ip
```

### 2. In-Memory Tracking

- Stores request counts in a Map
- Automatically cleans up expired entries every 5 minutes
- Resets on function cold start (acceptable for basic protection)

### 3. Rate Limit Check

For each request:
1. Extract client IP
2. Check if IP exists in store
3. If exists and within window:
   - Increment count
   - Check if over limit
4. If new or expired:
   - Create new entry with reset time

### 4. Response

If rate limited:
- Returns 429 status
- Includes retry information
- Logs the blocked request

## Configuration

### Adjusting Limits

Edit the rate limit config in each function:

```typescript
const rateLimitResult = await checkRateLimit(clientIP, {
    windowMs: 15 * 60 * 1000, // Time window (15 minutes)
    maxRequests: 5             // Max requests in window
});
```

### Common Configurations

**Strict (Login/Signup):**
```typescript
windowMs: 15 * 60 * 1000,  // 15 minutes
maxRequests: 3              // 3 attempts
```

**Moderate (Newsletter):**
```typescript
windowMs: 15 * 60 * 1000,  // 15 minutes
maxRequests: 5              // 5 attempts
```

**Lenient (Public API):**
```typescript
windowMs: 60 * 1000,        // 1 minute
maxRequests: 60             // 60 requests/min
```

## Database-Backed Rate Limiting (Optional)

For production systems with multiple Edge Function instances, use database-backed rate limiting:

### 1. Create Rate Limits Table

```sql
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    INDEX idx_rate_limits_identifier_created (identifier, created_at),
    INDEX idx_rate_limits_created (created_at)
);

-- Auto-cleanup old entries (older than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits 
    WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup every hour
SELECT cron.schedule(
    'cleanup-rate-limits',
    '0 * * * *',
    $$SELECT cleanup_rate_limits()$$
);
```

### 2. Use Database Rate Limiter

```typescript
import { checkRateLimitDB } from '../_shared/rate-limiter.ts'

const rateLimitResult = await checkRateLimitDB(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    clientIP,
    {
        windowMs: 15 * 60 * 1000,
        maxRequests: 5
    }
);
```

## Monitoring

### Check Rate Limit Logs

In Supabase Dashboard:
1. Go to Edge Functions
2. Select the function
3. View Logs tab
4. Filter for "Rate limit" or status 429

### Metrics to Track

- Number of rate-limited requests
- Most frequently limited IPs
- Peak request times
- False positive rate

## Bypassing Rate Limits

### For Testing

Temporarily increase limits or disable:

```typescript
// Disable rate limiting for testing
const TESTING = Deno.env.get('TESTING') === 'true';

if (!TESTING) {
    const rateLimitResult = await checkRateLimit(clientIP, config);
    if (!rateLimitResult.allowed) {
        return createRateLimitResponse(rateLimitResult.resetTime);
    }
}
```

### For Trusted IPs

Add whitelist:

```typescript
const TRUSTED_IPS = ['1.2.3.4', '5.6.7.8'];

if (!TRUSTED_IPS.includes(clientIP)) {
    const rateLimitResult = await checkRateLimit(clientIP, config);
    // ... check result
}
```

## Security Considerations

### Strengths

✅ **IP-based tracking** - Simple and effective
✅ **Automatic cleanup** - Prevents memory leaks
✅ **Configurable** - Easy to adjust per endpoint
✅ **Informative responses** - Tells users when to retry

### Limitations

⚠️ **In-memory store** - Resets on cold start
⚠️ **IP spoofing** - Possible with certain proxies
⚠️ **Shared IPs** - May affect users behind NAT
⚠️ **No user-based limiting** - Only IP-based

### Recommendations

1. **Use database-backed limiting** for production
2. **Monitor false positives** and adjust limits
3. **Combine with other security** (CAPTCHA, email verification)
4. **Log suspicious patterns** for analysis
5. **Consider user-based limits** for authenticated endpoints

## Troubleshooting

### Users Getting Rate Limited Unfairly

**Problem:** Legitimate users behind shared IP (office, school, etc.)

**Solutions:**
- Increase `maxRequests` limit
- Decrease `windowMs` to shorter period
- Implement user-based limiting for authenticated users
- Add CAPTCHA for borderline cases

### Rate Limits Not Working

**Problem:** Users can still spam requests

**Checks:**
1. Verify rate limiter is imported and called
2. Check if IP extraction is working (log `clientIP`)
3. Ensure function isn't cold-starting frequently
4. Consider switching to database-backed limiting

### Too Many False Positives

**Problem:** Normal users getting blocked

**Solutions:**
- Increase limits gradually
- Monitor actual usage patterns
- Implement progressive rate limiting (warn before block)
- Add user feedback mechanism

## Future Enhancements

Potential improvements:
- [ ] User-based rate limiting (for authenticated requests)
- [ ] Progressive rate limiting (warnings before blocking)
- [ ] CAPTCHA integration for borderline cases
- [ ] Distributed rate limiting with Redis
- [ ] Rate limit analytics dashboard
- [ ] Automatic IP reputation scoring
- [ ] Whitelist/blacklist management
