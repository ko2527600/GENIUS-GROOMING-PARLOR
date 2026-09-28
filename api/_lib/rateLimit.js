// Simple in-memory rate limiter
// For production, consider using Vercel KV or Upstash Redis

const requestCounts = new Map();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.resetTime > 0) {
      requestCounts.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Rate limit middleware
 * @param {string} identifier - Unique identifier (IP, user ID, etc.)
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {object} { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(identifier, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const key = `${identifier}`;
  
  let record = requestCounts.get(key);
  
  // Create new record if doesn't exist or expired
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + windowMs,
    };
    requestCounts.set(key, record);
  }
  
  record.count++;
  
  const allowed = record.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - record.count);
  
  return {
    allowed,
    remaining,
    resetTime: record.resetTime,
    limit: maxRequests,
  };
}

/**
 * Get client identifier from request
 */
export function getClientIdentifier(req) {
  // Try to get real IP from Vercel headers
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  const realIp = req.headers["x-real-ip"];
  if (realIp) {
    return realIp;
  }
  
  // Fallback to connection remote address
  return req.socket?.remoteAddress || "unknown";
}

/**
 * Rate limit middleware for API routes
 */
export function rateLimitMiddleware(req, res, maxRequests = 10, windowMs = 60000) {
  const identifier = getClientIdentifier(req);
  const result = checkRateLimit(identifier, maxRequests, windowMs);
  
  // Set rate limit headers
  res.setHeader("X-RateLimit-Limit", result.limit);
  res.setHeader("X-RateLimit-Remaining", result.remaining);
  res.setHeader("X-RateLimit-Reset", result.resetTime);
  
  if (!result.allowed) {
    return {
      rateLimited: true,
      response: {
        ok: false,
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
    };
  }
  
  return { rateLimited: false };
}
