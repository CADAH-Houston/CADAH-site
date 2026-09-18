"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Browser-side Supabase client, safe to use in client components.
 * Uses the public URL + anon key only — never the service role key.
 * Throws if called before NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY are set;
 * callers should check isSupabaseConfigured() first.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
