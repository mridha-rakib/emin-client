"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export const CTASection = () => {
  const { t, language } = useTranslation();
  const isDe = language === "DE";

  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <Container>
        <div className="relative bg-slate-900 rounded-3xl p-8 sm:p-12 md:p-16 overflow-hidden shadow-xl border border-slate-800">
          {/* Subtle ambient lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-primary font-bold text-xs uppercase tracking-wider mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.cta.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                {t.cta.titlePart1} <span className="text-primary">{t.cta.titlePart2}</span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t.cta.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-8">
                <Link href="/auth/confirm_auth">
                  <PrimaryButton size="lg" className="w-full sm:w-auto shadow-md shadow-primary/20">
                    <span>{t.cta.getStarted}</span>
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>
                </Link>
                <Link href="#how-it-works">
                  <button className="px-6 py-3 text-slate-300 hover:text-white font-semibold text-sm transition-colors cursor-pointer">
                    {t.cta.learnHow}
                  </button>
                </Link>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-5 sm:gap-6 pt-2 border-t border-slate-800/80">
                {[
                  t.cta.feature1,
                  t.cta.feature2,
                  t.cta.feature3,
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};