"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cookie, ShieldCheck, Settings, EyeOff } from "lucide-react";
import { Container } from "@/components/Container";
import { CTASection } from "@/sections/CTASection";
import { useTranslation } from "@/context/LanguageContext";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

export default function CookiesPage() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden pt-24 pb-0">

            {/* Hero Section */}
            <section className="relative pt-16 pb-20 bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

                <Container className="relative z-10 text-center max-w-3xl">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                        <motion.div variants={fadeInUp} className="inline-flex items-center justify-center p-3 bg-purple-50 text-purple-600 rounded-2xl mb-6">
                            <Cookie className="w-8 h-8" />
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            {t.cookiesPage.title}
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
                            {t.cookiesPage.subtitle}
                        </motion.p>
                    </motion.div>
                </Container>
            </section>

            {/* Content Section */}
            <section className="py-16 md:py-24">
                <Container className="max-w-4xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-200"
                    >

                        {/* Intro */}
                        <motion.p variants={fadeInUp} className="text-lg text-slate-600 leading-relaxed mb-12">
                            {t.cookiesPage.intro}
                        </motion.p>

                        {/* Section 1 */}
                        <motion.div variants={fadeInUp} className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{t.cookiesPage.section1Title}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed ml-0 md:ml-16">
                                {t.cookiesPage.section1Text}
                            </p>
                        </motion.div>

                        {/* Section 2 */}
                        <motion.div variants={fadeInUp} className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                                    <Settings className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{t.cookiesPage.section2Title}</h2>
                            </div>
                            <div className="ml-0 md:ml-16 space-y-4">
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    {t.cookiesPage.section2Text}
                                </p>
                            </div>
                        </motion.div>

                        {/* Section 3 */}
                        <motion.div variants={fadeInUp}>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                                    <EyeOff className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{t.cookiesPage.section3Title}</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed ml-0 md:ml-16">
                                {t.cookiesPage.section3Text}
                            </p>
                        </motion.div>

                    </motion.div>
                </Container>
            </section>

            {/* CTA Section */}
            <CTASection />
        </div>
    );
}