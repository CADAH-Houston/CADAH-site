"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { EventRow } from "@/lib/supabase/types";
import { createEvent, updateEvent } from "./actions";

// Converts a stored ISO timestamp (UTC) into the "YYYY-MM-DDTHH:mm" shape a
// <input type="datetime-local"> expects, rendered in the viewer's own local
// time zone (so the board member always sees times the way they'd say them
// out loud, not in UTC).
function isoToLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ event }: { event?: EventRow }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = event ? await updateEvent(event.id, formData) : await createEvent(formData);

    if (result.ok) {
      router.push("/admin/events");
      router.refresh();
    } else {
      setSubmitting(false);
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700" htmlFor="title">
            Title <span className="text-red-700">*</span>
          </label>
          <input
            id="title"
            name="title"
            defaultValue={event?.title}
            required
            placeholder="e.g. Annual Banquet"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700" htmlFor="start_at">
            Starts <span className="text-red-700">*</span>
          </label>
          <input
            id="start_at"
            name="start_at"
            type="datetime-local"
            defaultValue={isoToLocalInput(event?.start_at)}
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700" htmlFor="end_at">
            Ends
          </label>
          <input
            id="end_at"
            name="end_at"
            type="datetime-local"
            defaultValue={isoToLocalInput(event?.end_at)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <p className="mt-1 text-xs text-neutral-400">Optional.</p>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            name="location"
            defaultValue={event?.location ?? ""}
            placeholder="e.g. Ocean Palace Restaurant, Houston"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={event?.description ?? ""}
            placeholder="Details members and visitors should see"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700" htmlFor="visibility">
            Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            defaultValue={event?.visibility ?? "public"}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option value="public">Public — shown on the public calendar</option>
            <option value="members_only">Members only — hidden until member login ships</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {submitting ? "Saving…" : event ? "Save changes" : "Add event"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
