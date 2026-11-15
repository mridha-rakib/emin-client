"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    Lock,
    LogOut,
    ChevronRight,
    CheckCircle2,
    Edit2,
    Save,
    Briefcase,
    Eye,
    EyeOff,
    X,
    ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/Container";
import { cn, isStoredUpload } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { VerificationModal } from "@/components/VerificationModal";
import { IdentityStatusCard } from "@/components/IdentityStatusCard";
import { useAuthStore } from "@/store/auth-store";
import { apiRequest } from "@/lib/api";

interface ProviderProfile {
    name: string;
    businessName: string;
    email: string;
    phone: string;
    location: string;
    avatar: string;
    verified: boolean;
}

const INITIAL_PROFILE: ProviderProfile = {
    name: "Marco Rossi",
    businessName: "Rossi Handwerk & Montage",
    email: "marco.rossi@odaboo.ch",
    phone: "+41 79 456 78 90",
    location: "Zurich, Switzerland",
    avatar: "",
    verified: true
};

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export default function SettingsProviderPage() {
    const router = useRouter();
    const { t, language } = useTranslation();
    const { userName, userEmail, userPhone, userAvatar, emailVerified, phoneVerified, logout } = useAuthStore();
    const isHydrated = useSyncExternalStore(
        subscribeToHydration,
        getClientHydrationSnapshot,
        getServerHydrationSnapshot,
    );
    const [activeSection, setActiveSection] = useState("profile");
    const [profile, setProfile] = useState(INITIAL_PROFILE);
    const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
    const displayProfile = {
        ...profile,
        name: isHydrated && userName ? userName : profile.name,
        email: isHydrated && userEmail ? userEmail : profile.email,
        phone: isHydrated && userPhone ? userPhone : profile.phone,
        avatar: !isHydrated ? "" : userName ? userAvatar : profile.avatar,
    };
    const initials = (displayProfile.name || "U")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "U";
    const displayEmailVerified = isHydrated && emailVerified;
    const displayPhoneVerified = isHydrated && phoneVerified;

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    const menuItems = [
        { id: "profile", title: t.settingsPage.personalInfo, icon: Briefcase },
        { id: "security", title: t.settingsPage.security, icon: Lock },
    ];

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Menu */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-32">
                            <div className="flex items-center gap-4 mb-8 p-2 bg-slate-50 rounded-2xl border border-slate-50">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-[#17b9c1]/10">
                                        {displayProfile.avatar ? (
                                            <Image
                                                src={displayProfile.avatar}
                                                unoptimized={isStoredUpload(displayProfile.avatar)}
                                                alt={displayProfile.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-full w-full items-center justify-center text-sm font-black text-[#17b9c1]">
                                                {initials}
                                            </span>
                                        )}
                                    </div>
                                    {(displayEmailVerified && displayPhoneVerified) && (
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full p-0.5">
                                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800 leading-tight">{displayProfile.name}</h3>
                                    <p className="text-xs text-slate-400 font-semibold">{displayProfile.businessName}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer",
                                            activeSection === item.id
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4" />
                                            <span>{item.title}</span>
                                        </div>
                                        <ChevronRight className={cn(
                                            "w-4 h-4 transition-transform",
                                            activeSection === item.id ? "rotate-90" : "text-slate-300"
                                        )} />
                                    </button>
                                ))}
                            </div>

                            {/* Verification trigger */}
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-3">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[11px] font-bold text-slate-700">Provider Status</span>
                                        {(displayEmailVerified && displayPhoneVerified) ? (
                                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Verified</span>
                                        ) : (
                                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Unverified</span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-snug">
                                        Swiss & German law requires verified providers.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsVerifyModalOpen(true)}
                                    className="w-full py-2.5 rounded-xl border border-primary/30 text-primary hover:bg-primary/5 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Verify Provider ID</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="mt-3 w-full py-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>{t.nav.logout}</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {activeSection === "profile" && (
                                <ProfileSection 
                                    profile={displayProfile} 
                                    setProfile={setProfile} 
                                    onOpenVerify={() => setIsVerifyModalOpen(true)}
                                    emailVerified={displayEmailVerified}
                                    phoneVerified={displayPhoneVerified}
                                />
                            )}
                            {activeSection === "security" && <SecuritySection />}
                        </AnimatePresence>
                        {activeSection === "profile" && <IdentityStatusCard isDe={language === "DE"} />}
                    </div>

                </div>

                <VerificationModal
                    isOpen={isVerifyModalOpen}
                    level="seller"
                    onClose={() => setIsVerifyModalOpen(false)}
                />
            </Container>
        </div>
    );
}

const ProfileSection = ({ 
    profile, 
    setProfile, 
    onOpenVerify, 
    emailVerified, 
    phoneVerified 
}: { 
    profile: ProviderProfile; 
    setProfile: React.Dispatch<React.SetStateAction<ProviderProfile>>;
    onOpenVerify: () => void;
    emailVerified: boolean;
    phoneVerified: boolean;
}) => {
    const { t } = useTranslation();
    const setAuthProfile = useAuthStore((state) => state.setProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(profile);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setProfile(formData);
        setAuthProfile({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
        });
        if (typeof window !== "undefined") {
            localStorage.setItem("user_name", formData.name);
            localStorage.setItem("user_email", formData.email);
            localStorage.setItem("user_phone", formData.phone);
        }
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-sm"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{t.settingsPage.personalInfo}</h2>
                    <p className="text-slate-500 text-sm font-medium">{t.settingsPage.subtitle}</p>
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => {
                            setFormData(profile);
                            setIsEditing(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span>{t.common.edit}</span>
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setFormData(profile);
                                setIsEditing(false);
                            }}
                            className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{t.common.save}</span>
                        </button>
                    </div>
                )}
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{t.editProfileModal.fullName}</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={!isEditing}
                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Business Name</label>
                        <input
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            disabled={!isEditing}
                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t.customerProfile.email}</label>
                            {emailVerified ? (
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Verified
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onOpenVerify}
                                    className="text-[10px] font-bold text-amber-600 hover:underline"
                                >
                                    Verify Email
                                </button>
                            )}
                        </div>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!isEditing}
                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{t.customerProfile.phone}</label>
                            {phoneVerified ? (
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Verified (+41)
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onOpenVerify}
                                    className="text-[10px] font-bold text-amber-600 hover:underline"
                                >
                                    Verify Phone
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="+41 79 123 45 67"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={!isEditing}
                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{t.customerProfile.address}</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            disabled={!isEditing}
                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

const SecuritySection = () => {
    const { t } = useTranslation();
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (passwords.new !== passwords.confirm) {
            setError("New password and confirmation do not match.");
            return;
        }

        setIsSaving(true);
        try {
            const data = await apiRequest<{ message?: string }>("/auth/change-password", {
                method: "PATCH",
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                }),
            });
            setSuccess(data.message ?? "Password updated successfully.");
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Password update failed.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-sm"
        >
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{t.settingsPage.security}</h2>
                <p className="text-slate-500 text-sm font-medium">{t.settingsPage.changePassword}</p>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-xl">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{t.settingsPage.currentPassword}</label>
                    <div className="relative">
                        <input
                            type={showCurrent ? "text" : "password"}
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            required
                            className="w-full p-4 pr-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{t.settingsPage.newPassword}</label>
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            required
                            className="w-full p-4 pr-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{t.settingsPage.confirmPassword}</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            required
                            className="w-full p-4 pr-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
                {success && <p className="text-sm font-semibold text-emerald-600">{success}</p>}

                <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSaving ? "Saving..." : t.settingsPage.saveChanges}
                </button>
            </form>
        </motion.div>
    );
};
