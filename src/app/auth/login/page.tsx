"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const setSession = useAuthStore((state) => state.setSession);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const data = await apiRequest<{ accessToken: string; user: { firstName?: string; lastName?: string; email: string; phone?: string; emailVerifiedAt?: string; accountType?: "customer" | "seller" | "provider" } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      setSession({ accessToken: data.accessToken, user: data.user });
      const accountType = data.user.accountType ?? localStorage.getItem("user_role");
      if (accountType === "seller") router.push("/seller/products");
      else if (accountType === "provider") router.push("/manage_services");
      else router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
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
        {/* Dark overlay to make the card pop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Login Form Card */}
      <div className="relative z-10 bg-white rounded-xl shadow-2xl max-w-[480px] w-full p-8 md:p-10 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
            {t.auth.welcomeBack}
          </h1>
          <Image
            src="/Logo.png"
            alt="Odaboo Logo"
            width={100}
            height={30}
            className="h-7 w-auto object-contain"
          />
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder={t.auth.emailPlaceholder}
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-md border border-slate-200 text-slate-900 bg-transparent placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder={t.auth.passwordPlaceholder}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 rounded-md border border-slate-200 text-slate-900 bg-transparent placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                href="/auth/forgot_password"
                className="text-xs font-semibold text-purple-600 hover:underline"
              >
                {t.auth.forgotPasswordLink}
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 rounded-md text-sm font-bold text-white transition-all duration-200 shadow-md bg-purple-600 hover:bg-purple-700 shadow-purple-500/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
            )}
          >
            <span>{isSubmitting ? "Signing in..." : t.auth.loginButton}</span>
            <LogIn className="w-4 h-4" />
          </button>
          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        </form>

        <div className="text-center mt-6 text-sm pt-6 border-t border-slate-100">
          <span className="text-slate-500">{t.auth.noAccount} </span>
          <Link
            href="/auth/sign_up"
            className="text-primary font-bold hover:underline"
          >
            {t.nav.signUp}
          </Link>
        </div>
      </div>
    </div>
  );
}
