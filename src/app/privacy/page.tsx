"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Eye, Lock, Shield } from "lucide-react";
import { LegalCmsPage } from "@/components/LegalCmsPage";
import { useTranslation } from "@/context/LanguageContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <LegalCmsPage
      slug="privacy-policy"
      title={t.privacyPage.title}
      subtitle={t.privacyPage.subtitle}
      icon={<Shield className="h-8 w-8" />}
      glowClass="bg-purple-600/5"
      badgeClass="bg-purple-50 text-purple-600"
    >
      <motion.p variants={fadeInUp} className="mb-12 text-lg leading-relaxed font-medium text-slate-600">
        {t.privacyPage.intro}
      </motion.p>
      <motion.div variants={fadeInUp} className="mb-12">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
            <Database className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{t.privacyPage.section1Title}</h2>
        </div>
        <p className="leading-relaxed text-slate-600 md:ml-16">{t.privacyPage.section1Text}</p>
      </motion.div>
      <motion.div variants={fadeInUp} className="mb-12">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
            <Eye className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{t.privacyPage.section2Title}</h2>
        </div>
        <p className="leading-relaxed text-slate-600 md:ml-16">{t.privacyPage.section2Text}</p>
      </motion.div>
      <motion.div variants={fadeInUp}>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">{t.privacyPage.section3Title}</h2>
        </div>
        <p className="leading-relaxed text-slate-600 md:ml-16">{t.privacyPage.section3Text}</p>
      </motion.div>
    </LegalCmsPage>
  );
}
