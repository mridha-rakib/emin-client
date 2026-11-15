"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Phone,
  CheckCircle2,
  X,
  AlertCircle,
  RefreshCw,
  Lock,
  IdCard,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/api";
import { type ApiUser, useAuthStore } from "@/store/auth-store";
import { SWISS_DIAL_CODE, SwissDialCode } from "@/components/CountryCodeSelect";
import { IdentityVerificationStep } from "@/components/IdentityVerificationStep";

export type VerificationLevel = "buyer" | "seller";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** "buyer": email + Swiss mobile. "seller" (sellers and service providers): also an approved identity document. */
  level?: VerificationLevel;
  /** Open directly on the identity step when email and phone are already verified. */
  startAt?: "identity";
}

type Step = "overview" | "email" | "phone" | "identity";

const normalizeOtp = (value: string) => value.replace(/\D/g, "").slice(0, 4);
const localPart = (phone: string) => phone.replace(/^\+41\s?/, "").trim();

export const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onSuccess, level = "seller", startAt }) => {
  const { language } = useTranslation();
  const isDe = language === "DE";
  const { userEmail, userPhone, emailVerified, phoneVerified, identityStatus, canBuy, canSell, applyUser } = useAuthStore();

  const [step, setStep] = useState<Step>("overview");
  const [email, setEmail] = useState(userEmail);
  const [rawPhone, setRawPhone] = useState(localPart(userPhone));
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  useEffect(() => {
    if (!isOpen) return;
    apiRequest<ApiUser>("/auth/me").then(applyUser).catch(() => undefined);
  }, [isOpen, applyUser]);

  const canJumpToIdentity = startAt === "identity" && identityStatus !== "APPROVED";
  const [lastOpen, setLastOpen] = useState(false);
  if (isOpen !== lastOpen) {
    setLastOpen(isOpen);
    if (isOpen) setStep(canJumpToIdentity ? "identity" : "overview");
  }

  if (!isOpen) return null;

  const isComplete = level === "buyer" ? canBuy : canSell;

  const goTo = (next: Step) => {
    setStep(next);
    setNotice(null);
    setErrorMessage(null);
  };

  const fail = (error: unknown, fallback: string) => setErrorMessage(error instanceof Error ? error.message : fallback);

  const sendEmailCode = async () => {
    setIsBusy(true);
    setErrorMessage(null);
    setEmailOtp("");
    try {
      await apiRequest("/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) });
      setNotice(isDe ? "Verifizierungscode an Ihre E-Mail gesendet." : "Verification code sent to your email.");
    } catch (error) {
      fail(error, "Could not send verification code");
    } finally {
      setIsBusy(false);
    }
  };

  const verifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = normalizeOtp(emailOtp);
    if (otp.length !== 4) {
      setErrorMessage(isDe ? "Bitte geben Sie den 4-stelligen E-Mail-Code ein." : "Please enter the 4-digit email code.");
      return;
    }
    setIsBusy(true);
    try {
      const result = await apiRequest<{ user: ApiUser }>("/auth/verify-otp", { method: "POST", body: JSON.stringify({ email, otp }) });
      applyUser(result.user);
      goTo("overview");
    } catch {
      setErrorMessage(isDe ? "Ungültiger oder abgelaufener Code." : "Invalid or expired code.");
    } finally {
      setIsBusy(false);
    }
  };

  const sendPhoneCode = async () => {
    if (!rawPhone.trim()) {
      setErrorMessage(isDe ? "Bitte geben Sie Ihre Schweizer Mobilnummer ein." : "Please enter your Swiss mobile number.");
      return;
    }
    setIsBusy(true);
    setErrorMessage(null);
    setPhoneOtp("");
    try {
      const result = await apiRequest<{ message: string; resendAfterSeconds: number; devCode?: string }>("/auth/phone/send-code", {
        method: "POST",
        body: JSON.stringify({ phone: `${SWISS_DIAL_CODE} ${rawPhone}` }),
      });
      setResendIn(result.resendAfterSeconds);
      setNotice(result.devCode
        ? `${result.message} (Development mode — no SMS provider configured. Code: ${result.devCode})`
        : result.message);
    } catch (error) {
      fail(error, "Could not send SMS code");
    } finally {
      setIsBusy(false);
    }
  };

  const verifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = normalizeOtp(phoneOtp);
    if (code.length !== 4) {
      setErrorMessage(isDe ? "Bitte geben Sie den 4-stelligen SMS-Code ein." : "Please enter the 4-digit SMS code.");
      return;
    }
    setIsBusy(true);
    try {
      const result = await apiRequest<{ user: ApiUser }>("/auth/phone/verify", { method: "POST", body: JSON.stringify({ code }) });
      applyUser(result.user);
      goTo("overview");
    } catch (error) {
      fail(error, "Invalid SMS code");
    } finally {
      setIsBusy(false);
    }
  };

  const badge = (done: boolean, pendingLabel?: string) => done ? (
    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
      {isDe ? "Verifiziert" : "Verified"}
    </span>
  ) : (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
      {pendingLabel ?? (isDe ? "Ausstehend" : "Pending")}
    </span>
  );

  const identityBadge = () => {
    if (identityStatus === "APPROVED") return badge(true);
    if (identityStatus === "PENDING") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
          {isDe ? "In Prüfung" : "In review"}
        </span>
      );
    }
    if (identityStatus === "REJECTED") {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
          {isDe ? "Abgelehnt" : "Rejected"}
        </span>
      );
    }
    return badge(false);
  };

  const renderRow = ({
    icon: Icon,
    title,
    subtitle,
    done,
    status,
    action,
    disabled,
  }: {
    icon: React.ElementType;
    title: string;
    subtitle: string;
    done: boolean;
    status: React.ReactNode;
    action?: () => void;
    disabled?: boolean;
  }) => (
    <div className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60">
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn("w-10 h-10 shrink-0 rounded-xl flex items-center justify-center", done ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-600")}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-900">{title}</span>
            {status}
          </div>
          <p className="text-xs text-slate-500 truncate">{subtitle}</p>
        </div>
      </div>
      {action && (
        <button
          type="button"
          onClick={action}
          disabled={disabled}
          className="shrink-0 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isDe ? "Prüfen" : "Verify"}
        </button>
      )}
    </div>
  );

  const renderMessages = () => (
    <>
      {notice && <p className="text-xs text-emerald-700 font-medium bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">{notice}</p>}
      {errorMessage && <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-xl border border-red-200">{errorMessage}</p>}
    </>
  );

  const renderBackButton = () => (
    <button
      type="button"
      onClick={() => goTo("overview")}
      className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
    >
      {isDe ? "Zurück" : "Back"}
    </button>
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-6 pr-10">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#17b9c1]/10 border border-[#17b9c1]/20 flex items-center justify-center text-[#17b9c1]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isDe ? "Verifizierung" : "Account Verification"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {level === "buyer"
                  ? (isDe ? "Vor dem Kauf: E-Mail und Schweizer Mobilnummer bestätigen." : "Before buying: confirm your email and Swiss mobile number.")
                  : (isDe ? "Vor dem Verkaufen oder Anbieten: E-Mail, Schweizer Mobilnummer und Identität bestätigen." : "Before selling or offering services: confirm your email, Swiss mobile number and identity.")}
              </p>
            </div>
          </div>

          {step === "overview" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  {level === "buyer"
                    ? (isDe
                      ? "Käufer benötigen eine bestätigte E-Mail-Adresse und Schweizer Mobilnummer. Ein Ausweis ist nicht erforderlich."
                      : "Buyers need a verified email address and Swiss mobile number. No ID document is required to buy.")
                    : (isDe
                      ? "Nur vollständig verifizierte Verkäufer und Dienstleister dürfen Angebote veröffentlichen: E-Mail, Schweizer Mobilnummer sowie Ausweis (Schweizer ID, Pass, Ausweis B oder C)."
                      : "Only fully verified sellers and service providers may publish: email, Swiss mobile number, and an identity document (Swiss ID card, passport, or permit B/C).")}
                </p>
              </div>

              <div className="space-y-3">
                {renderRow({
                  icon: Mail,
                  title: isDe ? "E-Mail-Adresse" : "Email address",
                  subtitle: email,
                  done: emailVerified,
                  status: badge(emailVerified),
                  action: emailVerified ? undefined : () => goTo("email"),
                })}
                {renderRow({
                  icon: Phone,
                  title: isDe ? "Schweizer Mobilnummer" : "Swiss mobile number",
                  subtitle: phoneVerified ? userPhone : (isDe ? "Bestätigung per SMS-Code (+41)" : "Confirmed by SMS code (+41)"),
                  done: phoneVerified,
                  status: badge(phoneVerified),
                  action: phoneVerified ? undefined : () => goTo("phone"),
                })}
                {level === "seller" && renderRow({
                  icon: IdCard,
                  title: isDe ? "Identität" : "Identity",
                  subtitle: isDe ? "Ausweisdokument(e) plus Selfie-/Lebenderkennung" : "Identity document(s) plus selfie/liveness check",
                  done: identityStatus === "APPROVED",
                  status: identityBadge(),
                  action: identityStatus === "APPROVED" ? undefined : () => goTo("identity"),
                })}
              </div>

              <div className="pt-2">
                {isComplete ? (
                  <button
                    type="button"
                    onClick={() => {
                      onSuccess?.();
                      onClose();
                    }}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isDe ? "Verifiziert – weiter" : "Verified – continue"}</span>
                  </button>
                ) : level === "seller" && identityStatus === "PENDING" && emailVerified && phoneVerified ? (
                  <div className="w-full py-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 font-bold text-xs flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{isDe ? "Identität in Prüfung – wir benachrichtigen Sie" : "Identity under review – publishing unlocks after approval"}</span>
                  </div>
                ) : (
                  <button type="button" disabled className="w-full py-3.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                    <Lock className="w-4 h-4" />
                    <span>{isDe ? "Alle Schritte abschliessen" : "Complete all steps to unlock"}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {step === "email" && (
            <form onSubmit={verifyEmail} className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold uppercase text-slate-500 block mb-1">{isDe ? "E-Mail-Adresse" : "Email address"}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-primary"
                  required
                />
              </div>
              {renderMessages()}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">{isDe ? "4-stelliger E-Mail-Code" : "4-digit email code"}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="0000"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(normalizeOtp(e.target.value))}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-center text-lg font-black tracking-widest outline-none focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => void sendEmailCode()}
                    disabled={isBusy}
                    className="px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {isBusy ? <RefreshCw className="w-4 h-4 animate-spin" /> : notice ? (isDe ? "Erneut senden" : "Resend") : (isDe ? "Code senden" : "Send code")}
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                {renderBackButton()}
                <button type="submit" disabled={isBusy} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/20 cursor-pointer">
                  {isDe ? "Code bestätigen" : "Confirm code"}
                </button>
              </div>
            </form>
          )}

          {step === "phone" && (
            <form onSubmit={verifyPhone} className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="text-xs font-bold uppercase text-slate-500 block mb-2">{isDe ? "Schweizer Mobilnummer" : "Swiss mobile number"}</label>
                <div className="flex gap-2">
                  <SwissDialCode />
                  <input
                    type="tel"
                    placeholder="79 123 45 67"
                    value={rawPhone}
                    onChange={(e) => setRawPhone(e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => void sendPhoneCode()}
                    disabled={isBusy || resendIn > 0}
                    className="shrink-0 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBusy ? <RefreshCw className="w-4 h-4 animate-spin" /> : resendIn > 0 ? `${resendIn}s` : notice ? (isDe ? "Erneut" : "Resend") : (isDe ? "SMS senden" : "Send SMS")}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">{isDe ? "Nur Schweizer Mobilnummern (075–079)." : "Swiss mobile numbers only (075–079)."}</p>
              </div>
              {renderMessages()}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">{isDe ? "4-stelliger SMS-Code" : "4-digit SMS code"}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={4}
                  placeholder="0000"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(normalizeOtp(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center text-lg font-black tracking-widest outline-none focus:border-primary"
                />
              </div>
              <div className="flex gap-2 pt-2">
                {renderBackButton()}
                <button type="submit" disabled={isBusy} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-md shadow-primary/20 cursor-pointer">
                  {isDe ? "SMS-Code bestätigen" : "Confirm SMS code"}
                </button>
              </div>
            </form>
          )}

          {step === "identity" && (
            <div className="space-y-4">
              <IdentityVerificationStep isDe={isDe} onSubmitted={() => undefined} />
              <button
                type="button"
                onClick={() => goTo("overview")}
                className="w-full py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
              >
                {isDe ? "Zur Übersicht" : "Back to overview"}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
