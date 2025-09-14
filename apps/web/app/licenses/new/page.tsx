"use client";

import { FormEvent, useState } from "react";
import { fetchJson } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

export default function NewLicensePage() {
  const router = useRouter();
  const [product, setProduct] = useState("");
  const [vendor, setVendor] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [seatsTotal, setSeatsTotal] = useState("");
  const [seatsUsed, setSeatsUsed] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [assetId, setAssetId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await fetchJson("/licenses", {
        method: "POST",
        body: {
          product,
          vendor: vendor || undefined,
          licenseKey: licenseKey || undefined,
          seatsTotal: seatsTotal ? Number(seatsTotal) : undefined,
          seatsUsed: seatsUsed ? Number(seatsUsed) : undefined,
          expiresAt: expiresAt || undefined,
          assetId: assetId || undefined,
        },
      });
      toast.push({ type: "success", message: "License created" });
      router.replace("/licenses");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create";
      setError(msg);
      toast.push({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold mb-4">New License</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm block mb-1">Product</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={product} onChange={(e) => setProduct(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm block mb-1">Vendor</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={vendor} onChange={(e) => setVendor(e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">License Key</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Seats Total</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={seatsTotal} onChange={(e) => setSeatsTotal(e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Seats Used</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={seatsUsed} onChange={(e) => setSeatsUsed(e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Expires At</label>
            <input type="date" className="w-full px-3 py-2 rounded-md border bg-transparent" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Asset ID (optional)</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={assetId} onChange={(e) => setAssetId(e.target.value)} />
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

