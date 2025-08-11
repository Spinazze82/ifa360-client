import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container py-10">
      {/* Hero card (like pic 2) */}
      <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow">
        <p className="text-xs font-semibold text-blue-600">IFA360</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Smarter insurance decisions, in minutes.
        </h1>
        <p className="mt-3 text-gray-600">
          Compare estimates, use projection tools, and get clear explanations.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/quotes" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Get my quotes
          </Link>
          <Link href="/projection" className="rounded-md border px-4 py-2 text-gray-800 hover:bg-gray-50">
            Open projection tool
          </Link>
        </div>
      </div>
    </main>
  );
}
