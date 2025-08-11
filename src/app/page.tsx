// File: src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="container mt-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="kicker">Welcome</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">
              Compare quotes. Run projections. Make confident choices.
            </h1>
            <p className="mt-3 text-muted">
              Quick forms, clear results, and a download you can share. No fluff.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/quotes" className="btn btn-primary">Get Quotes</Link>
              <Link href="/projection" className="btn btn-ghost">Open Projection Tool</Link>
            </div>
            <ul className="mt-6 grid gap-2 text-sm text-gray-700">
              <li>• Clean side-by-side comparisons</li>
              <li>• Simple sliders for “what-if” scenarios</li>
              <li>• Print & download summaries</li>
            </ul>
          </div>

          <div className="grid gap-4">
            <div className="card p-5">
              <div className="text-sm text-gray-500">Quote Example</div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <div className="text-xs text-gray-500">Carrier A</div>
                  <div className="mt-1 font-semibold">R 450</div>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <div className="text-xs text-gray-500">Carrier B</div>
                  <div className="mt-1 font-semibold">R 489</div>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <div className="text-xs text-gray-500">Carrier C</div>
                  <div className="mt-1 font-semibold">R 505</div>
                </div>
              </div>
            </div>
            <div className="card p-5">
              <div className="text-sm text-gray-500">Projection Snapshot</div>
              <div className="mt-3 h-24 rounded-lg border bg-gray-50" />
              <div className="mt-2 flex justify-between text-xs text-gray-600">
                <span>Total contributions</span>
                <span>Projected value</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="container mt-10 grid gap-6 md:grid-cols-2">
        <Link href="/quotes" className="card p-6">
          <h2 className="text-xl font-semibold">Get Quotes</h2>
          <p className="mt-1 text-muted">
            Enter a few details and compare options side by side.
          </p>
          <span className="mt-3 inline-block btn btn-ghost">Start</span>
        </Link>

        <Link href="/projection" className="card p-6">
          <h2 className="text-xl font-semibold">Projection Tool</h2>
          <p className="mt-1 text-muted">
            Test monthly contributions, growth, and time easily.
          </p>
          <span className="mt-3 inline-block btn btn-ghost">Open tool</span>
        </Link>
      </section>
    </div>
  );
}
