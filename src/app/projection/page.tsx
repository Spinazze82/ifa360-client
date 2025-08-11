// File: src/app/projection/page.tsx
"use client";

import { useMemo, useState } from "react";

/** Tiny inline SVG line chart (no libraries) */
function LineChart({
  data,
  height = 260,
  className = "",
}: {
  data: { x: number; y: number }[];
  height?: number;
  className?: string;
}) {
  if (!data.length) return null;

  const pad = 28;
  const w = 800;
  const h = height;

  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = 0;
  const maxY = Math.max(...ys);

  const xScale = (x: number) =>
    pad + ((x - minX) / Math.max(1, maxX - minX)) * (w - pad * 2);
  const yScale = (y: number) =>
    h - pad - ((y - minY) / Math.max(1, maxY - minY)) * (h - pad * 2);

  const path = data
    .map((d, i) => `${i ? "L" : "M"} ${xScale(d.x).toFixed(2)} ${yScale(d.y).toFixed(2)}`)
    .join(" ");

  const ticks = [0, 0.5, 1].map((t) => ({
    y: minY + (maxY - minY) * t,
    label: "R" + Math.round(minY + (maxY - minY) * t).toLocaleString(),
  }));

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" strokeWidth="1" opacity={0.3} />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="currentColor" strokeWidth="1" opacity={0.3} />
        {ticks.map((t, i) => {
          const y = yScale(t.y);
          return (
            <g key={i}>
              <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="currentColor" strokeWidth="1" opacity={0.08} />
              <text x={pad - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="currentColor" opacity={0.6}>
                {t.label}
              </text>
            </g>
          );
        })}
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx={xScale(data[data.length - 1].x)} cy={yScale(data[data.length - 1].y)} r="3.5" fill="currentColor" />
        <text x={pad} y={h - pad + 16} fontSize="10" fill="currentColor" opacity={0.6}>
          Year {data[0].x}
        </text>
        <text x={w - pad} y={h - pad + 16} fontSize="10" fill="currentColor" opacity={0.6} textAnchor="end">
          Year {data[data.length - 1].x}
        </text>
      </svg>
    </div>
  );
}

function formatR(n: number) {
  return "R " + Math.round(n).toLocaleString();
}

