'use client'
import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

type License = {
  id: string
  product: string
  vendor?: string | null
  seatsTotal?: number | null
  seatsUsed?: number | null
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([])
  const [product, setProduct] = useState('')
  const [vendor, setVendor] = useState('')

  const load = async () => {
    const q = new URLSearchParams()
    if (product) q.set('product', product)
    if (vendor) q.set('vendor', vendor)
    const res = await fetch(`${API}/licenses?${q.toString()}`)
    setLicenses(await res.json())
  }

  useEffect(() => { load() }, [])

  return (
    <main className="space-y-6">
      <h1 className="text-xl font-semibold">لایسنس‌ها</h1>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <input className="rounded border p-2" placeholder="Product" value={product} onChange={e=>setProduct(e.target.value)} />
        <input className="rounded border p-2" placeholder="Vendor" value={vendor} onChange={e=>setVendor(e.target.value)} />
        <button onClick={load} className="rounded bg-black px-4 py-2 text-white">جستجو</button>
      </div>
      <div className="overflow-x-auto rounded border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-right">Product</th>
              <th className="p-2 text-right">Vendor</th>
              <th className="p-2 text-right">Seats</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map(l => (
              <tr key={l.id} className="border-t">
                <td className="p-2">{l.product}</td>
                <td className="p-2">{l.vendor}</td>
                <td className="p-2">{(l.seatsUsed ?? 0)}/{l.seatsTotal ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

