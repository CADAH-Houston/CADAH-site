import { isSupabaseConfigured, site } from "@/lib/config";
import { samplePhotos } from "@/lib/sample-data";

export const metadata = { title: `Photo Gallery — ${site.shortName}` };
export const revalidate = 0;

const STORAGE_BUCKET = "event-photos";

type GalleryPhoto = { id: string; caption: string | null; url: string };

async function getPhotos(): Promise<{ photos: GalleryPhoto[]; usingSampleData: boolean }> {
  if (!isSupabaseConfigured()) {
    return { photos: [], usingSampleData: true };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("event_photos")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error || !data) throw error ?? new Error("No data");

    const photos = data.map((row) => {
      const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(row.storage_path);
      return { id: row.id, caption: row.caption, url: urlData.publicUrl };
    });

    return { photos, usingSampleData: false };
  } catch {
    return { photos: [], usingSampleData: true };
  }
}

export default async function GalleryPage() {
  const { photos, usingSampleData } = await getPhotos();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-2xl font-bold text-neutral-900">Event Photo Gallery</h1>
      <p className="mt-2 text-neutral-600">A look back at recent {site.shortName} gatherings.</p>

      {usingSampleData && (
        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Showing sample placeholders — connect Supabase Storage to display real event photos.
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {usingSampleData
          ? samplePhotos.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-lg border border-black/10">
                <div
                  className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${photo.tone} text-sm font-medium text-neutral-700`}
                >
                  Sample photo
                </div>
                <p className="p-3 text-sm text-neutral-600">{photo.caption}</p>
              </div>
            ))
          : photos.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-lg border border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.caption ?? "Event photo"}
                  className="aspect-[4/3] w-full object-cover"
                />
                {photo.caption && <p className="p-3 text-sm text-neutral-600">{photo.caption}</p>}
              </div>
            ))}
        {!usingSampleData && photos.length === 0 && (
          <p className="text-neutral-500">No photos uploaded yet — check back after the next event.</p>
        )}
      </div>
    </div>
  );
}
