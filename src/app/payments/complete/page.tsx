"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { apiRequest, downloadInvoice } from "@/lib/api";
import { canAccessRoleRoute, roleHome } from "@/lib/role-access";
import { useAuthStore } from "@/store/auth-store";

type PaymentResult = { status: string; purpose?: string; planName?: string; orderNumber?: string; bookingId?: string; amount?: number; serviceTitle?: string; invoiceId?: string; invoiceNumber?: string; emailSent?: boolean };

function CompletePayment() {
  const sessionId = useSearchParams().get("session_id") ?? "";
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState("");
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    apiRequest<PaymentResult>(`/payments/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`)
      .then((payment) => {
        if (payment.purpose === "SUBSCRIPTION" && payment.planName) {
          localStorage.setItem("user_subscription_tier", payment.planName);
          localStorage.setItem("user_subscription", JSON.stringify({ planName: payment.planName, amount: payment.amount, currency: "CHF", status: "active" }));
          window.dispatchEvent(new Event("storage"));
        }
        setResult(payment);
      })
      .catch((confirmError) => setError(confirmError instanceof Error ? confirmError.message : "Payment could not be confirmed."));
  }, [sessionId]);

  const nextPath = result?.purpose === "SUBSCRIPTION"
    ? "/subscription"
    : result?.purpose === "SERVICE"
      ? "/my_bookings_customer"
      : "/marketplace";
  const continueHref = token && !canAccessRoleRoute(role, nextPath) ? roleHome[role] : nextPath;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
      <CheckCircle2 className="mb-4 h-14 w-14 text-emerald-600" />
      <h1 className="text-3xl font-black text-slate-900">{error ? "Payment not confirmed" : result ? "Payment confirmed" : "Confirming payment…"}</h1>
      <p className="mt-3 text-sm text-slate-600">
        {error || (result?.purpose === "SUBSCRIPTION" ? `${result.planName} is now active.` : result?.orderNumber ? `Order ${result.orderNumber} is paid.` : result?.serviceTitle ? `${result.serviceTitle} is booked and paid.` : "Stripe is verifying this payment.")}
      </p>
      {result?.emailSent && <p className="mt-2 text-sm font-semibold text-emerald-700">A PDF invoice was sent to your email.</p>}
      {result?.invoiceId && (
        <button
          type="button"
          onClick={() => {
            setDownloadError("");
            void downloadInvoice(result.invoiceId as string, result.invoiceNumber).catch((downloadFailure) => {
              setDownloadError(downloadFailure instanceof Error ? downloadFailure.message : "The invoice could not be downloaded.");
            });
          }}
          className="mt-5 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-800"
        >
          Download invoice
        </button>
      )}
      {downloadError && <p className="mt-2 text-sm font-semibold text-red-600">{downloadError}</p>}
      <Link href={continueHref} className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white">
        Continue
      </Link>
    </main>
  );
}

export default function PaymentCompletePage() {
  return <Suspense fallback={null}><CompletePayment /></Suspense>;
}
