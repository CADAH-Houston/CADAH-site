import "server-only";
import { cookies } from "next/headers";
import { createHash } from "crypto";

// A lightweight shared-passcode session for the temporary /admin/members
// tool (build step 2). This is NOT real per-user auth — it just lets Jill
// (or another board member with the passcode) stay logged in across pages
// instead of retyping ADMIN_UPLOAD_PASSCODE on every action. Gets replaced
// by real member/admin login (Supabase Auth) in a later build step.

const COOKIE_NAME = "cadah_admin";
const SESSION_SECONDS = 8 * 60 * 60; // 8 hours

function expectedToken(): string | null {
  const passcode = process.env.ADMIN_UPLOAD_PASSCODE;
  if (!passcode) return null;
  return createHash("sha256").update(passcode).digest("hex");
}

export function checkPasscode(input: string): boolean {
  const passcode = process.env.ADMIN_UPLOAD_PASSCODE;
  return Boolean(passcode) && input === passcode;
}

export async function isAdminAuthed(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === expected;
}

export async function setAdminSession(): Promise<void> {
  const expected = expectedToken();
  if (!expected) return;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, expected, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
