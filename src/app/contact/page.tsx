"use client";
import { useMemo, useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const mailtoHref = useMemo(() => {
    const to = "alexzis.spinazze@attooh.co.za";
    const subject = encodeURIComponent("IFA360 Customer Contact");
    const body = encodeURIComponent(
      [
        "New message from the customer site:",
        `Name: ${name || "-"}`,
        `Email: ${email || "-"}`,
        "",
        message || "-",
        "",
        "— Sent from IFA360 Customer Site",
      ].join("\n")
    );
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }, [name, email, message]);

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2 text-gray-600">Have a question? Send us a message.</p>

      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium">Your name</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea
            className="mt-1 w-full rounded border p-2 min-h-32"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help?"
          />
        </div>

        <a
          href={mailtoHref}
          className="inline-block rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Send message
        </a>
        <p className="mt-2 text-xs text-gray-500">
          Clicking opens your email app with the message pre-filled.
        </p>
      </form>
    </main>
  );
}
