"use client";
import { useMemo, useState } from "react";

// Simple monthly compounding projection
function project(totalMonths: number, monthly: number, annualRatePct: number) {
  const r = annualRatePct / 100;
  const i = r / 12; // monthly rate
  // Future value of an annuity due to monthly contributions
  // FV = P * [((1+i)^n - 1) / i]
  const fv = i === 0 ? monthly * totalMonths : monthly * ((Math.pow(1 + i, totalMonths) - 1) / i);
  return Math.round(fv);
}

export default function BudgetPage() {
  const [income, setIncome] = useState<number | "">("");
  const [expenses, setExpenses] = useState<number | "">("");
  const [monthlyInvest, setMonthlyInvest] = useState<number | "">("");
  const [years, setYears] = useState(10);
  const [returnPct, setReturnPct] = useState(8);

  const canCalc = typeof income === "number" && typeof expenses === "number" && typeof monthlyInvest === "number";

  const surplus = useMemo(() => {
    if (!canCalc) return null;
    return Math.max(0, income! - expenses!);
  }, [income, expenses, canCalc]);

  const projection = useMemo(() => {
    if (!canCalc) return null;
    const months = years * 12;
    return project(months, monthlyInvest!, returnPct);
  }, [monthlyInvest, years, returnPct, canCalc]);

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Budget & Projection Tool</h1>
      <p className="mt-2 text-gray-600">
        Enter your numbers to see your monthly surplus and a simple investment projection.
      </p>

      <section className="mt-6 space-y-4 rounded border bg-white p-4">
        <div>
          <label className="block text-sm font-medium">Monthly income (R)</label>
          <input
            type="number"
            className="mt-1 w-full rounded border p-2"
            value={income}
            onChange={(e) => setIncome(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="e.g. 30000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Monthly expenses (R)</label>
          <input
            type="number"
            className="mt-1 w-full rounded border p-2"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="e.g. 22000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Monthly invest/save (R)</label>
          <input
            type="number"
            className="mt-1 w-full rounded border p-2"
            value={monthlyInvest}
            onChange={(e) => setMonthlyInvest(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="e.g. 3000"
          />
          {surplus !== null && typeof monthlyInvest === "number" && monthlyInvest > surplus && (
            <p className="mt-1 text-sm text-red-600">
              Warning: your contribution exceeds your current surplus (R{surplus}).
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Years</label>
            <input
              type="range"
              min={1}
              max={40}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-700">⟶ {years} years</div>
          </div>

          <div>
            <label className="block text-sm font-medium">Expected annual return (%)</label>
            <input
              type="range"
              min={0}
              max={20}
              step={0.5}
              value={returnPct}
              onChange={(e) => setReturnPct(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-gray-700">⟶ {returnPct}% p.a.</div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded border bg-white p-4">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded bg-gray-50 p-3">
            <div className="text-sm text-gray-600">Monthly surplus</div>
            <div className="text-2xl font-bold">
              {surplus !== null ? `R${surplus}` : "—"}
            </div>
          </div>
          <div className="rounded bg-gray-50 p-3">
            <div className="text-sm text-gray-600">Projected value</div>
            <div className="text-2xl font-bold">
              {projection !== null && canCalc ? `R${projection.toLocaleString()}` : "—"}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Projection is a simplified estimate with monthly compounding and constant contributions. Not financial advice.
        </p>
      </section>
    </main>
  );
}
