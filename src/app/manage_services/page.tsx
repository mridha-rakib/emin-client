"use client";

import React, { useState, useEffect } from "react";
import { 
    Plus, 
    Search, 
    Trash2, 
    ToggleLeft, 
    ToggleRight, 
    X, 
    Clock, 
    Camera, 
    ImageOff,
    Layers, 
    DollarSign,
    Sparkles,
    CheckCircle2,
    ShieldCheck,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { VerificationModal } from "@/components/VerificationModal";
import { isVerificationRequiredError, useVerification } from "@/lib/use-verification";
import { apiRequest, ApiPage } from "@/lib/api";
import { useImageGallery } from "@/lib/use-image-gallery";
import { ImageGalleryField } from "@/components/ImageGalleryField";

export interface ServiceItem {
    id: string;
    name: string;
    category: string;
    price: number;
    duration: string;
    description: string;
    image: string;
    status: "active" | "inactive";
}

const limitText = (value: string, maxLength: number) => value.trim().slice(0, maxLength);

type ServiceApiItem = {
    _id?: string;
    id?: string;
    providerUserId?: string;
    title?: string;
    name?: string;
    category?: string;
    price?: unknown;
    duration?: string;
    metadata?: { duration?: string };
    description?: string;
    images?: string[];
    image?: string;
    status?: string;
};

const toNumber = (value: unknown, fallback = 0) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    if (value && typeof value === "object" && "$numberDecimal" in value) {
        const parsed = Number((value as { $numberDecimal: string }).$numberDecimal);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
};

const mapService = (item: ServiceApiItem): ServiceItem => ({
    id: item._id || item.id || `service-${Date.now()}`,
    name: item.title || item.name || "Untitled service",
    category: item.category || "General",
    price: toNumber(item.price, 50),
    duration: item.duration || item.metadata?.duration || "1-2 Hours",
    description: item.description || "",
    image: item.images?.[0] || item.image || "",
    status: item.status === "INACTIVE" ? "inactive" : "active",
});

const CATEGORIES = [
    "Trades & Crafts",
    "Education & Tutoring",
    "Gastronomy, Catering & Event",
    "Transport & Moving",
    "Business, IT Topics, Marketing",
    "Sports, Leisure & Care",
    "Design, Photography & Film",
    "Beauty, Styling & Health",
];

const MAX_SERVICE_IMAGES = 8;

export default function ManageServicesPage() {
    const { t, language } = useTranslation();
    const isDe = language === "DE";

    const [services, setServices] = useState<ServiceItem[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const { canSell: isVerified, isHydrated, identityStatus } = useVerification();
    const [createError, setCreateError] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const gallery = useImageGallery({ max: MAX_SERVICE_IMAGES, isDe });

    const [newService, setNewService] = useState({
        name: "",
        category: CATEGORIES[0],
        price: "",
        duration: "1-2 Hours",
        description: "",
    });

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void (async () => {
            try {
                const data = await apiRequest<ApiPage<ServiceApiItem>>("/services?page=1&limit=100");
                const myId = localStorage.getItem("user_id");
                setServices(data.items.filter((item) => myId && item.providerUserId === myId).map(mapService));
            } catch (e) {
                console.error("Error loading services", e);
                setLoadError(e instanceof Error ? e.message : "Could not load your services.");
            } finally {
                setIsLoadingServices(false);
            }
            })();
        }, 0);
        return () => window.clearTimeout(timeoutId);
    }, []);

    const saveAndBroadcastServices = (updated: ServiceItem[]) => {
        setServices(updated);
        window.dispatchEvent(new Event("storage"));
    };

    const toggleStatus = async (id: string) => {
        const current = services.find((service) => service.id === id);
        const nextStatus = current?.status === "active" ? "inactive" : "active";
        const updated: ServiceItem[] = services.map(s =>
            s.id === id ? { ...s, status: nextStatus } : s
        );
        saveAndBroadcastServices(updated);
        await apiRequest(`/services/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ payload: { status: nextStatus === "active" ? "ACTIVE" : "INACTIVE" } }),
        });
    };

    const deleteService = async (id: string) => {
        const updated = services.filter(s => s.id !== id);
        saveAndBroadcastServices(updated);
        await apiRequest(`/services/${id}`, { method: "DELETE" });
    };

    const handleAddNewServiceClick = () => {
        if (!isVerified) {
            setIsVerificationModalOpen(true);
        } else {
            setIsCreateModalOpen(true);
        }
    };

    const handleCreateService = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError("");
        if (gallery.images.length === 0) {
            setCreateError(isDe ? "Bitte fügen Sie mindestens ein Foto hinzu." : "Please add at least one photo.");
            return;
        }
        if (gallery.hasBroken) {
            setCreateError(isDe ? "Mindestens ein Bildlink lädt nicht. Bitte entfernen Sie ihn." : "At least one image link does not load. Please remove it first.");
            return;
        }
        setIsCreating(true);
        let serviceImages: string[];
        try {
            serviceImages = await gallery.uploadAll("services");
        } catch (error) {
            setCreateError(error instanceof Error ? error.message : "Image upload failed");
            setIsCreating(false);
            return;
        }
        const payload = {
            payload: {
                title: limitText(newService.name, 120) || "Untitled service",
                category: limitText(newService.category, 80) || CATEGORIES[0],
                price: String(Number(newService.price) || 50),
                currency: "CHF",
                duration: limitText(newService.duration, 40) || "1-2 Hours",
                description: limitText(newService.description, 1200),
                images: serviceImages,
                providerName: limitText(localStorage.getItem("user_name") || "Provider", 120),
                status: "ACTIVE",
                metadata: { duration: limitText(newService.duration, 40) || "1-2 Hours" },
            },
        };

        try {
            const saved = await apiRequest<ServiceApiItem>("/services", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            const updated = [mapService(saved), ...services];
            saveAndBroadcastServices(updated);

            // Reset
            setNewService({
                name: "",
                category: CATEGORIES[0],
                price: "",
                duration: "1-2 Hours",
                description: "",
            });
            gallery.reset();
            setIsCreateModalOpen(false);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unable to create service";
            setCreateError(message === "request entity too large"
                ? "The service data is too large. Please keep the description shorter."
                : message
            );
            if (isVerificationRequiredError(error)) {
                setIsCreateModalOpen(false);
                setIsVerificationModalOpen(true);
            }
        } finally {
            setIsCreating(false);
        }
    };

    const filteredServices = services.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24">
            <Container>
                {/* Verification Notice Banner if not verified */}
                {isHydrated && !isVerified && (
                    <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-amber-900">
                                    {identityStatus === "PENDING"
                                        ? (isDe ? "Identität in Prüfung" : "Identity check in review")
                                        : (isDe ? "Verifizierung erforderlich" : "Verification Required")}
                                </h4>
                                <p className="text-xs text-amber-700 font-medium">
                                    {identityStatus === "PENDING"
                                        ? (isDe
                                            ? "Sie können Dienstleistungen veröffentlichen, sobald unser Team Ihre Dokumente geprüft hat."
                                            : "You can publish service offers as soon as our team has approved your documents.")
                                        : (isDe
                                            ? "Nur vollständig verifizierte Dienstleister dürfen Angebote veröffentlichen: E-Mail, Schweizer Mobilnummer (SMS) und ein geprüfter Ausweis."
                                            : "Only fully verified service providers can publish offers: email, Swiss mobile number (SMS) and an approved ID document.")}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsVerificationModalOpen(true)}
                            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                        >
                            {isDe ? "Jetzt verifizieren" : "Verify Profile"}
                        </button>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                    <div className="space-y-2.5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17b9c1]/10 text-[#0d7d84] text-xs font-bold uppercase tracking-wider border border-[#17b9c1]/20">
                            <Sparkles className="w-3.5 h-3.5 text-[#17b9c1]" />
                            Provider Portal
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            {t.manageServicesPage.title}
                        </h1>
                        <p className="text-base text-slate-600 font-medium leading-relaxed max-w-xl">
                            {t.manageServicesPage.subtitle}
                        </p>
                    </div>
                    
                    <button 
                        onClick={handleAddNewServiceClick}
                        className="w-full lg:w-fit px-8 bg-[#17b9c1] hover:bg-[#15a5ad] text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-[#17b9c1]/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        {t.manageServicesPage.addNewService}
                    </button>
                </div>

                {/* Search Bar & Stats */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                    <div className="relative group w-full max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#17b9c1] transition-colors" />
                        <input 
                            type="text" 
                            placeholder={t.manageServicesPage.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#17b9c1]/10 focus:border-[#17b9c1] transition-all placeholder:text-slate-400 shadow-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <span className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                            {t.manageServicesPage.totalServices}: <strong className="text-slate-900">{services.length}</strong>
                        </span>
                        <span className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                            {t.manageServicesPage.active}: <strong className="text-emerald-800">{services.filter(s => s.status === "active").length}</strong>
                        </span>
                    </div>
                </div>

                {/* Services List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredServices.length > 0 ? (
                            filteredServices.map((service, index) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.04 }}
                                    key={service.id}
                                    className={cn(
                                        "p-5 md:p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group hover:shadow-md hover:border-slate-200",
                                        service.status === "inactive" && "opacity-60 bg-slate-50/50"
                                    )}
                                >
                                    <div className="flex items-start md:items-center gap-5 w-full sm:w-auto">
                                        {/* Image Box */}
                                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-100 border border-slate-100 shadow-xs flex items-center justify-center">
                                            {service.image ? (
                                                <img
                                                    src={service.image} 
                                                    alt={service.name} 
                                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <ImageOff className="w-6 h-6 text-slate-300" />
                                            )}
                                        </div>

                                        {/* Info Column */}
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#17b9c1]/10 text-[#0d7d84] uppercase tracking-wider">
                                                    {service.category}
                                                </span>
                                                <span className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                                    service.status === "active" 
                                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                                                        : "bg-slate-100 text-slate-500 border border-slate-200"
                                                )}>
                                                    {service.status === "active" ? "Active" : "Inactive"}
                                                </span>
                                            </div>

                                            <h3 className="text-base md:text-lg font-bold text-slate-800 tracking-tight leading-snug">
                                                {service.name}
                                            </h3>

                                            <p className="text-xs md:text-sm text-slate-600 line-clamp-2 leading-relaxed max-w-2xl font-normal">
                                                {service.description}
                                            </p>

                                            {/* Price in CHF */}
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-600 pt-1 flex-wrap">
                                                <span className="text-[#17b9c1] font-black text-sm md:text-base flex items-center gap-1">
                                                    CHF {service.price} / hour
                                                </span>
                                                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                                                <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                    {service.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Controls */}
                                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 sm:pl-6 sm:border-l border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-600 hidden lg:inline">
                                                {service.status === "active" ? "Online" : "Paused"}
                                            </span>
                                            <button 
                                                onClick={() => toggleStatus(service.id)}
                                                className={cn(
                                                    "p-2.5 rounded-2xl transition-all cursor-pointer",
                                                    service.status === "active" 
                                                        ? "text-[#17b9c1] bg-[#17b9c1]/10 hover:bg-[#17b9c1]/20" 
                                                        : "text-slate-400 bg-slate-100 hover:bg-slate-200"
                                                )}
                                                title="Toggle status"
                                            >
                                                {service.status === "active" ? (
                                                    <ToggleRight className="w-6 h-6 text-[#17b9c1]" />
                                                ) : (
                                                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                                                )}
                                            </button>
                                        </div>

                                        <button 
                                            onClick={() => deleteService(service.id)}
                                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all cursor-pointer"
                                            title={t.manageServicesPage.deleteService}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                <p className="text-slate-400 font-bold">
                                    {isLoadingServices
                                        ? (isDe ? "Dienste werden geladen…" : "Loading your services…")
                                        : loadError || t.servicesPage.noServicesFound}
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Create / Add Service Modal */}
                <AnimatePresence>
                    {isCreateModalOpen && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsCreateModalOpen(false)}
                                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 transition-opacity"
                            />

                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto"
                                >
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                                {t.manageServicesPage.addNewService}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-semibold mt-0.5">
                                                Upload photos, category, Swiss Franc pricing, and description
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => setIsCreateModalOpen(false)}
                                            className="p-2.5 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleCreateService} className="space-y-4">
                                        {/* Service Photo Upload & Preview */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                                <span className="flex items-center gap-1.5">
                                                    <Camera className="w-3.5 h-3.5 text-[#17b9c1]" />
                                                    {t.manageServicesPage.photo}
                                                </span>
                                                <span className="text-[11px] text-slate-400 font-normal">
                                                    {isDe ? "Erstes Foto = Titelbild" : "First photo is the cover"}
                                                </span>
                                            </label>

                                            <ImageGalleryField gallery={gallery} isDe={isDe} />
                                        </div>

                                        {/* Service Title */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700">
                                                {t.manageServicesPage.serviceName}
                                            </label>
                                            <input 
                                                required
                                                type="text" 
                                                placeholder={isDe ? "z. B. Maler- & Gipserarbeiten" : "e.g., Interior Painting & Plastering"}
                                                value={newService.name}
                                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#17b9c1]/20 focus:border-[#17b9c1] transition-all"
                                            />
                                        </div>

                                        {/* Category & Pricing in CHF */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                                    <Layers className="w-3.5 h-3.5 text-[#17b9c1]" />
                                                    {t.manageServicesPage.category}
                                                </label>
                                                <select 
                                                    value={newService.category}
                                                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#17b9c1]/20 focus:border-[#17b9c1] transition-all cursor-pointer"
                                                >
                                                    {CATEGORIES.map((cat, i) => (
                                                        <option key={i} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                                    <span>CHF</span>
                                                    {isDe ? "Stundensatz (CHF)" : "Hourly Rate (CHF)"}
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                                        CHF
                                                    </span>
                                                    <input 
                                                        required
                                                        type="number" 
                                                        min="1"
                                                        placeholder="55"
                                                        value={newService.price}
                                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                                        className="w-full pl-14 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#17b9c1]/20 focus:border-[#17b9c1] transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Duration */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-[#17b9c1]" />
                                                {t.manageServicesPage.duration}
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. 1-2 Hours, Half Day"
                                                value={newService.duration}
                                                onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#17b9c1]/20 focus:border-[#17b9c1] transition-all"
                                            />
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700">
                                                {t.manageServicesPage.description}
                                            </label>
                                            <textarea 
                                                rows={3}
                                                maxLength={1200}
                                                placeholder={isDe ? "Beschreiben Sie Ihren Service für Kunden..." : "Detail what is included in this service..."}
                                                value={newService.description}
                                                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#17b9c1]/20 focus:border-[#17b9c1] transition-all"
                                            />
                                        </div>

                                        {createError && (
                                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
                                                {createError}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                                            <button 
                                                type="button" 
                                                onClick={() => setIsCreateModalOpen(false)}
                                                className="px-6 py-3 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
                                            >
                                                {t.common.cancel}
                                            </button>
                                            <button 
                                                type="submit" 
                                                disabled={isCreating}
                                                className="px-8 py-3 bg-[#17b9c1] hover:bg-[#15a5ad] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#17b9c1]/20 transition-all cursor-pointer flex items-center gap-2 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                {isCreating
                                                    ? (gallery.localCount > 0 ? (isDe ? "Fotos werden hochgeladen…" : "Uploading photos…") : (isDe ? "Wird gespeichert…" : "Saving…"))
                                                    : t.manageServicesPage.saveService}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        </>
                    )}
                </AnimatePresence>

                {/* Mandatory Verification Modal */}
                <VerificationModal 
                    isOpen={isVerificationModalOpen}
                    level="seller"
                    onClose={() => setIsVerificationModalOpen(false)}
                    onSuccess={() => setIsCreateModalOpen(true)}
                />
            </Container>
        </div>
    );
}
