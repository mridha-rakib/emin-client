"use client";

import { useState } from "react";
import { uploadAvatar } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

const MAX_AVATAR_BYTES = 10 * 1024 * 1024;

export function useAvatarUpload() {
  const setProfile = useAuthStore((state) => state.setProfile);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file: File): Promise<string | null> => {
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return null;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError("Profile photos must be 10 MB or smaller.");
      return null;
    }

    setIsUploading(true);
    try {
      const result = await uploadAvatar(file);
      const avatarUrl = result.user?.avatar || result.url;
      setProfile({ avatar: avatarUrl });
      return avatarUrl;
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Profile photo upload failed.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error };
}
