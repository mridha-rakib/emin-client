"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
    Star, 
    MapPin, 
    ShieldCheck, 
    Award, 
    Clock, 
    CheckCircle2, 
    Edit2, 
    Share2, 
    Camera,
    ArrowUpRight,
    CalendarRange,
    ClipboardList,
    Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { PrimaryButton } from "@/components/PrimaryButton";
import { cn, isStoredUpload } from "@/lib/utils";
import { useTranslation } from "@/context/LanguageContext";
import { EditProfileModal } from "@/components/EditProfileModal";
import { SubscriptionBillingHub } from "@/components/SubscriptionBillingHub";
import { PayoutCard } from "@/components/PayoutCard";
import { useAuthStore } from "@/store/auth-store";
import { useAvatarUpload } from "@/lib/use-avatar-upload";
import { useMyProfile } from "@/lib/use-my-profile";
import { useAccountActivity } from "@/lib/use-account-activity";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

const PROVIDER_DATA = {
    name: "",
    profession: "",
    location: "",
    avatar: "",
    bio: "",
};

export default function ProviderProfilePage() {
    const { t } = useTranslation();
    const [providerData, setProviderData] = React.useState(PROVIDER_DATA);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [shareCopied, setShareCopied] = React.useState(false);
    const userAvatar = useAuthStore((state) => state.userAvatar);
    const userName = useAuthStore((state) => state.userName);
    const isHydrated = useSyncExternalStore(subscribeToHydration, getClientHydrationSnapshot, getServerHydrationSnapshot);
    const { upload: uploadAvatar, isUploading: isAvatarUploading, error: avatarError } = useAvatarUpload();
    const { profile, save: saveProfile, isSignedIn } = useMyProfile();
    const signedIn = isHydrated && isSignedIn;
    const activity = useAccountActivity(signedIn);
    const avatar = !isHydrated ? "" : signedIn ? userAvatar : providerData.avatar;
    const fromProfile = (value: string | undefined, demo: string, placeholder: string) =>
        !signedIn ? demo : profile === null ? "" : value || placeholder;
    const view = {
        name: signedIn ? profile?.name || userName : providerData.name,
        profession: fromProfile(profile?.profession, providerData.profession, "Add your profession"),
        bio: fromProfile(profile?.bio, providerData.bio, "No bio yet. Click Edit Profile to tell customers about yourself."),
        location: fromProfile(profile?.location, providerData.location, "Not set"),
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

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        const avatarUrl = await uploadAvatar(file);
        if (avatarUrl) {
            setProviderData(prev => ({ ...prev, avatar: avatarUrl }));
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
                            <p className="text-sm font-bold text-slate-400 mb-8 max-w-[240px] mx-auto leading-relaxed">
                                {view.profession}
                            </p>
                            
                            <div className="flex items-center justify-center gap-2 mb-10 p-3 bg-slate-50 rounded-2xl border border-slate-50">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={cn("w-4 h-4", i < Math.round(activity.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200")} />
                                    ))}
                                </div>
                                <div className="h-4 w-px bg-slate-200 mx-1" />
                                <span className="text-sm font-black text-slate-800">{activity.rating ? activity.rating.toFixed(1) : "—"}</span>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">({activity.reviews} {t.providerProfile.reviews})</span>
                            </div>

                            <div className="space-y-4">
                                <PrimaryButton 
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base font-bold shadow-xl shadow-[#17b9c1]/20 cursor-pointer"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    {t.providerProfile.editProfile}
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

                        {/* Professional Stats */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-[2.5rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100/80"
                        >
                            <h3 className="text-xs font-black text-[#17b9c1] mb-8 uppercase tracking-[0.2em]">{t.customerProfile.recentActivity}</h3>
                            <div className="space-y-6">
                                <StatItem icon={Award} label={t.customerProfile.memberSince} value={activity.memberSince} color="text-blue-500" />
                                <StatItem icon={CheckCircle2} label={t.providerProfile.jobsCompleted} value={activity.jobsCompleted} color="text-green-500" />
                                <StatItem icon={Clock} label="Services" value={activity.services} color="text-orange-500" />
                                <StatItem icon={MapPin} label={t.customerProfile.address} value={view.location} color="text-[#17b9c1]" />
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
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Vendor Plan & Billing</span>
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

                    {/* Right Column: Details and Subscription Hub */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[2.5rem] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100/80"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-8 bg-[#17b9c1] rounded-full" />
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t.providerProfile.aboutProvider}</h2>
                            </div>
                            <p className="text-slate-500 leading-relaxed text-base">
                                {view.bio}
                            </p>
                        </motion.div>

                        {/* Provider Service & Operations Shortcuts */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.22 }}
                            className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100/80"
                        >
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                        <Briefcase className="w-6 h-6 text-[#17b9c1]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Service Operations</h3>
                                        <p className="text-xs text-slate-400 font-medium">Manage client requests, incoming jobs, and your active catalog</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Link 
                                    href="/manage_services" 
                                    className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-white shadow-2xs text-[#17b9c1]">
                                            <ClipboardList className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">Manage Services</h4>
                                            <p className="text-[11px] text-slate-400 font-medium">Add, edit pricing and skills</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>

                                <Link 
                                    href="/booking-requests" 
                                    className="p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-white shadow-2xs text-[#17b9c1]">
                                            <CalendarRange className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">Booking Requests</h4>
                                            <p className="text-[11px] text-slate-400 font-medium">Schedule & customer orders</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </div>
                        </motion.div>

                        <PayoutCard />

                        {/* Subscription & Total Spend Hub */}
                        <div id="subscription-hub">
                            <SubscriptionBillingHub 
                                userRole="provider" 
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
                onSave={(newData) => signedIn ? saveProfile(newData) : setProviderData(prev => ({ ...prev, ...newData }))}
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
