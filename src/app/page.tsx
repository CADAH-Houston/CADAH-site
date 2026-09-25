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
              Become a Member
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
        <div className="mt-3 max-w-3xl space-y-4 text-neutral-600">
          <p>
            The Chinese American Doctors Association of Houston ({site.shortName}) is a
            nonprofit community of physicians and dentists dedicated to professional growth,
            mutual support, and service. Since {site.founded}, we’ve brought Chinese American
            doctors together through continuing medical education, community health fairs, our
            annual Chinese New Year gala, and more. We also partner with other Asian American
            physician organizations to advocate for the rights and welfare of doctors across
            our communities.
          </p>
          <p>
            Through the {site.shortName} Foundation, our 501(c)(3) charitable arm, funded
            entirely by our annual gala, we award{" "}
            <Link href="/scholarship" className="font-medium text-brand underline">
              scholarships
            </Link>{" "}
            to Houston-area medical and dental students, host health lectures for Asian
            communities, and provide health fairs with free medical and dental services. We
            encourage all {site.shortName} members to take part.
          </p>
          <p>
            Membership is open to U.S. citizens and permanent residents who are licensed
            physicians or dentists in good standing. Lifetime, regular, resident, student, and
            associate options are available.
          </p>
        </div>
      </section>

      <section className="border-t border-black/5 bg-brand-50">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-neutral-900">
            Join Houston’s Chinese American doctor community.
          </h2>
          <p className="mt-2 text-neutral-600">
            Connect with colleagues, keep learning, and give back.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/apply"
              className="rounded-md bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark"
            >
              Become a Member
            </Link>
            <Link
              href="/membership"
              className="rounded-md border border-neutral-300 bg-white px-5 py-3 font-medium text-neutral-800 transition hover:bg-neutral-50"
            >
              Membership Details &amp; Dues
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="rounded-lg border border-black/10 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <h2 className="text-lg font-semibold text-brand-green">Scholarship Program</h2>
            <p className="mt-1 max-w-2xl text-sm text-neutral-600">
              For thirty years, the {site.shortName} Foundation has awarded scholarships to
              Houston-area medical and dental students.
            </p>
          </div>
          <Link
            href="/scholarship"
            className="mt-4 inline-block shrink-0 rounded-md border border-brand-green px-4 py-2 text-sm font-medium text-brand-green transition hover:bg-brand-green hover:text-white sm:mt-0"
          >
            Learn &amp; Apply
          </Link>
        </div>
      </section>
    </div>
  );
}
