"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";

type License = {
  id: string;
  product: string;
  vendor?: string | null;
  seatsTotal?: number | null;
  seatsUsed?: number | null;
  expiresAt?: string | null;
  createdAt: string;
};

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<License[]>("/licenses")
      .then(setLicenses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Licenses</h1>
        <a href="/licenses/new" className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
          New License
        </a>
      </div>
      {loading ? <div>Loading...</div> : null}
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <div className="grid gap-3">
        {licenses.map((l) => (
          <div key={l.id} className="rounded-md border p-4">
            <div className="font-medium">{l.product} {l.vendor ? `· ${l.vendor}` : ""}</div>
            <div className="text-xs opacity-70">{l.seatsUsed ?? 0}/{l.seatsTotal ?? 0} seats · {l.expiresAt ? new Date(l.expiresAt).toLocaleDateString() : "no expiry"}</div>
          </div>
        ))}
        {!loading && licenses.length === 0 ? <div className="text-sm opacity-70">No licenses yet.</div> : null}
      </div>
    </div>
  );
}

