"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

type ApiUser = {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  profession?: string;
  bio?: string;
  location?: string;
};

export type MyProfile = {
  name: string;
  avatar: string;
  profession: string;
  bio: string;
  location: string;
};

export type MyProfileUpdate = Pick<MyProfile, "name" | "profession" | "bio" | "location">;

const toProfile = (user: ApiUser): MyProfile => ({
  name: [user.firstName, user.lastName].filter(Boolean).join(" ").trim(),
  avatar: user.avatar ?? "",
  profession: user.profession ?? "",
  bio: user.bio ?? "",
  location: user.location ?? "",
});

/** Loads the signed-in user's profile from the API and saves edits back to it. */
export function useMyProfile() {
  const token = useAuthStore((state) => state.token);
  const setAuthProfile = useAuthStore((state) => state.setProfile);
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    apiRequest<ApiUser>("/auth/me")
      .then((user) => {
        if (cancelled) return;
        const loaded = toProfile(user);
        setProfile(loaded);
        setAuthProfile({ name: loaded.name, avatar: loaded.avatar });
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "Could not load your profile.");
      });
    return () => {
      cancelled = true;
    };
  }, [token, setAuthProfile]);

  const save = async (update: MyProfileUpdate) => {
    const user = await apiRequest<ApiUser>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify({
        name: update.name.trim(),
        profession: update.profession,
        bio: update.bio,
        location: update.location,
      }),
    });
    const saved = toProfile(user);
    setProfile(saved);
    setAuthProfile({ name: saved.name, avatar: saved.avatar });
    return saved;
  };

  return { profile, save, loadError, isSignedIn: Boolean(token) };
}
