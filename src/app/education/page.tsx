"use client";
import { useMemo, useState } from "react";

export default function EducationPage() {
  const categories = [
    {
      name: "Life Cover",
      items: [
        "What is life insurance?",
        "How much cover do I need?",
        "Term vs. Whole-of-life (simple explainer)",
      ],
    },
    {
      name: "Disability & Income Protection",
      items: [
        "Disability cover vs. income protection",
        "Waiting periods explained",
        "Own-occupation vs. any-occupation",
      ],
    },
    {
      name: "Investing",
      items: [
        "Tax-free savings accounts (TFSA) basics",
        "RA vs. Unit Trust: which suits you?",
        "Fees 101: TER, performance fees, advice fees",
      ],
    },
    {
      name: "General",
      items: [
        "What affects your premium?",
        "Why insurers ask medical questions",
        "How underwriting works (in plain English)",
      ],
    },
  ];

  // --- Simple local "AI" explainer (rule-based placeholder) ---
  const [question, setQuestion] = useState("");
  const answer = useMemo(() => {
    const q = question.toLowerCase();

    if (!q.trim()) return "";

    // tiny keyword router (demo only)
    if (q.includes("life") && q.includes("insurance"))
      return "Life insurance pays a lump sum to your beneficiaries if you pass away. Premiums depend on age, health, smoker status, and cover amount. Start by choosing a cover amount that clears debt and replaces 5–10 years of income.";
    if (q.includes("how much") && (q.includes("cover") || q.includes("life")))
      return "Rule of thumb: target cover = debts + (annual income × 5–10) − existing assets available to your family. We’ll add a calculator later to personalise this.";
    if (q.includes("disability") || q.includes("income protection"))
      return "Disability cover pays a lump sum for permanent impairment; income protection pays a monthly income if you can’t work due to illness or injury (subject to a waiting period). Many people use both.";
    if (q.includes("tfsa") || q.includes("tax-free"))
      return "A TFSA lets your investment growth be tax-free (no tax on dividends, interest, or capital gains). Annual contribution limits apply; exceeding them triggers penalties.";
    if (q.includes("fees"))
      return "Common fees: admin/platform fee, fund TER, and sometimes performance fees. Lower cost can help long-term returns, but make sure the solution still fits your risk and goals.";
    if (q.includes("underwriting") || q.includes("medical"))
      return "Underwriting is how insurers assess risk (health questions, nurse tests). Full and honest disclosure is critical; non-disclosure can void claims.";
    if (q.includes("smoker"))
      return "Smoker status typically increases premiums 50–100% vs non-smokers. Some insurers allow re-rating after a smoke-free period with tests.";
    if (q.includes("waiting period"))
      return "Income protection waiting periods (e.g., 7, 14, 30, 90 days) trade cost for speed of payout. Shorter wait = higher premium.";

    return "I don’t have a canned explanation for that yet. Try asking about life cover, disability, income protection, TFSA, fees, or underwriting. We’ll connect this to a real AI soon.";
  }, [question]);

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Education</h1>
      <p className="mt-2 text-gray-600">
        Short, simple explanations to help you make confident decisions.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {categories.map((cat) => (
          <section key={cat.name} className="rounded border bg-white p-4">
            <h2 className="text-xl font-semibold">{cat.name}</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              {cat.items.map((title) => (
                <li key={title}>
                  <span className="text-gray-800">{title}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* AI explainer (demo) */}
      <section className="mt-8 rounded border bg-white p-4">
        <h2 className="text-xl font-semibold">Ask the explainer</h2>
        <p className="mt-1 text-gray-600">
          Type a question in plain English (demo answers for now; not financial advice).
        </p>

        <div className="mt-4">
          <input
            className="w-full rounded border p-2"
            placeholder="e.g. How much life cover do I need?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div className="mt-4 rounded bg-gray-50 p-3 min-h-16">
          {answer ? (
            <p>{answer}</p>
          ) : (
            <p className="text-gray-500">Your answer will appear here.</p>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Demo content only. For personalised advice, speak to a licensed adviser.
        </p>
      </section>
    </main>
  );
}
