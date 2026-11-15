"use client";

import React, { useState } from "react";
import {
  X,
  Send,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Info,
  Clock
} from "lucide-react";
import { MarketplaceProduct } from "@/data/aiMarketplaceData";
import { useTranslation } from "@/context/LanguageContext";

interface ProductAIChatModalProps {
  product: MarketplaceProduct;
  onClose: () => void;
  onProceedToCheckout?: (negotiatedPrice?: number) => void;
}

export function ProductAIChatModal({
  product,
  onClose,
  onProceedToCheckout
}: ProductAIChatModalProps) {
  const { language } = useTranslation();
  const isDe = language === "DE";

  const floor = product.chatGptRules?.lowestAcceptablePrice || product.minNegotiablePrice || Math.round(product.price * 0.85);
  const [offerAmount, setOfferAmount] = useState<number>(Math.round(product.price * 0.9));
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "accepted" | "counter">("idle");
  const [counterPrice, setCounterPrice] = useState<number>(product.price);

  const handleQuickPercent = (percent: number) => {
    const discounted = Math.round(product.price * (1 - percent / 100));
    setOfferAmount(discounted);
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    setTimeout(() => {
      if (offerAmount >= floor) {
        setStatus("accepted");
        // Record log to storage
        try {
          const storedLogs = localStorage.getItem("odaboo_chatgpt_logs");
          const logs = storedLogs ? JSON.parse(storedLogs) : [];
          logs.unshift({
            id: `OFFER-${Date.now().toString().slice(-4)}`,
            productId: product.id,
            productName: product.name,
            buyerName: "Verified Buyer",
            sellerName: product.sellerName,
            initialPrice: product.price,
            buyerOffer: offerAmount,
            finalPrice: offerAmount,
            status: "Accepted",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            conversationSnippet: message || "Offer accepted automatically based on seller acceptable threshold."
          });
          localStorage.setItem("odaboo_chatgpt_logs", JSON.stringify(logs));
          window.dispatchEvent(new Event("storage"));
        } catch (err) {
          console.error(err);
        }
      } else {
        const counter = Math.round(floor + (product.price - floor) * 0.4);
        setCounterPrice(counter);
        setStatus("counter");
      }
    }, 500);
  };

  const handleAcceptCounter = () => {
    try {
      const storedLogs = localStorage.getItem("odaboo_chatgpt_logs");
      const logs = storedLogs ? JSON.parse(storedLogs) : [];
      logs.unshift({
        id: `OFFER-${Date.now().toString().slice(-4)}`,
        productId: product.id,
        productName: product.name,
        buyerName: "Verified Buyer",
        sellerName: product.sellerName,
        initialPrice: product.price,
        buyerOffer: offerAmount,
        finalPrice: counterPrice,
        status: "Accepted",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        conversationSnippet: `Buyer accepted counter-offer of $${counterPrice}.`
      });
      localStorage.setItem("odaboo_chatgpt_logs", JSON.stringify(logs));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
    }
    onProceedToCheckout?.(counterPrice);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">
                {isDe ? "Preisangebot an Verkäufer" : "Make an Offer to Seller"}
              </h2>
              <p className="text-xs text-slate-500">
                {isDe ? "Direktes Angebot mit Käuferschutz" : "Direct verified offer with escrow protection"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Snapshot */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-white">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{product.sellerName}</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 truncate">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xs text-slate-400">{isDe ? "Listenpreis:" : "Asking Price:"}</span>
              <span className="text-base font-extrabold text-slate-900">CHF {product.price}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {status === "accepted" ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">
                  {isDe ? "Angebot Akzeptiert!" : "Offer Accepted!"}
                </h4>
                <p className="text-sm text-slate-600 mt-1">
                  {isDe
                    ? `Der Verkäufer akzeptiert Ihr Angebot von CHF ${offerAmount}. Sie können nun zur sicheren Kasse gehen.`
                    : `The seller agrees to your offer of CHF ${offerAmount}. Proceed to secure checkout now.`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onProceedToCheckout?.(offerAmount)}
                className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all shadow-md shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isDe ? `Jetzt für CHF ${offerAmount} kaufen` : `Checkout Now for CHF ${offerAmount}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : status === "counter" ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {isDe ? "Gegenangebot des Verkäufers" : "Seller Counter-Offer"}
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  {isDe
                    ? `Ihr Angebot lag unter dem Mindestlimit. Der Verkäufer schlägt CHF ${counterPrice} vor.`
                    : `Your offer was slightly below margin. The seller proposed a counter-offer of CHF ${counterPrice}.`}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs cursor-pointer"
                >
                  {isDe ? "Angebot anpassen" : "Adjust Offer"}
                </button>
                <button
                  type="button"
                  onClick={handleAcceptCounter}
                  className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs cursor-pointer shadow-xs shadow-primary/20"
                >
                  {isDe ? `CHF ${counterPrice} Akzeptieren` : `Accept CHF ${counterPrice}`}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOffer} className="space-y-5">
              {/* Offer input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {isDe ? "Ihr Preisangebot (CHF)" : "Your Offer Amount (CHF)"}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400 font-bold text-xs">CHF</span>
                  <input
                    type="number"
                    required
                    min="1"
                    max={product.price}
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(Number(e.target.value))}
                    className="w-full pl-14 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-black text-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
                  />
                </div>

                {/* Quick discount chips */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {isDe ? "Schnellauswahl:" : "Quick:"}
                  </span>
                  {[5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleQuickPercent(pct)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary text-[11px] font-bold text-slate-600 transition-colors cursor-pointer"
                    >
                      -{pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Message to seller */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {isDe ? "Nachricht an den Verkäufer (Optional)" : "Note to Seller (Optional)"}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isDe
                      ? "z.B. Ich kann den Artikel heute abholen oder sofort bezahlen..."
                      : "e.g., I am ready to pay immediately with express shipping..."
                  }
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-hidden resize-none"
                />
              </div>

              {/* Trust disclaimer */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isDe
                    ? "Treuhand-Schutz: Geld wird erst nach Erhalt der Ware freigegeben."
                    : "Escrow Protection: Funds held securely until item is verified."}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-primary" />
                <span>
                  {status === "submitting"
                    ? isDe ? "Wird gesendet..." : "Submitting..."
                    : isDe ? "Angebot verbindlich senden" : "Submit Binding Offer"}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
