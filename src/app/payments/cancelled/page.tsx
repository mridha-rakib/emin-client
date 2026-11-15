import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-black text-slate-900">Payment cancelled</h1>
      <p className="mt-3 text-sm text-slate-600">No charge was made. You can return and try the payment again.</p>
      <Link href="/" className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">Back home</Link>
    </main>
  );
}
