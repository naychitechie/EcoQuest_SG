/**
 * OneMap Token Manager
 * Handles token caching and auto-refresh for OneMap API authentication.
 */

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Get a valid OneMap access token.
 * Uses cached token if still valid, otherwise refreshes via API.
 * Falls back to ONEMAP_TOKEN env var if email/password not configured.
 */
export async function getOneMapToken(): Promise<string> {
  // Check if cached token is still valid (with 5-minute buffer)
  if (cachedToken && Date.now() < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }

  const email = process.env.ONEMAP_EMAIL;
  const password = process.env.ONEMAP_PASSWORD;

  // If credentials available, fetch fresh token
  if (email && password) {
    try {
      const response = await fetch('https://www.onemap.gov.sg/api/auth/post/getToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        cachedToken = data.access_token;
        // Token expires in 3 days, parse expiry timestamp
        tokenExpiry = new Date(data.expiry_timestamp).getTime();
        console.log('[OneMap] Token refreshed, expires:', data.expiry_timestamp);
        return cachedToken!;
      } else {
        console.error('[OneMap] Token refresh failed:', response.statusText);
      }
    } catch (error) {
      console.error('[OneMap] Token refresh error:', error);
    }
  }

  // Fallback to static token from env
  const staticToken = process.env.ONEMAP_TOKEN;
  if (staticToken) {
    cachedToken = staticToken;
    // Assume static token expires in 3 days from now
    tokenExpiry = Date.now() + 3 * 24 * 60 * 60 * 1000;
    return staticToken;
  }

  throw new Error('No OneMap token available. Set ONEMAP_TOKEN or ONEMAP_EMAIL + ONEMAP_PASSWORD.');
}
