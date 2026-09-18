import { UploadForm } from "./upload-form";
import { site } from "@/lib/config";

export const metadata = { title: `Upload Event Photo — ${site.shortName}` };

// Temporary admin route, gated by a shared passcode (ADMIN_UPLOAD_PASSCODE).
// Not linked from public navigation. Will be replaced by real admin login
// with per-user roles in a later build step.
export default function AdminUploadPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Upload Event Photo</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Board use only. This page isn&apos;t linked from the site navigation.
      </p>
      <div className="mt-8">
        <UploadForm />
      </div>
    </div>
  );
}
