'use client'
import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

type Asset = {
  id: string
  tag: string
  type: string
  model?: string | null
  serialNumber?: string | null
  status: string
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [tag, setTag] = useState('')
  const [type, setType] = useState('')
  const [model, setModel] = useState('')

  useEffect(() => {
    fetch(`${API}/assets`).then(r => r.json()).then(setAssets).finally(() => setLoading(false))
  }, [])

  const createAsset = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${API}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag, type, model })
    })
    const a = await res.json()
    setAssets(prev => [a, ...prev])
    setTag(''); setType(''); setModel('')
  }

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-semibold">دارایی‌ها</h1>
      <form onSubmit={createAsset} className="grid grid-cols-1 gap-2 md:grid-cols-4">
        <input className="rounded border p-2" placeholder="Tag" value={tag} onChange={e=>setTag(e.target.value)} />
        <input className="rounded border p-2" placeholder="Type" value={type} onChange={e=>setType(e.target.value)} />
        <input className="rounded border p-2" placeholder="Model" value={model} onChange={e=>setModel(e.target.value)} />
        <button className="rounded bg-black px-4 py-2 text-white">افزودن</button>
      </form>
      {loading ? <div>در حال بارگذاری...</div> : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-right">Tag</th>
                <th className="p-2 text-right">Type</th>
                <th className="p-2 text-right">Model</th>
                <th className="p-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.tag}</td>
                  <td className="p-2">{a.type}</td>
                  <td className="p-2">{a.model}</td>
                  <td className="p-2">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

