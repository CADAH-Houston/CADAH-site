import Link from "next/link";
import { site } from "@/lib/config";

export const metadata = {
  title: `Membership — ${site.shortName}`,
  description: `Why join ${site.shortName}, who can join, membership types and dues, and how to apply.`,
};

const whyJoin = [
  {
    title: "Community",
    body: "Meet fellow physicians and dentists at our annual Chinese New Year gala and throughout the year.",
  },
  {
    title: "Education",
    body: "Attend continuing medical education talks led by colleagues.",
  },
  {
    title: "Service",
    body: "Take part in community health fairs that bring care to those who need it.",
  },
  {
    title: "Advocacy",
    body: "Stand with a network working to safeguard the rights and welfare of Asian American doctors.",
  },
  {
    title: "Support",
    body: "Help fellow Chinese American doctors in need, members and non-members alike.",
  },
  {
    title: "Leadership",
    body: "Lifetime and regular members are eligible to serve on our board of directors and officers.",
  },
];

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Membership</h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Join Houston’s Chinese American doctor community. Connect with colleagues, keep
        learning, and give back.
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-neutral-900">Why join {site.shortName}</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {whyJoin.map((item) => (
            <li key={item.title} className="rounded-lg border border-black/10 p-5">
              <h3 className="font-semibold text-brand-green">{item.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-neutral-900">Who can join</h2>
        <p className="mt-3 max-w-3xl text-neutral-600">
          Membership is open to U.S. citizens and permanent residents who are licensed
          physicians or dentists in good standing in at least one U.S. state.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-neutral-900">Membership types &amp; dues</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.membershipTiers.map((tier) => (
            <div key={tier.id} className="rounded-lg border border-black/10 bg-white p-6">
              <h3 className="font-semibold text-neutral-900">{tier.label}</h3>
              <p className="mt-1 text-xl font-bold text-brand">{tier.price}</p>
              <p className="mt-3 text-sm text-neutral-600">{tier.blurb}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-neutral-500">
          Annual dues cover January through December.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-neutral-900">How to join</h2>
        <ol className="mt-4 max-w-3xl list-decimal space-y-2 pl-5 text-neutral-600">
          <li>
            Complete the{" "}
            <Link href="/apply" className="font-medium text-brand underline">
              online application
            </Link>
            .
          </li>
          <li>Confirm your license and eligibility.</li>
          <li>
            {site.onlinePaymentsEnabled
              ? "Pay your dues securely online."
              : "Pay your dues by check payable to CADAH (online card payment is coming soon)."}
          </li>
          <li>Welcome to {site.shortName}!</li>
        </ol>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/apply"
            className="rounded-md bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark"
          >
            Become a Member
          </Link>
          <a
            href={site.downloads.membershipForm}
            download
            className="rounded-md border border-neutral-300 px-5 py-3 font-medium text-neutral-800 transition hover:bg-neutral-50"
          >
            Download paper application (Word)
          </a>
        </div>

        <div className="mt-6 max-w-3xl rounded-lg border border-black/10 bg-neutral-50 p-5 text-sm text-neutral-600">
          <p className="font-medium text-neutral-800">Prefer to apply by mail?</p>
          <p className="mt-1">
            Download the application form, complete it, and mail it with your check payable to{" "}
            {site.shortName} to:
          </p>
          <address className="mt-2 not-italic text-neutral-800">
            {site.mailingAddress.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>

        <p className="mt-6 text-neutral-600">
          Not ready to join? Come to an{" "}
          <Link href="/calendar" className="font-medium text-brand underline">
            upcoming event
          </Link>{" "}
          as our guest.
        </p>
      </section>

      <section className="mt-12 rounded-lg bg-brand-50 p-6">
        <p className="max-w-3xl text-neutral-700">
          Membership keeps our community, education, and service programs running. The{" "}
          {site.shortName} Foundation’s{" "}
          <Link href="/scholarship" className="font-medium text-brand underline">
            scholarships
          </Link>{" "}
          for Houston-area medical and dental students are funded entirely through our annual
          gala — we hope you’ll join us there.
        </p>
      </section>
    </div>
  );
}
