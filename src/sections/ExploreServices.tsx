"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

type FeaturedService = {
  _id: string;
  title: string;
  category?: string;
  providerName?: string;
  role?: string;
  images?: string[];
  metadata?: { providers?: number };
};

const serviceImage = (service?: FeaturedService) => service?.images?.[0] || "";
const providerCount = (service?: FeaturedService) => Number(service?.metadata?.providers) || 0;

export const ExploreServices = () => {
  const { t, language } = useTranslation();
  const [featured, setFeatured] = useState<FeaturedService[]>([]);

  useEffect(() => {
    apiRequest<{ items: FeaturedService[] }>("/services/featured")
      .then((data) => setFeatured(data.items ?? []))
      .catch(() => setFeatured([]));
  }, []);

  const [main, second, third, fourth] = featured;
  const faces = featured.slice(0, 3);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <SectionTitle
            title={t.exploreServices.title}
            subtitle={t.exploreServices.subtitle}
            centered={false}
            className="mb-0"
          />
          <Link href="/services">
            <PrimaryButton
              variant="outline"
              className="group bg-transparent border-slate-200 text-[#17b9c1] hover:border-[#17b9c1] hover:bg-[#17b9c1] hover:text-white px-8 py-4 transition-all duration-500 cursor-pointer"
            >
              <span className="font-bold tracking-tight">{t.exploreServices.viewAll}</span>
              <ArrowRight className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
            </PrimaryButton>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[650px]">
          {featured.length === 0 && (
            <div className="md:col-span-4 flex min-h-[280px] items-center justify-center rounded-[2.5rem] border border-slate-100 bg-slate-50 text-sm font-bold text-slate-400">
              {language === "DE" ? "Noch keine hervorgehobenen Dienste." : "No featured services yet."}
            </div>
          )}
          {main && (
          <Link href={`/services?category=${encodeURIComponent(main.category || "")}`} className="md:col-span-2 md:row-span-2 block group">
            <motion.div
              className="h-full relative overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100"
            >
              {serviceImage(main) && (
              <Image
                src={serviceImage(main)}
                alt={main.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

              <div className="absolute bottom-0 left-0 p-10 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-block px-4 py-1.5 bg-[#17b9c1] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4 shadow-lg shadow-[#17b9c1]/20"
                >
                  {main.category}
                </motion.span>
                <h3 className="text-4xl font-black text-white mb-3 tracking-tight">{main.providerName || main.title}</h3>
                <p className="mb-4 text-sm font-bold text-slate-200">{main.role || main.title}</p>
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex -space-x-2">
                    {faces.map((person) => (
                      <div key={person._id} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden" title={person.providerName || person.role}>
                        {serviceImage(person) && <img src={serviceImage(person)} alt={person.role || person.title} className="w-full h-full object-cover" />}
                      </div>
                    ))}
                  </div>
                  <p className="text-slate-300 font-bold text-sm">{providerCount(main)}+ {t.exploreServices.prosAvailable}</p>
                </div>
                <PrimaryButton className="px-8 shadow-xl shadow-[#17b9c1]/20">{t.exploreServices.bookNow}</PrimaryButton>
              </div>
            </motion.div>
          </Link>
          )}

          {second && (
          <Link href={`/services?category=${encodeURIComponent(second.category || "")}`} className="md:col-span-2 block group">
            <motion.div
              className="h-full relative overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[300px]"
            >
              {serviceImage(second) && (
              <Image
                src={serviceImage(second)}
                alt={second.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              <div className="absolute bottom-0 left-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{second.role || second.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#17b9c1] animate-pulse" />
                  <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">{providerCount(second)} {t.exploreServices.prosActive}</p>
                </div>
              </div>
            </motion.div>
          </Link>
          )}

          {third && (
          <Link href={`/services?category=${encodeURIComponent(third.category || "")}`} className="block group">
            <motion.div
              className="h-full relative overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[300px]"
            >
              {serviceImage(third) && (
              <Image
                src={serviceImage(third)}
                alt={third.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-xl font-black text-white mb-1 tracking-tight">{third.role || third.title}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{providerCount(third)} {t.exploreServices.activeProviders}</p>
              </div>
            </motion.div>
          </Link>
          )}

          {fourth && (
          <Link href={`/services?category=${encodeURIComponent(fourth.category || "")}`} className="block group">
            <motion.div
              className="h-full relative overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[300px]"
            >
              {serviceImage(fourth) && (
              <Image
                src={serviceImage(fourth)}
                alt={fourth.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-xl font-black text-white mb-1 tracking-tight">{fourth.role || fourth.title}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{providerCount(fourth)} {t.exploreServices.activeProviders}</p>
              </div>
            </motion.div>
          </Link>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center md:hidden"
        >
          <Link href="/services">
            <PrimaryButton className="w-full py-5 rounded-2xl shadow-xl shadow-[#17b9c1]/20">
              {t.exploreServices.viewAll}
            </PrimaryButton>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
};
