"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAdmin } from "./actions";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAdmin(formData);

    if (result.ok) {
      const next = searchParams.get("next") || "/admin/members";
      router.push(next);
      router.refresh();
    } else {
      setSubmitting(false);
      setError(result.error);
    }
  }

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
          autoFocus
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {submitting ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
