"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Member } from "@/lib/supabase/types";
import { createMember, updateMember } from "./actions";

export function MemberForm({ member }: { member?: Member }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = member ? await updateMember(member.id, formData) : await createMember(formData);

    if (result.ok) {
      router.push("/admin/members");
      router.refresh();
    } else {
      setSubmitting(false);
      setError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" defaultValue={member?.name} required />
        <Field
          label="Specialty"
          name="specialty"
          defaultValue={member?.specialty ?? ""}
          placeholder="e.g. Endodontics"
        />
        <Field
          label="Practice location"
          name="practice_location"
          defaultValue={member?.practice_location ?? ""}
          placeholder="City / clinic name"
        />
        <div>
          <label className="block text-sm font-medium text-neutral-700" htmlFor="membership_type">
            Membership type
          </label>
          <select
            id="membership_type"
            name="membership_type"
            defaultValue={member?.membership_type ?? "annual"}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option value="annual">Annual</option>
            <option value="lifetime">Lifetime</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={member?.status ?? "active"}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="retired">Retired</option>
            <option value="moved">Moved</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-black/10 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Contact &amp; privacy
        </p>
        <p className="text-xs text-neutral-500">
          &quot;Visible&quot; will show that field to other logged-in members in the directory once
          member login ships. Leave unchecked to keep it board-only for now.
        </p>
        <FieldWithVisibility
          label="Phone"
          name="phone"
          type="tel"
          defaultValue={member?.phone ?? ""}
          visibleDefault={member?.phone_visible}
        />
        <FieldWithVisibility
          label="Email"
          name="email"
          type="email"
          defaultValue={member?.email ?? ""}
          visibleDefault={member?.email_visible}
        />
        <FieldWithVisibility
          label="Home address"
          name="home_address"
          defaultValue={member?.home_address ?? ""}
          visibleDefault={member?.home_address_visible}
        />
        <FieldWithVisibility
          label="Practice address"
          name="practice_address"
          defaultValue={member?.practice_address ?? ""}
          visibleDefault={member?.practice_address_visible}
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {submitting ? "Saving…" : member ? "Save changes" : "Add member"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/members")}
          className="text-sm text-neutral-500 hover:text-neutral-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
      />
    </div>
  );
}

function FieldWithVisibility({
  label,
  name,
  type = "text",
  defaultValue,
  visibleDefault,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  visibleDefault?: boolean;
}) {
  return (
    <div className="flex items-end gap-3">
      <div className="flex-1">
        <label className="block text-sm font-medium text-neutral-700" htmlFor={name}>
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          defaultValue={defaultValue}
          className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <label className="mb-2 flex items-center gap-1.5 text-xs text-neutral-500">
        <input
          type="checkbox"
          name={`${name}_visible`}
          defaultChecked={visibleDefault}
          className="rounded border-neutral-300"
        />
        Visible
      </label>
    </div>
  );
}
