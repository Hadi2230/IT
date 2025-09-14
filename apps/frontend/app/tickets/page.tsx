'use client'
import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

type Ticket = {
  id: string
  title: string
  status: string
  priority: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    fetch(`${API}/tickets`).then(r=>r.json()).then(setTickets).catch(()=>setTickets([]))
  }, [])

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-semibold">تیکت‌ها</h1>
      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-right">Title</th>
              <th className="p-2 text-right">Status</th>
              <th className="p-2 text-right">Priority</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.title}</td>
                <td className="p-2">{t.status}</td>
                <td className="p-2">{t.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

