"use client";
import { useState } from "react";

export default function EducationPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "asking" | "error">("idle");
  const [error, setError] = useState("");

  async function askAI(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setStatus("asking");
    setAnswer(null);
    setError("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data?.error || "Something went wrong.");
        return;
      }

      setAnswer(data.answer);
      setStatus("idle");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Education</h1>
      <p className="mt-2 text-gray-600">
        Ask a question about life cover, disability, income protection, TFSA, fees, or underwriting.
      </p>

      <form onSubmit={askAI} className="mt-6 flex gap-2">
        <input
          className="flex-1 rounded border p-3"
          placeholder="e.g. How much life cover do I need?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          type="submit"
          disabled={status === "asking"}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {status === "asking" ? "Thinking…" : "Ask"}
        </button>
      </form>

      <section className="mt-6 rounded border bg-white p-4 min-h-24">
        {status === "asking" && <p className="text-gray-600">Working on it…</p>}
        {status === "error" && <p className="text-red-700">{error}</p>}
        {answer && <p className="whitespace-pre-wrap">{answer}</p>}
        {!answer && status === "idle" && (
          <p className="text-gray-500">Your answer will appear here.</p>
        )}
      </section>

      <p className="mt-3 text-xs text-gray-500">
        This is general info, not financial advice.
      </p>
    </main>
  );
}
