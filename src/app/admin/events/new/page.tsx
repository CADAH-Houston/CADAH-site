import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/admin-session";
import { site } from "@/lib/config";
import { EventForm } from "../event-form";

export const metadata = { title: `Add Event — ${site.shortName} Admin` };

export default async function NewEventPage() {
  const authed = await isAdminAuthed();
  if (!authed) redirect("/admin/login?next=/admin/events/new");

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Add Event</h1>
      <div className="mt-8">
        <EventForm />
      </div>
    </div>
  );
}
