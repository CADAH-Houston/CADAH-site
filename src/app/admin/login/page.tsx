import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { site } from "@/lib/config";

export const metadata = { title: `Board Admin — ${site.shortName}` };

// Shared entry point for temporary board-admin tools (member list today,
// more later). Not linked from public navigation. Gets replaced by real
// per-user login in a later build step.
export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Board Admin</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Enter the admin passcode to manage members. Board use only — not linked from the site
        navigation.
      </p>
      <div className="mt-8">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
