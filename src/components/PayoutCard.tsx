"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useTranslation } from "@/context/LanguageContext";

type PayoutCardView = {
  brand: string;
  last4: string;
  expMonth?: number;
  expYear?: number;
  status: string;
  detail?: string;
};

type HeldPayout = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  detail?: string;
  sourceType: string;
};

type PayoutProfile = { card: PayoutCardView | null; payouts: HeldPayout[] };

export function PayoutCard() {
  const { language } = useTranslation();
  const isDe = language === "DE";
  const [profile, setProfile] = useState<PayoutProfile | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  const load = () => {
    apiRequest<PayoutProfile>("/payout-methods/me")
      .then(setProfile)
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : "Could not load the payout card."));
  };

  useEffect(() => {
    load();
  }, []);

  const addCard = async () => {
    setBusy("card");
    setError("");
    try {
      const setup = await apiRequest<{ url: string | null }>("/payout-methods/setup", { method: "POST" });
      if (setup.url) window.location.href = setup.url;
    } catch (setupError: unknown) {
      setError(setupError instanceof Error ? setupError.message : "Stripe could not open the card form.");
    } finally {
      setBusy("");
    }
  };

  const complete = async (payout: HeldPayout) => {
    setBusy(payout.id);
    setError("");
    try {
      const updated = await apiRequest<HeldPayout>(`/payouts/${payout.id}/release`, { method: "POST" });
      setProfile((current) => current ? {
        ...current,
        payouts: current.payouts.map((item) => item.id === payout.id ? { ...item, ...updated } : item),
      } : current);
    } catch (releaseError: unknown) {
      setError(releaseError instanceof Error ? releaseError.message : "The payout could not be released.");
    } finally {
      setBusy("");
    }
  };

  const card = profile?.card;

  return (
    <section className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-[#17b9c1]">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">{isDe ? "Auszahlungskarte" : "Payout card"}</h2>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              {isDe
                ? "Stripe speichert die Karte. Hier erscheinen nur die letzten 4 Ziffern. Buchungs- und Verkaufsgelder bleiben auf dem Plattformkonto, bis der Auftrag abgeschlossen wird."
                : "Stripe stores the card. Only the last 4 digits are shown here. Booking and sale payments stay on the platform account until the job is marked completed."}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void addCard()}
          disabled={busy === "card"}
          className="rounded-2xl bg-[#17b9c1] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {card ? (isDe ? "Karte ersetzen" : "Replace card") : isDe ? "Karte hinzufügen" : "Add payout card"}
        </button>
      </div>

      {card && (
        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm font-black text-slate-800">
            {(card.brand || "Card").toUpperCase()} •••• {card.last4}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {card.expMonth && card.expYear ? `${String(card.expMonth).padStart(2, "0")}/${card.expYear} · ` : ""}
            {card.status === "ACTIVE" ? (isDe ? "Bereit" : "Ready") : isDe ? "Ausstehend" : "Pending"}
          </p>
          {card.detail && <p className="mt-2 text-xs leading-relaxed text-slate-500">{card.detail}</p>}
        </div>
      )}

      {error && <p className="mt-4 text-sm font-semibold text-red-500">{error}</p>}

      <div className="mt-6 space-y-3">
        {(profile?.payouts ?? []).map((payout) => (
          <div key={payout.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">{payout.title || (isDe ? "Zahlung" : "Payment")}</p>
              <p className="text-xs font-semibold text-slate-400">
                {payout.currency} {payout.amount.toFixed(2)} · {payout.status}
              </p>
              {payout.detail && <p className="mt-1 text-xs leading-relaxed text-slate-500">{payout.detail}</p>}
            </div>
            <button
              type="button"
              disabled={busy === payout.id || payout.status === "TRANSFERRED"}
              onClick={() => void complete(payout)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-60"
            >
              {payout.status === "TRANSFERRED" ? (isDe ? "Ausgezahlt" : "Paid out") : isDe ? "Abgeschlossen" : "Mark completed"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
