"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Bot,
  Sparkles,
  Star,
  ShieldCheck,
  Tag,
  Palette,
  CheckCircle2,
  DollarSign,
  ArrowUpDown,
  ShoppingBag,
  Plus
} from "lucide-react";
import { Container } from "@/components/Container";
import { useTranslation } from "@/context/LanguageContext";
import {
  MarketplaceProduct,
  MARKETPLACE_CATEGORIES,
  PRODUCT_COLORS
} from "@/data/aiMarketplaceData";
import { ProductAIChatModal } from "@/components/ProductAIChatModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { VerificationModal } from "@/components/VerificationModal";
import { useVerification } from "@/lib/use-verification";
import { useRouter } from "next/navigation";
import { apiRequest, ApiPage } from "@/lib/api";
import { mapProduct, ProductApiItem } from "@/lib/marketplace";
import { PaginationControls } from "@/components/PaginationControls";
import { useAuthStore } from "@/store/auth-store";

const PRODUCTS_PER_PAGE = 9;

export default function MarketplacePage() {
  const { t, language } = useTranslation();
  const isDe = language === "DE";

  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All Colors");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Active Modals
  const [chatProduct, setChatProduct] = useState<MarketplaceProduct | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<MarketplaceProduct | null>(null);
  const [negotiatedPrice, setNegotiatedPrice] = useState<number | undefined>(undefined);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);
  const [pendingPurchase, setPendingPurchase] = useState<{ product: MarketplaceProduct; price?: number } | null>(null);
  const { isSignedIn, canBuy } = useVerification({ refreshOnMount: false });
  const role = useAuthStore((state) => state.role);
  const router = useRouter();

  /** Buyers must have a verified email and Swiss mobile number; no ID document is needed to buy. */
  const startCheckout = (product: MarketplaceProduct, price?: number) => {
    if (!isSignedIn) {
      router.push("/auth/login");
      return;
    }
    if (!canBuy) {
      setPendingPurchase({ product, price });
      return;
    }
    setNegotiatedPrice(price);
    setCheckoutProduct(product);
  };

  const loadProducts = async () => {
    const data = await apiRequest<ApiPage<ProductApiItem>>("/products?page=1&limit=100");
    const publicListings = data.items.filter(
      (item) => (item.status === "ACTIVE" || item.status === "SOLD") && item.approvalStatus !== "REJECTED"
    );
    setProducts(publicListings.map(mapProduct));
  };

  useEffect(() => {
    void Promise.resolve().then(loadProducts).catch(() => setProducts([]));
  }, []);

  // Filter products
  const filteredProducts = products.filter((item) => {
    // Search query matching title, category, tags, description
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchTag && !matchDesc) return false;
    }

    // Category
    if (selectedCategory !== "All" && item.category !== selectedCategory) {
      return false;
    }

    // Color
    if (selectedColor !== "All Colors" && item.color !== selectedColor) {
      return false;
    }

    // Condition
    if (selectedCondition !== "All" && item.condition !== selectedCondition) {
      return false;
    }

    // Max Price
    if (item.price > maxPrice) {
      return false;
    }

    // In-Stock only
    if (inStockOnly && item.status !== "Available") {
      return false;
    }

    return true;
  });
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedColor, selectedCondition, maxPrice, inStockOnly]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* ── Signature Architectural Grid Hero Section ── */}
      <section className="relative pt-28 pb-14 lg:pt-36 lg:pb-16 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 border-b border-slate-100/80">
        {/* Architectural grid pattern with radial mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <Container className="relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold tracking-wide mb-6 shadow-xs">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{t.marketplace.badge}</span>
            </div>

            {/* Two-Tone Grand Headline with Wavy SVG Underline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              {isDe ? "Entdecken Sie Produkte" : "Discover Unique Products"}{" "}
              <span className="text-primary relative inline-block">
                {isDe ? "Für Jeden Bedarf" : "For Every Need"}
                <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed font-normal">
              {t.marketplace.heroSubtitle}
            </p>

            {/* Search Bar & Fast AI Keyword Filter Console */}
            <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-xl shadow-slate-200/50 text-left">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.marketplace.searchPlaceholder}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50/70 border border-slate-100 text-sm font-medium text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {isSignedIn && role === "seller" && (
                  <Link
                    href="/seller/upload"
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.marketplace.sellAnItem}</span>
                  </Link>
                )}
              </div>

              {/* Category Chips Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-100 mt-3 no-scrollbar">
                {MARKETPLACE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primary text-white shadow-xs"
                        : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Content Layout: Filters Sidebar (3 cols) & Products Grid (9 cols) */}
      <div className="pt-10 pb-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  {t.marketplace.filtersAndAttributes}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedColor("All Colors");
                    setSelectedCondition("All");
                    setMaxPrice(3000);
                    setInStockOnly(false);
                    setSearchQuery("");
                  }}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer"
                >
                  {t.marketplace.reset}
                </button>
              </div>

              {/* Color Attributes */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-slate-400" />
                  {t.marketplace.color}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRODUCT_COLORS.map((clr) => (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => setSelectedColor(clr)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                        selectedColor === clr
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {clr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  {t.marketplace.condition}
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                >
                  <option value="All">{t.marketplace.allConditions}</option>
                  <option value="Brand New">{t.marketplace.brandNew}</option>
                  <option value="Like New">{t.marketplace.likeNew}</option>
                  <option value="Refurbished">{t.marketplace.refurbished}</option>
                  <option value="Good">{t.marketplace.good}</option>
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1.5">
                  <span className="uppercase tracking-wider">{t.marketplace.maxPrice}</span>
                  <span className="text-primary font-black">CHF {maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* In-stock toggle */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                  <span>{t.marketplace.inStockOnly}</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-primary rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid (9 cols) */}
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                {filteredProducts.length} {t.marketplace.itemsFound}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-700">
                  {t.marketplace.noProductsFound}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t.marketplace.noProductsDesc}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    {/* Image Header */}
                    <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Status / Sold overlay */}
                      {product.status === "Sold" && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center">
                          <span className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                            {t.marketplace.soldOut}
                          </span>
                        </div>
                      )}

                      {/* Condition & Verification Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-xs border border-slate-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-bold text-slate-800">
                          {isDe ? "Geprüft" : "Verified"}
                        </span>
                      </div>

                      {/* Condition Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold">
                          {product.condition}
                        </span>
                      </div>

                      {/* Category & Color Pill */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                          {product.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-semibold">
                          {product.color}
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Seller Row */}
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                          <span className="flex items-center gap-1 font-semibold text-slate-700 truncate">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {product.sellerName}
                          </span>
                          <span className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {product.sellerRating}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>

                        {/* Description snippet */}
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        {/* Price */}
                        <div className="flex items-baseline justify-between mb-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              {t.productChat.originalPrice}
                            </span>
                            <span className="text-xl font-black text-slate-900">
                              CHF {product.price}
                            </span>
                          </div>

                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            {isDe ? "Treuhand-Schutz" : "Escrow Covered"}
                          </span>
                        </div>

                        {/* Action Buttons: Make Offer & Buy Now */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setChatProduct(product)}
                            className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <DollarSign className="w-3.5 h-3.5 text-primary" />
                            <span>{isDe ? "Angebot machen" : "Make Offer"}</span>
                          </button>

                          <button
                            type="button"
                            disabled={product.status === "Sold"}
                            onClick={() => startCheckout(product)}
                            className="py-2.5 px-2 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white text-xs font-bold transition-all shadow-2xs shadow-primary/20 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{product.status === "Sold" ? t.marketplace.soldOut : t.marketplace.buyNow}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <PaginationControls page={currentPage} pages={totalPages} onPageChange={setCurrentPage} isDe={isDe} />
          </div>
        </div>

        {/* Live ChatGPT Negotiation Modal */}
        {chatProduct && (
          <ProductAIChatModal
            product={chatProduct}
            onClose={() => setChatProduct(null)}
            onProceedToCheckout={(discounted) => {
              setChatProduct(null);
              startCheckout(chatProduct, discounted);
            }}
          />
        )}

        {/* Checkout Modal */}
        {checkoutProduct && (
          <CheckoutModal
            product={checkoutProduct}
            discountedPrice={negotiatedPrice}
            onClose={() => {
              setCheckoutProduct(null);
              setNegotiatedPrice(undefined);
            }}
            onOrderSuccess={(orderId) => {
              setOrderSuccessId(orderId);
              loadProducts().catch(() => setProducts([]));
            }}
          />
        )}

        <VerificationModal
          isOpen={pendingPurchase !== null}
          level="buyer"
          onClose={() => setPendingPurchase(null)}
          onSuccess={() => {
            if (pendingPurchase) {
              setNegotiatedPrice(pendingPurchase.price);
              setCheckoutProduct(pendingPurchase.product);
            }
          }}
        />
        </Container>
      </div>
    </div>
  );
}
