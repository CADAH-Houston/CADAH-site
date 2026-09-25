import { site } from "@/lib/config";
import type { Member, MembershipTierId } from "@/lib/supabase/types";

/** The member's tier, falling back sensibly if migration 0002 hasn't run yet. */
export function effectiveTier(m: Member): MembershipTierId {
  return m.membership_tier ?? (m.membership_type === "lifetime" ? "lifetime" : "regular");
}

export function tierLabel(id: MembershipTierId): string {
  return site.membershipTiers.find((t) => t.id === id)?.label ?? id;
}
