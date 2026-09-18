"use server";

import { checkPasscode, setAdminSession } from "@/lib/admin-session";

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function loginAdmin(formData: FormData): Promise<LoginResult> {
  const passcode = String(formData.get("passcode") ?? "");

  if (!process.env.ADMIN_UPLOAD_PASSCODE) {
    return { ok: false, error: "Admin passcode isn't configured yet (ADMIN_UPLOAD_PASSCODE)." };
  }
  if (!checkPasscode(passcode)) {
    return { ok: false, error: "Incorrect passcode." };
  }

  await setAdminSession();
  return { ok: true };
}
