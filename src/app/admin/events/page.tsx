import Link from "next/link";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-session";
import { isSupabaseAdminConfigured, site } from "@/lib/config";
import type { EventRow } from "@/lib/supabase/types";
import { DeleteEventButton } from "./delete-button";
import { logoutAdmin } from "../members/actions";

export const metadata = { title: `Events — ${site.shortName} Admin` };
export const revalidate = 0;

async function getEvents(): Promise<{ events: EventRow[]; nowMs: number }> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("events").select("*").order("start_at", { ascending: false });
  return { events: error || !data ? [] : (data as EventRow[]), nowMs: Date.now() };
}

export default async function AdminEventsPage() {
  const authed = await isAdminAuthed();
  if (!authed) redirect("/admin/login?next=/admin/events");

  if (!isSupabaseAdminConfigured()) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Supabase admin credentials aren&apos;t configured yet.
        </div>
      </div>
    );
  }

  const { events, nowMs } = await getEvents();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Events</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Board use only. {events.length} event{events.length === 1 ? "" : "s"}. Public events show up
            on the <Link href="/calendar" className="underline hover:text-neutral-700">calendar page</Link>{" "}
            right away.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          + Add Event
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border border-black/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Visibility</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                  No events yet — click &quot;Add Event&quot; to add the first one.
                </td>
              </tr>
            )}
            {events.map((ev) => {
              const isPast = new Date(ev.start_at).getTime() < nowMs;
              return (
                <tr key={ev.id} className={isPast ? "opacity-60" : undefined}>
                  <td className="px-4 py-3 font-medium text-neutral-900">{ev.title}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {format(new Date(ev.start_at), "MMM d, yyyy · h:mm a")}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{ev.location || "—"}</td>
                  <td className="px-4 py-3 capitalize text-neutral-600">
                    {ev.visibility === "members_only" ? "Members only" : "Public"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link href={`/admin/events/${ev.id}/edit`} className="mr-3 text-brand hover:text-brand-dark">
                      Edit
                    </Link>
                    <DeleteEventButton id={ev.id} title={ev.title} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex gap-4">
          <Link href="/admin/members" className="hover:text-neutral-600">
            ← Members
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