export default function ProjectionToolPage() {
  const [initial, setInitial] = useState(0);
  const [monthly, setMonthly] = useState(2500);
  const [years, setYears] = useState(10);
  const [growth, setGrowth] = useState(6);
  const [escalation, setEscalation] = useState(0);

  const { series, finalValue, totalContrib } = useMemo(() => {
    const months = Math.max(1, years) * 12;
    const rMonthly = growth / 100 / 12;

    let bal = initial;
    let mContr = monthly;
    let totalContribCalc = initial;
    const pts: { x: number; y: number }[] = [];

    for (let m = 1; m <= months; m++) {
      if (m > 1 && (m - 1) % 12 === 0) mContr = mContr * (1 + escalation / 100);
      bal = (bal + mContr) * (1 + rMonthly);
      totalContribCalc += mContr;
      if (m % 12 === 0) pts.push({ x: m / 12, y: bal });
    }
    return { series: pts, finalValue: bal, totalContrib: totalContribCalc };
  }, [initial, monthly, years, growth, escalation]);

  function resetDefaults() {
    setInitial(0);
    setMonthly(2500);
    setYears(10);
    setGrowth(6);
    setEscalation(0);
  }

  // Contact form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function sendQuoteRequest(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("https://formspree.io/f/movlyeqe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          form: "investment_quote_request",
          fullName,
          email,
          mobile,
          // include latest projection summary for adviser context
          projection: {
            initial,
            monthly,
            years,
            growth,
            escalation,
            totalContrib: Math.round(totalContrib),
            projectedValue: Math.round(finalValue),
          },
          source: "ifa360-projection-page",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("ok");
      setFullName("");
      setEmail("");
      setMobile("");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between print:justify-start print:gap-6">
        <div>
          <h1 className="text-3xl font-bold">Projection Tool</h1>
          <p className="mt-2 text-gray-600">
            Adjust the sliders to see how your savings could grow over time. Demo only — not financial advice.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="print:hidden rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            title="Download PDF"
          >
            Download PDF
          </button>
          <button
            onClick={resetDefaults}
            className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Controls */}
      <section className="mt-6 space-y-6 rounded border bg-white p-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Initial amount (once-off)</label>
            <input
              type="number"
              className="w-40 rounded border p-1.5 text-right"
              value={initial}
              onChange={(e) => setInitial(Number(e.target.value || 0))}
            />
          </div>
        </div>

        <input type="range" min={0} max={2_000_000} step={5_000} value={initial} onChange={(e) => setInitial(Number(e.target.value))} className="w-full" />
        <div className="text-xs text-gray-600">{formatR(initial)}</div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Monthly contribution</label>
            <input
              type="number"
              className="w-40 rounded border p-1.5 text-right"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value || 0))}
            />
          </div>
        </div>

        <input type="range" min={0} max={100_000} step={500} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full" />
        <div className="text-xs text-gray-600">{formatR(monthly)}/mo</div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Projection period (years)</label>
            <input
              type="number"
              className="w-24 rounded border p-1.5 text-right"
              value={years}
              onChange={(e) => setYears(Math.max(1, Number(e.target.value || 1)))}
            />
          </div>
        </div>

        <input type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full" />
        <div className="text-xs text-gray-600">{years} year(s)</div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Expected annual growth</label>
            <input
              type="number"
              className="w-24 rounded border p-1.5 text-right"
              value={growth}
              onChange={(e) => setGrowth(Number(e.target.value || 0))}
            />
          </div>
        </div>

        <input type="range" min={0} max={20} step={0.1} value={growth} onChange={(e) => setGrowth(Number(e.target.value))} className="w-full" />
        <div className="text-xs text-gray-600">{growth}% p.a.</div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Contribution escalation (annual)</label>
            <input
              type="number"
              className="w-24 rounded border p-1.5 text-right"
              value={escalation}
              onChange={(e) => setEscalation(Number(e.target.value || 0))}
            />
          </div>
        </div>

        <input type="range" min={0} max={15} step={0.5} value={escalation} onChange={(e) => setEscalation(Number(e.target.value))} className="w-full" />
        <div className="text-xs text-gray-600">{escalation}% / year</div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded bg-white p-4 border">
          <div className="text-sm text-gray-600">Total contributions</div>
          <div className="text-xl font-semibold">{formatR(totalContrib)}</div>
        </div>
        <div className="rounded bg-white p-4 border">
          <div className="text-sm text-gray-600">Projected value</div>
          <div className="text-xl font-semibold">{formatR(finalValue)}</div>
        </div>
        <div className="rounded bg-white p-4 border">
          <div className="text-sm text-gray-600">Growth (gain)</div>
          <div className="text-xl font-semibold">{formatR(finalValue - totalContrib)}</div>
        </div>
      </section>

      {series.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Projection chart</h2>
          <LineChart className="mt-3 text-blue-700" data={series} />
        </section>
      )}

      {/* Contact for investment quote */}
      <section className="mt-10 rounded border bg-white p-4">
        <h2 className="text-xl font-semibold">Request an investment quote</h2>
        <p className="mt-1 text-gray-600">
          Send your details and your latest projection to an authorised adviser.
        </p>

        <form onSubmit={sendQuoteRequest} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Full name</label>
            <input className="mt-1 w-full rounded border p-2" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="mt-1 w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile</label>
            <input className="mt-1 w-full rounded border p-2" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
          </div>

        <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send request"}
            </button>
            {status === "ok" && <p className="text-sm text-green-700 mt-2">Thanks — we’ll be in touch shortly.</p>}
            {status === "error" && <p className="text-sm text-red-700 mt-2">{error}</p>}
          </div>
        </form>
      </section>

      <p className="mt-4 text-xs text-gray-500">
        Illustrative only. Assumes monthly contributions compounded monthly and annual escalation applied at the start of each year.
      </p>
    </main>
  );
}
