import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-session";
import { isSupabaseAdminConfigured, site } from "@/lib/config";
import type { Member } from "@/lib/supabase/types";
import { DeleteMemberButton } from "./delete-button";
import { logoutAdmin } from "./actions";

export const metadata = { title: `Members — ${site.shortName} Admin` };
export const revalidate = 0;

async function getMembers(): Promise<Member[]> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("members").select("*").order("name", { ascending: true });
  if (error || !data) return [];
  return data as Member[];
}

export default async function AdminMembersPage() {
  const authed = await isAdminAuthed();
  if (!authed) redirect("/admin/login?next=/admin/members");

  if (!isSupabaseAdminConfigured()) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Supabase admin credentials aren&apos;t configured yet.
        </div>
      </div>
    );
  }

  const members = await getMembers();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Members</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Board use only. {members.length} member{members.length === 1 ? "" : "s"}.
          </p>
        </div>
        <Link
          href="/admin/members/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          + Add Member
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-black/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Specialty</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {members.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No members yet — click &quot;Add Member&quot; to add the first one.
                </td>
              </tr>
            )}
            {members.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">{m.name}</td>
                <td className="px-4 py-3 text-neutral-600">{m.specialty || "—"}</td>
                <td className="px-4 py-3 capitalize text-neutral-600">{m.membership_type}</td>
                <td className="px-4 py-3 capitalize text-neutral-600">{m.status}</td>
                <td className="px-4 py-3 text-neutral-600">{m.email || m.phone || "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link href={`/admin/members/${m.id}/edit`} className="mr-3 text-brand hover:text-brand-dark">
                    Edit
                  </Link>
                  <DeleteMemberButton id={m.id} name={m.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex gap-4">
          <Link href="/admin/events" className="hover:text-neutral-600">
            Events →
          </Link>
          <Link href="/admin/upload" className="hover:text-neutral-600">
            Upload event photos →
          </Link>
        </div>
        <form action={logoutAdmin}>
          <button type="submit" className="hover:text-neutral-600">
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
