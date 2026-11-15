"use client";

import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  Lock,
  Tag,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { MarketplaceProduct } from "@/data/aiMarketplaceData";
import { useTranslation } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/api";

interface CheckoutModalProps {
  product: MarketplaceProduct;
  discountedPrice?: number;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export function CheckoutModal({
  product,
  discountedPrice,
  onClose,
  onOrderSuccess
}: CheckoutModalProps) {
  const { t, language } = useTranslation();
  const isDe = language === "DE";

  const effectivePrice = discountedPrice || product.price;
  const discountAmount = product.price > effectivePrice ? product.price - effectivePrice : 0;
  const shippingFee = 0; // Free express delivery
  const finalTotal = effectivePrice + shippingFee;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError("");
    setIsProcessing(true);
    try {
      const result = await apiRequest<{ url: string }>("/payments/checkout", {
        method: "POST",
        body: JSON.stringify({
          purpose: "MARKETPLACE",
          productId: product.id,
          amount: finalTotal,
          shipping: { fullName, phone, addressLine1: address, city, postalCode, country: "Switzerland" },
        }),
      });
      window.location.href = result.url;
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Payment could not be started.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="font-extrabold text-base text-white">
              {t.checkout.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isCompleted ? (
          <div className="p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              {isDe ? "Zahlung Erfolgreich" : "Payment & Order Confirmed"}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              {t.checkout.orderSuccessTitle}
            </h2>
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5 max-w-sm mx-auto text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.checkout.orderNumber}:</span>
                <strong className="text-slate-900 font-bold">{orderId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <strong className="text-emerald-700 font-mono font-bold">{transactionId}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-semibold text-slate-800">
                  Stripe
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                <span className="text-slate-700">Total Paid:</span>
                <span className="text-primary font-black">CHF {finalTotal}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 max-w-md mx-auto">
              {t.checkout.orderSuccessDesc}
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={onClose}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-extrabold rounded-xl text-sm transition-all cursor-pointer shadow-md shadow-primary/20"
              >
                {t.checkout.continueShopping}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Product Summary Row */}
            <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-sm text-slate-900 truncate">{product.name}</h4>
                <p className="text-xs text-slate-500">{product.sellerName} • {product.condition}</p>
                {discountAmount > 0 ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-black text-emerald-700">CHF {effectivePrice}</span>
                    <span className="text-xs line-through text-slate-400">CHF {product.price}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                      {t.checkout.aiDiscount}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-black text-slate-900 mt-1 block">CHF {effectivePrice}</span>
                )}
              </div>
            </div>

            {/* Shipping Address Form */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                {t.checkout.deliveryAddress}
              </h5>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.checkout.fullName}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isDe ? "Telefon" : "Phone"}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t.checkout.streetAddress}
                  className="col-span-2 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder={t.checkout.postalCode}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <CreditCard className="mb-1 h-4 w-4 text-primary" />
              {isDe ? "Die Zahlung wird auf der sicheren Stripe-Seite abgeschlossen." : "Payment is completed on Stripe’s secure page."}
            </div>
            {paymentError && <p className="rounded-xl border border-red-200 bg-red-50 p-2 text-xs font-medium text-red-600">{paymentError}</p>}

            {/* Price Breakdown */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>{t.checkout.originalPrice}</span>
                <span>CHF {product.price}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {t.checkout.aiDiscount}
                  </span>
                  <span>-CHF {discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>{t.checkout.freeExpressShipping}</span>
                <span className="text-emerald-600 font-bold">{t.checkout.free}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 flex justify-between text-slate-900 font-black text-sm">
                <span>{t.checkout.total}</span>
                <span className="text-base text-primary">CHF {finalTotal}</span>
              </div>
            </div>

            {/* Payment Guarantee Notice */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {t.checkout.escrowBadge}: {isDe ? "Auszahlung erfolgt erst nach erfolgreicher Prüfung." : "Funds held securely until item is verified."}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-2/3 py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <span>{t.checkout.processing}</span>
                ) : (
                  <>
                    <span>
                      {isDe ? `Mit Stripe CHF ${finalTotal} bezahlen` : `Pay CHF ${finalTotal} with Stripe`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
