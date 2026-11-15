"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, IdCard } from "lucide-react";
import { VerificationModal } from "@/components/VerificationModal";
import { useVerification } from "@/lib/use-verification";
import { cn } from "@/lib/utils";

/**
 * Identity verification status for the settings pages. Buyers do not need it,
 * but anyone who wants to sell products or offer services can start it from here.
 */
export function IdentityStatusCard({ isDe }: { isDe: boolean }) {
  const { identityStatus, identityRejectionReason, isHydrated } = useVerification();
  const [isOpen, setIsOpen] = useState(false);

  if (!isHydrated) return null;

  const view = {
    APPROVED: {
      icon: CheckCircle2,
      tone: "border-emerald-200 bg-emerald-50 text-emerald-800",
      badge: isDe ? "Verifiziert" : "Verified",
      text: isDe
        ? "Ihre Identität ist bestätigt. Sie können Produkte verkaufen und Dienstleistungen anbieten."
        : "Your identity is confirmed. You can sell products and offer services.",
      action: null,
    },
    PENDING: {
      icon: Clock,
      tone: "border-sky-200 bg-sky-50 text-sky-800",
      badge: isDe ? "In Prüfung" : "In review",
      text: isDe
        ? "Unser Team prüft Ihre Dokumente. Sie werden freigeschaltet, sobald die Prüfung genehmigt ist."
        : "Our team is reviewing your documents. Selling unlocks as soon as the review is approved.",
      action: null,
    },
    REJECTED: {
      icon: AlertCircle,
      tone: "border-red-200 bg-red-50 text-red-800",
      badge: isDe ? "Abgelehnt" : "Rejected",
      text: identityRejectionReason || (isDe ? "Ihre letzte Einreichung wurde abgelehnt." : "Your last submission was not approved."),
      action: isDe ? "Erneut einreichen" : "Submit again",
    },
    NOT_SUBMITTED: {
      icon: IdCard,
      tone: "border-slate-200 bg-slate-50 text-slate-700",
      badge: isDe ? "Nicht eingereicht" : "Not submitted",
      text: isDe
        ? "Für Käufe nicht nötig. Erforderlich, um Produkte zu verkaufen oder Dienstleistungen anzubieten: Schweizer ID, Pass oder Ausweis B/C."
        : "Not needed for buying. Required to sell products or offer services: Swiss ID card, passport or permit B/C.",
      action: isDe ? "Identität verifizieren" : "Verify identity",
    },
  }[identityStatus];
  const Icon = view.icon;

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-100 shadow-sm mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={cn("w-11 h-11 shrink-0 rounded-2xl border flex items-center justify-center", view.tone)}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-800">{isDe ? "Identitätsprüfung" : "Identity verification"}</h3>
              <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", view.tone)}>{view.badge}</span>
            </div>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">{view.text}</p>
          </div>
        </div>
        {view.action && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all cursor-pointer"
          >
            {view.action}
          </button>
        )}
      </div>

      <VerificationModal isOpen={isOpen} level="seller" startAt="identity" onClose={() => setIsOpen(false)} />
    </div>
  );
}
