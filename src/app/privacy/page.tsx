export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold">Privacy Policy (Demo)</h1>
      <p className="mt-2 text-gray-600">
        This is a placeholder policy. Replace with your real POPIA-compliant policy before launch.
      </p>

      <section className="mt-6 space-y-3">
        <h2 className="text-xl font-semibold">What we collect</h2>
        <ul className="list-disc pl-6">
          <li>Details you provide in forms (name, contact details, quote info).</li>
          <li>Basic analytics (pages visited, device/browser info).</li>
          <li>Files you upload (if any) for quotes.</li>
        </ul>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-xl font-semibold">How we use it</h2>
        <ul className="list-disc pl-6">
          <li>To prepare quotes and estimates you request.</li>
          <li>To contact you when you ask to speak to an adviser.</li>
          <li>To improve our tools and content.</li>
        </ul>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-xl font-semibold">Your choices</h2>
        <ul className="list-disc pl-6">
          <li>You can request a copy of your data.</li>
          <li>You can ask us to delete your data.</li>
          <li>You can withdraw consent at any time.</li>
        </ul>
      </section>

      <p className="mt-6 text-sm text-gray-500">
        For POPIA compliance you will need consent logging, secure storage, and a data breach response plan in production.
      </p>
    </main>
  );
}
