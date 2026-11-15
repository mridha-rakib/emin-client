"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, HelpCircle } from "lucide-react";
import { Container } from "@/components/Container";
import { CTASection } from "@/sections/CTASection";
import { cn } from "@/lib/utils";
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
        transition: { staggerChildren: 0.1 }
    }
};

export default function FAQPage() {
    const { t } = useTranslation();
    const categories = useMemo(() => [
        { id: "all", label: t.faqPage.categories.all },
        { id: "general", label: t.faqPage.categories.general },
        { id: "pros", label: t.faqPage.categories.forPros },
        { id: "clients", label: t.faqPage.categories.forClients },
        { id: "billing", label: t.faqPage.categories.billing },
    ], [t]);

    const [selectedCatId, setSelectedCatId] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const filteredFaqs = useMemo(() => {
        const selectedCat = categories.find(c => c.id === selectedCatId);
        return t.faqPage.items.filter(faq => {
            const matchesCategory = selectedCatId === "all" || faq.category === selectedCat?.label;
            const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [t.faqPage.items, categories, selectedCatId, searchQuery]);

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden pt-24 pb-0">
            {/* --- 1. Hero Section --- */}
            <section className="relative pt-16 pb-20 bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

                <Container className="relative z-10 text-center max-w-3xl">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                        <motion.div variants={fadeInUp} className="inline-flex items-center justify-center p-3 bg-cyan-50 text-cyan-600 rounded-2xl mb-6">
                            <HelpCircle className="w-8 h-8" />
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            {t.faqPage.title}
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
                            {t.faqPage.subtitle}
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div variants={fadeInUp} className="relative max-w-xl mx-auto">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-4 rounded-full border-slate-200 shadow-sm text-slate-900 focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all outline-none"
                                placeholder={t.faqPage.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </motion.div>
                    </motion.div>
                </Container>
            </section>

            {/* --- 2. FAQ Content Section --- */}
            <section className="py-16 md:py-24">
                <Container className="max-w-4xl">

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCatId(cat.id);
                                    setOpenIndex(null);
                                }}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer",
                                    selectedCatId === cat.id
                                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Accordion List */}
                    <div className="space-y-4">
                        <AnimatePresence mode="wait">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq, idx) => {
                                    const isOpen = openIndex === idx;
                                    return (
                                        <motion.div
                                            key={faq.question}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className={cn(
                                                "border rounded-2xl overflow-hidden transition-colors",
                                                isOpen ? "bg-white border-purple-200 shadow-sm" : "bg-white border-slate-200 hover:border-purple-200"
                                            )}
                                        >
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : idx)}
                                                className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                                            >
                                                <span className="text-lg font-bold text-slate-900 pr-8">{faq.question}</span>
                                                <motion.div
                                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                                    className={cn("shrink-0", isOpen ? "text-purple-600" : "text-slate-400")}
                                                >
                                                    <ChevronDown className="w-5 h-5" />
                                                </motion.div>
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    >
                                                        <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                                                            {faq.answer}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    {t.faqPage.noFaqs}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </Container>
            </section>

            {/* --- 3. CTA Section --- */}
            <CTASection />
        </div>
    );
}