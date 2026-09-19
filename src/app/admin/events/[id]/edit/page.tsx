import { notFound, redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-session";
import { isSupabaseAdminConfigured, site } from "@/lib/config";
import type { EventRow } from "@/lib/supabase/types";
import { EventForm } from "../../event-form";

export const metadata = { title: `Edit Event — ${site.shortName} Admin` };

async function getEvent(id: string): Promise<EventRow | null> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as EventRow;
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const authed = await isAdminAuthed();
  if (!authed) redirect("/admin/login?next=/admin/events");

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
  const event = await getEvent(id);
  if (!event) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Edit Event</h1>
      <div className="mt-8">
        <EventForm event={event} />
      </div>
    </div>
  );
}
