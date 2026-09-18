import Link from "next/link";
import { site } from "@/lib/config";

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-black/5 bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {site.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-600">{site.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/apply"
              className="rounded-md bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark"
            >
              Apply to Join
            </Link>
            <Link
              href="/calendar"
              className="rounded-md border border-neutral-300 px-5 py-3 font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              See Upcoming Events
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-xl font-semibold text-neutral-900">About {site.shortName}</h2>
        <p className="mt-3 max-w-3xl text-neutral-600">
          {/* TODO: replace with the association's real mission/history copy */}
          {site.shortName} brings together Chinese-speaking physicians and dentists across
          Greater Houston for professional connection, continuing education, and community.
          We host an annual banquet, periodic CE talks, and social events throughout the year.
        </p>
      </section>

      <section className="border-t border-black/5 bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="text-xl font-semibold text-neutral-900">Membership</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {Object.values(site.membership).map((tier) => (
              <div key={tier.label} className="rounded-lg border border-black/10 bg-white p-6">
                <h3 className="font-semibold text-neutral-900">{tier.label}</h3>
                <p className="mt-1 text-2xl font-bold text-brand">{tier.price}</p>
                <p className="mt-3 text-sm text-neutral-600">{tier.blurb}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-neutral-500">
            Ready to join, or have questions first?{" "}
            <Link href="/apply" className="font-medium text-brand underline">
              Submit an application
            </Link>{" "}
            or email{" "}
            <a className="font-medium text-brand underline" href={`mailto:${site.boardEmail}`}>
              {site.boardEmail}
            </a>
            . A board member will follow up before your login is created.
          </p>
        </div>
      </section>
    </div>
  );
}
