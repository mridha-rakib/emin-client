"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle2, DollarSign } from "lucide-react";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

interface BookServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: {
        id: number | string;
        title: string;
        category?: string;
        price?: number;
        image?: string;
        providerName?: string;
    } | null;
    onBookingComplete?: (booking: any) => void;
}

const TIME_SLOTS = [
    "09:00 AM - 11:00 AM",
    "11:30 AM - 01:30 PM",
    "02:00 PM - 04:00 PM",
    "04:30 PM - 06:30 PM",
    "07:00 PM - 09:00 PM"
];

export function BookServiceModal({ isOpen, onClose, service, onBookingComplete }: BookServiceModalProps) {
    const { t } = useTranslation();
    const [date, setDate] = useState("");
    const [time, setTime] = useState(TIME_SLOTS[0]);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setDate(tomorrow.toISOString().split("T")[0]);
            setIsSuccess(false);
        }
    }, [isOpen]);

    if (!service) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const newBooking = {
            serviceName: service.title,
            providerName: service.providerName || "Verified Service Partner",
            providerAvatar: service.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop",
            date: date,
            time: time,
            amount: service.price || 60.00,
            status: "Pending",
            location: address,
            customerName: customerName.trim() || "Customer",
            customerPhone: customerPhone.trim() || "+41 79 000 00 00",
            details: notes,
            createdAt: new Date().toISOString()
        };

        try {
            const result = await apiRequest<{ url: string }>("/payments/checkout", {
                method: "POST",
                body: JSON.stringify({
                    purpose: "SERVICE",
                    serviceId: String(service.id),
                    booking: {
                        customerName: newBooking.customerName,
                        customerPhone: newBooking.customerPhone,
                        date,
                        time,
                        location: address,
                        notes,
                    },
                }),
            });
            window.location.href = result.url;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Booking failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{t.bookServiceModal.title}</h3>
                                        <p className="text-xs text-slate-400">{t.bookServiceModal.subtitle}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {isSuccess ? (
                                <div className="p-10 text-center space-y-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto"
                                    >
                                        <CheckCircle2 className="w-10 h-10" />
                                    </motion.div>
                                    <h4 className="text-2xl font-bold text-slate-800">{t.bookServiceModal.confirmedTitle}</h4>
                                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                        {t.bookServiceModal.confirmedDesc}
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    {/* Selected Service Card Preview */}
                                    <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100/50 flex items-center justify-between">
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                                                {service.category || "Service"}
                                            </span>
                                            <h4 className="text-sm font-bold text-slate-800">{service.title}</h4>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-base font-extrabold text-purple-700">
                                                CHF {service.price || 60}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Date & Time Slot */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-purple-600" />
                                                {t.bookServiceModal.preferredDate}
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-purple-600" />
                                                {t.bookServiceModal.timeSlot}
                                            </label>
                                            <select
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-white"
                                            >
                                                {TIME_SLOTS.map((slot) => (
                                                    <option key={slot} value={slot}>
                                                        {slot}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Customer Name & Phone */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                                <User className="w-3.5 h-3.5 text-purple-600" />
                                                {t.bookServiceModal.fullName}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder={t.bookServiceModal.fullNamePlaceholder}
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                                <Phone className="w-3.5 h-3.5 text-purple-600" />
                                                {t.bookServiceModal.phone}
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder={t.bookServiceModal.phonePlaceholder}
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-purple-600" />
                                            {t.bookServiceModal.address}
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder={t.bookServiceModal.addressPlaceholder}
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                        />
                                    </div>

                                    {/* Special Notes */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700">{t.bookServiceModal.notes}</label>
                                        <textarea
                                            rows={2}
                                            placeholder={t.bookServiceModal.notesPlaceholder}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                                        >
                                            {t.common.cancel}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? "Booking..." : t.bookServiceModal.confirmButton}
                                        </button>
                                    </div>
                                    {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
                                </form>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
