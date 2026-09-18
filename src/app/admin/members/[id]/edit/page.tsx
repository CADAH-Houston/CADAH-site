import { notFound, redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-session";
import { isSupabaseAdminConfigured, site } from "@/lib/config";
import type { Member } from "@/lib/supabase/types";
import { MemberForm } from "../../member-form";

export const metadata = { title: `Edit Member — ${site.shortName} Admin` };

async function getMember(id: string): Promise<Member | null> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("members").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as Member;
}

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const authed = await isAdminAuthed();
  if (!authed) redirect("/admin/login?next=/admin/members");

  if (!isSupabaseAdminConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Supabase admin credentials aren&apos;t configured yet.
        </div>
      </div>
    );
  }

  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Edit Member</h1>
      <div className="mt-8">
        <MemberForm member={member} />
      </div>
    </div>
  );
}
