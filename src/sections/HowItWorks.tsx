"use client";

import React from "react";
import { Container } from "@/components/Container";
import { Search, Calendar, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import Link from "next/link";

export const HowItWorks = () => {
  const { t, language } = useTranslation();
  const isDe = language === "DE";

  const steps = [
    {
      step: "01",
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
      icon: Search,
    },
    {
      step: "02",
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
      icon: ShieldCheck,
    },
    {
      step: "03",
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
      icon: Calendar,
    },
    {
      step: "04",
      title: t.howItWorks.step4Title,
      description: t.howItWorks.step4Desc,
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-slate-50/70 border-y border-slate-200/60 overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-primary font-bold text-xs sm:text-sm uppercase tracking-wider mb-2.5 inline-block">
            {t.howItWorks.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* 4-Step Minimalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 flex flex-col justify-between relative group"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                      STEP {item.step}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 tracking-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>{isDe ? "Einfach & sicher" : "Simple & verified"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};