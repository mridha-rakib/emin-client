"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Check, 
    X, 
    HelpCircle, 
    Zap, 
    Shield, 
    Star, 
    ChevronDown,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { CTASection } from "@/sections/CTASection";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { SubscriptionModal, SubscriptionPlanDetails } from "@/components/SubscriptionModal";
import { apiRequest, ApiPage } from "@/lib/api";

const toNumber = (value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value) || 0;
    if (value && typeof value === "object" && "$numberDecimal" in value) return Number((value as { $numberDecimal: string }).$numberDecimal) || 0;
    if (value && typeof value === "object" && "toString" in value) return Number(String(value)) || 0;
    return 0;
};

// --- Animation Variants ---
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function SubscriptionPage() {
    const { t, language } = useTranslation();
    const isDe = language === "DE";
    const [isAnnual, setIsAnnual] = useState(true);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [selectedPlanForModal, setSelectedPlanForModal] = useState<SubscriptionPlanDetails | null>(null);
    const [activeTier, setActiveTier] = useState<string>("Starter");
    const [pricingPlans, setPricingPlans] = useState<Array<SubscriptionPlanDetails & { notIncluded: string[]; isPopular: boolean; icon: typeof Star }>>([]);
    const [plansError, setPlansError] = useState("");

    const loadSubscriptionInfo = () => {
        try {
            const savedTier = localStorage.getItem("user_subscription_tier") || "Starter";
            setActiveTier(savedTier);
        } catch {}
    };

    React.useEffect(() => {
        loadSubscriptionInfo();
        const handleStorage = () => loadSubscriptionInfo();
        window.addEventListener("storage", handleStorage);
        apiRequest<ApiPage<{ _id: string; name: string; description?: string; monthlyPrice: unknown; yearlyPrice?: unknown; features?: string[]; notIncluded?: string[]; popular?: boolean; active?: boolean }>>("/subscription-plans?page=1&limit=20")
            .then((data) => {
                const icons = [Star, Zap, Shield];
                setPlansError("");
                setPricingPlans(data.items.filter((plan) => plan.active !== false).map((plan, index) => ({
                    id: plan._id,
                    name: plan.name,
                    description: plan.description || "",
                    monthlyPrice: toNumber(plan.monthlyPrice),
                    yearlyPrice: toNumber(plan.yearlyPrice),
                    features: plan.features ?? [],
                    notIncluded: plan.notIncluded ?? [],
                    isPopular: Boolean(plan.popular),
                    icon: icons[index % icons.length],
                })));
            })
            .catch((error) => setPlansError(error instanceof Error ? error.message : "Plans could not be loaded."));
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const faqs = t.subscriptionPage.faqs;

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden">

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
                        {/* Trust / Category Badge */}
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide mb-6 shadow-xs"
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span>{isDe ? "Transparente Mitgliedschaftspläne" : "Transparent & Flexible Membership"}</span>
                        </motion.div>

                        {/* Two-Tone Grand Headline with Wavy SVG Underline */}
                        <motion.h1
                            variants={fadeInUp}
                            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]"
                        >
                            {t.subscriptionPage.title}{" "}
                            <span className="text-primary relative inline-block">
                                {isDe ? "Für Jeden Anspruch" : "For Every Ambition"}
                                <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                                </svg>
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-base sm:text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-normal"
                        >
                            {t.subscriptionPage.subtitle}
                        </motion.p>

                        {/* Toggle Switch */}
                        <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4">
                            <span className={cn("text-sm font-semibold transition-colors", !isAnnual ? "text-slate-900 font-bold" : "text-slate-500")}>
                                {t.subscriptionPage.monthly}
                            </span>
                            <button
                                onClick={() => setIsAnnual(!isAnnual)}
                                className="relative w-16 h-8 rounded-full bg-slate-200 flex items-center p-1 cursor-pointer transition-colors"
                                style={{ backgroundColor: isAnnual ? '#1eb9c7' : '#e2e8f0' }}
                            >
                                <motion.div
                                    className="w-6 h-6 bg-white rounded-full shadow-sm"
                                    animate={{ x: isAnnual ? 32 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </button>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-sm font-semibold transition-colors", isAnnual ? "text-slate-900 font-bold" : "text-slate-500")}>
                                    {t.subscriptionPage.yearly}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                                    {t.subscriptionPage.savePercent}
                                </span>
                            </div>
                        </motion.div>

                    </motion.div>
                </Container>
            </section>

            {/* --- 2. Pricing Cards Section --- */}
            <section className="pb-24 bg-white relative z-20">
                <Container>
                    {plansError && (
                        <p className="mb-6 text-center text-sm font-bold text-red-600">{plansError}</p>
                    )}
                    <motion.div
                        initial="hidden"
                        animate={pricingPlans.length ? "visible" : "hidden"}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 items-stretch max-w-6xl mx-auto"
                    >
                        {pricingPlans.map((plan) => (
                            <motion.div
                                key={plan.name}
                                variants={scaleUp}
                                className={cn(
                                    "relative bg-white rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg flex flex-col justify-between",
                                    plan.isPopular
                                        ? "border-primary shadow-md shadow-primary/10 md:-translate-y-2"
                                        : "border-slate-200/80 shadow-2xs"
                                )}
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3.5 rounded-full shadow-sm border border-primary/20">
                                            {t.subscriptionPage.popularBadge}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                                    <plan.icon className={cn("w-6 h-6", plan.isPopular ? "text-primary" : "text-slate-400")} />
                                </div>

                                <p className="text-slate-500 text-sm mb-6 h-10">{plan.description}</p>

                                <div className="mb-8">
                                    <div className="flex items-end gap-1">
                                        <span className="text-4xl font-black text-slate-900">
                                            CHF {isAnnual ? plan.yearlyPrice : plan.monthlyPrice}
                                        </span>
                                        <span className="text-slate-500 font-medium mb-1">
                                            /{isAnnual ? 'yr' : 'mo'}
                                        </span>
                                    </div>
                                </div>

                                {activeTier === plan.name ? (
                                    <div className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 text-center mb-8 flex items-center justify-center gap-1.5">
                                        <Check className="w-4 h-4 text-emerald-600" />
                                        <span>Active Current Plan</span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedPlanForModal({
                                                id: plan.id,
                                                name: plan.name,
                                                monthlyPrice: plan.monthlyPrice,
                                                yearlyPrice: plan.yearlyPrice,
                                                description: plan.description,
                                                features: plan.features,
                                            });
                                        }}
                                        className={cn(
                                            "w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95 mb-8 cursor-pointer",
                                            plan.isPopular
                                                ? "bg-primary hover:bg-primary-hover text-white shadow-primary/25"
                                                : "bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200"
                                        )}
                                    >
                                        {plan.monthlyPrice === 0 ? "Select Free Plan" : `Subscribe to ${plan.name}`}
                                    </button>
                                )}

                                <div className="space-y-4">
                                    <p className="text-sm font-bold text-slate-900">{t.subscriptionPage.featureIncluded}:</p>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                        {plan.notIncluded.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                                                <X className="w-5 h-5 text-slate-300 shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </Container>
            </section>

            {/* --- 4. FAQ Section --- */}
            <section className="py-24 bg-white">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 mb-6">
                                <HelpCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t.faqPage.badge}</h2>
                            <p className="text-lg text-slate-600">{t.faqPage.subtitle}</p>
                        </div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="space-y-4"
                        >
                            {faqs.map((faq, idx) => {
                                const isOpen = openFaqIndex === idx;
                                return (
                                    <motion.div
                                        key={idx}
                                        variants={fadeInUp}
                                        className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white hover:border-primary/40 transition-colors shadow-2xs"
                                    >
                                        <button
                                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                            className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                                        >
                                            <span className="text-base sm:text-lg font-bold text-slate-900 pr-6">{faq.question}</span>
                                            <motion.div
                                                animate={{ rotate: isOpen ? 180 : 0 }}
                                                className={cn("shrink-0", isOpen ? "text-primary" : "text-slate-400")}
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
                            })}
                        </motion.div>
                    </div>
                </Container>
            </section>

            {/* --- 5. CTA Section --- */}
            <CTASection />

            {/* Subscription Checkout Modal */}
            <SubscriptionModal
                isOpen={!!selectedPlanForModal}
                plan={selectedPlanForModal}
                isAnnual={isAnnual}
                onClose={() => setSelectedPlanForModal(null)}
                onSuccess={(tier) => {
                    setActiveTier(tier);
                    setSelectedPlanForModal(null);
                }}
            />
        </div>
    );
}
