"use client";

import { FormEvent, useState } from "react";
import { fetchJson, getCurrentUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Protected } from "@/components/Auth";

export default function NewTicketPage() {
  const router = useRouter();
  const current = getCurrentUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetchJson<{ id: string }>("/tickets", {
        method: "POST",
        body: {
          title,
          description,
          category,
          priority,
          requesterId: current?.id,
        },
      });
      router.replace(`/tickets/${res.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Protected>
      <div className="max-w-xl">
        <h1 className="text-xl font-semibold mb-4">New Ticket</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm block mb-1">Title</label>
            <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm block mb-1">Description</label>
            <textarea className="w-full px-3 py-2 rounded-md border bg-transparent min-h-28" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm block mb-1">Category</label>
              <input className="w-full px-3 py-2 rounded-md border bg-transparent" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm block mb-1">Priority</label>
              <select className="w-full px-3 py-2 rounded-md border bg-transparent" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option>CRITICAL</option>
                <option>HIGH</option>
                <option>MEDIUM</option>
                <option>LOW</option>
              </select>
            </div>
          </div>
          {error ? <div className="text-red-600 text-sm">{error}</div> : null}
          <div className="flex gap-2">
            <button disabled={submitting} className="h-10 px-4 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">Create</button>
            <button type="button" onClick={() => router.back()} className="h-10 px-4 rounded-md border">Cancel</button>
          </div>
        </form>
      </div>
    </Protected>
  );
}

