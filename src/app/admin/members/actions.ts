"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearAdminSession, isAdminAuthed } from "@/lib/admin-session";
import { isSupabaseAdminConfigured } from "@/lib/config";
import { site } from "@/lib/config";
import type { MemberStatus, MembershipTierId } from "@/lib/supabase/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseMemberForm(formData: FormData) {
  const tierId = String(formData.get("membership_tier") ?? "regular");
  const tier = site.membershipTiers.find((t) => t.id === tierId) ?? site.membershipTiers[1];
  return {
    name: String(formData.get("name") ?? "").trim(),
    specialty: String(formData.get("specialty") ?? "").trim() || null,
    practice_location: String(formData.get("practice_location") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    phone_visible: formData.get("phone_visible") === "on",
    email: String(formData.get("email") ?? "").trim() || null,
    email_visible: formData.get("email_visible") === "on",
    home_address: String(formData.get("home_address") ?? "").trim() || null,
    home_address_visible: formData.get("home_address_visible") === "on",
    practice_address: String(formData.get("practice_address") ?? "").trim() || null,
    practice_address_visible: formData.get("practice_address_visible") === "on",
    membership_tier: tier.id as MembershipTierId,
    // Keep the annual/lifetime column in sync with the tier.
    membership_type: tier.id === "lifetime" ? ("lifetime" as const) : ("annual" as const),
    status: String(formData.get("status") ?? "active") as MemberStatus,
  };
}

export async function createMember(formData: FormData): Promise<ActionResult> {
  if (!(await isAdminAuthed())) return { ok: false, error: "Session expired — please log in again." };
  if (!isSupabaseAdminConfigured())
    return { ok: false, error: "Supabase admin credentials aren't configured yet." };

  const data = parseMemberForm(formData);
  if (!data.name) return { ok: false, error: "Name is required." };

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { error } = await supabase.from("members").insert(data);
    if (error) throw error;
    revalidatePath("/admin/members");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save member." };
  }
}

export async function updateMember(id: string, formData: FormData): Promise<ActionResult> {
  if (!(await isAdminAuthed())) return { ok: false, error: "Session expired — please log in again." };
  if (!isSupabaseAdminConfigured())
    return { ok: false, error: "Supabase admin credentials aren't configured yet." };

  const data = parseMemberForm(formData);
  if (!data.name) return { ok: false, error: "Name is required." };

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { error } = await supabase.from("members").update(data).eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/members");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save member." };
  }
}

export async function deleteMember(id: string): Promise<ActionResult> {
  if (!(await isAdminAuthed())) return { ok: false, error: "Session expired — please log in again." };
  if (!isSupabaseAdminConfigured())
    return { ok: false, error: "Supabase admin credentials aren't configured yet." };

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/members");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not delete member." };
  }
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
