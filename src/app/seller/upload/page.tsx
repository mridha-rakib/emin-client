"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { VerificationModal } from "@/components/VerificationModal";
import { isVerificationRequiredError, useVerification } from "@/lib/use-verification";
import {
  UploadCloud,
  Link2,
  Star,
  X,
  ImagePlus,
  Sparkles,
  Bot,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Tag,
  Palette,
  AlertCircle,
  HelpCircle,
  Eye,
  Sliders,
  Layers,
  FileText,
  Truck
} from "lucide-react";
import { Container } from "@/components/Container";
import { useTranslation } from "@/context/LanguageContext";
import {
  MarketplaceProduct,
  AiPhotoInspection,
  MARKETPLACE_CATEGORIES,
  PRODUCT_COLORS
} from "@/data/aiMarketplaceData";
import { apiRequest } from "@/lib/api";
import { ACCEPTED_IMAGE_TYPES, useImageGallery } from "@/lib/use-image-gallery";
import { conditionToApi, statusToApi } from "@/lib/marketplace";

const MAX_PRODUCT_IMAGES = 10;

export default function SellerUploadPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const isDe = language === "DE";

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [subcategory, setSubcategory] = useState("Smartphones");
  const [condition, setCondition] = useState<MarketplaceProduct["condition"]>("Like New");
  const [color, setColor] = useState("Titanium Gray");
  const [price, setPrice] = useState<number>(450);
  const [minNegotiablePrice, setMinNegotiablePrice] = useState<number>(400);
  const [status, setStatus] = useState<MarketplaceProduct["status"]>("Available");
  const [description, setDescription] = useState("");

  // ChatGPT AI Training Inputs
  const [allowNegotiation, setAllowNegotiation] = useState(true);
  const [shippingTerms, setShippingTerms] = useState(
    isDe
      ? "Kostenloser versicherter DHL-Expressversand innerhalb von 24 Stunden."
      : "Free insured express courier with tracking within 24 hours."
  );
  const [returnPolicy, setReturnPolicy] = useState(
    isDe
      ? "7 Tage Prüffrist mit voller Geld-zurück-Garantie bei Abweichungen."
      : "7 days inspection window with 100% money back guarantee."
  );
  const [customFaq, setCustomFaq] = useState(
    isDe
      ? "Originalverpackung und sämtliches Originalzubehör enthalten. Akku in exzellentem Zustand."
      : "Original packaging and all factory accessories included. Battery health is peak."
  );

  // AI Photo Analysis State
  const gallery = useImageGallery({ max: MAX_PRODUCT_IMAGES, isDe });
  const images = gallery.images;
  const imageError = gallery.error;
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [aiInspection, setAiInspection] = useState<AiPhotoInspection | null>(null);
  const activeImage = images.find((image) => image.id === activeImageId) ?? images[0];

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const { canSell: isVerified, isHydrated, identityStatus } = useVerification();
  const [submitError, setSubmitError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [sellerName, setSellerName] = useState("Seller");
  const [publishStep, setPublishStep] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedName = localStorage.getItem("user_name") || localStorage.getItem("user_email") || "Seller";
      setSellerName(storedName);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const runImageInspection = () => {
    setAiInspection({
      detectedType: subcategory || "Custom Listing",
      detectedCategory: category,
      detectedColor: color,
      qualityScore: Math.floor(Math.random() * 12) + 88,
      angleAdvice: isDe
        ? "Gute Beleuchtung erkannt. Hochauflösende Aufnahme mit klaren Details."
        : "Good lighting detected. High-resolution angle with clear product edges.",
      lightingStatus: "Optimal",
      suggestedTags: [category, subcategory, "Inspected", "Verified"].filter(Boolean)
    });
  };

  const afterImagesAdded = (wasEmpty: boolean, added: boolean) => {
    if (!added) return;
    setSubmitError("");
    if (wasEmpty) runImageInspection();
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    afterImagesAdded(images.length === 0, gallery.addFiles(files));
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    const wasEmpty = images.length === 0;
    const added = gallery.addLink(linkInput);
    if (added) setLinkInput("");
    afterImagesAdded(wasEmpty, added);
  };

  const removeImage = (id: string) => {
    gallery.remove(id);
    if (images.length === 1) setAiInspection(null);
  };

  const makeCover = (id: string) => {
    gallery.makeCover(id);
    setActiveImageId(id);
  };

  const markBroken = gallery.markBroken;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPublishing) return;
    setSubmitError("");

    if (!isVerified) {
      setIsVerificationModalOpen(true);
      return;
    }

    if (images.length === 0) {
      setSubmitError(isDe ? "Bitte fügen Sie mindestens ein Produktfoto hinzu." : "Please add at least one product photo.");
      return;
    }
    if (gallery.hasBroken) {
      setSubmitError(isDe ? "Mindestens ein Bildlink lädt nicht. Bitte entfernen Sie ihn." : "At least one image link does not load. Please remove it before publishing.");
      return;
    }

    setIsPublishing(true);
    try {
      const sellerUserId = localStorage.getItem("user_id");
      if (!sellerUserId) {
        setSubmitError(isDe ? "Bitte melden Sie sich erneut an, bevor Sie ein Produkt veröffentlichen." : "Please sign in again before publishing a product.");
        return;
      }

      const localCount = gallery.localCount;
      if (localCount > 0) {
        setPublishStep(isDe ? `${localCount} Foto(s) werden hochgeladen…` : `Uploading ${localCount} photo${localCount > 1 ? "s" : ""}…`);
      }
      const imageUrls = await gallery.uploadAll("products");
      setPublishStep(isDe ? "Produkt wird gespeichert…" : "Saving product…");

      await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify({
          payload: {
            sellerUserId,
            sellerEmail: localStorage.getItem("user_email") || undefined,
            title: name.trim() || (isDe ? "Neues Angebot" : "New Listing"),
            category,
            subcategory,
            price: String(Number(price) || 100),
            minNegotiablePrice: String(Number(minNegotiablePrice) || Number(price) * 0.9),
            condition: conditionToApi(condition),
            color,
            tags: aiInspection?.suggestedTags ?? [category, subcategory].filter(Boolean),
            images: imageUrls.map((url, index) => ({ url, isPrimary: index === 0, sortOrder: index + 1 })),
            description: description.trim() || (isDe ? "Keine Beschreibung angegeben." : "Detailed description coming soon."),
            sellerName: localStorage.getItem("user_name") || "Seller",
            sellerRating: 0,
            status: statusToApi(status),
            approvalStatus: "APPROVED",
            shippingTerms,
            returnPolicy,
            customFaq,
            allowNegotiation,
            qualityScore: aiInspection?.qualityScore,
            angleAdvice: aiInspection?.angleAdvice,
          },
        }),
      });
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error(error);
      setSubmitError(error instanceof Error ? error.message : (isDe ? "Produkt konnte nicht veröffentlicht werden." : "Product could not be published."));
      if (isVerificationRequiredError(error)) setIsVerificationModalOpen(true);
      return;
    } finally {
      setIsPublishing(false);
      setPublishStep("");
    }

    setIsSubmitted(true);
    setTimeout(() => {
      router.push("/seller/products");
    }, 1200);
  };

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
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{t.seller.uploadBadge}</span>
            </div>

            {/* Two-Tone Grand Headline with Wavy SVG Underline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              {t.seller.uploadTitle}{" "}
              <span className="text-primary relative inline-block">
                {isDe ? "mit KI-Führung" : "With AI Guidance"}
                <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              {t.seller.uploadSubtitle}
            </p>
          </div>
        </Container>
      </section>

      <Container>
        {/* Verification Warning Banner if not verified */}
        {isHydrated && !isVerified && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  {identityStatus === "PENDING"
                    ? (isDe ? "Identität in Prüfung" : "Identity check in review")
                    : (isDe ? "Verifizierung vor dem Veröffentlichen erforderlich" : "Verification Required Before Publishing")}
                </h4>
                <p className="text-xs text-amber-700 font-medium">
                  {identityStatus === "PENDING"
                    ? (isDe
                      ? "Sie können Produkte veröffentlichen, sobald unser Team Ihre Dokumente geprüft hat."
                      : "You can publish products as soon as our team has approved your documents.")
                    : (isDe
                      ? "Nur vollständig verifizierte Verkäufer dürfen Produkte listen: E-Mail, Schweizer Mobilnummer (SMS) und ein geprüfter Ausweis."
                      : "Only fully verified sellers can list products: email, Swiss mobile number (SMS) and an approved ID document.")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsVerificationModalOpen(true)}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
            >
              {isDe ? "Jetzt verifizieren" : "Verify Now"}
            </button>
          </div>
        )}

        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/seller/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.seller.backToPortfolio}
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.seller.verifiedSeller}: {sellerName}
            </span>
          </div>
        </div>

        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-12 border border-emerald-100 shadow-xl text-center max-w-xl mx-auto my-12 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              {t.seller.successTitle}
            </h2>
            <p className="text-slate-600 mt-2 text-sm">
              {t.seller.successDesc}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Photo Upload & AI Scanner (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Photo Upload & AI Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-primary" />
                    {t.seller.productPhotos}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                    {images.length}/{MAX_PRODUCT_IMAGES}
                  </span>
                </div>

                {/* Main Image Preview */}
                {activeImage ? (
                  <div className="relative aspect-video sm:aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
                    <img
                      src={activeImage.previewUrl}
                      alt="Product preview"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {images[0]?.id === activeImage.id && (
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xs border border-slate-100 flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-slate-800">{isDe ? "Titelbild" : "Cover photo"}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video sm:aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-3 text-slate-500 cursor-pointer"
                  >
                    <ImagePlus className="w-10 h-10 text-primary" />
                    <span className="text-sm font-bold text-slate-700">{isDe ? "Produktfotos hinzufügen" : "Add product photos"}</span>
                    <span className="text-xs">{isDe ? "Vom Gerät hochladen oder unten einen Link einfügen" : "Upload from your device or paste a link below"}</span>
                  </button>
                )}

                {/* Thumbnails */}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          activeImage?.id === image.id ? "border-primary ring-2 ring-primary/20" : "border-slate-200 hover:border-slate-300"
                        } ${image.broken ? "border-red-400" : ""}`}
                      >
                        <button type="button" onClick={() => setActiveImageId(image.id)} className="absolute inset-0 cursor-pointer" title={image.file?.name ?? image.previewUrl}>
                          <img
                            src={image.previewUrl}
                            alt={`Product photo ${index + 1}`}
                            onError={() => markBroken(image.id)}
                            className="h-full w-full object-cover"
                          />
                        </button>
                        {image.broken && (
                          <span className="absolute inset-x-0 bottom-0 bg-red-500/90 text-[9px] font-bold text-white text-center py-0.5">
                            {isDe ? "Lädt nicht" : "Not loading"}
                          </span>
                        )}
                        {!image.broken && (
                          <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1 text-[9px] font-bold text-white">
                            {image.file ? (isDe ? "Datei" : "File") : "Link"}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer"
                          title={isDe ? "Entfernen" : "Remove"}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index > 0 && !image.broken && (
                          <button
                            type="button"
                            onClick={() => makeCover(image.id)}
                            className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/60 hover:bg-amber-500 text-white flex items-center justify-center cursor-pointer"
                            title={isDe ? "Als Titelbild verwenden" : "Make cover photo"}
                          >
                            <Star className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPTED_IMAGE_TYPES.join(",")}
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={images.length >= MAX_PRODUCT_IMAGES}
                  className="mt-4 w-full py-2.5 rounded-xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UploadCloud className="w-4 h-4" />
                  {isDe ? "Fotos vom Gerät hochladen (mehrere möglich)" : "Upload photos from device (select multiple)"}
                </button>

                {/* Add by URL */}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    {t.seller.customPhotoUrl}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="url"
                        value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddLink();
                          }
                        }}
                        placeholder={t.seller.urlPlaceholder}
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-slate-700"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      disabled={!linkInput.trim() || images.length >= MAX_PRODUCT_IMAGES}
                      className="px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isDe ? "Hinzufügen" : "Add"}
                    </button>
                  </div>
                </div>

                {imageError && (
                  <p className="mt-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{imageError}</p>
                )}

                {/* AI Inspection Results Box */}
                {aiInspection && (
                <div className="mt-5 rounded-2xl bg-linear-to-br from-indigo-50/70 via-slate-50 to-white p-4 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider">
                      {t.seller.aiInspectionReport}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-indigo-100/60">
                      <span className="text-slate-500">{t.seller.detectedType}:</span>
                      <span className="font-bold text-slate-800">{aiInspection.detectedType}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-indigo-100/60">
                      <span className="text-slate-500">{t.seller.dominantColor}:</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                        {aiInspection.detectedColor}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-indigo-100/60">
                      <span className="text-slate-500">{t.seller.lightingQuality}:</span>
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {aiInspection.lightingStatus}
                      </span>
                    </div>
                    <div className="pt-1">
                      <span className="text-slate-500 block mb-1">
                        {t.seller.angleFeedback}:
                      </span>
                      <p className="text-[11px] text-slate-700 italic bg-white/90 p-2.5 rounded-xl border border-indigo-50">
                        &ldquo;{aiInspection.angleAdvice}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
                )}
              </div>

              {/* Real-Time Status & Inventory Control */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <Layers className="w-5 h-5 text-primary" />
                  {t.seller.inventoryStatus}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(["Available", "Sold", "UnderReview"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        status === st
                          ? st === "Available"
                            ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                            : st === "Sold"
                            ? "bg-purple-600 text-white border-purple-700 shadow-sm"
                            : "bg-amber-500 text-white border-amber-600 shadow-sm"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st === "Available"
                        ? t.marketplace.inStockOnly
                        : st === "Sold"
                        ? t.seller.sold
                        : t.seller.underReview}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Product Details, Pricing, and ChatGPT Training (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Info Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-5 text-lg">
                  <FileText className="w-5 h-5 text-primary" />
                  {t.seller.productDetails}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t.seller.listingTitle}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.seller.listingTitlePlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        {t.seller.category}
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                      >
                        {MARKETPLACE_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-slate-400" />
                        {t.seller.color}
                      </label>
                      <select
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                      >
                        {PRODUCT_COLORS.filter((c) => c !== "All Colors").map((clr) => (
                          <option key={clr} value={clr}>
                            {clr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        {t.seller.condition}
                      </label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value as MarketplaceProduct["condition"])}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                      >
                        <option value="Brand New">{t.marketplace.brandNew}</option>
                        <option value="Like New">{t.marketplace.likeNew}</option>
                        <option value="Refurbished">{t.marketplace.refurbished}</option>
                        <option value="Good">{t.marketplace.good}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        {t.seller.subcategory}
                      </label>
                      <input
                        type="text"
                        value={subcategory}
                        onChange={(e) => setSubcategory(e.target.value)}
                        placeholder={t.seller.subcategoryPlaceholder}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      {t.seller.productDescription}
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t.seller.productDescriptionPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-hidden resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Pricing & Confidential Floor Price Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2 text-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  {t.seller.regularPrice} & {t.seller.floorPrice}
                </h3>
                <p className="text-xs text-slate-500 mb-5">
                  {t.seller.floorPriceHint}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t.seller.regularPrice} *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-slate-400 font-bold text-xs">CHF</span>
                      <input
                        type="number"
                        required
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-14 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base font-bold focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center justify-between">
                      <span>{t.seller.floorPrice}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        {isDe ? "Mindestpreis" : "Floor Price"}
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-emerald-600 font-bold text-xs">CHF</span>
                      <input
                        type="number"
                        required
                        min="1"
                        value={minNegotiablePrice}
                        onChange={(e) => setMinNegotiablePrice(Number(e.target.value))}
                        className="w-full pl-14 pr-4 py-3 rounded-xl bg-emerald-50/50 border border-emerald-300 text-emerald-900 text-base font-bold focus:ring-2 focus:ring-emerald-400/20 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    {isDe ? "Maximaler Verhandlungsspielraum:" : "Maximum Buyer Discount:"}
                  </span>
                  <span className="font-extrabold text-slate-900">
                    ${Math.max(0, price - minNegotiablePrice)} (
                    {price > 0 ? Math.round(((price - minNegotiablePrice) / price) * 100) : 0}%)
                  </span>
                </div>
              </div>

              {/* Shipping, Delivery & Policies Card - Clean Minimal */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        {isDe ? "Versand, Garantie & Richtlinien" : "Shipping, Warranty & Policies"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isDe ? "Klare Bedingungen für reibungslose Transaktionen" : "Clear terms for verified and smooth fulfillment"}
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs font-semibold text-slate-600">
                      {allowNegotiation
                        ? isDe ? "Angebote erlaubt" : "Accept Offers"
                        : isDe ? "Festpreis" : "Fixed Price"}
                    </span>
                    <input
                      type="checkbox"
                      checked={allowNegotiation}
                      onChange={(e) => setAllowNegotiation(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                  </label>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-primary" />
                      {t.seller.shippingTerms}
                    </label>
                    <input
                      type="text"
                      value={shippingTerms}
                      onChange={(e) => setShippingTerms(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {t.seller.returnPolicy}
                    </label>
                    <input
                      type="text"
                      value={returnPolicy}
                      onChange={(e) => setReturnPolicy(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-primary" />
                      {t.seller.customFaq}
                    </label>
                    <textarea
                      rows={2}
                      value={customFaq}
                      onChange={(e) => setCustomFaq(e.target.value)}
                      placeholder="e.g. Battery health is 99%, includes original charger. Lowest floor is firm."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-hidden resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                {submitError && (
                  <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                    {submitError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold text-base shadow-lg shadow-primary/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                >
                  <Sparkles className="w-5 h-5" />
                  {isPublishing ? (publishStep || (isDe ? "Wird veröffentlicht…" : "Publishing…")) : t.seller.publishButton}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Mandatory Verification Modal */}
        <VerificationModal
          isOpen={isVerificationModalOpen}
          level="seller"
          onClose={() => setIsVerificationModalOpen(false)}
        />
      </Container>
    </div>
  );
}
