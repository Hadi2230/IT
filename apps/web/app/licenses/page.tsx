"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/api";
import Link from "next/link";
import { SkeletonList } from "@/components/Skeleton";

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
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchJson<License[]>("/licenses")
      .then(setLicenses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return licenses.filter((l) => !q || l.product.toLowerCase().includes(q) || (l.vendor || '').toLowerCase().includes(q));
  }, [licenses, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-semibold">Licenses</h1>
        <div className="flex items-center gap-2">
          <input placeholder="Search product/vendor" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md border bg-transparent" />
          <Link href="/licenses/new" className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">New License</Link>
        </div>
      </div>
      {loading ? <SkeletonList /> : null}
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <div className="grid gap-3">
        {slice.map((l) => (
          <div key={l.id} className="rounded-md border p-4">
            <div className="font-medium">{l.product} {l.vendor ? `· ${l.vendor}` : ""}</div>
            <div className="text-xs opacity-70">{l.seatsUsed ?? 0}/{l.seatsTotal ?? 0} seats · {l.expiresAt ? new Date(l.expiresAt).toLocaleDateString() : "no expiry"}</div>
          </div>
        ))}
        {!loading && filtered.length === 0 ? <div className="text-sm opacity-70">No licenses match filters.</div> : null}
      </div>
      <div className="flex items-center justify-end gap-2 text-sm">
        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 rounded-md border disabled:opacity-50">Prev</button>
        <div className="opacity-70">Page {page} / {pageCount}</div>
        <button disabled={page >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="px-3 py-2 rounded-md border disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}

