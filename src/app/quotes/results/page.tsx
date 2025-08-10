// File: src/app/quotes/results/page.tsx
"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type CarrierRow = {
  key: string;
  name: string;
  factor: number;
  perks?: string;
};

const CARRIERS: CarrierRow[] = [
  { key: "discovery", name: "Discovery", factor: 1.0, perks: "Wellness-linked" },
  { key: "liberty", name: "Liberty", factor: 0.98, perks: "Strong disability options" },
  { key: "sanlam", name: "Sanlam", factor: 1.03, perks: "Broad cover range" },
  { key: "hollard", name: "Hollard", factor: 0.97, perks: "Value combos" },
  { key: "capital-legacy", name: "Capital Legacy", factor: 1.05, perks: "Estate-focused add-ons" },
  { key: "momentum", name: "Momentum", factor: 1.01, perks: "Partner discounts" },
  { key: "old-mutual", name: "Old Mutual", factor: 1.02, perks: "Large provider" },
  { key: "brightrock", name: "BrightRock", factor: 0.99, perks: "Needs-matched structure" },
  { key: "bidvest-life", name: "Bidvest Life", factor: 1.0, perks: "Income protection specialist" },
];

export default function Page() {
  return (
    <Suspense fallback={<main className="p-8">Loading…</main>}>
      <ResultsInner />
    </Suspense>
  );
}

function formatR(n: number | null | undefined) {
  if (n == null || isNaN(n)) return "—";
  return "R" + Math.round(n).toLocaleString();
}

