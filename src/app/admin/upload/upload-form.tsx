"use client";

import { useRef, useState, type FormEvent } from "react";
import { uploadEventPhoto } from "./actions";

export function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await uploadEventPhoto(formData);

    if (result.ok) {
      setStatus("done");
      formRef.current?.reset();
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
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
        <label className="block text-sm font-medium text-neutral-700" htmlFor="file">
          Photo
        </label>
        <input id="file" name="file" type="file" accept="image/*" required className="mt-1 block w-full text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700" htmlFor="caption">
          Caption (optional)
        </label>
        <input
          id="caption"
          name="caption"
          type="text"
          placeholder="e.g. 2026 Spring Mixer"
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>

      {status === "done" && <p className="text-sm text-green-700">Uploaded — check the gallery page.</p>}
      {status === "error" && error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-md bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Uploading…" : "Upload Photo"}
      </button>
    </form>
  );
}
