// Placeholder content shown only when Supabase isn't configured yet, so the
// site is fully reviewable before any real accounts/data exist. Every piece
// is clearly labeled "Sample" in the UI that renders it.
import type { EventPhoto, EventRow } from "./supabase/types";

export const sampleEvents: EventRow[] = [
  {
    id: "sample-1",
    title: "Annual Fall Banquet",
    description: "Our yearly gathering with dinner, a keynote speaker, and a chance to catch up with colleagues.",
    location: "Houston, TX (venue TBD)",
    start_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(),
    end_at: null,
    visibility: "public",
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-2",
    title: "CE Talk: Updates in Endodontic Care",
    description: "A continuing education session open to members and the public.",
    location: "Virtual (Zoom link sent after RSVP)",
    start_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    end_at: null,
    visibility: "public",
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-3",
    title: "Board Planning Meeting",
    description: "Members-only planning session.",
    location: "Board member's office",
    start_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    end_at: null,
    visibility: "members_only",
    created_at: new Date().toISOString(),
  },
];

export const samplePhotos: (EventPhoto & { label: string; tone: string })[] = [
  {
    id: "sample-photo-1",
    event_id: null,
    storage_path: "",
    caption: "2025 Fall Banquet",
    uploaded_at: new Date().toISOString(),
    label: "Fall Banquet",
    tone: "from-rose-200 to-orange-200",
  },
  {
    id: "sample-photo-2",
    event_id: null,
    storage_path: "",
    caption: "Spring CE Symposium",
    uploaded_at: new Date().toISOString(),
    label: "CE Symposium",
    tone: "from-sky-200 to-indigo-200",
  },
  {
    id: "sample-photo-3",
    event_id: null,
    storage_path: "",
    caption: "New Member Mixer",
    uploaded_at: new Date().toISOString(),
    label: "New Member Mixer",
    tone: "from-emerald-200 to-teal-200",
  },
];
