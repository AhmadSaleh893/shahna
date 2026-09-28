// Store-wide settings. Translated text (store name, tagline, city, hours) lives in
// src/lib/i18n/ar.ts and en.ts; secrets come from environment variables (see .env.example).
export const site = {
  email: "hello@shahna.example",
  // Time zone for order timestamps in the admin (Vercel servers run on UTC).
  timeZone: "UTC",
};

export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "USD";
