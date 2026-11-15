"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
    Search,
    Calendar,
    Clock,
    MapPin,
    Filter,
    User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { PrimaryButton } from "@/components/PrimaryButton";
import { cn, isStoredUpload } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest, ApiPage } from "@/lib/api";

type RequestView = {
    id: string;
    code: string;
    serviceName: string;
    customerName: string;
    customerAvatar: string;
    date: string;
    time: string;
    amount: string;
    status: string;
    location: string;
    details: string;
    payoutNote?: string;
};

type BookingApi = {
    _id: string;
    customerName?: string;
    serviceId?: string;
    serviceTitle?: string;
    scheduledAt?: string;
    location?: string;
    amount?: unknown;
    currency?: string;
    status?: string;
    metadata?: { timeSlot?: string; notes?: string };
};

const money = (value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value) || 0;
    if (value && typeof value === "object" && "$numberDecimal" in value) return Number((value as { $numberDecimal: string }).$numberDecimal) || 0;
    return 0;
};

export default function BookingRequestsProviderPage() {
    const { t } = useTranslation();
    const [allRequests, setAllRequests] = useState<RequestView[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [busyId, setBusyId] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;
        Promise.all([
            apiRequest<ApiPage<BookingApi>>("/bookings?page=1&limit=100"),
            apiRequest<ApiPage<{ _id: string; providerUserId?: string }>>("/services?page=1&limit=100"),
        ]).then(([bookings, services]) => {
            const mine = new Set(services.items.filter((item) => item.providerUserId === userId).map((item) => item._id));
            setAllRequests(bookings.items.filter((item) => item.serviceId && mine.has(String(item.serviceId))).map((item) => {
                const date = item.scheduledAt ? new Date(item.scheduledAt) : null;
                const valid = date && !Number.isNaN(date.getTime());
                return {
                    id: item._id,
                    code: `BK-${item._id.slice(-6).toUpperCase()}`,
                    serviceName: item.serviceTitle || "Service",
                    customerName: item.customerName || "Customer",
                    customerAvatar: "",
                    date: valid ? date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Date not set",
                    time: item.metadata?.timeSlot || (valid ? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : ""),
                    amount: `${item.currency === "USD" ? "$" : "CHF "}${money(item.amount).toFixed(0)}`,
                    status: item.status || "pending",
                    location: item.location || "Location not set",
                    details: item.metadata?.notes || "No extra details.",
                };
            }));
        }).catch(() => setAllRequests([]));
    }, []);

    const updateStatus = async (id: string, status: "confirmed" | "cancelled" | "completed") => {
        setBusyId(id);
        try {
            const updated = await apiRequest<{ payout?: { detail?: string; status?: string } }>(`/bookings/${id}`, { method: "PATCH", body: JSON.stringify({ payload: { status } }) });
            setAllRequests((items) => items.map((item) => item.id === id ? { ...item, status, payoutNote: updated.payout?.detail || item.payoutNote } : item));
        } finally {
            setBusyId("");
        }
    };

    const filteredRequests = allRequests.filter(item =>
        item.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <Container>
                {/* Header  */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">{t.bookings.title}</h1>
                        <p className="text-lg text-slate-400 font-medium leading-relaxed">{t.bookings.providerSubtitle}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#17b9c1] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by Client or ID..."
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

                {/* Requests List */}
                <div className="space-y-8">
                    <AnimatePresence mode="popLayout">
                        {filteredRequests.length === 0 && (
                            <div className="text-center py-20 bg-slate-50 rounded-[2.5rem]">
                                <p className="text-slate-400 font-bold">{t.bookings.noBookingsFound}</p>
                            </div>
                        )}
                        {filteredRequests.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-[#17b9c1]/20 transition-all group relative overflow-hidden"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                                    {/* Client & Service Info */}
                                    <div className="lg:col-span-5 space-y-6">
                                        <div className="flex items-center gap-5">
                                            <div className="relative w-20 h-20 shrink-0">
                                                <div className="relative w-full h-full rounded-[2rem] bg-[#17b9c1]/10 overflow-hidden border-4 border-white shadow-md">
                                                    {item.customerAvatar ? (
                                                        <Image
                                                            src={item.customerAvatar}
                                                            unoptimized={isStoredUpload(item.customerAvatar)}
                                                            alt={item.customerName}
                                                            fill
                                                            sizes="80px"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <span className="flex h-full w-full items-center justify-center text-lg font-black text-[#17b9c1]">
                                                            {item.customerName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "C"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white shadow-lg border border-slate-50 flex items-center justify-center">
                                                    <User className="w-3.5 h-3.5 text-[#17b9c1]" />
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#17b9c1]">{item.code}</span>
                                                <h3 className="text-xl font-black text-slate-800 tracking-tight">{item.customerName}</h3>
                                                <p className="text-xs font-bold text-slate-400">{item.serviceName}</p>
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-500 font-medium leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                            "{item.details}"
                                        </p>
                                    </div>

                                    {/* Schedule & Location */}
                                    <div className="lg:col-span-4 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span>{item.date}</span>
                                                <Clock className="w-4 h-4 text-slate-400 ml-2" />
                                                <span>{item.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span>{item.location}</span>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <span className="text-xs font-bold text-slate-400 block">{t.bookings.amount}</span>
                                            <span className="text-2xl font-black text-slate-900">{item.amount}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="lg:col-span-3 flex flex-col justify-center gap-3">
                                        <PrimaryButton type="button" disabled={busyId === item.id || item.status === "confirmed"} onClick={() => updateStatus(item.id, "confirmed")} className="w-full py-4 rounded-2xl font-bold text-sm shadow-xl shadow-[#17b9c1]/20 cursor-pointer">
                                            {item.status === "confirmed" ? "Accepted" : t.bookings.accept}
                                        </PrimaryButton>
                                        <button type="button" disabled={busyId === item.id || item.status === "cancelled" || item.status === "completed"} onClick={() => updateStatus(item.id, "cancelled")} className="w-full py-4 bg-slate-50 text-slate-500 font-bold text-sm rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all border border-slate-100 cursor-pointer disabled:opacity-60">
                                            {item.status === "cancelled" ? "Rejected" : t.bookings.reject}
                                        </button>
                                        {item.status === "confirmed" && (
                                            <button type="button" disabled={busyId === item.id} onClick={() => updateStatus(item.id, "completed")} className="w-full py-4 bg-slate-900 text-white font-bold text-sm rounded-2xl cursor-pointer disabled:opacity-60">
                                                Mark completed
                                            </button>
                                        )}
                                        {item.status === "completed" && (
                                            <p className="text-center text-xs font-bold text-slate-400">Completed</p>
                                        )}
                                        {item.payoutNote && <p className="text-xs leading-relaxed text-slate-500">{item.payoutNote}</p>}
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </Container>
        </div>
    );
}
