"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMember } from "./actions";

export function DeleteMemberButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!window.confirm(`Remove ${name} from the member list? This can't be undone.`)) return;
    setError(null);
    startTransition(async () => {
      const result = await deleteMember(id);
      if (!result.ok) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <span>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="text-red-700 hover:text-red-900 disabled:opacity-60"
      >
        {pending ? "Removing…" : "Delete"}
      </button>
      {error && <span className="ml-2 text-xs text-red-700">{error}</span>}
    </span>
  );
}
