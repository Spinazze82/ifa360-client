// File: src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Welcome to IFA360</h1>
      <p className="mt-2 text-gray-600">
        Quickly get insurance quotes or run investment projections.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link
          href="/quotes"
          className="rounded-lg border p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Get Quotes →</h2>
          <p className="mt-2 text-gray-600">
            Compare insurance and investment products instantly.
          </p>
        </Link>

        <Link
          href="/projection"
          className="rounded-lg border p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">Projection Tool →</h2>
          <p className="mt-2 text-gray-600">
            See how your investments could grow over time.
          </p>
        </Link>
      </div>
    </main>
  );
}
