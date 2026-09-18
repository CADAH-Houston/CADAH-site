"use server";

import { isSupabaseAdminConfigured } from "@/lib/config";

const STORAGE_BUCKET = "event-photos";

export type UploadResult = { ok: true } | { ok: false; error: string };

/**
 * Temporary admin gate: a single shared passcode (ADMIN_UPLOAD_PASSCODE env var)
 * until real member/admin login ships in a later build step. Anyone with the
 * passcode can upload event photos; nothing else is exposed by this action.
 */
export async function uploadEventPhoto(formData: FormData): Promise<UploadResult> {
  if (!isSupabaseAdminConfigured()) {
    return { ok: false, error: "Supabase admin credentials aren't configured yet." };
  }

  const passcode = String(formData.get("passcode") ?? "");
  const expected = process.env.ADMIN_UPLOAD_PASSCODE;
  if (!expected || passcode !== expected) {
    return { ok: false, error: "Incorrect passcode." };
  }

  const file = formData.get("file");
  const caption = String(formData.get("caption") ?? "").trim() || null;

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Please choose a photo to upload." };
  }

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, await file.arrayBuffer(), {
        contentType: file.type || "image/jpeg",
      });
    if (uploadError) throw uploadError;

    const { error: insertError } = await supabase
      .from("event_photos")
      .insert({ storage_path: path, caption, uploaded_at: new Date().toISOString() });
    if (insertError) throw insertError;

    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Upload failed." };
  }
}
