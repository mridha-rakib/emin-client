"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Briefcase, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/context/LanguageContext";

export default function ConfirmAuthPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<
    "customer" | "seller" | "provider" | null
  >(null);

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

      {/* Role Selection Card */}
      <div className="relative z-10 bg-white rounded-xl shadow-2xl max-w-[480px] w-full p-8 md:p-10 border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800">
            {t.auth.selectRole}
          </h1>
          <Image
            src="/Logo.png"
            alt="Odaboo Logo"
            width={100}
            height={30}
            className="h-7 w-auto object-contain"
          />
        </div>

        {/* Role Options */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => setSelectedRole("customer")}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-md border text-sm font-bold uppercase transition-all duration-200 cursor-pointer",
              selectedRole === "customer"
                ? "border-primary bg-primary/5 text-primary shadow-sm"
                : "border-primary/30 text-primary/70 hover:bg-primary/5",
            )}
          >
            <User className="w-4 h-4" />
            <span>{t.auth.roleCustomer}</span>
          </button>

          <button
            onClick={() => setSelectedRole("seller")}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-md border text-sm font-bold uppercase transition-all duration-200 cursor-pointer",
              selectedRole === "seller"
                ? "border-primary bg-primary/5 text-primary shadow-sm"
                : "border-primary/30 text-primary/70 hover:bg-primary/5",
            )}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.auth.roleSeller}</span>
          </button>

          <button
            onClick={() => setSelectedRole("provider")}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-md border text-sm font-bold uppercase transition-all duration-200 cursor-pointer",
              selectedRole === "provider"
                ? "border-primary bg-primary/5 text-primary shadow-sm"
                : "border-primary/30 text-primary/70 hover:bg-primary/5",
            )}
          >
            <Briefcase className="w-4 h-4" />
            <span>{t.auth.roleProvider}</span>
          </button>
        </div>

        {/* Signup / Switch Action */}
        <button
          onClick={() => {
            if (selectedRole) {
              const token = localStorage.getItem("auth_token");
              if (token) {
                const accountType = localStorage.getItem("user_role") || "customer";
                if (accountType === "seller") router.push("/seller/products");
                else if (accountType === "provider") router.push("/manage_services");
                else router.push("/myprofile_customer");
              } else {
                localStorage.setItem("user_role", selectedRole);
                router.push("/auth/sign_up");
              }
            }
          }}
          className={cn(
            "w-full py-3.5 rounded-xl text-sm font-bold text-white transition-colors duration-200 shadow-md cursor-pointer",
            selectedRole
              ? "bg-primary hover:bg-primary/90 shadow-primary/20"
              : "bg-slate-300 cursor-not-allowed shadow-none",
          )}
          disabled={!selectedRole}
        >
          {t.auth.signUpWithEmail}
        </button>

        {/* Login Link */}
        <div className="text-center mt-6 text-sm">
          <span className="text-slate-500">{t.auth.haveAccount} </span>
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            {t.auth.loginButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
