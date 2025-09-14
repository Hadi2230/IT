"use client";

import { useEffect, useState } from "react";
import { fetchJson, getCurrentUser } from "@/lib/api";
import { useParams } from "next/navigation";
import Link from "next/link";

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
};

type Message = { id: string; content: string; createdAt: string; author: { fullName: string } };

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params?.id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const me = getCurrentUser();

  async function load() {
    setLoading(true);
    try {
      const t = await fetchJson<Ticket>(`/tickets/${ticketId}`);
      const m = await fetchJson<Message[]>(`/tickets/${ticketId}/messages`);
      setTicket(t);
      setMessages(m);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (ticketId) load();
  }, [ticketId]);

  async function sendMessage() {
    if (!content.trim() || !me) return;
    await fetchJson(`/tickets/${ticketId}/messages`, {
      method: "POST",
      body: { content, authorId: me.id },
    });
    setContent("");
    await load();
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{ticket?.title || "Ticket"}</h1>
          <Link href={`/tickets/${ticketId}/remote`} className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
            Start Remote
          </Link>
        </div>
        <div className="rounded-md border p-4">
          <div className="text-sm opacity-70 mb-2">{ticket?.status} · {ticket?.priority}</div>
          <p className="whitespace-pre-wrap">{ticket?.description}</p>
        </div>
        <div className="space-y-3">
          <h2 className="font-medium">Conversation</h2>
          <div className="rounded-md border p-3 max-h-[50vh] overflow-auto space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="text-sm">
                <div className="opacity-70 text-xs">{m.author?.fullName || "User"} · {new Date(m.createdAt).toLocaleString()}</div>
                <div>{m.content}</div>
              </div>
            ))}
            {messages.length === 0 ? <div className="text-xs opacity-60">No messages yet.</div> : null}
          </div>
          <div className="flex gap-2">
            <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a message" className="flex-1 px-3 py-2 rounded-md border bg-transparent" />
            <button onClick={sendMessage} className="px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">Send</button>
          </div>
        </div>
      </div>
      <aside className="space-y-3">
        <div className="rounded-md border p-3">
          <div className="font-medium mb-2">Actions</div>
          <Link href="/tickets/new" className="block px-3 py-2 rounded-md border text-center">New Ticket</Link>
        </div>
      </aside>
    </div>
  );
}

