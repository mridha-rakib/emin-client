"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  DollarSign,
  TrendingUp,
  Tag,
  Eye,
  CheckCircle2,
  Clock,
  Archive,
  ArrowUpRight,
  ShieldCheck,
  Star,
  MessageSquare,
  Sliders,
  Filter,
  Store
} from "lucide-react";
import { Container } from "@/components/Container";
import { useTranslation } from "@/context/LanguageContext";
import {
  MarketplaceProduct
} from "@/data/aiMarketplaceData";
import { ProductAIChatModal } from "@/components/ProductAIChatModal";
import { apiRequest, ApiPage } from "@/lib/api";
import { mapProduct, ProductApiItem } from "@/lib/marketplace";
import { isStoredUpload } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useAccountActivity } from "@/lib/use-account-activity";
import { PayoutCard } from "@/components/PayoutCard";

export default function SellerProductsPage() {
  const { t, language } = useTranslation();
  const isDe = language === "DE";
  const userAvatar = useAuthStore((state) => state.userAvatar);

  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [activeFilter, setActiveFilter] = useState<"All" | "Available" | "Sold" | "UnderReview">("All");
  const [selectedProductForChat, setSelectedProductForChat] = useState<MarketplaceProduct | null>(null);
  const activity = useAccountActivity(true);
  const [currentRole, setCurrentRole] = useState<string>("seller");
  const [sellerName, setSellerName] = useState("Seller");
  const [sellerEmail, setSellerEmail] = useState("");

  const loadProducts = async () => {
    try {
      const role = localStorage.getItem("user_role") || "seller";
      setCurrentRole(role);
      const storedName = localStorage.getItem("user_name") || "";
      const storedEmail = localStorage.getItem("user_email") || "";
      setSellerName(storedName || storedEmail || "Seller");
      setSellerEmail(storedEmail);

      const sellerUserId = localStorage.getItem("user_id");
      const sellerQuery = [
        sellerUserId ? `sellerUserId=${encodeURIComponent(sellerUserId)}` : "",
        storedEmail ? `sellerEmail=${encodeURIComponent(storedEmail)}` : "",
      ].filter(Boolean).join("&");
      const sellerParams = sellerQuery ? `&${sellerQuery}` : "";
      const data = await apiRequest<ApiPage<ProductApiItem>>(`/products?page=1&limit=100${sellerParams}`);
      setProducts(data.items.map(mapProduct));
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadProducts);
  }, []);

  const handleToggleStatus = async (id: string) => {
    const current = products.find((p) => p.id === id);
    const nextStatus: MarketplaceProduct["status"] = current?.status === "Available" ? "Sold" : "Available";
    await apiRequest(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ payload: { status: nextStatus === "Sold" ? "SOLD" : "ACTIVE" } }),
    });
    setProducts((items) => items.map((p) => p.id === id ? { ...p, status: nextStatus } : p));
  };

  const handleToggleAiNegotiator = async (id: string) => {
    const current = products.find((p) => p.id === id);
    const allowNegotiation = !current?.chatGptRules.allowNegotiation;
    await apiRequest(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ payload: { allowNegotiation } }),
    });
    setProducts((items) => items.map((p) => p.id === id ? { ...p, chatGptRules: { ...p.chatGptRules, allowNegotiation } } : p));
  };

  // Metrics
  const totalListings = products.length;
  const availableListings = products.filter((p) => p.status === "Available").length;
  const soldListings = products.filter((p) => p.status === "Sold").length;
  const totalPortfolioValue = products.reduce((sum, p) => sum + p.price, 0);

  const filteredProducts = products.filter((p) => {
    if (activeFilter === "All") return true;
    return p.status === activeFilter;
  });
  const sellerInitials = sellerName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "S";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 text-slate-800">
      {/* ── Signature Architectural Grid Hero Section ── */}
      <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 border-b border-slate-100/80 mb-8">
        {/* Architectural grid pattern with radial mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <Container className="relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide mb-6 shadow-xs">
              <Store className="w-4 h-4 text-primary" />
              <span>{isDe ? "Verkäufer-Portal & Bestandsübersicht" : "Seller Portal & Inventory Hub"}</span>
            </div>

            {/* Two-Tone Grand Headline with Wavy SVG Underline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              {isDe ? "Verwalten Sie Ihr" : "Manage Your"}{" "}
              <span className="text-primary relative inline-block">
                {isDe ? "Verkäufer-Portfolio" : "Marketplace Portfolio"}
                <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              {t.seller.portfolioSubtitle}
            </p>
          </div>
        </Container>
      </section>

      <Container>
        {/* Customer Mode Notice Banner if user is currently in Customer mode */}
        {currentRole !== "seller" && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {isDe ? "Sie befinden sich im Verkäufer-Portal (Vorschau)" : "You are currently previewing the Seller Portal"}
                </p>
                <p className="text-xs text-slate-500">
                  {isDe ? "Dieses Dashboard ist nur für Verkäuferkonten verfügbar." : "This dashboard is available only to seller accounts."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/marketplace"
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-amber-200 text-slate-700 font-bold text-xs transition-colors"
              >
                {isDe ? "Zurück zum Marktplatz" : "Back to Marketplace"}
              </Link>
            </div>
          </div>
        )}

        {/* Seller Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 shadow-sm shrink-0 flex items-center justify-center text-primary text-xl sm:text-2xl font-black">
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    unoptimized={isStoredUpload(userAvatar)}
                    alt={sellerName}
                    width={80}
                    height={80}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : sellerInitials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{sellerName}</h1>
                  {activity.verified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.seller.verifiedSeller}
                  </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {activity.rating ? activity.rating.toFixed(1) : "—"} ({activity.reviews} {isDe ? "Bewertungen" : "Reviews"})
                  </span>
                  <span>•</span>
                  <span>{isDe ? "Aktives Verkäuferkonto" : "Active seller account"}</span>
                  <span>•</span>
                  <span className="text-primary font-semibold">{sellerEmail || (isDe ? "Verkäufer" : "Seller")}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/subscription">
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-right cursor-pointer hidden sm:block">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block leading-tight">
                    Subscription Spend
                  </span>
                  <span className="text-xs font-black text-slate-900">
                    CHF {activity.totalSpend.toFixed(2)} • <span className="text-primary font-bold">{activity.planName || (isDe ? "Kein Tarif" : "No plan")}</span>
                  </span>
                </div>
              </Link>
              <Link
                href="/marketplace"
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                {t.seller.viewInMarketplace}
              </Link>
              <Link
                href="/seller/upload"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {t.seller.addNewListing}
              </Link>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t.seller.activeItems}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">{availableListings}</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-0.5" />
                  Live
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t.seller.soldItems}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-700">{soldListings}</span>
                <span className="text-xs font-semibold text-purple-600">
                  {isDe ? "Abgeschlossen" : "Completed"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t.seller.portfolioValue}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">CHF {totalPortfolioValue.toLocaleString()}</span>
                <span className="text-xs font-semibold text-slate-400">CHF</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {t.seller.autoNegotiatorActive}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-600">
                  {products.filter((p) => p.chatGptRules?.allowNegotiation).length}
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center">
                  <Tag className="w-3 h-3 mr-0.5" />
                  {isDe ? "Aktiviert" : "Active"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <PayoutCard />
        </div>

        {/* Section Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {t.seller.portfolioTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.seller.portfolioSubtitle}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs self-start sm:self-auto">
            {(["All", "Available", "Sold", "UnderReview"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {filter === "All"
                  ? t.seller.allListings
                  : filter === "Available"
                  ? t.marketplace.inStockOnly
                  : filter === "Sold"
                  ? t.seller.sold
                  : t.seller.underReview}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Archive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">
              {t.seller.noListingsFound}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t.seller.noListingsDesc}
            </p>
            <Link
              href="/seller/upload"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              {t.seller.addNewListing}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Product Image Header */}
                <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-sm ${
                        product.status === "Available"
                          ? "bg-emerald-500 text-white"
                          : product.status === "Sold"
                          ? "bg-purple-600 text-white"
                          : "bg-amber-500 text-white"
                      }`}
                    >
                      {product.status === "Available"
                        ? t.marketplace.inStockOnly
                        : product.status === "Sold"
                        ? t.seller.sold
                        : t.seller.underReview}
                    </span>
                  </div>

                  {/* Verified Condition Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs border border-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[11px] font-extrabold text-slate-800">
                      {product.condition}
                    </span>
                  </div>

                  {/* Color & Category pill on bottom */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                      {product.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold">
                      {product.color}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price and Floor Price */}
                    <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          {t.marketplace.sortBy.includes("Preis") ? "Preis" : "Listing Price"}
                        </span>
                        <span className="text-lg font-black text-slate-900">
                          CHF {product.price}
                        </span>
                      </div>
                      <div className="border-l border-slate-200/80 pl-3">
                        <span className="text-[10px] font-bold uppercase text-emerald-600 block">
                          {isDe ? "Mindestangebot" : "Min. Offer Floor"}
                        </span>
                        <span className="text-base font-extrabold text-emerald-700">
                          CHF {product.minNegotiablePrice}
                        </span>
                      </div>
                    </div>

                    {/* Offer Acceptance Toggle */}
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Tag className="w-3.5 h-3.5 text-primary" />
                        <span className="font-semibold">{isDe ? "Käuferangebote:" : "Buyer Offers:"}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleAiNegotiator(product.id)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                          product.chatGptRules?.allowNegotiation
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}
                      >
                        {product.chatGptRules?.allowNegotiation
                          ? isDe ? "Erlaubt" : "Allowed"
                          : isDe ? "Nur Festpreis" : "Fixed Only"}
                      </button>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(product.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        product.status === "Available"
                          ? "border-amber-200 bg-amber-50/70 text-amber-800 hover:bg-amber-100"
                          : "border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100"
                      }`}
                    >
                      {product.status === "Available"
                        ? t.seller.markAsSold
                        : t.seller.markAsAvailable}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedProductForChat(product)}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      title={t.seller.testAiChat}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                      <span>{t.seller.testAiChat}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Live ChatGPT Assistant Modal for Testing */}
        {selectedProductForChat && (
          <ProductAIChatModal
            product={selectedProductForChat}
            onClose={() => setSelectedProductForChat(null)}
          />
        )}
      </Container>
    </div>
  );
}
