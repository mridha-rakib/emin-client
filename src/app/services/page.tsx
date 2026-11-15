"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Search, Sparkles, SlidersHorizontal, Info, Tag } from 'lucide-react';
import { CTASection } from '@/sections/CTASection';
import { Container } from '@/components/Container';
import { MAIN_CATEGORIES } from '@/data/categoriesData';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/context/LanguageContext';
import { BookServiceModal } from '@/components/BookServiceModal';
import { apiRequest, ApiPage } from '@/lib/api';
import { expandSearchTerms, matchesSearch, resolveCategoryKey } from '@/lib/service-search';
import { PaginationControls } from '@/components/PaginationControls';

const SERVICES_PER_PAGE = 9;

const toNumber = (value: unknown, fallback = 0) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    if (value && typeof value === 'object' && '$numberDecimal' in value) {
        const parsed = Number((value as { $numberDecimal: string }).$numberDecimal);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
};

type ServiceApiItem = {
    _id?: string;
    title?: string;
    category?: string;
    description?: string;
    providers?: number;
    price?: unknown;
    images?: string[];
    image?: string;
    providerId?: string;
    providerName?: string;
};

type ServiceView = {
    id: string;
    title: string;
    category: string;
    categoryKey?: string;
    description?: string;
    serviceType: string;
    providers: number;
    priceCHF: number;
    price: number;
    image: string;
    providerId?: string;
    providerName?: string;
};

type CategoryOption = { key: string; label: string };

// --- Animations ---
const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

// --- Components ---

