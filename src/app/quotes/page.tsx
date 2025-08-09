"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [smoker, setSmoker] = useState("no");
  const [cover, setCover] = useState<number | "">("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !age || !cover) {
      alert("Please fill in your name, age, and cover amount.");
      return;
    }
    const params = new URLSearchParams({
      name: fullName,
      age: String(age),
      smoker,
      cover: String(cover),
    });
    router.push(`/quotes/results?${params.toString()}`);
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Get Quotes</h1>
      <p className="mt-2 text-gray-600">
        Tell us a few details and we’ll prepare quotes.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Thabo Mkhize"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Age</label>
            <input
              type="number"
              min={18}
              max={85}
              className="mt-1 w-full rounded border p-2"
              value={age}
              onChange={(e) =>
                setAge(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="e.g. 35"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Smoker</label>
            <select
              className="mt-1 w-full rounded border p-2 bg-white"
              value={smoker}
              onChange={(e) => setSmoker(e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Cover amount (R)</label>
          <input
            type="number"
            min={100000}
            step={50000}
            className="mt-1 w-full rounded border p-2"
            value={cover}
            onChange={(e) =>
              setCover(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="e.g. 1000000"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
