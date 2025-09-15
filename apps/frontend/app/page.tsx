export default function HomePage() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">داشبورد IT</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <a className="rounded-lg border bg-white p-4 shadow-sm hover:shadow" href="/tickets">تیکت‌ها</a>
        <a className="rounded-lg border bg-white p-4 shadow-sm hover:shadow" href="/assets">دارایی‌ها</a>
        <a className="rounded-lg border bg-white p-4 shadow-sm hover:shadow" href="/licenses">لایسنس‌ها</a>
        <a className="rounded-lg border bg-white p-4 shadow-sm hover:shadow" href="/remote-support">ریموت ساپورت</a>
      </div>
    </main>
  );
}

