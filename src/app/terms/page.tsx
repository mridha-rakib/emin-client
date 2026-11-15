"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, FileText, Scale, Shield } from "lucide-react";
import { LegalCmsPage } from "@/components/LegalCmsPage";
import { useTranslation } from "@/context/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <LegalCmsPage
      slug="terms-conditions"
      title={t.termsPage.title}
      subtitle={t.termsPage.subtitle}
      icon={<FileText className="h-8 w-8" />}
      glowClass="bg-cyan-500/5"
      badgeClass="bg-cyan-50 text-cyan-600"
    >
      <motion.p variants={fadeInUp} className="mb-12 text-lg leading-relaxed font-medium text-slate-600">
        {t.termsPage.intro}
      </motion.p>
      <motion.div variants={fadeInUp} className="mb-12">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
            <Scale className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{t.termsPage.section1Title}</h2>
        </div>
        <p className="leading-relaxed text-slate-600 md:ml-16">{t.termsPage.section1Text}</p>
      </motion.div>
      <motion.div variants={fadeInUp} className="mb-12">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{t.termsPage.section2Title}</h2>
        </div>
        <p className="leading-relaxed text-slate-600 md:ml-16">{t.termsPage.section2Text}</p>
      </motion.div>
      <motion.div variants={fadeInUp}>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{t.termsPage.section3Title}</h2>
        </div>
        <p className="leading-relaxed text-slate-600 md:ml-16">{t.termsPage.section3Text}</p>
      </motion.div>
    </LegalCmsPage>
  );
}