const SearchSection = ({ term, onChange, onSubmit }: { term: string; onChange: (term: string) => void; onSubmit: () => void }) => {
    const { t } = useTranslation();

    return (
        <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 border-b border-slate-100/80">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <Container className="relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/25 shadow-xs">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span>{t.servicesPage.badge}</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                        {t.servicesPage.title}{" "}
                        <span className="text-primary relative inline-block">
                            {t.servicesPage.titleHighlight}
                            <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
                        {t.servicesPage.subtitle}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto text-left"
                >
                    <div className="relative group p-2.5 bg-white shadow-xl shadow-slate-200/50 rounded-2xl sm:rounded-3xl border border-slate-200/90">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder={t.servicesPage.searchPlaceholder}
                                    className="w-full pl-12 pr-4 py-4 outline-none text-slate-700 bg-transparent rounded-xl focus:bg-slate-50/50 transition-all text-sm md:text-base font-medium"
                                    value={term}
                                    onChange={(e) => onChange(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') onSubmit();
                                    }}
                                />
                            </div>
                            <button
                                onClick={onSubmit}
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer text-sm md:text-base shrink-0"
                            >
                                {t.servicesPage.findButton}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
};

const ServiceCard = ({ service, onBook }: { service: ServiceView; onBook?: (service: ServiceView) => void }) => {
    const { t, language } = useTranslation();
    const isDe = language === "DE";

    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col"
        >
            <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                    src={service.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop"}
                    alt={service.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs text-xs font-bold text-slate-900 uppercase tracking-wider border border-slate-100">
                        {service.category}
                    </span>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-1">
                        {service.title}
                    </h3>
                    <div className="text-sm font-extrabold text-[#17b9c1] mb-2">
                        {isDe ? `Ab ${service.priceCHF || 45} CHF/Std.` : `From CHF ${service.priceCHF || 45}/hr`}
                    </div>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-center text-xs font-semibold leading-snug text-slate-600">
                            {service.providers || 15} {t.servicesPage.expertsAvailable}
                        </span>
                    </div>
                    <button
                        onClick={() => onBook && onBook(service)}
                        className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-xs shadow-primary/20 transition-all duration-200 hover:bg-primary/90 cursor-pointer"
                    >
                        {isDe ? "Jetzt Buchen" : "Book Now"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const Sidebar = ({
    categories,
    selectedCategories,
    onToggleCategory,
    onClear
}: {
    categories: CategoryOption[];
    selectedCategories: string[];
    onToggleCategory: (category: string) => void;
    onClear: () => void;
}) => {
    const { t, language } = useTranslation();
    const isDe = language === "DE";

    return (
        <div className="w-full lg:w-80 flex-shrink-0">
            <div className="sticky top-28 space-y-6">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                        <span>{t.servicesPage.filters}</span>
                    </div>
                    {selectedCategories.length > 0 && (
                        <button
                            onClick={onClear}
                            className="text-xs font-bold text-primary hover:text-primary/80 underline underline-offset-4 cursor-pointer"
                        >
                            {t.servicesPage.clearAll}
                        </button>
                    )}
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
                    <h4 className="text-slate-900 font-bold mb-5 flex items-center justify-between text-sm">
                        <span>{t.servicesPage.categoriesTitle}</span>
                        <span className="text-xs text-primary font-semibold">
                            {categories.length} {isDe ? "Kategorien" : "Categories"}
                        </span>
                    </h4>
                    <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                        {categories.map((cat) => {
                            const catName = cat.label;
                            const isSelected = selectedCategories.includes(cat.key);

                            return (
                                <label key={cat.key} className="flex items-center gap-3 cursor-pointer group select-none">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer appearance-none w-5 h-5 rounded-md border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all duration-200 cursor-pointer"
                                            checked={isSelected}
                                            onChange={() => onToggleCategory(cat.key)}
                                        />
                                        <motion.div
                                            initial={false}
                                            animate={isSelected ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                        >
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                    <span className={cn(
                                        "text-xs sm:text-sm font-medium transition-all duration-200 line-clamp-1",
                                        isSelected ? "text-primary font-bold translate-x-0.5" : "text-slate-600 group-hover:text-slate-900"
                                    )}>
                                        {catName}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Swiss Franc Notice Card */}
                <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-xs border border-slate-800">
                    <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-[#17b9c1]" />
                        <h5 className="font-bold text-sm">
                            {isDe ? "Preise in Schweizer Franken (CHF)" : "Prices in Swiss Francs (CHF)"}
                        </h5>
                    </div>
                    <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                        {isDe
                            ? "Alle Stundensätze und Festpreisangebote verstehen sich in CHF mit Treuhandschutz."
                            : "All hourly rates and fixed contracts are guaranteed in CHF with full escrow protection."}
                    </p>
                    <a
                        href={`tel:${t.footer.phone.replace(/[^\d+]/g, "")}`}
                        className="block w-full py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-all border border-white/10 cursor-pointer text-center"
                    >
                        {t.footer.callUs}
                    </a>
                </div>
            </div>
        </div>
    );
};

const categoriesFromParams = (params: URLSearchParams) =>
    params.getAll('category')
        .flatMap((value) => value.split(','))
        .map((value) => resolveCategoryKey(value))
        .filter((key): key is string => Boolean(key));

const ServicesPage = () => {
    const { t, language } = useTranslation();
    const isDe = language === "DE";
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const paramsKey = searchParams.toString();

    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => categoriesFromParams(searchParams));
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') ?? '');
    const [syncedParamsKey, setSyncedParamsKey] = useState(paramsKey);

    // Footer/header links navigate to /services?q=… while this page is already mounted, so re-read the URL when it changes.
    if (paramsKey !== syncedParamsKey) {
        setSyncedParamsKey(paramsKey);
        setSelectedCategories(categoriesFromParams(searchParams));
        setSearchTerm(searchParams.get('q') ?? '');
    }

    const updateUrl = (nextTerm: string, nextCategories: string[]) => {
        const params = new URLSearchParams();
        if (nextTerm.trim()) params.set('q', nextTerm.trim());
        if (nextCategories.length > 0) params.set('category', nextCategories.join(','));
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };
    const [bookingService, setBookingService] = useState<ServiceView | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [services, setServices] = useState<ServiceView[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        let mounted = true;
        apiRequest<ApiPage<ServiceApiItem>>('/services?page=1&limit=100')
            .then((data) => {
                if (!mounted) return;
                setServices(data.items.map((item) => ({
                    id: item._id || "",
                    title: item.title || "Untitled service",
                    category: item.category || "General",
                    categoryKey: resolveCategoryKey(item.category),
                    description: item.description,
                    serviceType: item.category || "General",
                    providers: item.providers ?? 1,
                    priceCHF: toNumber(item.price, 0),
                    price: toNumber(item.price, 0),
                    image: item.images?.[0] || item.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
                    providerId: item.providerId,
                    providerName: item.providerName,
                })));
            })
            .catch(() => setServices([]))
            .finally(() => mounted && setIsLoading(false));
        return () => {
            mounted = false;
        };
    }, []);

    const categoriesList = useMemo<CategoryOption[]>(() => {
        return MAIN_CATEGORIES.map((c) => ({ key: c.key, label: isDe ? c.nameDe : c.nameEn }));
    }, [isDe]);

    const handleToggleCategory = (categoryKey: string) => {
        const next = selectedCategories.includes(categoryKey)
            ? selectedCategories.filter(c => c !== categoryKey)
            : [...selectedCategories, categoryKey];
        setSelectedCategories(next);
        updateUrl(searchTerm, next);
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
        setSearchTerm('');
        updateUrl('', []);
    };

    const filteredServices = useMemo(() => {
        const terms = expandSearchTerms(searchTerm);
        return services.filter(service =>
            (selectedCategories.length === 0 || (service.categoryKey !== undefined && selectedCategories.includes(service.categoryKey))) &&
            matchesSearch([service.title, service.category, service.serviceType, service.description], terms)
        );
    }, [selectedCategories, searchTerm, services]);
    const totalPages = Math.ceil(filteredServices.length / SERVICES_PER_PAGE);
    const paginatedServices = filteredServices.slice(
        (currentPage - 1) * SERVICES_PER_PAGE,
        currentPage * SERVICES_PER_PAGE,
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategories, searchTerm]);

    const activeCategoryLabels = categoriesList.filter((c) => selectedCategories.includes(c.key)).map((c) => c.label);

    return (
        <div className="min-h-screen bg-[#fafbfc]">
            <main>
                <SearchSection
                    term={searchTerm}
                    onChange={setSearchTerm}
                    onSubmit={() => updateUrl(searchTerm, selectedCategories)}
                />

                <div className="pb-32">
                    <Container>
                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                            <Sidebar
                                categories={categoriesList}
                                selectedCategories={selectedCategories}
                                onToggleCategory={handleToggleCategory}
                                onClear={handleClearFilters}
                            />

                            <div className="flex-grow">
                                {(searchTerm.trim() || activeCategoryLabels.length > 0) && !isLoading && (
                                    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                                        <span className="font-semibold">
                                            {isDe ? `${filteredServices.length} Ergebnisse für` : `${filteredServices.length} result${filteredServices.length === 1 ? '' : 's'} for`}
                                        </span>
                                        {searchTerm.trim() && (
                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">&ldquo;{searchTerm.trim()}&rdquo;</span>
                                        )}
                                        {activeCategoryLabels.map((label) => (
                                            <span key={label} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">{label}</span>
                                        ))}
                                        <button onClick={handleClearFilters} className="ml-1 text-xs font-bold text-primary underline underline-offset-4 cursor-pointer">
                                            {t.servicesPage.clearAll}
                                        </button>
                                    </div>
                                )}
                                {isLoading ? (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xs">
                                        <p className="text-slate-500 text-sm font-semibold">Loading services...</p>
                                    </div>
                                ) : filteredServices.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                                        {paginatedServices.map(service => (
                                            <ServiceCard
                                                key={service.id}
                                                service={service}
                                                onBook={(srv) => {
                                                    setBookingService(srv);
                                                    setIsBookingOpen(true);
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-2xs">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                            <Search className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{t.servicesPage.noServicesFound}</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto text-sm">{t.servicesPage.noServicesDesc}</p>
                                    </div>
                                )}
                                <PaginationControls page={currentPage} pages={totalPages} onPageChange={setCurrentPage} isDe={isDe} />
                            </div>
                        </div>
                    </Container>
                </div>

                <CTASection />
            </main>

            {bookingService && (
                <BookServiceModal
                    isOpen={isBookingOpen}
                    onClose={() => setIsBookingOpen(false)}
                    service={bookingService}
                />
            )}
        </div>
    );
};

export default function ServicesRoute() {
    return (
        <Suspense fallback={null}>
            <ServicesPage />
        </Suspense>
    );
}
