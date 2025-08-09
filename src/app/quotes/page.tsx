"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function isDigits(str: string) {
  return /^[0-9]+$/.test(str);
}

// Simple SA ID check: 13 digits + Luhn checksum
function isValidSouthAfricanID(id: string) {
  if (!id || id.length !== 13 || !isDigits(id)) return false;

  // Luhn checksum
  let sum = 0;
  let shouldDouble = false;
  for (let i = id.length - 1; i >= 0; i--) {
    let digit = Number(id[i]);
    if (shouldDouble) {
      digit = digit * 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export default function Page() {
  const router = useRouter();

  // Personal
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [occupation, setOccupation] = useState("");
  const [education, setEducation] = useState("");
  const [salary, setSalary] = useState<number | "">("");
  const [smoker, setSmoker] = useState("no");

  // Cover selections (Rands unless stated)
  const [lifeCover, setLifeCover] = useState<number | "">("");
  const [severeIllnessType, setSevereIllnessType] = useState<"accelerated" | "non-accelerated">("accelerated");
  const [severeIllnessCover, setSevereIllnessCover] = useState<number | "">("");

  const [disabilityType, setDisabilityType] = useState<"accelerated" | "non-accelerated">("accelerated");
  const [disabilityCover, setDisabilityCover] = useState<number | "">("");

  const [incomeProtection, setIncomeProtection] = useState<number | "">(""); // monthly benefit

  // Consent
  const [consent, setConsent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic validations
    if (!fullName.trim()) return alert("Please enter your full name.");
    if (!idNumber || !isValidSouthAfricanID(idNumber)) {
      return alert("Please enter a valid SA ID number (13 digits).");
    }
    if (!occupation.trim()) return alert("Please enter your occupation.");
    if (!education) return alert("Please select your highest education level.");
    if (salary === "" || Number(salary) <= 0) return alert("Please enter your gross monthly salary.");
    if (lifeCover === "" || Number(lifeCover) <= 0) return alert("Please enter a life cover amount.");
    if (severeIllnessCover === "" || Number(severeIllnessCover) < 0) return alert("Please enter severe illness cover (0 if none).");
    if (disabilityCover === "" || Number(disabilityCover) < 0) return alert("Please enter disability cover (0 if none).");
    if (incomeProtection === "" || Number(incomeProtection) < 0) return alert("Please enter income protection monthly benefit (0 if none).");
    if (!consent) return alert("Please tick consent to proceed.");

    // Build querystring and go to results
    const params = new URLSearchParams({
      name: fullName,
      id: idNumber,
      occupation,
      education,
      salary: String(salary),
      smoker,
      life: String(lifeCover),
      siType: severeIllnessType,
      siCover: String(severeIllnessCover),
      disType: disabilityType,
      disCover: String(disabilityCover),
      ipMonthly: String(incomeProtection),
    });

    router.push(`/quotes/results?${params.toString()}`);
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Get Quotes</h1>
      <p className="mt-2 text-gray-600">
        Complete your details below. We’ll prepare estimates (demo only) and an adviser can follow up if you choose.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {/* Personal Details */}
        <section className="rounded border bg-white p-4">
          <h2 className="text-xl font-semibold">Your details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">Full name</label>
              <input
                className="mt-1 w-full rounded border p-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Thabo Mkhize"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">SA ID number</label>
              <input
                inputMode="numeric"
                className="mt-1 w-full rounded border p-2"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value.replace(/\s/g, ""))}
                placeholder="13 digits"
                required
              />
              {idNumber.length > 0 && !isValidSouthAfricanID(idNumber) && (
                <p className="mt-1 text-xs text-red-600">ID number format/checksum looks invalid.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Occupation</label>
              <input
                className="mt-1 w-full rounded border p-2"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Accountant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Highest education</label>
              <select
                className="mt-1 w-full rounded border p-2 bg-white"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                required
              >
                <option value="">Select…</option>
                <option value="Matric">Matric</option>
                <option value="Certificate/Diploma">Certificate/Diploma</option>
                <option value="Undergraduate Degree">Undergraduate Degree</option>
                <option value="Postgraduate Degree">Postgraduate Degree</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Gross monthly salary (R)</label>
              <input
                type="number"
                min={0}
                className="mt-1 w-full rounded border p-2"
                value={salary}
                onChange={(e) => setSalary(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 30000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Smoker status</label>
              <select
                className="mt-1 w-full rounded border p-2 bg-white"
                value={smoker}
                onChange={(e) => setSmoker(e.target.value)}
              >
                <option value="no">Non-smoker</option>
                <option value="yes">Smoker</option>
              </select>
            </div>
          </div>
        </section>

        {/* Cover Selections */}
        <section className="rounded border bg-white p-4">
          <h2 className="text-xl font-semibold">Cover selections</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Life cover (R)</label>
              <input
                type="number"
                min={0}
                step={50000}
                className="mt-1 w-full rounded border p-2"
                value={lifeCover}
                onChange={(e) => setLifeCover(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 1000000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Severe illness type</label>
              <select
                className="mt-1 w-full rounded border p-2 bg-white"
                value={severeIllnessType}
                onChange={(e) => setSevereIllnessType(e.target.value as "accelerated" | "non-accelerated")}
              >
                <option value="accelerated">Accelerated</option>
                <option value="non-accelerated">Non-accelerated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Severe illness cover (R)</label>
              <input
                type="number"
                min={0}
                step={50000}
                className="mt-1 w-full rounded border p-2"
                value={severeIllnessCover}
                onChange={(e) => setSevereIllnessCover(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 250000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Disability type</label>
              <select
                className="mt-1 w-full rounded border p-2 bg-white"
                value={disabilityType}
                onChange={(e) => setDisabilityType(e.target.value as "accelerated" | "non-accelerated")}
              >
                <option value="accelerated">Accelerated</option>
                <option value="non-accelerated">Non-accelerated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Disability cover (R)</label>
              <input
                type="number"
                min={0}
                step={50000}
                className="mt-1 w-full rounded border p-2"
                value={disabilityCover}
                onChange={(e) => setDisabilityCover(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 500000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Income protection monthly benefit (R)</label>
              <input
                type="number"
                min={0}
                step={500}
                className="mt-1 w-full rounded border p-2"
                value={incomeProtection}
                onChange={(e) => setIncomeProtection(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 20000"
              />
            </div>
          </div>
        </section>

        {/* Consent */}
        <section className="rounded border bg-white p-4">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              I consent to the processing of my personal information for the purpose of preparing insurance estimates.
              This is a demo and not financial advice.
            </span>
          </label>
        </section>

        <div>
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </form>
    </main>
  );
}
