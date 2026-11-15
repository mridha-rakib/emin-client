"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, MessageCircle, ShieldCheck, Star } from "lucide-react";
import { Container } from "@/components/Container";

const initials = (name: string) =>
    name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";

export default function PublicProfilePage() {
    const searchParams = useSearchParams();
    const name = searchParams.get("name") || "Community Member";
    const role = searchParams.get("role") || "Odaboo User";
    const isProvider = /provider|pro|seller|vendor/i.test(role);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <Container>
                <div className="max-w-3xl mx-auto">
                    <Link href="/feed" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to feed
                    </Link>

                    <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-100 to-purple-100 text-slate-800 flex items-center justify-center text-3xl font-black border border-slate-200">
                                {initials(name)}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <h1 className="text-3xl font-black text-slate-900">{name}</h1>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Verified
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-slate-500">{role}</p>
                                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                    <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        4.9
                                    </span>
                                    <span>{isProvider ? "Service provider" : "Community member"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-2">Profile</h2>
                            <p className="text-slate-600 leading-relaxed">
                                This public profile is connected from the feed. More details will appear here as the user completes their Odaboo profile.
                            </p>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Link href="/messages" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-primary/90">
                                <MessageCircle className="w-4 h-4" />
                                Message
                            </Link>
                            <Link href={isProvider ? "/services" : "/feed"} className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                                {isProvider ? "View services" : "View activity"}
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
