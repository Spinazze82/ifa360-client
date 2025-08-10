"use client";

import { useMemo, useState } from "react";

/** Tiny inline chart (no libraries) */
function LineChart({
  data,
  height = 240,
  className = "",
}: {
  data: { x: number; y: number }[];
  height?: number;
  className?: string;
}) {
  if (!data.length) return null;

  // padding around the plot area
  const pad = 28;
  const w = 800; // logical width (svg scales to fit container)
  const h = height;

  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = 0; // start at zero for finance charts
  const maxY = Math.max(...ys);

  const xScale = (x: number) =>
    pad + ((x - minX) / Math.max(1, maxX - minX)) * (w - pad * 2);
  const yScale = (y: number) =>
    h - pad - ((y - minY) / Math.max(1, maxY - minY)) * (h - pad * 2);

  const path = data
    .map((d, i) => `${i ? "L" : "M"} ${xScale(d.x).toFixed(2)} ${yScale(d.y).toFixed(2)}`)
    .join(" ");

  // simple y-axis ticks: 0%, 50%, 100% of max
  const ticks = [0, 0.5, 1].map((t) => ({
    y: minY + (maxY - minY) * t,
    label:
      "R" +
      Math.round((minY + (maxY - minY) * t)).toLocaleString(),
  }));

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        {/* axes */}
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" strokeWidth="1" opacity={0.3} />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="currentColor" strokeWidth="1" opacity={0.3} />

        {/* y ticks */}
        {ticks.map((t, i) => {
          const y = yScale(t.y);
          return (
            <g key={i}>
              <line x1={pad} y1={y} x2={w - pad} y2={y} stroke="currentColor" strokeWidth="1" opacity={0.1} />
              <text x={pad - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="currentColor" opacity={0.6}>
                {t.label}
              </text>
            </g>
          );
        })}

        {/* line */}
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />

        {/* last point dot */}
        {data.length > 0 && (
          <circle
            cx={xScale(data[data.length - 1].x)}
            cy={yScale(data[data.length - 1].y)}
            r="3.5"
            fill="currentColor"
          />
        )}

        {/* x labels: first & last year */}
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

export default function Page() {
  const [income, setIncome] = useState<number | "">("");
  const [expenses, setExpenses] = useState<number | "">("");
  const [growthRate, setGrowthRate] = useState<number | "">(6);
  const [years, setYears] = useState<number | "">(10);

  const surplus = income !== "" && expenses !== "" ? income - expenses : null;

  // simple projection (demo): compound each year's total contributions at rate
  const projection = useMemo(() => {
    if (surplus === null || surplus <= 0 || growthRate === "" || years === "") return [];
    const arr: { year: number; value: number }[] = [];
    for (let y = 1; y <= Number(years); y++) {
      const value = surplus * 12 * y * Math.pow(1 + Number(growthRate) / 100, y);
      arr.push({ year: y, value });
    }
    return arr;
  }, [surplus, growthRate, years]);

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Budget & Projection Tool</h1>
      <p className="mt-2 text-gray-600">
        Calculate your monthly surplus and project potential investment growth over time.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium">Monthly income after tax (R)</label>
          <input
            type="number"
            className="mt-1 w-full rounded border p-2"
            value={income}
            onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="e.g. 25000"
          />
          <p className="mt-1 text-xs text-gray-500">
            Use your net take-home pay after PAYE/UIF/other deductions.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium">Monthly expenses (R)</label>
          <input
            type="number"
            className="mt-1 w-full rounded border p-2"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="e.g. 18000"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Expected annual growth rate (%)</label>
            <input
              type="number"
              className="mt-1 w-full rounded border p-2"
              value={growthRate}
              onChange={(e) => setGrowthRate(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Projection period (years)</label>
            <input
              type="number"
              className="mt-1 w-full rounded border p-2"
              value={years}
              onChange={(e) => setYears(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 10"
            />
          </div>
        </div>
      </div>

      {/* Surplus */}
      {surplus !== null && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Monthly Surplus</h2>
          <p className="mt-1 text-lg">R {surplus.toLocaleString()}</p>
        </div>
      )}

      {/* Chart */}
      {projection.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Projection chart</h2>
          <LineChart
            className="mt-3 text-blue-700"
            data={projection.map((p) => ({ x: p.year, y: p.value }))}
          />
        </div>
      )}

      {/* Table */}
      {projection.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Projection table</h2>
          <table className="mt-2 w-full border-collapse border">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Year</th>
                <th className="border px-4 py-2 text-left">Estimated Value (R)</th>
              </tr>
            </thead>
            <tbody>
              {projection.map((row) => (
                <tr key={row.year}>
                  <td className="border px-4 py-2">{row.year}</td>
                  <td className="border px-4 py-2">
                    {row.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
