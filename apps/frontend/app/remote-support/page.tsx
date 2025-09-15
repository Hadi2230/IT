'use client'

export default function RemoteSupportPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-xl font-semibold">ریموت ساپورت</h1>
      <p className="text-sm text-gray-600">برای آغاز جلسه ریموت، لینک اختصاصی کاربر را ارسال کنید.</p>
      <div className="rounded border bg-white p-4">
        <p>این بخش به WebSocket و احراز هویت JWT متصل می‌شود (در بک‌اند آماده است). UI کامل جلسه (اشتراک‌گذاری صفحه/کنترل) را می‌توان با WebRTC اضافه کرد.</p>
      </div>
    </main>
  )
}

