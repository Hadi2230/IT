"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchJson } from "@/lib/api";

type Asset = {
  id: string;
  tag: string;
  type: string;
  model?: string | null;
  status: string;
  createdAt: string;
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchJson<Asset[]>("/assets")
      .then(setAssets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = assets.filter((a) => (!q || a.tag.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)) && (!typeFilter || a.type.toLowerCase().includes(typeFilter.toLowerCase())));
    return list;
  }, [assets, query, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-semibold">Assets</h1>
        <div className="flex items-center gap-2">
          <input placeholder="Search tag/type" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md border bg-transparent" />
          <input placeholder="Filter type" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md border bg-transparent" />
          <Link href="/assets/new" className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">New Asset</Link>
        </div>
      </div>
      {loading ? <div>Loading...</div> : null}
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <div className="grid gap-3">
        {slice.map((a) => (
          <Link key={a.id} href={`/assets/${a.id}`} className="rounded-md border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
            <div className="font-medium">{a.tag} · {a.type}</div>
            <div className="text-xs opacity-70">{a.model || "-"} · {a.status} · {new Date(a.createdAt).toLocaleString()}</div>
          </Link>
        ))}
        {!loading && filtered.length === 0 ? <div className="text-sm opacity-70">No assets match filters.</div> : null}
      </div>
      <div className="flex items-center justify-end gap-2 text-sm">
        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 rounded-md border disabled:opacity-50">Prev</button>
        <div className="opacity-70">Page {page} / {pageCount}</div>
        <button disabled={page >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="px-3 py-2 rounded-md border disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}

