// File: src/app/privacy/page.tsx
export const metadata = { title: "Privacy — IFA360" };

export default function Page() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-gray-600">
        We respect your privacy. This site follows POPIA principles: purpose limitation,
        data minimisation, and consent-based processing.
      </p>

      <section className="mt-6 space-y-3">
        <h2 className="text-xl font-semibold">What we collect</h2>
        <ul className="list-disc ml-6">
          <li>Contact details you submit (e.g., name, email, phone).</li>
          <li>Form inputs for quotes/projections (for demo display purposes).</li>
        </ul>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-xl font-semibold">How we use it</h2>
        <ul className="list-disc ml-6">
          <li>To provide quotes, projections, and requested info.</li>
          <li>To connect you with an authorised adviser (if you consent).</li>
        </ul>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-xl font-semibold">Your choices</h2>
        <ul className="list-disc ml-6">
          <li>You can request access, correction, or deletion of your data.</li>
          <li>You can opt out of marketing at any time.</li>
        </ul>
      </section>

      <p className="mt-8 text-sm text-gray-500">
        This is a demo policy. Replace with your firm’s official POPIA-compliant policy.
      </p>
    </main>
  );
}
