export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl bg-white p-10 shadow-sm">
          <div className="text-sm font-semibold text-blue-600">IFA360</div>
          <h1 className="mt-2 text-4xl font-bold text-gray-900">
            Smarter insurance decisions, in minutes.
          </h1>
          <p className="mt-3 text-gray-700">
            Compare estimates, use budget & projection tools, and get clear explanations with AI help.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="/quotes"
              className="rounded bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Get my quotes
            </a>
            <a
              href="/education"
              className="rounded border border-gray-300 px-5 py-3 font-medium text-gray-800 hover:bg-gray-100"
            >
              Learn the basics
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
