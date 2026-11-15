"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { 
    Star, 
    MapPin, 
    ShieldCheck, 
    Calendar, 
    ShoppingBag,
    Edit2,
    Share2,
    Camera,
    CheckCircle2,
    ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { PrimaryButton } from "@/components/PrimaryButton";
import { EditProfileModal } from "@/components/EditProfileModal";
import { SubscriptionBillingHub } from "@/components/SubscriptionBillingHub";
import { useTranslation } from "@/context/LanguageContext";
import { useAuthStore } from "@/store/auth-store";
import { useAvatarUpload } from "@/lib/use-avatar-upload";
import { useMyProfile } from "@/lib/use-my-profile";
import { useAccountActivity } from "@/lib/use-account-activity";
import { isStoredUpload } from "@/lib/utils";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

const INITIAL_CUSTOMER_DATA = {
    name: "",
    profession: "",
    location: "",
    avatar: "",
    bio: "",
};

export default function MyProfileCustomerPage() {
    const { t } = useTranslation();
    const [customerData, setCustomerData] = useState(INITIAL_CUSTOMER_DATA);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);
    const userAvatar = useAuthStore((state) => state.userAvatar);
    const userName = useAuthStore((state) => state.userName);
    const isHydrated = useSyncExternalStore(subscribeToHydration, getClientHydrationSnapshot, getServerHydrationSnapshot);
    const { upload: uploadAvatar, isUploading: isAvatarUploading, error: avatarError } = useAvatarUpload();
    const { profile, save: saveProfile, isSignedIn } = useMyProfile();
    const signedIn = isHydrated && isSignedIn;
    const activity = useAccountActivity(signedIn);
    const avatar = !isHydrated ? "" : signedIn ? userAvatar : customerData.avatar;
    const fromProfile = (value: string | undefined, demo: string, placeholder: string) =>
        !signedIn ? demo : profile === null ? "" : value || placeholder;
    const view = {
        name: signedIn ? profile?.name || userName : customerData.name,
        profession: fromProfile(profile?.profession, customerData.profession, "Customer"),
        bio: fromProfile(profile?.bio, customerData.bio, "No bio yet. Click Edit Profile to add one."),
        location: fromProfile(profile?.location, customerData.location, "Location not set"),
    };
    const editableProfile = signedIn
        ? { name: profile?.name || userName, profession: profile?.profession ?? "", bio: profile?.bio ?? "", location: profile?.location ?? "" }
        : view;
    const initials = (view.name || "U")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "U";

    const handleUpdateProfile = (newData: { name: string; profession: string; bio: string; location: string; avatar: string }) =>
        signedIn ? saveProfile(newData) : setCustomerData(prev => ({ ...prev, ...newData }));

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        const avatarUrl = await uploadAvatar(file);
        if (avatarUrl) {
            setCustomerData(prev => ({ ...prev, avatar: avatarUrl }));
        }
    };

    const handleShareProfile = async () => {
        const url = window.location.href;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `${view.name} on Odaboo`,
                    text: view.bio,
                    url,
                });
                return;
            }
            await navigator.clipboard.writeText(url);
            setShareCopied(true);
            window.setTimeout(() => setShareCopied(false), 1800);
        } catch {
            // Sharing can be cancelled by the user.
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 pt-32 pb-20 relative overflow-hidden">
            {/* Architectural grid pattern with radial mask */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <Container className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Left Column: Profile Card & Stats */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100/80 text-center"
                        >
                            <div className="relative mx-auto w-36 h-36 md:w-44 md:h-44 mb-6">
                                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-xl bg-[#17b9c1]/10">
                                    {avatar ? (
                                        <Image 
                                            src={avatar} 
                                            unoptimized={isStoredUpload(avatar)}
                                            alt={view.name}
                                            fill
                                            sizes="176px"
                                            className={isAvatarUploading ? "object-cover opacity-50" : "object-cover"}
                                        />
                                    ) : (
                                        <span className="flex h-full w-full items-center justify-center text-4xl font-black text-[#17b9c1]">
                                            {initials}
                                        </span>
                                    )}
                                </div>
                                <label className="absolute bottom-3 right-3 p-2.5 bg-[#17b9c1] text-white rounded-2xl shadow-xl border-4 border-white hover:scale-110 active:scale-95 transition-all cursor-pointer">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif" 
                                        onChange={handleImageChange}
                                        disabled={isAvatarUploading}
                                    />
                                    <Camera className={isAvatarUploading ? "w-4 h-4 animate-pulse" : "w-4 h-4"} />
                                </label>
                            </div>
                            {avatarError && (
                                <p className="-mt-3 mb-4 text-xs font-bold text-red-500">{avatarError}</p>
                            )}

                            <div className="flex items-center justify-center gap-2 mb-1.5">
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">{view.name}</h1>
                                {activity.verified && (
                                    <div className="bg-[#17b9c1]/10 p-1 rounded-full">
                                        <ShieldCheck className="w-5 h-5 text-[#17b9c1]" />
                                    </div>
                                )}
                            </div>
                            <p className="text-sm font-bold text-slate-400 mb-3 max-w-[240px] mx-auto leading-relaxed">
                                {view.profession}
                            </p>
                            <div className="flex items-center justify-center gap-1 text-[#17b9c1] mb-8">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-black uppercase tracking-widest">{view.location}</span>
                            </div>
                            
                            <div className="space-y-4">
                                <PrimaryButton 
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-bold shadow-xl shadow-[#17b9c1]/20 cursor-pointer"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {t.customerProfile.editProfile}
                                </PrimaryButton>
                                <button
                                    type="button"
                                    onClick={handleShareProfile}
                                    className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2 border border-slate-100 cursor-pointer"
                                >
                                    <Share2 className="w-4 h-4" />
                                    {shareCopied ? "Copied" : t.feedPage.share}
                                </button>
                            </div>
                        </motion.div>

                        {/* Booking Activity */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100/80"
                        >
                            <h3 className="text-xs font-black text-[#17b9c1] mb-8 uppercase tracking-[0.2em]">{t.customerProfile.recentActivity}</h3>
                            <div className="space-y-6">
                                <StatItem icon={ShoppingBag} label={t.customerProfile.totalBookings} value={activity.totalBookings} color="text-blue-500" />
                                <StatItem icon={CheckCircle2} label={t.bookings.completedTab} value={activity.completedBookings} color="text-green-500" />
                                <StatItem icon={Star} label={t.providerProfile.reviews} value={activity.reviews} color="text-orange-500" />
                                <StatItem icon={Calendar} label={t.customerProfile.memberSince} value={activity.memberSince} color="text-[#17b9c1]" />
                            </div>
                        </motion.div>

                        {/* Membership & Total Spend Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-7 shadow-xl border border-slate-700/50"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Membership & Billing</span>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/20 text-primary border border-primary/30">
                                    {activity.hasSubscription ? activity.planName : "No plan"}
                                </span>
                            </div>

                            <div className="space-y-1 mb-5">
                                <span className="text-xs text-slate-400 font-medium block">Total Subscription Spend</span>
                                <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
                                    <span>CHF {activity.totalSpend.toFixed(2)}</span>
                                    <span className="text-xs text-slate-400 font-medium">CHF</span>
                                </div>
                            </div>

                            <a href="#subscription-hub" className="block">
                                <button className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                                    <span>View Billing & Invoices</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </button>
                            </a>
                        </motion.div>
                    </div>

                    {/* Right Column: Bio and Subscription Hub */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100/80"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-8 bg-[#17b9c1] rounded-full" />
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.editProfileModal.bio}</h2>
                            </div>
                            <p className="text-slate-500 leading-relaxed text-base">
                                {view.bio}
                            </p>
                        </motion.div>

                        {/* Subscription & Total Spend Hub */}
                        <div id="subscription-hub">
                            <SubscriptionBillingHub 
                                userRole="customer" 
                                userName={view.name}
                                activity={activity}
                            />
                        </div>
                    </div>
                </div>
            </Container>

            <EditProfileModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                data={{ ...editableProfile, avatar }}
                onSave={handleUpdateProfile}
            />
        </div>
    );
}

interface StatItemProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
}

const StatItem = ({ icon: Icon, label, value, color }: StatItemProps) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <span className="text-sm font-bold text-slate-500">{label}</span>
        </div>
        <span className="text-sm font-black text-slate-800">{value}</span>
    </div>
);
