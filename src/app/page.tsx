// File: src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold">Welcome to IFA360</h1>
      <p className="mt-2 text-gray-600">Quickly get insurance quotes or run investment projections.</p>

      {/* Two blocks in the middle */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link
          href="/quotes"
          className="rounded-lg border p-6 hover:shadow transition"
        >
          <h2 className="text-xl font-semibold">Get Quotes →</h2>
          <p className="mt-2 text-gray-600">Compare options side by side.</p>
        </Link>

        <Link
          href="/projection"
          className="rounded-lg border p-6 hover:shadow transition"
        >
          <h2 className="text-xl font-semibold">Projection Tool →</h2>
          <p className="mt-2 text-gray-600">See how your savings could grow.</p>
        </Link>
      </div>
    </main>
  );
}
