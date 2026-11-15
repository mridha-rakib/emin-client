"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { ArrowUpRight, ArrowRight, Star, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

type HomepageCategory = {
  _id: string;
  name: string;
  nameDe?: string;
  image?: string;
  professionalCount?: number;
  priceCHF?: number;
  rating?: number;
  reviewCount?: number;
};

export const ServiceCategories = () => {
  const { t, language } = useTranslation();
  const isDe = language === "DE";
  const [categories, setCategories] = useState<HomepageCategory[]>([]);

  useEffect(() => {
    apiRequest<{ items: HomepageCategory[] }>("/categories/featured")
      .then((data) => setCategories(data.items ?? []))
      .catch(() => setCategories([]));
  }, []);

  return (
    <section className="py-24 sm:py-32 bg-white overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-bold text-xs sm:text-sm uppercase tracking-wider mb-2.5 inline-block">
              {t.categories.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {t.categories.title}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
              {t.categories.subtitle}
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-primary font-bold text-sm sm:text-base hover:text-primary-hover transition-colors group self-start md:self-end shrink-0"
          >
            <span>{isDe ? "Alle Kategorien ansehen" : "Explore All Categories"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid - Human-Crafted Modern Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {categories.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-4 flex min-h-[180px] items-center justify-center rounded-3xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-400">
              {isDe ? "Noch keine hervorgehobenen Kategorien." : "No featured categories yet."}
            </div>
          )}
          {categories.map((category) => {
            const displayName = isDe && category.nameDe ? category.nameDe : category.name;
            const priceLabel = isDe
              ? `Ab ${category.priceCHF || 0} CHF/Std.`
              : `From CHF ${category.priceCHF || 0}/hr`;
            const rating = category.rating ? `${category.rating} (${category.reviewCount || 0}+)` : "";

            return (
              <Link
                href={`/services?category=${encodeURIComponent(category.name)}`}
                key={category._id}
                className="block group"
              >
                <div className="relative h-[420px] rounded-3xl overflow-hidden bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 border border-slate-200/80 group-hover:border-primary/40 flex flex-col justify-between p-6 sm:p-7">
                  {category.image && (
                  <Image
                    src={category.image}
                    alt={displayName}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  )}

                  {/* Rich Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20 group-hover:from-slate-950/85 transition-colors" />

                  {/* Top Floating Badge with CHF */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs font-bold shadow-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      {priceLabel}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <ArrowUpRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  {/* Bottom Card Content */}
                  <div className="relative z-10 space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                      {displayName}
                    </h3>
                    <div className="flex items-center justify-between pt-1 border-t border-white/15 text-xs font-semibold text-slate-300">
                      <span>{category.professionalCount || 0}+ {t.categories.professionals}</span>
                      {rating && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current text-amber-400" />
                        {rating}
                      </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
