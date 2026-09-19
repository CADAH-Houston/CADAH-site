import Link from "next/link";
import { site } from "@/lib/config";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-neutral-500 sm:px-6">
        <p>
          {site.name} &middot; Questions?{" "}
          <a className="underline hover:text-neutral-700" href={`mailto:${site.boardEmail}`}>
            {site.boardEmail}
          </a>
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2">
          <span>
            &copy; {new Date().getFullYear()} {site.shortName}. All rights reserved.
          </span>
          <Link href="/admin/login" className="text-neutral-400 hover:text-neutral-600">
            Board
          </Link>
        </p>
      </div>
    </footer>
  );
}
