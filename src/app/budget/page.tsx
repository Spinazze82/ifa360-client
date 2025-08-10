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
        {/* axes */}
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" strokeWidth="1" opacity={0.3} />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="currentColor" strokeWidth="1" opacity={0.3} />

        {/* y-grid + labels */}
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

        {/* line */}
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />

        {/* last point */}
        <circle
          cx={xScale(data[data.length - 1].x)}
          cy={yScale(data[data.length - 1].y)}
          r="3.5"
          fill="currentColor"
        />

        {/* x labels */}
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
  // Inputs
  const [initial, setInitial] = useState(0);      // Initial lump sum (R)
  const [monthly, setMonthly] = useState(2500);   // Monthly contribution (R)
  const [years, setYears] = useState(10);         // Years
  const [growth, setGrowth] = useState(6);        // Annual growth % (net)
  const [escalation, setEscalation] = useState(0);// Annual contribution increase %

  // Calculations — simulate month by month (handles annual escalation)
  const { series, finalValue, totalContrib } = useMemo(() => {
    const months = Math.max(1, years) * 12;
    const rMonthly = growth / 100 / 12;

    let bal = initial;
    let mContr = monthly;
    let totalContribCalc = initial;
    const pts: { x: number; y: number }[] = [];

    for (let m = 1; m <= months; m++) {
      // escalate contribution at start of each new year (except the first)
      if (m > 1 && (m - 1) % 12 === 0) {
        mContr = mContr * (1 + escalation / 100);
      }
      bal = (bal + mContr) * (1 + rMonthly);
      totalContribCalc += mContr;

      if (m % 12 === 0) {
        pts.push({ x: m / 12, y: bal });
      }
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

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projection Tool</h1>
        <button
          onClick={resetDefaults}
          className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
      <p className="mt-2 text-gray-600">
        Adjust the sliders to see how your savings could grow over time. Demo only — not financial advice.
      </p>

      {/* Controls */}
      <section className="mt-6 space-y-6 rounded border bg-white p-4">
        {/* Initial lump sum */}
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
          <input
            type="range"
            min={0}
            max={2_000_000}
            step={5_000}
            value={initial}
            onChange={(e) => setInitial(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <div className="text-xs text-gray-600 mt-1">{formatR(initial)}</div>
        </div>

        {/* Monthly contribution */}
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
          <input
            type="range"
            min={0}
            max={100_000}
            step={500}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <div className="text-xs text-gray-600 mt-1">{formatR(monthly)}/mo</div>
        </div>

        {/* Years */}
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
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <div className="text-xs text-gray-600 mt-1">{years} year(s)</div>
        </div>

        {/* Growth */}
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
          <input
            type="range"
            min={0}
            max={20}
            step={0.1}
            value={growth}
            onChange={(e) => setGrowth(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <div className="text-xs text-gray-600 mt-1">{growth}% p.a.</div>
        </div>

        {/* Escalation */}
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
          <input
            type="range"
            min={0}
            max={15}
            step={0.5}
            value={escalation}
            onChange={(e) => setEscalation(Number(e.target.value))}
            className="mt-2 w-full"
          />
          <div className="text-xs text-gray-600 mt-1">{escalation}% / year</div>
        </div>
      </section>

      {/* Summary cards */}
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

      {/* Chart */}
      {series.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Projection chart</h2>
          <LineChart className="mt-3 text-blue-700" data={series} />
        </section>
      )}

      {/* Table */}
      {series.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Projection table</h2>
          <table className="mt-2 w-full border-collapse border">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Year</th>
                <th className="border px-4 py-2 text-left">Estimated Value (R)</th>
              </tr>
            </thead>
            <tbody>
              {series.map((row) => (
                <tr key={row.x}>
                  <td className="border px-4 py-2">{row.x}</td>
                  <td className="border px-4 py-2">{Math.round(row.y).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <p className="mt-4 text-xs text-gray-500">
        Illustrative only. Assumes monthly contributions compounded monthly and annual escalation applied at the start of each year.
      </p>
    </main>
  );
}
