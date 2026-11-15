"use client";

import { create } from "zustand";

export type UserRole = "customer" | "provider" | "seller";

export type IdentityStatus = "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";

export type VerificationSummary = {
  email: boolean;
  phone: boolean;
  identity: IdentityStatus;
  identityRejectionReason?: string;
  canBuy: boolean;
  canSell: boolean;
};

export type ApiUser = {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  accountType?: UserRole;
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
  verification?: VerificationSummary;
};

type SessionInput = {
  accessToken: string;
  user?: ApiUser;
  role?: UserRole;
  name?: string;
  phone?: string;
};

type ProfileInput = {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
};

type AuthState = {
  token: string | null;
  role: UserRole;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAvatar: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  identityStatus: IdentityStatus;
  identityRejectionReason: string;
  /** Email + Swiss mobile verified: allowed to buy products. */
  canBuy: boolean;
  /** Email + Swiss mobile + approved identity: allowed to publish products and services. */
  canSell: boolean;
  setSession: (input: SessionInput) => void;
  /** Refreshes profile and verification state from a user object returned by the API. */
  applyUser: (user: ApiUser) => void;
  setRole: (role: UserRole) => void;
  setProfile: (input: ProfileInput) => void;
  logout: () => void;
};

const read = (key: string) =>
  typeof window === "undefined" ? null : window.localStorage.getItem(key);

const write = (key: string, value?: string | null) => {
  if (typeof window === "undefined") return;
  if (value === undefined || value === null || value === "") {
    window.localStorage.removeItem(key);
    return;
  }
  window.localStorage.setItem(key, value);
};

const emitAuthChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage"));
  }
};

const isRole = (value: string | null): value is UserRole =>
  value === "customer" || value === "provider" || value === "seller";

const IDENTITY_STATUSES: IdentityStatus[] = ["NOT_SUBMITTED", "PENDING", "APPROVED", "REJECTED"];
const readIdentity = (): IdentityStatus => {
  const value = read("user_identity_status") as IdentityStatus | null;
  return value && IDENTITY_STATUSES.includes(value) ? value : "NOT_SUBMITTED";
};

const fullName = (user?: ApiUser, fallback?: string) => {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  return name || fallback || "";
};

const summaryFrom = (user: ApiUser): VerificationSummary => {
  if (user.verification) return user.verification;
  const email = Boolean(user.emailVerifiedAt);
  const phone = Boolean(user.phoneVerifiedAt);
  return { email, phone, identity: "NOT_SUBMITTED", canBuy: email && phone, canSell: false };
};

const persistVerification = (summary: VerificationSummary) => {
  write("user_email_verified", summary.email ? "true" : "false");
  write("user_phone_verified", summary.phone ? "true" : "false");
  write("user_identity_status", summary.identity);
  write("user_identity_rejection", summary.identityRejectionReason ?? "");
  write("user_can_buy", summary.canBuy ? "true" : "false");
  write("user_can_sell", summary.canSell ? "true" : "false");
  return {
    emailVerified: summary.email,
    phoneVerified: summary.phone,
    identityStatus: summary.identity,
    identityRejectionReason: summary.identityRejectionReason ?? "",
    canBuy: summary.canBuy,
    canSell: summary.canSell,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  token: read("auth_token"),
  role: isRole(read("user_role")) ? read("user_role") as UserRole : "customer",
  userId: read("user_id") ?? "",
  userName: read("user_name") ?? "",
  userEmail: read("user_email") ?? "",
  userPhone: read("user_phone") ?? "",
  userAvatar: read("user_avatar") ?? "",
  emailVerified: read("user_email_verified") === "true",
  phoneVerified: read("user_phone_verified") === "true",
  identityStatus: readIdentity(),
  identityRejectionReason: read("user_identity_rejection") ?? "",
  canBuy: read("user_can_buy") === "true",
  canSell: read("user_can_sell") === "true",

  setSession: ({ accessToken, user, role, name, phone }) => {
    const userId = user?._id ?? user?.id ?? "";
    const userName = fullName(user, name);
    const userEmail = user?.email ?? "";
    const userPhone = user?.phone ?? phone ?? "";
    const userAvatar = user?.avatar ?? "";
    const storedRole = read("user_role");
    const accountRole = role ?? user?.accountType ?? (isRole(storedRole) ? storedRole : "customer");

    write("auth_token", accessToken);
    write("user_role", accountRole);
    write("user_id", userId);
    write("user_name", userName);
    write("user_email", userEmail);
    write("user_phone", userPhone);
    write("user_avatar", userAvatar);
    const verification = persistVerification(summaryFrom(user ?? {}));

    set({
      token: accessToken,
      role: accountRole,
      userId,
      userName,
      userEmail,
      userPhone,
      userAvatar,
      ...verification,
    });
    emitAuthChange();
  },

  applyUser: (user) => {
    const verification = persistVerification(summaryFrom(user));
    const name = fullName(user);
    if (name) write("user_name", name);
    if (user.email) write("user_email", user.email);
    if (user.phone !== undefined) write("user_phone", user.phone);
    if (user.avatar !== undefined) write("user_avatar", user.avatar);
    if (user.accountType) write("user_role", user.accountType);

    set((state) => ({
      userName: name || state.userName,
      userEmail: user.email ?? state.userEmail,
      userPhone: user.phone ?? state.userPhone,
      userAvatar: user.avatar ?? state.userAvatar,
      role: user.accountType ?? state.role,
      ...verification,
    }));
    emitAuthChange();
  },

  setRole: (role) => {
    write("user_role", role);
    set({ role });
    emitAuthChange();
  },

  setProfile: ({ name, email, phone, avatar }) => {
    if (name !== undefined) write("user_name", name);
    if (email !== undefined) write("user_email", email);
    if (phone !== undefined) write("user_phone", phone);
    if (avatar !== undefined) write("user_avatar", avatar);

    set((state) => ({
      userName: name ?? state.userName,
      userEmail: email ?? state.userEmail,
      userPhone: phone ?? state.userPhone,
      userAvatar: avatar ?? state.userAvatar,
    }));
    emitAuthChange();
  },

  logout: () => {
    [
      "auth_token",
      "user_role",
      "user_id",
      "user_name",
      "user_email",
      "user_phone",
      "user_avatar",
      "user_email_verified",
      "user_phone_verified",
      "user_identity_status",
      "user_identity_rejection",
      "user_can_buy",
      "user_can_sell",
      "user_verified",
    ].forEach((key) => write(key));

    set({
      token: null,
      role: "customer",
      userId: "",
      userName: "",
      userEmail: "",
      userPhone: "",
      userAvatar: "",
      emailVerified: false,
      phoneVerified: false,
      identityStatus: "NOT_SUBMITTED",
      identityRejectionReason: "",
      canBuy: false,
      canSell: false,
    });
    emitAuthChange();
  },
}));
