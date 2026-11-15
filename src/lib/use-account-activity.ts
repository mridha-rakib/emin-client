"use client";

import { useEffect, useState } from "react";
import { apiRequest, type ApiPage } from "@/lib/api";

export type AccountInvoice = {
  id: string;
  recordId: string;
  date: string;
  planName: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  txnId: string;
};

export type AccountActivity = {
  totalBookings: number;
  completedBookings: number;
  reviews: number;
  memberSince: string;
  verified: boolean;
  services: number;
  jobsCompleted: number;
  rating: number;
  planName: string;
  planStatus: string;
  isAnnual: boolean;
  nextBillingDate: string;
  paymentMethod: string;
  totalSpend: number;
  invoices: AccountInvoice[];
  hasSubscription: boolean;
};

const EMPTY: AccountActivity = {
  totalBookings: 0,
  completedBookings: 0,
  reviews: 0,
  memberSince: "—",
  verified: false,
  services: 0,
  jobsCompleted: 0,
  rating: 0,
  planName: "",
  planStatus: "",
  isAnnual: false,
  nextBillingDate: "",
  paymentMethod: "",
  totalSpend: 0,
  invoices: [],
  hasSubscription: false,
};

const emptyPage = { items: [] as never[], meta: { page: 1, limit: 100, total: 0, pages: 0 } };

const idOf = (value: unknown) => (value == null ? "" : String(value));

const money = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  if (value && typeof value === "object" && "$numberDecimal" in value) {
    return Number((value as { $numberDecimal: string }).$numberDecimal) || 0;
  }
  return 0;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const formatMonth = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
};

const paymentLabel = (provider?: string) => {
  if (provider === "stripe") return "Stripe";
  if (provider === "free") return "Free";
  return "";
};

type Booking = { customerId?: unknown; serviceId?: unknown; status?: string };
type Review = { reviewerId?: unknown; rating?: number };
type Subscription = {
  _id: string;
  userId?: unknown;
  planName?: string;
  billingCycle?: string;
  amount?: unknown;
  currency?: string;
  status?: string;
  endsAt?: string;
  createdAt?: string;
  paymentDetails?: { provider?: string; sessionId?: string };
};
type Invoice = {
  _id: string;
  invoiceNumber?: string;
  userId?: unknown;
  subscriptionId?: unknown;
  amount?: unknown;
  currency?: string;
  status?: string;
  paidAt?: string;
  createdAt?: string;
  metadata?: { stripeSessionId?: string; title?: string; reference?: string };
};
type Service = { _id: string; providerUserId?: unknown };
type Seller = { userId?: unknown; rating?: { average?: number; total?: number } };
type Me = { createdAt?: string; verification?: { identity?: string } };

export function useAccountActivity(enabled: boolean) {
  const [activity, setActivity] = useState<AccountActivity>(EMPTY);

  useEffect(() => {
    if (!enabled) {
      setActivity(EMPTY);
      return;
    }
    const userId = window.localStorage.getItem("user_id") || "";
    if (!userId) {
      setActivity(EMPTY);
      return;
    }
    let cancelled = false;

    Promise.all([
      apiRequest<ApiPage<Booking>>("/bookings?page=1&limit=100").catch(() => emptyPage),
      apiRequest<ApiPage<Review>>("/reviews?page=1&limit=100").catch(() => emptyPage),
      apiRequest<ApiPage<Subscription>>("/subscriptions?page=1&limit=100").catch(() => emptyPage),
      apiRequest<ApiPage<Invoice>>("/invoices?page=1&limit=100").catch(() => emptyPage),
      apiRequest<ApiPage<Service>>("/services?page=1&limit=100").catch(() => emptyPage),
      apiRequest<ApiPage<Seller>>("/seller-profiles?page=1&limit=100").catch(() => emptyPage),
      apiRequest<Me>("/auth/me").catch(() => null),
    ]).then(([bookings, reviews, subscriptions, invoices, services, sellers, me]) => {
      if (cancelled) return;
      const mine = bookings.items.filter((item) => idOf(item.customerId) === userId);
      const myServices = new Set(services.items.filter((item) => idOf(item.providerUserId) === userId).map((item) => item._id));
      const jobs = bookings.items.filter((item) => item.serviceId && myServices.has(idOf(item.serviceId)));
      const given = reviews.items.filter((item) => idOf(item.reviewerId) === userId);
      const seller = sellers.items.find((item) => idOf(item.userId) === userId);
      const mineSubs = subscriptions.items
        .filter((item) => idOf(item.userId) === userId)
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      const current = mineSubs.find((item) => item.status === "ACTIVE") ?? mineSubs[0];
      const planBySubscription = new Map(mineSubs.map((item) => [item._id, item.planName || "Subscription"]));
      const mineInvoices = invoices.items
        .filter((item) => idOf(item.userId) === userId)
        .sort((a, b) => new Date(b.paidAt || b.createdAt || 0).getTime() - new Date(a.paidAt || a.createdAt || 0).getTime());
      const paid = mineInvoices.filter((item) => (item.status || "").toUpperCase() === "PAID");

      setActivity({
        totalBookings: mine.length,
        completedBookings: mine.filter((item) => (item.status || "").toLowerCase() === "completed").length,
        reviews: seller?.rating?.total || given.length,
        memberSince: formatMonth(me?.createdAt),
        verified: (me?.verification?.identity || "").toUpperCase() === "APPROVED",
        services: myServices.size,
        jobsCompleted: jobs.filter((item) => (item.status || "").toLowerCase() === "completed").length,
        rating: Number(seller?.rating?.average) || (given.length ? given.reduce((sum, item) => sum + (item.rating || 0), 0) / given.length : 0),
        planName: current?.planName || "",
        planStatus: current?.status || "",
        isAnnual: current?.billingCycle === "yearly",
        nextBillingDate: formatDate(current?.endsAt),
        paymentMethod: paymentLabel(current?.paymentDetails?.provider),
        totalSpend: paid.reduce((sum, item) => sum + money(item.amount), 0),
        hasSubscription: Boolean(current),
        invoices: mineInvoices.map((item) => ({
          id: item.invoiceNumber || item._id,
          recordId: item._id,
          date: formatDate(item.paidAt || item.createdAt) || "—",
          planName: item.metadata?.title || planBySubscription.get(idOf(item.subscriptionId)) || "Payment",
          amount: money(item.amount),
          currency: item.currency || "CHF",
          status: (item.status || "PENDING").replace(/_/g, " "),
          paymentMethod: paymentLabel(current?.paymentDetails?.provider) || "Stripe",
          txnId: item.metadata?.stripeSessionId || item._id,
        })),
      });
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return activity;
}
