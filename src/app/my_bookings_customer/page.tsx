"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
    Search, 
    Calendar, 
    Clock, 
    MapPin, 
    Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { cn, isStoredUpload } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest, ApiPage } from "@/lib/api";

type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

type BookingView = {
    id: string;
    code: string;
    serviceName: string;
    providerName: string;
    providerAvatar: string;
    date: string;
    time: string;
    amount: string;
    status: BookingStatus;
    location: string;
};

type BookingApi = {
    _id: string;
    customerId?: string;
    customerEmail?: string;
    serviceId?: string;
    serviceTitle?: string;
    scheduledAt?: string;
    location?: string;
    amount?: unknown;
    currency?: string;
    status?: string;
    metadata?: { timeSlot?: string };
};

type ServiceApi = { _id: string; providerName?: string; images?: string[]; image?: string };

const money = (value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value) || 0;
    if (value && typeof value === "object" && "$numberDecimal" in value) return Number((value as { $numberDecimal: string }).$numberDecimal) || 0;
    return 0;
};

const statusLabel = (value?: string): BookingStatus => {
    const status = (value || "pending").toLowerCase();
    if (status === "confirmed") return "Confirmed";
    if (status === "completed") return "Completed";
    if (status === "cancelled") return "Cancelled";
    return "Pending";
};

const formatWhen = (value?: string) => {
    if (!value) return { date: "Date not set", time: "" };
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return { date: "Date not set", time: "" };
    return {
        date: date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
        time: date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
    };
};

export default function MyBookingsCustomerPage() {
    const { t } = useTranslation();
    const [allBookings, setAllBookings] = useState<BookingView[]>([]);
    const [activeTab, setActiveTab] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        const email = (localStorage.getItem("user_email") || "").toLowerCase();
        if (!userId && !email) return;
        Promise.all([
            apiRequest<ApiPage<BookingApi>>("/bookings?page=1&limit=100"),
            apiRequest<ApiPage<ServiceApi>>("/services?page=1&limit=100").catch(() => ({ items: [], meta: { page: 1, limit: 100, total: 0, pages: 0 } })),
        ]).then(([bookings, services]) => {
            const byService = new Map(services.items.map((item) => [item._id, item]));
            const mine = bookings.items.filter((item) =>
                (userId && String(item.customerId) === userId) ||
                (email && item.customerEmail?.toLowerCase() === email)
            );
            setAllBookings(mine.map((item) => {
                const service = item.serviceId ? byService.get(String(item.serviceId)) : undefined;
                const when = formatWhen(item.scheduledAt);
                const providerName = service?.providerName || "Service provider";
                return {
                    id: item._id,
                    code: `BK-${item._id.slice(-6).toUpperCase()}`,
                    serviceName: item.serviceTitle || "Service",
                    providerName,
                    providerAvatar: service?.images?.[0] || service?.image || "",
                    date: when.date,
                    time: item.metadata?.timeSlot || when.time,
                    amount: `${item.currency === "USD" ? "$" : "CHF "}${money(item.amount).toFixed(0)}`,
                    status: statusLabel(item.status),
                    location: item.location || "Location not set",
                };
            }));
        }).catch(() => setAllBookings([]));
    }, []);

    const tabs = [
        { key: "All", label: t.bookings.allTab },
        { key: "Pending", label: t.bookings.pendingTab },
        { key: "Confirmed", label: t.bookings.confirmedTab },
        { key: "Completed", label: t.bookings.completedTab }
    ];

    const filteredBookings = allBookings.filter((booking) => {
        const matchesTab = (() => {
            if (activeTab === "All") return true;
            if (activeTab === "Pending") return booking.status === "Pending";
            if (activeTab === "Confirmed") return booking.status === "Confirmed";
            if (activeTab === "Completed") return booking.status === "Completed";
            return true;
        })();

        const q = searchQuery.toLowerCase();
        const matchesSearch = booking.code.toLowerCase().includes(q) ||
                              booking.providerName.toLowerCase().includes(q) ||
                              booking.serviceName.toLowerCase().includes(q);

        return matchesTab && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <Container>
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">{t.bookings.title}</h1>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">{t.bookings.customerSubtitle}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#17b9c1] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by ID or Provider..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-none rounded-2xl text-[14px] font-bold focus:outline-none focus:ring-4 focus:ring-[#17b9c1]/5 focus:bg-white transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-[#17b9c1] hover:bg-[#17b9c1]/5 transition-all cursor-pointer">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 custom-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "px-8 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap cursor-pointer",
                                activeTab === tab.key 
                                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                                    : "bg-slate-50 text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {filteredBookings.length > 0 ? filteredBookings.map((booking, index) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-[#17b9c1]/20 transition-all group relative overflow-hidden"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                    
                                    {/* Service & Provider Info */}
                                    <div className="lg:col-span-5 flex items-center gap-6">
                                        <div className="relative w-24 h-24 shrink-0">
                                            <div className="relative w-full h-full rounded-[2rem] bg-[#17b9c1]/10 overflow-hidden border-4 border-white shadow-md">
                                                {booking.providerAvatar ? (
                                                    <Image
                                                        src={booking.providerAvatar}
                                                        unoptimized={isStoredUpload(booking.providerAvatar)}
                                                        alt={booking.providerName}
                                                        fill
                                                        sizes="96px"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <span className="flex h-full w-full items-center justify-center text-lg font-black text-[#17b9c1]">
                                                        {booking.providerName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "P"}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#17b9c1]">{booking.code}</span>
                                            <h3 className="text-xl font-black text-slate-800 tracking-tight">{booking.serviceName}</h3>
                                            <p className="text-sm font-bold text-slate-400">{t.bookings.provider}: {booking.providerName}</p>
                                        </div>
                                    </div>

                                    {/* Schedule and Location */}
                                    <div className="lg:col-span-4 space-y-2">
                                        <div className="flex items-center gap-2 text-slate-600 text-sm font-bold">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span>{booking.date}</span>
                                            <Clock className="w-4 h-4 text-slate-400 ml-2" />
                                            <span>{booking.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span>{booking.location}</span>
                                        </div>
                                    </div>

                                    {/* Amount and Status */}
                                    <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-6">
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-slate-400 block">{t.bookings.amount}</span>
                                            <span className="text-2xl font-black text-slate-900">{booking.amount}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider",
                                                booking.status === "Confirmed" && "bg-green-50 text-green-600",
                                                booking.status === "Pending" && "bg-yellow-50 text-yellow-600",
                                                booking.status === "Completed" && "bg-blue-50 text-blue-600",
                                                booking.status === "Cancelled" && "bg-red-50 text-red-600"
                                            )}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        )) : (
                            <div className="text-center py-20 bg-slate-50 rounded-[2.5rem]">
                                <p className="text-slate-400 font-bold">{t.bookings.noBookingsFound}</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </Container>
        </div>
    );
}