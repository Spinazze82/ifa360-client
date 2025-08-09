"use client";
import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("https://formspree.io/f/myzplegy", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message, form: "contact" }),
      });

      if (res.ok) {
        setStatus("ok");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-gray-600">Have a question? Send us a message.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Your name</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Your email</label>
          <input
            type="email"
            className="mt-1 w-full rounded border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea
            className="mt-1 w-full rounded border p-2 min-h-32"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help?"
            required
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </button>

        {status === "ok" && (
          <p className="text-sm text-green-700 mt-2">Thanks! We’ll be in touch shortly.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-700 mt-2">{errorMsg}</p>
        )}
      </form>
    </main>
  );
}
