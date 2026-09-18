import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-session";
import { site } from "@/lib/config";
import { MemberForm } from "../member-form";

export const metadata = { title: `Add Member — ${site.shortName} Admin` };

export default async function NewMemberPage() {
  const authed = await isAdminAuthed();
  if (!authed) redirect("/admin/login?next=/admin/members/new");

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Add Member</h1>
      <div className="mt-8">
        <MemberForm />
      </div>
    </div>
  );
}
