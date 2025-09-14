"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetchJson<Asset[]>("/assets")
      .then(setAssets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Assets</h1>
        <a href="/assets/new" className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
          New Asset
        </a>
      </div>
      {loading ? <div>Loading...</div> : null}
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <div className="grid gap-3">
        {assets.map((a) => (
          <a key={a.id} href={`/assets/${a.id}`} className="rounded-md border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
            <div className="font-medium">{a.tag} · {a.type}</div>
            <div className="text-xs opacity-70">{a.model || "-"} · {a.status} · {new Date(a.createdAt).toLocaleString()}</div>
          </a>
        ))}
        {!loading && assets.length === 0 ? <div className="text-sm opacity-70">No assets yet.</div> : null}
      </div>
    </div>
  );
}

