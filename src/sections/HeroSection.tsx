"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Search, MapPin, Calendar, ShieldCheck, Star, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";

export const HeroSection = () => {
  const router = useRouter();
  const { t, language } = useTranslation();
  const isDe = language === "DE";

  const [serviceQuery, setServiceQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (serviceQuery.trim()) params.set("q", serviceQuery.trim());
    if (locationQuery.trim()) params.set("location", locationQuery.trim());
    router.push(`/services?${params.toString()}`);
  };

  const quickTags = [
    { label: isDe ? "Reinigung" : "Cleaning", query: "Cleaning" },
    { label: isDe ? "Gartenbau" : "Gardening", query: "Gardening" },
    { label: isDe ? "Sanitär" : "Plumbing", query: "Plumbing" },
    { label: isDe ? "Maler" : "Painter", query: "Painter" },
    { label: isDe ? "Schreiner" : "Carpenter", query: "Carpenter" },
    { label: isDe ? "Umzugshilfe" : "Moving", query: "Moving" },
  ];

  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50">
      {/* Subtle architectural grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <Container className="relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide mb-6 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>{isDe ? "Zertifizierter Dienstleistungs-Marktplatz in der Schweiz & Deutschland" : "Certified & Vetted Service Marketplace in Switzerland & Germany"}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]"
          >
            {t.hero.titlePart1}{" "}
            <span className="text-primary relative inline-block">
              {t.hero.titlePart2}
              <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {t.hero.subtitlePart1} {t.hero.subtitlePart2}
          </motion.p>

          {/* Multi-Segment Service Search Console */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative max-w-3xl mx-auto"
          >
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/90 flex flex-col md:flex-row items-stretch md:items-center gap-2"
            >
              {/* Segment 1: Service input */}
              <div className="flex-1 px-4 py-3 flex items-center gap-3 bg-slate-50/70 hover:bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 transition-all focus-within:bg-white focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  placeholder={t.hero.searchPlaceholder}
                  className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium"
                />
              </div>

              {/* Segment 2: Location input */}
              <div className="w-full md:w-56 px-4 py-3 flex items-center gap-3 bg-slate-50/70 hover:bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 transition-all focus-within:bg-white focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder={isDe ? "Stadt oder PLZ" : "City or Postal Code"}
                  className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium"
                />
              </div>

              {/* Submit CTA Button */}
              <PrimaryButton
                type="submit"
                className="w-full md:w-auto bg-primary hover:bg-primary-hover text-white rounded-xl sm:rounded-2xl px-8 py-3.5 h-auto text-base font-bold shadow-md shadow-primary/25 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>{t.hero.searchButton}</span>
                <ArrowRight className="w-4 h-4" />
              </PrimaryButton>
            </form>

            {/* Quick Filter Tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">
                {isDe ? "Beliebt:" : "Popular:"}
              </span>
              {quickTags.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => router.push(`/services?q=${encodeURIComponent(tag.query)}`)}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-600 font-medium transition-colors cursor-pointer border border-slate-200/60"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* Authentic Social Proof & Guarantees Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-10 pt-6 border-t border-slate-200/70 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-slate-600"
            >
              {/* Rating & reviews */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  4.9/5{" "}
                  <span className="font-normal text-slate-500">
                    ({isDe ? "10.400+ echte Bewertungen" : "10k+ verified reviews"})
                  </span>
                </span>
              </div>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              {/* Guarantees */}
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isDe ? "100% Treuhand-Käuferschutz" : "100% Escrow Protection"}</span>
              </div>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isDe ? "Geprüfte Fachkräfte" : "ID Verified Specialists"}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};
