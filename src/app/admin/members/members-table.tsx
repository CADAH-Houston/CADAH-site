"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/config";
import { effectiveTier, tierLabel } from "@/lib/members";
import type { Member, MemberStatus } from "@/lib/supabase/types";
import { DeleteMemberButton } from "./delete-button";

const STATUSES: MemberStatus[] = ["active", "retired", "moved", "inactive"];

const EXPORT_COLUMNS = [
  { key: "name", label: "Name", get: (m: Member) => m.name },
  { key: "email", label: "Email", get: (m: Member) => m.email ?? "" },
  { key: "phone", label: "Phone", get: (m: Member) => m.phone ?? "" },
  { key: "specialty", label: "Specialty", get: (m: Member) => m.specialty ?? "" },
  { key: "location", label: "Practice location", get: (m: Member) => m.practice_location ?? "" },
  { key: "tier", label: "Membership type", get: (m: Member) => tierLabel(effectiveTier(m)) },
  { key: "status", label: "Status", get: (m: Member) => m.status },
  { key: "practice_address", label: "Practice address", get: (m: Member) => m.practice_address ?? "" },
  { key: "home_address", label: "Home address", get: (m: Member) => m.home_address ?? "" },
] as const;

type ColumnKey = (typeof EXPORT_COLUMNS)[number]["key"];

// Guard against spreadsheet formula injection, and quote per CSV rules.
function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

const selectClass =
  "mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none";

export function MembersTable({ members }: { members: Member[] }) {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("all");
  const [status, setStatus] = useState("active");
  const [specialty, setSpecialty] = useState("all");
  const [columns, setColumns] = useState<Set<ColumnKey>>(new Set(["name", "email"]));
  const [notice, setNotice] = useState<string | null>(null);

  // Distinct specialties (case-insensitive), with counts.
  const specialties = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    for (const m of members) {
      const label = m.specialty?.trim();
      if (!label) continue;
      const key = label.toLowerCase();
      const cur = map.get(key);
      if (cur) cur.count += 1;
      else map.set(key, { label, count: 1 });
    }
    return [...map.entries()].sort((a, b) => a[1].label.localeCompare(b[1].label));
  }, [members]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (tier !== "all" && effectiveTier(m) !== tier) return false;
      if (status !== "all" && m.status !== status) return false;
      if (specialty !== "all" && (m.specialty?.trim().toLowerCase() ?? "") !== specialty) return false;
      if (q) {
        const hay = [m.name, m.specialty, m.practice_location, m.email].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [members, search, tier, status, specialty]);

  const emails = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const m of filtered) {
      const e = m.email?.trim();
      if (e && !seen.has(e.toLowerCase())) {
        seen.add(e.toLowerCase());
        out.push(e);
      }
    }
    return out;
  }, [filtered]);

  function toggleColumn(key: ColumnKey) {
    setColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function copyEmails() {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setNotice(`Copied ${emails.length} email address${emails.length === 1 ? "" : "es"}. Paste into the BCC line.`);
    } catch {
      setNotice("Couldn't copy automatically — use Download CSV instead.");
    }
  }

  function downloadCsv() {
    const cols = EXPORT_COLUMNS.filter((c) => columns.has(c.key));
    if (cols.length === 0) {
      setNotice("Choose at least one column to export.");
      return;
    }
    const lines = [
      cols.map((c) => csvCell(c.label)).join(","),
      ...filtered.map((m) => cols.map((c) => csvCell(c.get(m))).join(",")),
    ];
    // BOM so Excel reads Chinese characters correctly.
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cadah-members-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice(`Downloaded ${filtered.length} member${filtered.length === 1 ? "" : "s"}.`);
  }

  return (
    <div className="mt-8">
      <div className="grid gap-4 rounded-lg border border-black/10 bg-neutral-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-neutral-700" htmlFor="q">
            Search
          </label>
          <input
            id="q"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, specialty, location…"
            className={selectClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700" htmlFor="tier">
            Membership type
          </label>
          <select id="tier" value={tier} onChange={(e) => setTier(e.target.value)} className={selectClass}>
            <option value="all">All types</option>
            {site.membershipTiers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700" htmlFor="specialty">
            Specialty
          </label>
          <select
            id="specialty"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className={selectClass}
          >
            <option value="all">All specialties</option>
            {specialties.map(([key, s]) => (
              <option key={key} value={key}>
                {s.label} ({s.count})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700" htmlFor="status">
            Status
          </label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-black/10 p-4">
        <p className="text-sm text-neutral-700">
          <strong>{filtered.length}</strong> of {members.length} members match ·{" "}
          <strong>{emails.length}</strong> unique email address{emails.length === 1 ? "" : "es"}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            CSV columns
          </span>
          {EXPORT_COLUMNS.map((c) => (
            <label key={c.key} className="flex items-center gap-1.5 text-sm text-neutral-600">
              <input
                type="checkbox"
                checked={columns.has(c.key)}
                onChange={() => toggleColumn(c.key)}
                className="rounded border-neutral-300"
              />
              {c.label}
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyEmails}
            disabled={emails.length === 0}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-50"
          >
            Copy emails
          </button>
          <button
            type="button"
            onClick={downloadCsv}
            disabled={filtered.length === 0}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:bg-neutral-50 disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>
        {notice && <p className="mt-3 text-sm text-green-700">{notice}</p>}
        <p className="mt-3 text-xs text-neutral-500">
          Exports include every address the board has on file, regardless of the members’ “Visible”
          settings. When emailing a group, put addresses in BCC so members’ emails stay private.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-black/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Specialty</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {members.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No members yet — click &quot;Add Member&quot; to add the first one.
                </td>
              </tr>
            )}
            {members.length > 0 && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No members match these filters.
                </td>
              </tr>
            )}
            {filtered.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 font-medium text-neutral-900">{m.name}</td>
                <td className="px-4 py-3 text-neutral-600">{m.specialty || "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{tierLabel(effectiveTier(m))}</td>
                <td className="px-4 py-3 capitalize text-neutral-600">{m.status}</td>
                <td className="px-4 py-3 text-neutral-600">{m.email || m.phone || "—"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link href={`/admin/members/${m.id}/edit`} className="mr-3 text-brand hover:text-brand-dark">
                    Edit
                  </Link>
                  <DeleteMemberButton id={m.id} name={m.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
