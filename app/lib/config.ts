export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not set in .env.local");
}

export const TOKEN_STORAGE_KEY = "auth_token";
