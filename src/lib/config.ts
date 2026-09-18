// Central place for site-wide constants and small config helpers.
// All of the site's wording lives here (or directly in the page files under
// src/app/ for longer copy) — nothing is hardcoded beyond editing text.
// Update the copy below with CADAH's real details before launch.

export const site = {
  name: "Chinese American Doctors Association of Houston",
  shortName: "CADAH",
  tagline: "A community of Chinese-speaking physicians and dentists serving Greater Houston.",
  boardEmail: "board@cadah.example.org", // TODO: replace with the real board contact address
  membership: {
    annual: {
      label: "Annual Membership",
      price: "$__ / year", // TODO: fill in the real annual dues amount
      blurb: "Renews each year. Includes voting rights, the member directory, and event invitations.",
    },
    lifetime: {
      label: "Lifetime Membership",
      price: "$__ one-time", // TODO: fill in the real lifetime dues amount
      blurb: "A one-time payment — no renewals, ever.",
    },
  },
};

/**
 * True once real Supabase credentials are in the environment.
 * Until then, pages fall back to clearly-labeled sample data so the
 * site is fully reviewable before any accounts exist.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** True once a service-role key is available for admin-only server actions. */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
