"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { uploadEventPhoto } from "./actions";

// Photos are shrunk in the browser before upload: a phone photo can be 5–15 MB,
// which is slow to send and can exceed the server's request-size limit.
const MAX_DIMENSION = 1600; // px, longest side
const MAX_BYTES = 900 * 1024; // stay under the 1 MB server-action body limit

type Item = {
  id: number;
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    const url = URL.createObjectURL(file);
    try {
      return await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("decode"));
        img.src = url;
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

/** Returns a resized JPEG, or throws if the photo can't be read/shrunk enough. */
async function shrinkPhoto(file: File): Promise<File> {
  let source: ImageBitmap | HTMLImageElement;
  try {
    source = await loadBitmap(file);
  } catch {
    // Browser can't read this format (e.g. HEIC on desktop Chrome). Send it
    // as-is only if it's already small enough.
    if (file.size <= MAX_BYTES) return file;
    throw new Error("Couldn't read this photo. Try a JPEG or PNG.");
  }

  const w = "naturalWidth" in source ? source.naturalWidth : source.width;
  const h = "naturalHeight" in source ? source.naturalHeight : source.height;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  canvas.getContext("2d")!.drawImage(source, 0, 0, canvas.width, canvas.height);
  if ("close" in source) source.close();

  for (const quality of [0.85, 0.75, 0.65, 0.5]) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (blob && blob.size <= MAX_BYTES) {
      const base = file.name.replace(/\.[^.]+$/, "") || "photo";
      return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
    }
  }
  throw new Error("Photo is still too large after shrinking.");
}

export function UploadForm() {
  const [items, setItems] = useState<Item[]>([]);
  const [running, setRunning] = useState(false);
  const [fatal, setFatal] = useState<string | null>(null);

  function update(id: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function handleChoose(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setItems((prev) => [
      ...prev,
      ...files.map((file, i) => ({
        id: Date.now() + i,
        file,
        status: "pending" as const,
      })),
    ]);
    e.target.value = ""; // allow picking the same files again later
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFatal(null);
    const form = new FormData(e.currentTarget);
    const passcode = String(form.get("passcode") ?? "");
    const caption = String(form.get("caption") ?? "");

    const queue = items.filter((it) => it.status === "pending" || it.status === "error");
    if (queue.length === 0) {
      setFatal("Choose at least one photo first.");
      return;
    }

    setRunning(true);
    for (const item of queue) {
      update(item.id, { status: "uploading", error: undefined });
      try {
        const small = await shrinkPhoto(item.file);
        const fd = new FormData();
        fd.set("passcode", passcode);
        fd.set("caption", caption);
        fd.set("file", small);
        const result = await uploadEventPhoto(fd);
        if (result.ok) {
          update(item.id, { status: "done" });
        } else {
          update(item.id, { status: "error", error: result.error });
          if (result.error === "Incorrect passcode.") {
            setFatal("Incorrect passcode — nothing was uploaded.");
            break; // don't fail every remaining photo the same way
          }
        }
      } catch (err) {
        update(item.id, {
          status: "error",
          error: err instanceof Error ? err.message : "Upload failed.",
        });
      }
    }
    setRunning(false);
  }

  const done = items.filter((i) => i.status === "done").length;
  const failed = items.filter((i) => i.status === "error").length;
  const remaining = items.filter((i) => i.status === "pending" || i.status === "error").length;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-neutral-700" htmlFor="passcode">
          Admin passcode
        </label>
        <input
          id="passcode"
          name="passcode"
          type="password"
          required
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700" htmlFor="files">
          Photos
        </label>
        <input
          id="files"
          type="file"
          accept="image/*"
          multiple
          onChange={handleChoose}
          disabled={running}
          className="mt-1 block w-full text-sm"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Select as many as you like. Each photo is automatically resized before uploading.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700" htmlFor="caption">
          Caption for all photos (optional)
        </label>
        <input
          id="caption"
          name="caption"
          type="text"
          placeholder="e.g. 2026 Chinese New Year Gala"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>

      {items.length > 0 && (
        <div>
          <p className="text-sm font-medium text-neutral-700">
            {done} of {items.length} uploaded{failed > 0 && `, ${failed} failed`}
          </p>
          <ul className="mt-2 max-h-72 divide-y divide-neutral-100 overflow-y-auto rounded-md border border-neutral-200 text-sm">
            {items.map((it) => (
              <li key={it.id} className="flex items-start justify-between gap-3 px-3 py-2">
                <span className="min-w-0 break-words text-neutral-800">
                  {it.file.name}
                  {it.error && <span className="block text-xs text-red-700">{it.error}</span>}
                </span>
                <span
                  className={`shrink-0 text-xs ${
                    it.status === "done"
                      ? "text-green-700"
                      : it.status === "error"
                        ? "text-red-700"
                        : "text-neutral-500"
                  }`}
                >
                  {it.status === "done" && "✓ Uploaded"}
                  {it.status === "uploading" && "Uploading…"}
                  {it.status === "pending" && "Waiting"}
                  {it.status === "error" && "Failed"}
                </span>
              </li>
            ))}
          </ul>
          {!running && (
            <button
              type="button"
              onClick={() => setItems((prev) => prev.filter((i) => i.status !== "done"))}
              className="mt-2 text-xs text-neutral-500 underline"
            >
              Clear finished
            </button>
          )}
        </div>
      )}

      {fatal && <p className="text-sm text-red-700">{fatal}</p>}
      {!running && items.length > 0 && remaining === 0 && !fatal && (
        <p className="text-sm text-green-700">All done — check the gallery page.</p>
      )}

      <button
        type="submit"
        disabled={running || remaining === 0}
        className="rounded-md bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {running
          ? "Uploading…"
          : failed > 0
            ? `Retry ${remaining} photo${remaining === 1 ? "" : "s"}`
            : `Upload ${remaining || ""} Photo${remaining === 1 ? "" : "s"}`.replace("  ", " ")}
      </button>
    </form>
  );
}
