"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { CmsHtml } from "@/components/CmsHtml";
import { CTASection } from "@/sections/CTASection";
import { apiRequest } from "@/lib/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

type CmsPage = {
  title?: string;
  content?: { body?: unknown; html?: unknown } | null;
};

function bodyOf(page: CmsPage) {
  const body = page.content?.body ?? page.content?.html;
  return typeof body === "string" && body.trim() ? body : "";
}

export function LegalCmsPage({
  slug,
  title,
  subtitle,
  icon,
  glowClass,
  badgeClass,
  children,
}: {
  slug: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  glowClass: string;
  badgeClass: string;
  children: React.ReactNode;
}) {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiRequest<CmsPage>(`/pages/by-slug/${slug}`)
      .then((page) => {
        if (!cancelled) setHtml(bodyOf(page));
      })
      .catch(() => {
        if (!cancelled) setHtml("");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 pt-24 pb-0">
      <section className="relative bg-white">
        <div className={`pointer-events-none absolute -top-16 left-1/2 h-40 w-[32rem] -translate-x-1/2 rounded-full blur-3xl ${glowClass}`} />
        <Container className="relative z-10 max-w-3xl py-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className={`mb-3 inline-flex items-center justify-center rounded-2xl p-2.5 ${badgeClass}`}>
              {icon}
            </motion.div>
            <motion.h1 variants={fadeInUp} className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              {title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-base leading-relaxed text-slate-500 md:text-lg">
              {subtitle}
            </motion.p>
          </motion.div>
        </Container>
      </section>

      <section className="py-6 md:py-8">
        <Container className="max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-12"
          >
            {loading ? (
              <p className="text-slate-400">Loading…</p>
            ) : html ? (
              <CmsHtml html={html} />
            ) : (
              children
            )}
          </motion.div>
        </Container>
      </section>
      <CTASection />
    </div>
  );
}
