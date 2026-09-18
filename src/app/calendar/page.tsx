import { format } from "date-fns";
import { isSupabaseConfigured, site } from "@/lib/config";
import { sampleEvents } from "@/lib/sample-data";
import type { EventRow } from "@/lib/supabase/types";

export const metadata = { title: `Calendar — ${site.shortName}` };
export const revalidate = 0;

function splitByTime(events: EventRow[], nowMs: number) {
  return {
    upcoming: events.filter((e) => new Date(e.start_at).getTime() >= nowMs),
    past: events.filter((e) => new Date(e.start_at).getTime() < nowMs),
  };
}

async function getPublicEvents(): Promise<{
  upcoming: EventRow[];
  past: EventRow[];
  usingSampleData: boolean;
}> {
  const nowMs = Date.now();

  if (!isSupabaseConfigured()) {
    return {
      ...splitByTime(sampleEvents.filter((e) => e.visibility === "public"), nowMs),
      usingSampleData: true,
    };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("visibility", "public")
      .order("start_at", { ascending: true });

    if (error || !data) throw error ?? new Error("No data");
    return { ...splitByTime(data as EventRow[], nowMs), usingSampleData: false };
  } catch {
    return {
      ...splitByTime(sampleEvents.filter((e) => e.visibility === "public"), nowMs),
      usingSampleData: true,
    };
  }
}

export default async function CalendarPage() {
  const { upcoming, past, usingSampleData } = await getPublicEvents();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Upcoming Events</h1>
      <p className="mt-2 text-neutral-600">
        Public events are listed below. Some board and members-only events aren&apos;t shown here
        until member login is available.
      </p>

      {usingSampleData && (
        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Showing sample events — connect Supabase to display real ones.
        </div>
      )}

      <div className="mt-8 space-y-4">
        {upcoming.length === 0 && (
          <p className="text-neutral-500">No upcoming public events right now — check back soon.</p>
        )}
        {upcoming.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {past.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-semibold text-neutral-900">Past Events</h2>
          <div className="mt-4 space-y-4">
            {past.map((event) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({ event, isPast }: { event: EventRow; isPast?: boolean }) {
  return (
    <div
      className={`rounded-lg border border-black/10 p-5 ${isPast ? "bg-neutral-50 opacity-75" : "bg-white"}`}
    >
      <p className="text-sm font-medium text-brand">
        {format(new Date(event.start_at), "EEEE, MMMM d, yyyy · h:mm a")}
      </p>
      <h3 className="mt-1 font-semibold text-neutral-900">{event.title}</h3>
      {event.location && <p className="mt-1 text-sm text-neutral-500">{event.location}</p>}
      {event.description && <p className="mt-2 text-sm text-neutral-600">{event.description}</p>}
    </div>
  );
}
