"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
    Zap, 
    DollarSign, 
    CreditCard, 
    CalendarCheck, 
    Receipt, 
    ArrowUpRight, 
    ShieldCheck, 
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/context/LanguageContext";
import type { AccountActivity, AccountInvoice } from "@/lib/use-account-activity";
import { downloadInvoice } from "@/lib/api";

interface SubscriptionBillingHubProps {
    userRole?: "customer" | "provider";
    userName?: string;
    activity: AccountActivity;
}

const moneyText = (amount: number, currency = "CHF") =>
    `${currency} ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function SubscriptionBillingHub({ userRole = "customer", userName, activity }: SubscriptionBillingHubProps) {
    const { language } = useTranslation();
    const isDe = language === "DE";
    const [selectedInvoice, setSelectedInvoice] = useState<AccountInvoice | null>(null);
    const [downloadError, setDownloadError] = useState("");
    const saveInvoice = async (invoice: AccountInvoice) => {
        setDownloadError("");
        try {
            await downloadInvoice(invoice.recordId, invoice.id);
        } catch (error) {
            setDownloadError(error instanceof Error ? error.message : (isDe ? "Die Rechnung konnte nicht heruntergeladen werden." : "The invoice could not be downloaded."));
        }
    };
    const active = activity.hasSubscription && activity.planStatus === "ACTIVE";
    const invoices = activity.invoices;
    const paidCount = invoices.filter((invoice) => invoice.status.toUpperCase() === "PAID").length;
    const totalSpend = activity.totalSpend;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100/90 shadow-[0_10px_40px_rgba(0,0,0,0.04)] space-y-6"
        >
            {/* Header: Title, Active Badge, and Total Spend Box */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                            {isDe ? "Aktives Abonnement & Ausgaben" : "Your Subscription Status & Total Subscription Spend"}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border flex items-center gap-1 ${active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                            <Zap className="w-3 h-3" />
                            <span>{active ? (isDe ? "Aktiv" : "Active") : (isDe ? "Kein Tarif" : "No plan")}</span>
                        </span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        {active
                            ? `${activity.planName} (${isDe ? "Aktiv" : "Active"})`
                            : (isDe ? "Kein aktives Abonnement" : "No active subscription")}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">
                        {active && activity.nextBillingDate
                            ? `${isDe ? "Nächste Verlängerung am" : "Next renewal on"} ${activity.nextBillingDate}${activity.paymentMethod ? ` ${isDe ? "über" : "via"} ${activity.paymentMethod}` : ""}.`
                            : (isDe ? "Wählen Sie einen Tarif, um ein Abonnement zu starten." : "Choose a plan to start a subscription.")}
                    </p>
                </div>

                {/* Total Spend Highlight Widget */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#17b9c1]/10 flex items-center justify-center text-[#17b9c1] font-black">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                            {isDe ? "Gesamtausgaben" : "Total Subscription Spend"}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                {moneyText(totalSpend)}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-400">CHF Lifetime</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {isDe ? "Zahlungsart" : "Payment Method"}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 truncate block">
                            {activity.paymentMethod || (isDe ? "Nicht hinterlegt" : "Not set")}
                        </span>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
                    <CalendarCheck className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {isDe ? "Abrechnungszyklus" : "Billing Period"}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 truncate block">
                            {!activity.hasSubscription
                                ? "—"
                                : activity.isAnnual
                                ? (isDe ? "Jährlich" : "Yearly")
                                : (isDe ? "Monatlich" : "Monthly")}
                        </span>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {isDe ? "Rechnungen bezahlt" : "Invoices Cleared"}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 truncate block">
                            {paidCount} {isDe ? "bezahlt" : "paid"}{invoices.length ? ` / ${invoices.length}` : ""}
                        </span>
                    </div>
                </div>
            </div>

            {/* Invoices List Table */}
            <div className="pt-2">
                <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-[#17b9c1]" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            {isDe ? "Rechnungshistorie & Quittungen" : "Invoice & Payment History"}
                        </h4>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400 font-medium">
                            {invoices.length} {isDe ? "Einträge" : "Records"}
                        </span>
                        <Link href="/subscription">
                            <span className="text-[11px] font-bold text-[#17b9c1] hover:underline inline-flex items-center gap-1 cursor-pointer">
                                <span>Change Plan</span>
                                <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </Link>
                    </div>
                </div>

                {invoices.length > 0 ? (
                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                                    <th className="py-3 px-4">Invoice ID</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4">Subscription Plan</th>
                                    <th className="py-3 px-4">Amount</th>
                                    <th className="py-3 px-4">Payment</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {invoices.map((inv, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.id}</td>
                                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{inv.date}</td>
                                        <td className="py-3 px-4 font-semibold text-slate-800">{inv.planName}</td>
                                        <td className="py-3 px-4 font-black text-slate-900 whitespace-nowrap">{moneyText(inv.amount, inv.currency)}</td>
                                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{inv.paymentMethod}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedInvoice(inv)}
                                                className="inline-flex items-center gap-1 text-[#17b9c1] hover:underline font-bold text-[11px] cursor-pointer"
                                            >
                                                <Receipt className="w-3 h-3" />
                                                <span>{isDe ? "Ansehen" : "View"}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => void saveInvoice(inv)}
                                                className="ml-3 inline-flex items-center gap-1 text-slate-700 hover:underline font-bold text-[11px] cursor-pointer"
                                            >
                                                <span>{isDe ? "PDF" : "Download"}</span>
                                                <ArrowUpRight className="w-3 h-3" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
                        <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-medium">No invoice records found yet.</p>
                    </div>
                )}
                {downloadError && <p className="mt-3 text-xs font-semibold text-red-600">{downloadError}</p>}
            </div>

            {/* Official Payment Receipt Modal */}
            <AnimatePresence>
                {selectedInvoice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-md rounded-[2rem] p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4"
                        >
                            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <Receipt className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm text-slate-900">Official Payment Receipt</h3>
                                        <span className="text-[10px] font-mono text-slate-400 font-bold">{selectedInvoice.id}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedInvoice(null)}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Billed To:</span>
                                    <span className="font-bold text-slate-900">
                                        {userName || (userRole === "provider" ? (isDe ? "Anbieter" : "Provider") : (isDe ? "Kunde" : "Customer"))}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Plan Tier:</span>
                                    <span className="font-bold text-slate-900">{selectedInvoice.planName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Transaction Ref:</span>
                                    <span className="font-mono text-slate-700 font-medium">{selectedInvoice.txnId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Date Issued:</span>
                                    <span className="text-slate-700 font-medium">{selectedInvoice.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Payment Channel:</span>
                                    <span className="text-slate-700 font-medium">{selectedInvoice.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Status:</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        {selectedInvoice.status || "Paid"}
                                    </span>
                                </div>
                                <div className="pt-2.5 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                                    <span>Total Paid:</span>
                                    <span className="text-[#17b9c1] font-black">{moneyText(selectedInvoice.amount, selectedInvoice.currency)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold justify-center">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>Verified Stripe 256-Bit SSL Encrypted Payment</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => selectedInvoice && void saveInvoice(selectedInvoice)}
                                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all cursor-pointer"
                                >
                                    {isDe ? "PDF herunterladen" : "Download PDF"}
                                </button>
                                <button
                                    onClick={() => setSelectedInvoice(null)}
                                    className="flex-1 py-3 bg-[#17b9c1] hover:bg-[#15a5ad] text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-[#17b9c1]/20 cursor-pointer"
                                >
                                    {isDe ? "Schließen" : "Close Receipt"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
