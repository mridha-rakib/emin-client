"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Store,
  Layers,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  Bot
} from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { MarketplaceProduct } from "@/data/aiMarketplaceData";
import { apiRequest, ApiPage } from "@/lib/api";
import { mapProduct, ProductApiItem } from "@/lib/marketplace";
import { cn } from "@/lib/utils";

interface SellerWorkspaceCardProps {
  userRole?: string;
  className?: string;
}

export const SellerWorkspaceCard: React.FC<SellerWorkspaceCardProps> = ({
  userRole = "customer",
  className
}) => {
  const { language } = useTranslation();
  const isDe = language === "DE";

  const [products, setProducts] = useState<MarketplaceProduct[]>([]);

  const loadData = async () => {
    try {
      const sellerUserId = localStorage.getItem("user_id");
      const sellerEmail = localStorage.getItem("user_email") || "";
      if (sellerUserId || sellerEmail) {
        const sellerQuery = [
          sellerUserId ? `sellerUserId=${encodeURIComponent(sellerUserId)}` : "",
          sellerEmail ? `sellerEmail=${encodeURIComponent(sellerEmail)}` : "",
        ].filter(Boolean).join("&");
        const data = await apiRequest<ApiPage<ProductApiItem>>(
          `/products?page=1&limit=100&${sellerQuery}`
        );
        setProducts(data.items.map(mapProduct));
        return;
      }

      setProducts([]);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadData);
    const handleStorage = () => void loadData();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const totalListings = products.length;
  const availableItems = products.filter((p) => p.status === "Available").length;
  const soldItems = products.filter((p) => p.status === "Sold").length;
  const totalValue = products.reduce((acc, curr) => acc + (curr.price || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className={cn(
        "bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100/80 overflow-hidden relative",
        className
      )}
    >
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primary/10 via-purple-500/5 to-transparent rounded-bl-full pointer-events-none -z-0" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center border border-primary/20 text-primary shrink-0 shadow-xs">
            <Store className="w-7 h-7 text-[#17b9c1]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                {isDe ? "Verkäufer- & Marktplatz-Hub" : "Seller & Marketplace Hub"}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                {isDe ? "Aktiv" : "Vendor Active"}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
              {isDe
                ? "Verwalten Sie Ihre gelisteten Produkte, AI-Verhandlungen und Marktplatz-Verkäufe direkt von Ihrem Profil."
                : "Manage listed products, AI negotiation presets, and marketplace sales directly from your profile."}
            </p>
          </div>
        </div>

        {/* Quick Upload Button */}
        <Link
          href="/seller/upload"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#17b9c1] hover:bg-[#14a3aa] text-white font-bold text-xs md:text-sm shadow-md shadow-[#17b9c1]/20 transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isDe ? "Produkt hochladen (KI)" : "Upload Product (AI)"}</span>
        </Link>
      </div>

      {/* 3 Metric Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">
              {isDe ? "Gelistete Artikel" : "Total Listings"}
            </span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            {totalListings}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {isDe ? "Aktuell im Odaboo-Katalog" : "Synchronized in catalog"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700">
              {isDe ? "Verfügbar auf Lager" : "Available in Stock"}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-900 tracking-tight">
            {availableItems}
          </div>
          <p className="text-[11px] text-emerald-600/80 mt-1 font-medium">
            {isDe ? "Bereit zum Kaufen & Verhandeln" : "Ready for AI negotiation"}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100/80 hover:border-purple-200 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-700">
              {isDe ? "Verkaufte Einheiten" : "Units Sold"}
            </span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-purple-900 tracking-tight">
            {soldItems}
          </div>
          <p className="text-[11px] text-purple-600/80 mt-1 font-medium">
            {isDe ? "Erfolgreich abgeschlossen" : "Delivered & completed"}
          </p>
        </div>
      </div>

      {/* Recent Listings Preview Carousel / Mini List */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            {isDe ? "Kürzlich gelistete Artikel" : "Your Active Storefront Products"}
          </h3>
          <Link
            href="/seller/products"
            className="text-xs font-bold text-[#17b9c1] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isDe ? "Alle im Dashboard ansehen" : "View all in Dashboard"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-primary/30 transition-all group"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200/80 text-slate-700">
                    {item.category}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded",
                      item.status === "Available"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    )}
                  >
                    {item.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 truncate">
                  {item.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-black text-slate-900">
                    CHF {item.price}
                  </span>
                  {item.minNegotiablePrice && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      (Min: CHF {item.minNegotiablePrice})
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer Navigation */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Bot className="w-4 h-4 text-[#17b9c1]" />
          <span>
            {isDe
              ? "ChatGPT Preisverhandlung ist für Ihre aktiven Artikel aktiviert"
              : "ChatGPT Auto-Negotiator is enabled for your active listings"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/marketplace"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            {isDe ? "Marktplatz öffnen" : "View Marketplace"}
          </Link>
          <Link
            href="/seller/products"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span>{isDe ? "Schnittstelle öffnen" : "Open Seller Dashboard"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
