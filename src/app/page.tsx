// File: src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="container mt-10">
        <div className="panel p-8 md:p-12">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Make better money moves with{" "}
                <span className="text-gradient">clarity & speed</span>.
              </h1>
              <p className="mt-4 text-white/80">
                Compare quotes in minutes and project how your investments could grow.
                No jargon. No fuss.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/quotes" className="btn btn-brand">Get Quotes</Link>
                <Link href="/projection" className="btn btn-ghost">Open Projection Tool</Link>
              </div>

              <ul className="mt-6 grid gap-2 text-sm text-white/70">
                <li>✅ Simple, guided forms</li>
                <li>✅ Clear results & downloadable summaries</li>
                <li>✅ Built with privacy in mind</li>
              </ul>
            </div>

            <div className="hidden md:block">
              {/* Decorative card stack */}
              <div className="mx-auto max-w-sm">
                <div className="card p-5 rotate-[-3deg] translate-x-3 translate-y-2">
                  <h3 className="text-white/90 font-medium">Projection preview</h3>
                  <div className="mt-3 h-32 rounded-xl bg-white/5" />
                  <div className="mt-3 flex justify-between text-xs text-white/60">
                    <span>Total contributions</span>
                    <span>Projected value</span>
                  </div>
                </div>
                <div className="card p-5 -mt-6">
                  <h3 className="text-white/90 font-medium">Quote comparison</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="h-20 rounded-xl bg-white/5" />
                    <div className="h-20 rounded-xl bg-white/5" />
                    <div className="h-20 rounded-xl bg-white/5" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="container mt-10 grid gap-6 md:grid-cols-2">
        <Link href="/quotes" className="card p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white/10 p-3">📝</div>
            <div>
              <h2 className="text-xl font-semibold">Get Quotes</h2>
              <p className="mt-1 text-white/70">
                Enter a few details and see side-by-side options. Save a PDF or share.
              </p>
              <span className="mt-3 inline-block btn btn-ghost">Start</span>
            </div>
          </div>
        </Link>

        <Link href="/projection" className="card p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white/10 p-3">📈</div>
            <div>
              <h2 className="text-xl font-semibold">Projection Tool</h2>
              <p className="mt-1 text-white/70">
                Use sliders to test “what-ifs” and download a neat summary.
              </p>
              <span className="mt-3 inline-block btn btn-ghost">Open tool</span>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
