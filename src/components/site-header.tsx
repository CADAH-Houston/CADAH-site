import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/config";

const navLinks = [
  { href: "/", label: "About" },
  { href: "/membership", label: "Membership" },
  { href: "/scholarship", label: "Scholarship" },
  { href: "/calendar", label: "Calendar" },
  { href: "/gallery", label: "Photo Gallery" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt={`${site.shortName} logo`} width={36} height={36} priority />
          <span className="font-semibold text-lg tracking-tight text-brand-green">
            {site.shortName}
          </span>
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-neutral-700 transition hover:bg-brand-50 hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="rounded-md bg-brand px-3 py-2 font-medium text-white transition hover:bg-brand-dark"
          >
            Apply to Join
          </Link>
        </nav>
      </div>
    </header>
  );
}
