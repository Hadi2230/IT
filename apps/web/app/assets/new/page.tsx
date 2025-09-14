"use client";

import { FormEvent, useState } from "react";
import { fetchJson } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewAssetPage() {
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [status, setStatus] = useState("in_stock");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetchJson<{ id: string }>("/assets", { method: "POST", body: { tag, type, model, serialNumber, status, location, notes } });
      router.replace(`/assets/${res.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-4">New Asset</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm block mb-1">Tag</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={tag} onChange={(e) => setTag(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm block mb-1">Type</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={type} onChange={(e) => setType(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm block mb-1">Model</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={model} onChange={(e) => setModel(e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Serial Number</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Status</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Location</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm block mb-1">Notes</label>
            <textarea className="w-full px-3 py-2 rounded-md border bg-transparent min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        {error ? <div className="text-red-600 text-sm">{error}</div> : null}
        <div className="flex gap-2">
          <button disabled={submitting} className="h-10 px-4 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">Create</button>
          <button type="button" onClick={() => router.back()} className="h-10 px-4 rounded-md border">Cancel</button>
        </div>
      </form>
    </div>
  );
}

