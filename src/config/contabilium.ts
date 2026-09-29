// Contabilium integration configuration
// IMPORTANT: All secrets must be in environment variables — never hardcoded here

export const contabiliumConfig = {
  apiUrl: process.env.CONTABILIUM_API_URL ?? 'https://api.contabilium.com',
  accountId: process.env.CONTABILIUM_ACCOUNT_ID ?? '',
  // API key is server-only — never expose in client-side code
  // Access via /api/contabilium route only
}

// This file is safe to import in shared code — it holds NO secrets
// The actual API key lives in process.env.CONTABILIUM_API_KEY and is read
// only inside /api/contabilium route handlers (server-side)
