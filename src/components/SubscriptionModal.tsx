"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Lock,
  Sparkles,
  ArrowRight,
  Zap,
  Check
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

export interface SubscriptionPlanDetails {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  features: string[];
}

interface SubscriptionModalProps {
  isOpen: boolean;
  plan: SubscriptionPlanDetails | null;
  isAnnual: boolean;
  onClose: () => void;
  onSuccess: (planName: string, txnId: string) => void;
}

export function SubscriptionModal({
  isOpen,
  plan,
  isAnnual,
  onClose,
  onSuccess
}: SubscriptionModalProps) {
  const { language } = useTranslation();
  const isDe = language === "DE";

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [txnId, setTxnId] = useState("");

  if (!isOpen || !plan) return null;

  const price = isAnnual ? plan.yearlyPrice : plan.monthlyPrice;
  const billingPeriod = isAnnual ? (isDe ? "pro Jahr" : "per year") : (isDe ? "pro Monat" : "per month");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const result = await apiRequest<{ url?: string | null; activated?: boolean }>("/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ purpose: "SUBSCRIPTION", planId: plan.id, billingCycle: isAnnual ? "yearly" : "monthly" }),
      });
      if (result.activated || !result.url) {
        localStorage.setItem("user_subscription_tier", plan.name);
        window.dispatchEvent(new Event("storage"));
        onSuccess(plan.name, "free");
        return;
      }
      window.location.href = result.url;
    } catch (error) {
      setTxnId(error instanceof Error ? error.message : "Payment could not be started.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                {isDe ? "Abonnement Abschließen" : "Subscribe to Platform"}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-primary/20 text-primary border border-primary/30">
                  {plan.name}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {isDe ? "Sicher mit Stripe 256-Bit SSL" : "Secured with Stripe 256-Bit SSL"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isCompleted ? (
          <div className="p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              {isDe ? "Abonnement Aktiviert" : "Subscription Activated"}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              {isDe ? "Willkommen beim Pro Plan!" : `Welcome to ${plan.name}!`}
            </h2>
            <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto">
              {isDe
                ? "Ihr Verkäuferkonto wurde erfolgreich aufgerüstet. Sie genießen jetzt alle erweiterten KI- und Marketplace-Vorteile."
                : "Your seller account has been upgraded. You now have full access to high-priority AI inspection, unlimited uploads, and reduced commission."}
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5 max-w-sm mx-auto text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">{isDe ? "Plan:" : "Plan Tier:"}</span>
                <strong className="text-slate-900 font-bold">{plan.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <strong className="text-emerald-700 font-mono font-bold">{txnId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isDe ? "Betrag bezahlt:" : "Amount Billed:"}</span>
                <span className="text-primary font-black">CHF {price} {billingPeriod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isDe ? "Zahlungsmittel:" : "Payment:"}</span>
                <span className="font-semibold text-slate-800">{isDe ? "Bezahlt mit Stripe" : "Paid with Stripe"}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={onClose}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-extrabold rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-primary/20"
              >
                {isDe ? "Zum Dashboard" : "Start Using Premium Features"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Plan Pricing Summary Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  {isAnnual ? (isDe ? "Jährliche Abrechnung (Spare 17%)" : "Annual Billing (Save 17%)") : (isDe ? "Monatliche Abrechnung" : "Monthly Billing")}
                </span>
                <h4 className="text-base font-black text-slate-900">{plan.name} Tier</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{plan.description}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-slate-900">CHF {price}</div>
                <div className="text-[11px] text-slate-400 font-medium">/{isAnnual ? "year" : "month"}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <CreditCard className="mb-2 h-4 w-4 text-primary" />
              {isDe
                ? "Die Kartenzahlung öffnet die sichere Stripe-Checkout-Seite. Es werden keine Kartennummern in Odaboo gespeichert."
                : "Card payment opens Stripe’s secure checkout. Card numbers are never stored in Odaboo."}
            </div>
            {txnId && <p className="rounded-xl border border-red-200 bg-red-50 p-2 text-xs font-medium text-red-600">{txnId}</p>}

            {/* Included Key Highlights */}
            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                {isDe ? "In diesem Plan enthalten:" : "Included in this subscription:"}
              </div>
              <ul className="text-[11px] text-slate-600 space-y-0.5">
                {plan.features.slice(0, 3).map((f, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stripe Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isDe
                  ? "Jederzeit kündbar. 256-Bit SSL Verschlüsselung durch Stripe."
                  : "Cancel anytime. 256-Bit SSL Encrypted by Stripe."}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {isDe ? "Abbrechen" : "Cancel"}
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-2/3 py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>{isDe ? "Wird verarbeitet..." : "Processing Payment..."}</span>
                ) : (
                  <>
                    <span>
                      {isDe ? `Jetzt für CHF ${price} Abonnieren` : `Pay CHF ${price} & Activate Plan`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
