"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { roleHome } from "@/lib/role-access";
import { useAuthStore } from "@/store/auth-store";

type SavedCard = { brand?: string; last4?: string; status?: string; detail?: string };

function ConfirmPayoutCard() {
  const sessionId = useSearchParams().get("session_id") ?? "";
  const role = useAuthStore((state) => state.role);
  const [card, setCard] = useState<SavedCard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    apiRequest<{ card: SavedCard | null; detail?: string }>(`/payout-methods/confirm?session_id=${encodeURIComponent(sessionId)}`)
      .then((result) => setCard(result.card ?? { status: "PENDING", detail: result.detail }))
      .catch((confirmError: unknown) => setError(confirmError instanceof Error ? confirmError.message : "The card could not be saved."));
  }, [sessionId]);

  const back = roleHome[role] || "/";

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-black text-slate-900">Payout card</h1>
      {error && <p className="mt-4 text-sm font-semibold text-red-500">{error}</p>}
      {!error && !card && <p className="mt-4 text-sm text-slate-500">Saving the card with Stripe…</p>}
      {card && (
        <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-6">
          <p className="text-lg font-black text-slate-800">
            {card.last4 ? `${(card.brand || "Card").toUpperCase()} •••• ${card.last4}` : "Card pending"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{card.detail}</p>
        </div>
      )}
      <Link href={back} className="mt-6 text-sm font-bold text-[#17b9c1]">Back to profile</Link>
    </main>
  );
}

export default function PayoutCardPage() {
  return (
    <Suspense fallback={<main className="px-6 py-16 text-sm text-slate-500">Saving the card with Stripe…</main>}>
      <ConfirmPayoutCard />
    </Suspense>
  );
}