function ResultsInner() {
  const sp = useSearchParams();

  // Personal
  const name = sp.get("name") ?? "";
  const id = sp.get("id") ?? "";
  const occupation = sp.get("occupation") ?? "";
  const education = sp.get("education") ?? "";
  const salaryStr = sp.get("salary") ?? "";
  const smoker = sp.get("smoker") ?? "no";

  // Cover selections
  const lifeStr = sp.get("life") ?? "";
  const siType = (sp.get("siType") ?? "accelerated") as "accelerated" | "non-accelerated";
  const siCoverStr = sp.get("siCover") ?? "";
  const disType = (sp.get("disType") ?? "accelerated") as "accelerated" | "non-accelerated";
  const disCoverStr = sp.get("disCover") ?? "";
  const ipMonthlyStr = sp.get("ipMonthly") ?? "";

  // Numbers
  const salary = Number(salaryStr);
  const life = Number(lifeStr);
  const siCover = Number(siCoverStr);
  const disCover = Number(disCoverStr);
  const ipMonthly = Number(ipMonthlyStr);

  // Base demo premium model
  const baseTotals = useMemo(() => {
    let lifePrem = 0;
    if (life > 0) {
      const units = life / 100_000;
      const basePerUnit = 45;
      const smokerFactor = smoker === "yes" ? 1.6 : 1.0;
      lifePrem = units * basePerUnit * smokerFactor;
    }

    let siPrem = 0;
    if (siCover > 0) {
      const units = siCover / 100_000;
      const basePerUnit = 65;
      const typeFactor = siType === "accelerated" ? 0.85 : 1.0;
      siPrem = units * basePerUnit * typeFactor;
    }

    let disPrem = 0;
    if (disCover > 0) {
      const units = disCover / 100_000;
      const basePerUnit = 55;
      const typeFactor = disType === "accelerated" ? 0.9 : 1.0;
      disPrem = units * basePerUnit * typeFactor;
    }

    let ipPrem = 0;
    if (ipMonthly > 0) {
      const units = ipMonthly / 1_000;
      const basePerUnit = 22;
      ipPrem = units * basePerUnit;
    }

    const total = Math.round(lifePrem + siPrem + disPrem + ipPrem);
    return {
      lifePrem: Math.round(lifePrem),
      siPrem: Math.round(siPrem),
      disPrem: Math.round(disPrem),
      ipPrem: Math.round(ipPrem),
      total,
    };
  }, [life, siCover, disCover, ipMonthly, smoker, siType, disType]);

  // Multi-carrier quotes based on baseTotals (cheapest first)
  const carrierQuotes = useMemo(() => {
    return CARRIERS.map((c) => {
      const lifePrem = Math.round(baseTotals.lifePrem * c.factor);
      const siPrem = Math.round(baseTotals.siPrem * (c.factor + 0.01));
      const disPrem = Math.round(baseTotals.disPrem * (c.factor - 0.01));
      const ipPrem = Math.round(baseTotals.ipPrem * c.factor);
      const total = lifePrem + siPrem + disPrem + ipPrem;
      return { ...c, lifePrem, siPrem, disPrem, ipPrem, total };
    }).sort((a, b) => a.total - b.total);
  }, [baseTotals]);

  // Lead capture
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<string>("all");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("https://formspree.io/f/movlyeqe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          form: "lead",
          selectedCarrier,
          // personal
          name,
          id,
          occupation,
          education,
          salary: salaryStr,
          smoker,
          // covers
          life: lifeStr,
          severeIllnessType: siType,
          severeIllnessCover: siCoverStr,
          disabilityType: disType,
          disabilityCover: disCoverStr,
          incomeProtectionMonthly: ipMonthlyStr,
          // base premiums (demo)
          base_premium_life: formatR(baseTotals.lifePrem),
          base_premium_severeIllness: formatR(baseTotals.siPrem),
          base_premium_disability: formatR(baseTotals.disPrem),
          base_premium_incomeProtection: formatR(baseTotals.ipPrem),
          base_premium_total: formatR(baseTotals.total),
          // carrier table snapshot
          carriers: carrierQuotes.map((c) => ({
            name: c.name,
            total: formatR(c.total),
            life: formatR(c.lifePrem),
            si: formatR(c.siPrem),
            dis: formatR(c.disPrem),
            ip: formatR(c.ipPrem),
          })),
          // contact
          clientEmail,
          clientPhone,
          source: "ifa360-customer-site",
        }),
      });

      if (res.ok) {
        setStatus("ok");
        setClientEmail("");
        setClientPhone("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between print:justify-start print:gap-6">
        <div>
          <h1 className="text-3xl font-bold">Your Quote Preview</h1>
          <p className="mt-2 text-gray-600">
            Demo estimates only — for illustration. Final pricing depends on underwriting and insurer rules.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="print:hidden rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          aria-label="Download PDF"
          title="Download PDF"
        >
          Download PDF
        </button>
      </div>

      {/* Inputs summary */}
      <section className="mt-6 rounded border bg-white p-4">
        <h2 className="text-xl font-semibold">Your details</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><span className="font-medium">Name:</span> {name || "—"}</div>
          <div><span className="font-medium">ID:</span> {id || "—"}</div>
          <div><span className="font-medium">Occupation:</span> {occupation || "—"}</div>
          <div><span className="font-medium">Education:</span> {education || "—"}</div>
          <div><span className="font-medium">Gross salary:</span> {salaryStr ? formatR(salary) : "—"}</div>
          <div><span className="font-medium">Smoker:</span> {smoker}</div>
        </div>
      </section>

      {/* Cover selections */}
      <section className="mt-6 rounded border bg-white p-4">
        <h2 className="text-xl font-semibold">Cover selections</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div><span className="font-medium">Life cover:</span> {lifeStr ? formatR(life) : "—"}</div>
          <div><span className="font-medium">Severe illness:</span> {siCoverStr ? `${formatR(siCover)} (${siType})` : "—"}</div>
          <div><span className="font-medium">Disability:</span> {disCoverStr ? `${formatR(disCover)} (${disType})` : "—"}</div>
          <div><span className="font-medium">Income protection (monthly):</span> {ipMonthlyStr ? formatR(ipMonthly) : "—"}</div>
        </div>
      </section>

      {/* Base premium */}
      <section className="mt-6 rounded border bg-white p-4">
        <h2 className="text-xl font-semibold">Estimated monthly premium (base demo)</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded bg-gray-50 p-3">
            <div className="text-sm text-gray-600">Life</div>
            <div className="text-2xl font-bold">{formatR(baseTotals.lifePrem)}</div>
          </div>
          <div className="rounded bg-gray-50 p-3">
            <div className="text-sm text-gray-600">Severe illness</div>
            <div className="text-2xl font-bold">{formatR(baseTotals.siPrem)}</div>
          </div>
          <div className="rounded bg-gray-50 p-3">
            <div className="text-sm text-gray-600">Disability</div>
            <div className="text-2xl font-bold">{formatR(baseTotals.disPrem)}</div>
          </div>
          <div className="rounded bg-gray-50 p-3">
            <div className="text-sm text-gray-600">Income protection</div>
            <div className="text-2xl font-bold">{formatR(baseTotals.ipPrem)}</div>
          </div>
        </div>
        <div className="mt-4 text-xl">
          <span className="font-semibold">Total estimate:</span> {formatR(baseTotals.total)}
        </div>
      </section>

      {/* Multi-carrier quotes */}
      <section className="mt-6 rounded border bg-white p-4">
        <h2 className="text-xl font-semibold">Carrier quotes (demo)</h2>
        <p className="mt-1 text-sm text-gray-600">
          These are illustrative variations per carrier. We’ll replace with real APIs later.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Carrier</th>
                <th className="py-2 pr-4">Life</th>
                <th className="py-2 pr-4">Severe Illness</th>
                <th className="py-2 pr-4">Disability</th>
                <th className="py-2 pr-4">Income Prot.</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {carrierQuotes.map((c) => (
                <tr key={c.key} className="border-b last:border-none">
                  <td className="py-2 pr-4">
                    <div className="font-medium">{c.name}</div>
                    {c.perks && <div className="text-xs text-gray-500">{c.perks}</div>}
                  </td>
                  <td className="py-2 pr-4">{formatR(c.lifePrem)}</td>
                  <td className="py-2 pr-4">{formatR(c.siPrem)}</td>
                  <td className="py-2 pr-4">{formatR(c.disPrem)}</td>
                  <td className="py-2 pr-4">{formatR(c.ipPrem)}</td>
                  <td className="py-2 pr-4 font-semibold">{formatR(c.total)}</td>
                  <td className="py-2">
                    <button
                      onClick={() => setSelectedCarrier(c.name)}
                      className="rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 text-xs"
                    >
                      Request this quote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedCarrier !== "all" && (
          <p className="mt-3 text-sm">
            Selected carrier: <span className="font-medium">{selectedCarrier}</span>
          </p>
        )}
      </section>

      {/* Lead capture */}
      <section className="mt-8 rounded border bg-white p-4">
        <h2 className="text-2xl font-semibold">Talk to an adviser</h2>
        <p className="mt-1 text-gray-600">
          Choose a specific carrier above (optional), add your contact details, and we’ll get an authorised adviser to contact you.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium">Your email</label>
            <input
              type="email"
              className="mt-1 w-full rounded border p-2"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium">Your phone</label>
            <input
              type="tel"
              className="mt-1 w-full rounded border p-2"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="e.g. 082 123 4567"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {status === "sending" ? "Sending..." : "Send my details to an adviser"}
            </button>
            {status === "ok" && (
              <p className="text-sm text-green-700 mt-2">
                Thanks! An adviser will contact you shortly.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-700 mt-2">{errorMsg}</p>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
