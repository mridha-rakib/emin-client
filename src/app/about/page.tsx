"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Eye, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Container } from "@/components/Container";
import { CTASection } from "@/sections/CTASection";
import { useTranslation } from "@/context/LanguageContext";

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

export default function AboutUsPage() {
  const { t, language } = useTranslation();
  const isDe = language === "DE";

  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {/* --- 1. Signature Hero Section --- */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 border-b border-slate-100/80">
        {/* Architectural grid pattern with radial mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <Container className="relative z-10 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            {/* Trust Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide mb-6 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>{t.aboutPage.badge || (isDe ? "Über Odaboo" : "About Odaboo")}</span>
            </motion.div>

            {/* Two-Tone Grand Headline with Wavy SVG Underline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]"
            >
              {isDe ? "Fachkräfte stärken," : "Empowering People,"}{" "}
              <span className="text-primary relative inline-block">
                {isDe ? "Leben vereinfachen" : "Simplifying Services"}
                <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg lg:text-xl text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed font-normal"
            >
              {t.aboutPage.subtitle}
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* --- 2. Mission & Vision Section --- */}
      <section className="py-24 bg-white relative">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInLeft}
              className="space-y-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 mb-2">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-bold text-slate-900">{t.aboutPage.missionTitle}</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t.aboutPage.missionText}
              </p>
              <ul className="space-y-4 pt-4">
                {[t.cta.feature1, t.cta.feature2, t.cta.feature3].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-6 h-6 text-cyan-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={slideInRight}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-cyan-50 rounded-3xl transform rotate-3" />
              <div className="relative bg-white border border-slate-100 p-10 lg:p-12 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.05)]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-600 mb-8">
                  <Eye className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">{t.aboutPage.visionTitle}</h2>
                <p className="text-lg text-slate-600 leading-relaxed italic">
                  "{t.aboutPage.visionText}"
                </p>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* --- 3. Statistics Section --- */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
        <Container className="relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center"
          >
            {[
              { label: t.aboutPage.stat1, value: "10,000+" },
              { label: t.aboutPage.stat2, value: "250K+" },
              { label: t.aboutPage.stat3, value: "98%" },
              { label: t.aboutPage.stat4, value: "50+" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="p-4">
                <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* --- 4. CTA Section --- */}
      <CTASection />

    </div>
  );
}
