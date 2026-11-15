"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { apiRequest } from "@/lib/api";
import { type ApiUser, useAuthStore } from "@/store/auth-store";

const subscribeToHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

/**
 * Current verification state of the signed-in user. Values are cached in the auth store and
 * re-fetched from /auth/me on mount, so permissions always reflect what the backend enforces.
 */
export function useVerification({ refreshOnMount = true }: { refreshOnMount?: boolean } = {}) {
  const isHydrated = useSyncExternalStore(subscribeToHydration, getClientHydrationSnapshot, getServerHydrationSnapshot);
  const state = useAuthStore();
  const { token, applyUser } = state;

  const refresh = useCallback(async () => {
    if (!token) return null;
    const user = await apiRequest<ApiUser>("/auth/me");
    applyUser(user);
    return user;
  }, [token, applyUser]);

  useEffect(() => {
    if (refreshOnMount && token) {
      refresh().catch(() => undefined);
    }
  }, [refreshOnMount, token, refresh]);

  return {
    isHydrated,
    isSignedIn: isHydrated && Boolean(token),
    emailVerified: isHydrated && state.emailVerified,
    phoneVerified: isHydrated && state.phoneVerified,
    identityStatus: isHydrated ? state.identityStatus : "NOT_SUBMITTED",
    identityRejectionReason: isHydrated ? state.identityRejectionReason : "",
    canBuy: isHydrated && state.canBuy,
    canSell: isHydrated && state.canSell,
    refresh,
  };
}

/** True when an API error means the backend refused the action because verification is missing. */
export const isVerificationRequiredError = (error: unknown) =>
  error instanceof Error && /verif/i.test(error.message);
