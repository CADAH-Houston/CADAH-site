"use client";

import { useState, type FormEvent } from "react";
import { isSupabaseConfigured } from "@/lib/config";
import type { MembershipType } from "@/lib/supabase/types";

const configured = isSupabaseConfigured();

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      full_name: String(data.get("full_name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim() || null,
      specialty: String(data.get("specialty") ?? "").trim() || null,
      practice_location: String(data.get("practice_location") ?? "").trim() || null,
      membership_type_interest:
        (data.get("membership_type_interest") as MembershipType | "" | null) || null,
      message: String(data.get("message") ?? "").trim() || null,
      status: "pending" as const,
    };

    if (!payload.full_name || !payload.email) {
      setError("Name and email are required.");
      return;
    }

    if (!configured) {
      // Supabase isn't wired up yet — this is expected during early review.
      setStatus("done");
      return;
    }

    setStatus("submitting");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("membership_applications")
        .insert(payload);

      if (insertError) throw insertError;
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
      setError("Something went wrong submitting your application. Please email the board instead.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-900">
        <p className="font-medium">Thank you! Your application has been received.</p>
        <p className="mt-1 text-sm text-green-800">
          A board member will reach out by email to confirm your membership and set up your
          login.
          {!configured && " (Demo mode — this submission was not saved anywhere yet.)"}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!configured && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Demo mode: Supabase isn&apos;t connected yet, so submissions here won&apos;t be saved.
          This form is fully wired up and will start saving real applications the moment
          Supabase credentials are added.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="full_name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" type="tel" />
        <Field label="Specialty" name="specialty" placeholder="e.g. Endodontics" />
        <Field label="Practice location" name="practice_location" placeholder="City / clinic name" />
        <div>
          <label className="block text-sm font-medium text-neutral-700" htmlFor="membership_type_interest">
            Interested in
          </label>
          <select
            id="membership_type_interest"
            name="membership_type_interest"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>
              Select one
            </option>
            <option value="annual">Annual Membership</option>
            <option value="lifetime">Lifetime Membership</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700" htmlFor="message">
          Anything else you&apos;d like the board to know?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-md bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700" htmlFor={name}>
        {label}
        {required && <span className="text-red-700"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
    </div>
  );
}
