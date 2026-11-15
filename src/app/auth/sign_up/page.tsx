"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { SWISS_DIAL_CODE, SwissDialCode } from "@/components/CountryCodeSelect";

export default function SignUpPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const setSession = useAuthStore((state) => state.setSession);
  const isDe = language === "DE";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: SWISS_DIAL_CODE,
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const [firstName, ...lastNameParts] = formData.name.trim().split(/\s+/);
      const storedRole = localStorage.getItem("user_role");
      const accountType = storedRole === "seller" || storedRole === "provider" ? storedRole : "customer";
      const data = await apiRequest<{ accessToken: string; user: { email: string; phone?: string; emailVerifiedAt?: string; accountType?: "customer" | "seller" | "provider" } }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName: lastNameParts.join(" ") || firstName,
          email: formData.email,
          phone: `${formData.countryCode} ${formData.phone}`,
          password: formData.password,
          accountType,
        }),
      });
      setSession({
        accessToken: data.accessToken,
        user: data.user,
        role: accountType,
        name: formData.name,
        phone: `${formData.countryCode} ${formData.phone}`,
      });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-24 pb-14 px-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg.jpg"
          alt="Professionals"
          fill
          sizes="100vw"
          className="object-cover blur-xs"
          priority
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
      </div>

      {/* Sign Up Form Card */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-[500px] w-full p-7 sm:p-10 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t.auth.createAccount}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {isDe ? "Ein Konto für alles – Schweiz & Deutschland" : "Single Account for All Services"}
            </p>
          </div>
          <Image
            src="/Logo.png"
            alt="Odaboo Logo"
            width={100}
            height={30}
            className="h-7 w-auto object-contain"
          />
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="name"
              placeholder={t.auth.fullNamePlaceholder}
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50 placeholder:text-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          {/* Email Address */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              name="email"
              placeholder={t.auth.emailPlaceholder}
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50 placeholder:text-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          {/* Swiss mobile number */}
          <div className="space-y-1">
            <div className="flex gap-2">
              <SwissDialCode variant="field" />

              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="79 123 45 67"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50 placeholder:text-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pl-1 font-medium">
              {isDe ? "Nur Schweizer Mobilnummern (+41 75–79)" : "Swiss mobile numbers only (+41 75–79)"}
            </p>
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t.auth.passwordPlaceholder}
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50 placeholder:text-slate-400 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 shadow-md bg-primary hover:bg-primary/90 shadow-primary/20 cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed",
            )}
          >
            <span>{isSubmitting ? "Creating..." : t.auth.signUpButton}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        </form>

        {/* Trust info */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isDe ? "Profil später jederzeit zum Verkäufer erweiterbar" : "Free profile, switch to seller/provider anytime"}</span>
        </div>

        {/* Terms text */}
        <p className="text-xs text-slate-500 text-center mt-3">
          {t.auth.termsAgreement}{" "}
          <Link
            href="/terms"
            className="text-primary font-semibold hover:underline"
          >
            {t.auth.termsLink}
          </Link>{" "}
          {t.auth.and}{" "}
          <Link
            href="/privacy"
            className="text-primary font-semibold hover:underline"
          >
            {t.auth.privacyLink}
          </Link>
          .
        </p>

        {/* Login Link */}
        <div className="text-center mt-4 text-sm pt-4 border-t border-slate-100">
          <span className="text-slate-500">{t.auth.haveAccount} </span>
          <Link
            href="/auth/login"
            className="text-primary font-bold hover:underline"
          >
            {t.auth.loginButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
