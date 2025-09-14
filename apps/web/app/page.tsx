export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/tickets" className="rounded-md border p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="font-medium">Tickets</div>
          <div className="text-xs opacity-70">View and manage support tickets.</div>
        </a>
        <a href="/assets" className="rounded-md border p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="font-medium">Assets</div>
          <div className="text-xs opacity-70">Inventory of IT assets.</div>
        </a>
        <a href="/licenses" className="rounded-md border p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="font-medium">Licenses</div>
          <div className="text-xs opacity-70">Software licenses and seats.</div>
        </a>
        <a href="/remote" className="rounded-md border p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="font-medium">Remote</div>
          <div className="text-xs opacity-70">Start a remote session.</div>
        </a>
      </div>
    </div>
  );
}
