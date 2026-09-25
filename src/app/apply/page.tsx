import Link from "next/link";
import { ApplyForm } from "./apply-form";
import { site } from "@/lib/config";

export const metadata = { title: `Apply to Join — ${site.shortName}` };

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Apply to Join {site.shortName}</h1>
      <p className="mt-2 text-neutral-600">
        Fill out the form below and a board member will follow up by email to confirm your
        membership and set up your login. Prefer paper?{" "}
        <a href={site.downloads.membershipForm} download className="font-medium text-brand underline">
          Download the application form
        </a>{" "}
        and mail it with your check — see{" "}
        <Link href="/membership" className="font-medium text-brand underline">
          Membership
        </Link>{" "}
        for details and dues.
      </p>
      <div className="mt-8">
        <ApplyForm />
      </div>
    </div>
  );
}
