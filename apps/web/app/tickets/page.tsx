"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchJson<Ticket[]>("/tickets")
      .then(setTickets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((t) => (!q || t.title.toLowerCase().includes(q)) && (!statusFilter || t.status === statusFilter));
  }, [tickets, query, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-semibold">Tickets</h1>
        <div className="flex items-center gap-2">
          <input placeholder="Search title" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md border bg-transparent" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md border bg-transparent">
            <option value="">All</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="PENDING_CUSTOMER">PENDING_CUSTOMER</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
          <a href="/tickets/new" className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">New Ticket</a>
        </div>
      </div>
      {loading ? <div>Loading...</div> : null}
      {error ? <div className="text-red-600 text-sm">{error}</div> : null}
      <div className="grid gap-3">
        {slice.map((t) => (
          <a key={t.id} href={`/tickets/${t.id}`} className="rounded-md border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
            <div className="font-medium">{t.title}</div>
            <div className="text-xs opacity-70">{t.status} · {t.priority} · {new Date(t.createdAt).toLocaleString()}</div>
          </a>
        ))}
        {!loading && filtered.length === 0 ? <div className="text-sm opacity-70">No tickets match filters.</div> : null}
      </div>
      <div className="flex items-center justify-end gap-2 text-sm">
        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 rounded-md border disabled:opacity-50">Prev</button>
        <div className="opacity-70">Page {page} / {pageCount}</div>
        <button disabled={page >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))} className="px-3 py-2 rounded-md border disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}

