// Central place for site-wide constants and small config helpers.
// All of the site's wording lives here (or directly in the page files under
// src/app/ for longer copy) — nothing is hardcoded beyond editing text.
// Update the copy below with CADAH's real details before launch.

export type MembershipTier = {
  id: "lifetime" | "regular" | "resident" | "student" | "associate";
  label: string;
  price: string;
  blurb: string;
  /** How this tier maps onto the database's two-value membership_type column. */
  dbType: "annual" | "lifetime" | null;
};

export const site = {
  name: "Chinese American Doctors Association of Houston",
  shortName: "CADAH",
  founded: 1993,
  tagline: "Connecting Houston’s Chinese American physicians and dentists since 1993.",
  // Short version — used in the footer and as the default page description.
  shortBio:
    "CADAH: uniting Chinese American doctors in Houston through education, fellowship, and service since 1993.",
  boardEmail: "cadahrsvp@gmail.com",
  mailingAddress: ["CADAH", "PO Box 420725", "Houston, TX 77242"],

  // Flip to true once Stripe (build step 7) is live. Until then the "How to join"
  // steps tell people to pay by check.
  onlinePaymentsEnabled: false,

  // Files in /public/downloads. Keep the file names stable so replacing a form
  // is just a drop-in file swap.
  downloads: {
    membershipForm: "/downloads/CADAH-Membership-Application.docx",
    scholarshipForm: "/downloads/CADAH-Scholarship-Application.pdf",
  },

  // Annual dues run January through December (per the paper application form).
  membershipTiers: [
    {
      id: "lifetime",
      label: "Lifetime",
      price: "$1,000 one-time",
      blurb:
        "One payment, no renewals. Annual dues paid in the same calendar year can be applied toward lifetime membership.",
      dbType: "lifetime",
    },
    {
      id: "regular",
      label: "Regular",
      price: "$100 / year",
      blurb: "Annual membership for licensed physicians and dentists in practice.",
      dbType: "annual",
    },
    {
      id: "resident",
      label: "Resident",
      price: "$50 / year",
      blurb: "Annual membership for residents, fellows, and interns.",
      dbType: "annual",
    },
    {
      id: "student",
      label: "Student",
      price: "$25 / year",
      blurb: "Annual membership for medical and dental students.",
      dbType: "annual",
    },
    {
      id: "associate",
      label: "Associate",
      price: "Contact the board",
      blurb: "Ask the board about Associate membership and dues.", // TODO: real description + dues
      dbType: null,
    },
  ] satisfies MembershipTier[],

  scholarship: {
    // Update these each cycle (and swap the PDF in public/downloads).
    deadline: "January 16, 2027",
    announcement: "February 2027",
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
