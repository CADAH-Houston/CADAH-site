import { site } from "@/lib/config";

export const metadata = {
  title: `Scholarship Program — ${site.shortName}`,
  description: `The ${site.shortName} Foundation awards scholarships to Houston-area medical and dental students. Eligibility, requirements, and how to apply.`,
};

export default function ScholarshipPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
        {site.shortName} Scholarship Program
      </h1>
      <p className="mt-4 text-neutral-600">
        For the past thirty years, the {site.shortName} Foundation has awarded scholarships to
        Houston-area medical and dental students, funded entirely through our annual gala. Last
        year, we awarded ten scholarships totaling approximately $14,000, with individual awards
        ranging from $1,000 to $3,000 given directly to students.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-neutral-900">Who can apply</h2>
        <p className="mt-3 text-neutral-600">You’re eligible to apply if you are either:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-600">
          <li>
            A student of Chinese descent (25% or greater) currently enrolled in an accredited
            medical or dental school within 100 miles of the Houston area, or
          </li>
          <li>
            The child of a {site.shortName} member, currently enrolled in an accredited medical
            or dental school, inside or outside the Greater Houston area.
          </li>
        </ul>
        <p className="mt-4 text-sm text-neutral-600">
          <span className="font-medium text-neutral-800">Note:</span> {site.shortName}{" "}
          membership is not required to apply for the scholarship. Previous recipients are not
          eligible to reapply.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-neutral-900">What you’ll need to submit</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-neutral-600">
          <li>A completed application form</li>
          <li>A signed certification of Chinese descent</li>
          <li>A copy of your medical/dental school transcripts</li>
          <li>
            Two letters of recommendation from graduate school or medical/dental school
            professors
          </li>
          <li>A personal statement (500 words maximum)</li>
        </ol>
        <p className="mt-4 text-neutral-600">
          Finalists will be invited to interview with the Scholarship Committee.
        </p>
      </section>

      <section className="mt-10 rounded-lg border border-brand/30 bg-brand-50 p-6">
        <h2 className="text-xl font-semibold text-neutral-900">Deadline</h2>
        <p className="mt-2 text-neutral-700">
          All materials must be submitted by email or postmarked by{" "}
          <strong>{site.scholarship.deadline}</strong>. Recipients will be announced in{" "}
          {site.scholarship.announcement}.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-neutral-900">How to apply</h2>
        <p className="mt-3 text-neutral-600">
          Download the application form, complete it, and follow the submission instructions on
          the last page.
        </p>
        <a
          href={site.downloads.scholarshipForm}
          download
          className="mt-4 inline-block rounded-md bg-brand px-5 py-3 font-medium text-white transition hover:bg-brand-dark"
        >
          Download Application Form (PDF)
        </a>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-neutral-900">Questions?</h2>
        <p className="mt-3 text-neutral-600">
          Contact {site.shortName} at{" "}
          <a className="font-medium text-brand underline" href={`mailto:${site.boardEmail}`}>
            {site.boardEmail}
          </a>
          .
        </p>
      </section>

      <p className="mt-12 rounded-lg bg-neutral-50 p-6 text-neutral-700">
        Every scholarship we award is made possible by our community’s support at the annual{" "}
        {site.shortName} gala. If you’d like to help fund the next generation of Houston’s
        medical and dental professionals, join us there.
      </p>
    </div>
  );
}
