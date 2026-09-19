"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthed } from "@/lib/admin-session";
import { isSupabaseAdminConfigured } from "@/lib/config";
import type { EventVisibility } from "@/lib/supabase/types";

export type ActionResult = { ok: true } | { ok: false; error: string };

// Datetime-local inputs give "YYYY-MM-DDTHH:mm" with no timezone, which
// JS parses as local time in the browser but Node would parse as UTC on
// the server — so we do the conversion here, before it ever leaves the
// client's clock behind. (The <input> itself always reflects the
// browser's local time, i.e. the board member's own time zone.)
function localInputToIso(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function parseEventForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    start_at: localInputToIso(String(formData.get("start_at") ?? "")),
    end_at: localInputToIso(String(formData.get("end_at") ?? "")),
    visibility: String(formData.get("visibility") ?? "public") as EventVisibility,
  };
}

export async function createEvent(formData: FormData): Promise<ActionResult> {
  if (!(await isAdminAuthed())) return { ok: false, error: "Session expired — please log in again." };
  if (!isSupabaseAdminConfigured())
    return { ok: false, error: "Supabase admin credentials aren't configured yet." };

  const data = parseEventForm(formData);
  if (!data.title) return { ok: false, error: "Title is required." };
  if (!data.start_at) return { ok: false, error: "Start date & time is required." };

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { error } = await supabase.from("events").insert({ ...data, start_at: data.start_at });
    if (error) throw error;
    revalidatePath("/admin/events");
    revalidatePath("/calendar");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save event." };
  }
}

export async function updateEvent(id: string, formData: FormData): Promise<ActionResult> {
  if (!(await isAdminAuthed())) return { ok: false, error: "Session expired — please log in again." };
  if (!isSupabaseAdminConfigured())
    return { ok: false, error: "Supabase admin credentials aren't configured yet." };

  const data = parseEventForm(formData);
  if (!data.title) return { ok: false, error: "Title is required." };
  if (!data.start_at) return { ok: false, error: "Start date & time is required." };

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("events")
      .update({ ...data, start_at: data.start_at })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/events");
    revalidatePath("/calendar");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save event." };
  }
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  if (!(await isAdminAuthed())) return { ok: false, error: "Session expired — please log in again." };
  if (!isSupabaseAdminConfigured())
    return { ok: false, error: "Supabase admin credentials aren't configured yet." };

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/admin/events");
    revalidatePath("/calendar");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not delete event." };
  }
}
