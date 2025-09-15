"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";
import { useParams } from "next/navigation";

type ServiceLog = { id: string; createdAt: string; title: string; description: string; performedBy: string; cost?: number | null };
type Asset = {
  id: string;
  tag: string;
  type: string;
  model?: string | null;
  serialNumber?: string | null;
  status: string;
  location?: string | null;
  notes?: string | null;
};

export default function AssetDetailPage() {
  const params = useParams();
  const assetId = params?.id as string;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [cost, setCost] = useState<string>("");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const a = await fetchJson<Asset>(`/assets/${assetId}`);
      const l = await fetchJson<ServiceLog[]>(`/assets/${assetId}/service-logs`);
      setAsset(a);
      setLogs(l);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (assetId) load();
  }, [assetId]);

  async function addLog() {
    if (!title.trim() || !description.trim() || !performedBy.trim()) return;
    await fetchJson(`/assets/${assetId}/service-logs`, {
      method: "POST",
      body: { title, description, performedBy, cost: cost ? Number(cost) : undefined },
    });
    setTitle(""); setDescription(""); setPerformedBy(""); setCost("");
    await load();
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-xl font-semibold">{asset ? `${asset.tag} · ${asset.type}` : "Asset"}</h1>
        {loading ? <div>Loading...</div> : null}
        {error ? <div className="text-red-600 text-sm">{error}</div> : null}
        {asset ? (
          <div className="rounded-md border p-4 space-y-1 text-sm">
            <div>Status: {asset.status}</div>
            <div>Model: {asset.model || "-"}</div>
            <div>Serial: {asset.serialNumber || "-"}</div>
            <div>Location: {asset.location || "-"}</div>
            <div>Notes: {asset.notes || "-"}</div>
          </div>
        ) : null}
        <div className="space-y-3">
          <h2 className="font-medium">Service Logs</h2>
          <div className="rounded-md border p-3 space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="text-sm">
                <div className="opacity-70 text-xs">{new Date(log.createdAt).toLocaleString()} · by {log.performedBy} {typeof log.cost === 'number' ? `· $${log.cost}` : ''}</div>
                <div className="font-medium">{log.title}</div>
                <div>{log.description}</div>
              </div>
            ))}
            {logs.length === 0 ? <div className="text-xs opacity-60">No logs yet.</div> : null}
          </div>
          <div className="rounded-md border p-3 grid sm:grid-cols-2 gap-3">
            <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="px-3 py-2 rounded-md border bg-transparent" />
            <input placeholder="Performed by" value={performedBy} onChange={(e) => setPerformedBy(e.target.value)} className="px-3 py-2 rounded-md border bg-transparent" />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="sm:col-span-2 px-3 py-2 rounded-md border bg-transparent min-h-24" />
            <input placeholder="Cost (optional)" value={cost} onChange={(e) => setCost(e.target.value)} className="px-3 py-2 rounded-md border bg-transparent" />
            <div className="sm:col-span-2 flex gap-2">
              <button onClick={addLog} className="h-10 px-4 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">Add Log</button>
            </div>
          </div>
        </div>
      </div>
      <aside className="space-y-3">
        <div className="rounded-md border p-3 text-sm">
          <div className="font-medium mb-1">Quick Actions</div>
          <div className="opacity-70">Edit and advanced actions coming soon.</div>
        </div>
      </aside>
    </div>
  );
}

