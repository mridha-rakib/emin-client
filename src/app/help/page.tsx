"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, LifeBuoy, BookOpen, User, CreditCard, Wrench, MessageSquare } from "lucide-react";
import { Container } from "@/components/Container";
import { CTASection } from "@/sections/CTASection";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

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

const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value);

export default function HelpCenterPage() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [account, setAccount] = useState<{ id: string; name: string } | null>(null);
    const [subject, setSubject] = useState("");
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const id = window.localStorage.getItem("user_id") || "";
        if (!isObjectId(id)) return;
        setAccount({ id, name: window.localStorage.getItem("user_name") || "" });
    }, []);

    const helpTopics = [
        {
            title: t.helpPage.topic1Title,
            description: t.helpPage.topic1Desc,
            icon: BookOpen,
            color: "bg-blue-50 text-blue-600",
            href: "/faq"
        },
        {
            title: t.helpPage.topic2Title,
            description: t.helpPage.topic2Desc,
            icon: User,
            color: "bg-purple-50 text-purple-600",
            href: "/faq"
        },
        {
            title: t.helpPage.topic3Title,
            description: t.helpPage.topic3Desc,
            icon: CreditCard,
            color: "bg-emerald-50 text-emerald-600",
            href: "/faq"
        },
        {
            title: t.helpPage.topic4Title,
            description: t.helpPage.topic4Desc,
            icon: Wrench,
            color: "bg-orange-50 text-orange-600",
            href: "/faq"
        },
        {
            title: t.termsPage.title,
            description: t.termsPage.subtitle,
            icon: LifeBuoy,
            color: "bg-cyan-50 text-cyan-600",
            href: "/terms"
        },
        {
            title: t.helpPage.contactUs,
            description: t.helpPage.contactDesc,
            icon: MessageSquare,
            color: "bg-rose-50 text-rose-600",
            href: "#contact-support"
        }
    ];

    const visibleTopics = helpTopics.filter((topic) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return `${topic.title} ${topic.description}`.toLowerCase().includes(query);
    });

    const sendHelp = async (event: React.FormEvent) => {
        event.preventDefault();
        setNotice("");
        setError("");
        if (subject.trim().length < 3 || body.trim().length < 1) {
            setError(t.helpPage.sendError);
            return;
        }
        if (!account && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError(t.helpPage.emailHint);
            return;
        }
        setSending(true);
        try {
            await apiRequest("/support-tickets/help", {
                method: "POST",
                body: JSON.stringify({
                    subject: subject.trim(),
                    message: body.trim(),
                    category: "Help Center",
                    ...(account
                        ? { userId: account.id, name: account.name || "Customer" }
                        : { email: email.trim(), name: email.trim() }),
                }),
            });
            setSubject("");
            setBody("");
            setEmail("");
            setNotice(account ? t.helpPage.sentToMessages : t.helpPage.sentToEmail);
        } catch (sendError) {
            setError(sendError instanceof Error ? sendError.message : t.helpPage.sendError);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden pt-24 pb-0">

            {/* Hero Section */}
            <section className="relative pt-16 pb-20 bg-white">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

                <Container className="relative z-10 text-center max-w-3xl">
                    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                        <motion.div variants={fadeInUp} className="inline-flex items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-2xl mb-6">
                            <LifeBuoy className="w-8 h-8" />
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            {t.helpPage.title}
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
                            {t.helpPage.subtitle}
                        </motion.p>

                        {/* Search Bar */}
                        <motion.div variants={fadeInUp} className="relative max-w-xl mx-auto shadow-lg shadow-blue-900/5 rounded-full">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-14 pr-4 py-4 rounded-full border border-slate-200 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all outline-none"
                                placeholder={t.helpPage.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </motion.div>
                    </motion.div>
                </Container>
            </section>

            {/* Content Section - Topics Grid */}
            <section className="py-16 md:py-24">
                <Container className="max-w-6xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {visibleTopics.map((topic, index) => (
                            <Link href={topic.href} key={index}>
                                <motion.div
                                    variants={fadeInUp}
                                    className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all h-full cursor-pointer group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${topic.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <topic.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{topic.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">
                                        {topic.description}
                                    </p>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                    {visibleTopics.length === 0 && (
                        <p className="mt-8 text-center text-slate-500">{t.helpPage.noTopics}</p>
                    )}
                </Container>
            </section>

            <section id="contact-support" className="pb-16 md:pb-24">
                <Container className="max-w-2xl">
                    <form onSubmit={sendHelp} className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900">{t.helpPage.contactUs}</h2>
                        <p className="mt-2 text-slate-500">{account ? t.helpPage.signedInHint : t.helpPage.emailHint}</p>
                        <label className="mt-6 block text-sm font-semibold text-slate-700">
                            {t.helpPage.subjectLabel}
                            <input
                                value={subject}
                                onChange={(event) => setSubject(event.target.value)}
                                required
                                minLength={3}
                                maxLength={160}
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
                            />
                        </label>
                        {!account && (
                            <label className="mt-4 block text-sm font-semibold text-slate-700">
                                {t.helpPage.emailLabel}
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
                                />
                            </label>
                        )}
                        <label className="mt-4 block text-sm font-semibold text-slate-700">
                            {t.helpPage.messageLabel}
                            <textarea
                                value={body}
                                onChange={(event) => setBody(event.target.value)}
                                required
                                rows={5}
                                maxLength={2000}
                                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-600"
                            />
                        </label>
                        {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
                        {notice && (
                            <p className="mt-4 text-sm font-semibold text-emerald-700">
                                {notice}{" "}
                                {account && (
                                    <Link href="/messages" className="underline">
                                        {t.messagesPage.title}
                                    </Link>
                                )}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={sending}
                            className="mt-6 rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white disabled:opacity-60"
                        >
                            {sending ? t.helpPage.sending : t.helpPage.send}
                        </button>
                    </form>
                </Container>
            </section>

            {/* CTA Section */}
            <CTASection />
        </div>
    );
}
