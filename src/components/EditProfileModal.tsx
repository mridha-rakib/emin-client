"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { useTranslation } from "@/context/LanguageContext";
import { useAvatarUpload } from "@/lib/use-avatar-upload";
import { isStoredUpload } from "@/lib/utils";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        name: string;
        profession: string;
        bio: string;
        location: string;
        avatar: string;
    };
    onSave: (newData: EditProfileModalProps["data"]) => void | Promise<unknown>;
}

export function EditProfileModal({ isOpen, onClose, data, onSave }: EditProfileModalProps) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState(data);
    const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const previewUrlRef = useRef<string | null>(null);
    const { upload: uploadAvatar, isUploading, error: uploadError } = useAvatarUpload();

    const clearPreview = () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
    };

    useEffect(() => {
        if (isOpen) {
            clearPreview();
            setPendingAvatar(null);
            setSaveError("");
            setFormData(data);
        }
        // Only reset when the modal opens; parents rebuild `data` on every render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => clearPreview, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (file) {
            clearPreview();
            const previewUrl = URL.createObjectURL(file);
            previewUrlRef.current = previewUrl;
            setPendingAvatar(file);
            setFormData(prev => ({ ...prev, avatar: previewUrl }));
        }
    };

    const initials = (formData.name || "U")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "U";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;
        setSaveError("");
        setIsSaving(true);
        try {
            let avatar = formData.avatar;
            if (pendingAvatar) {
                const uploadedUrl = await uploadAvatar(pendingAvatar);
                if (!uploadedUrl) return;
                avatar = uploadedUrl;
                setPendingAvatar(null);
                clearPreview();
            }
            await onSave({ ...formData, avatar });
            onClose();
        } catch (error) {
            setSaveError(error instanceof Error ? error.message : "Your profile could not be saved.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="fixed inset-0 m-auto z-[110] w-full max-w-xl h-fit bg-white rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.15)] overflow-hidden"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#17b9c1]/10 to-blue-500/10 -z-10" />
                        
                        <div className="p-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t.editProfileModal.title}</h2>
                                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Update your digital identity</p>
                                </div>
                                <button 
                                    onClick={onClose} 
                                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 cursor-pointer"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <div className="relative w-24 h-24 shrink-0">
                                        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl bg-[#17b9c1]/10">
                                            {formData.avatar ? (
                                                <Image 
                                                    src={formData.avatar} 
                                                    unoptimized={isStoredUpload(formData.avatar)}
                                                    alt="Preview" 
                                                    fill
                                                    sizes="96px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="flex h-full w-full items-center justify-center text-2xl font-black text-[#17b9c1]">
                                                    {initials}
                                                </span>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 p-2 bg-[#17b9c1] text-white rounded-xl shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-all cursor-pointer">
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/jpeg,image/png,image/webp,image/gif,image/avif" 
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                            />
                                            <Camera className="w-4 h-4" />
                                        </label>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-slate-800">{t.editProfileModal.uploadPhoto}</h4>
                                        <p className="text-xs text-slate-400 font-bold leading-relaxed">
                                            Upload a high-quality photo. Max size 10MB.
                                        </p>
                                        {uploadError && (
                                            <p className="text-xs text-red-500 font-bold">{uploadError}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.editProfileModal.fullName}</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#17b9c1]/20 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.customerProfile.title}</label>
                                        <input
                                            type="text"
                                            name="profession"
                                            value={formData.profession}
                                            onChange={handleChange}
                                            placeholder="What do you do?"
                                            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#17b9c1]/20 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.editProfileModal.address}</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="City, Country"
                                        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#17b9c1]/20 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.editProfileModal.bio}</label>
                                    <textarea
                                        rows={4}
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        placeholder="Write a brief overview about yourself..."
                                        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#17b9c1]/20 focus:bg-white outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm resize-none"
                                    />
                                </div>

                                {saveError && (
                                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{saveError}</p>
                                )}

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-1/2 py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all cursor-pointer"
                                    >
                                        {t.editProfileModal.cancel}
                                    </button>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-1/2 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-[#17b9c1]/20 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                                    >
                                        {isUploading ? "Uploading photo…" : isSaving ? "Saving…" : t.editProfileModal.save}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
