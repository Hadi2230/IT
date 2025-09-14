"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/api";

type Ticket = {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<Ticket[]>("/tickets")
      .then(setTickets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tickets</h1>
        <a href="/tickets/new" className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
          New Ticket
        </a>
      </div>
      {loading ? <div>Loading...</div> : null}
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <div className="grid gap-3">
        {tickets.map((t) => (
          <a key={t.id} href={`/tickets/${t.id}`} className="rounded-md border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
            <div className="font-medium">{t.title}</div>
            <div className="text-xs opacity-70">{t.status} · {t.priority} · {new Date(t.createdAt).toLocaleString()}</div>
          </a>
        ))}
        {!loading && tickets.length === 0 ? <div className="text-sm opacity-70">No tickets yet.</div> : null}
      </div>
    </div>
  );
}

