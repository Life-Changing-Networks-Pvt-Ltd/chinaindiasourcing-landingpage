"use client";

import { useEffect, useState } from "react";
import { CreditCard, Headphones, Loader2, ReceiptText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type MarketForm,
  type MarketPaymentDetails,
  applyMarketPaymentCoupon,
  refreshMarketPayment,
  requestMarketPaymentHelp,
  verifyMarketPayment,
} from "@/lib/api";

type RazorpayResult = { razorpay_payment_id: string; razorpay_signature: string };
type RazorpayConstructor = new (options: Record<string, unknown>) => {
  open: () => void;
  on: (event: string, callback: (response: { error?: { description?: string } }) => void) => void;
};

declare global {
  interface Window { Razorpay?: RazorpayConstructor }
}

async function loadRazorpay() {
  if (window.Razorpay) return;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-razorpay-checkout]");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Unable to load payment checkout.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpayCheckout = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load payment checkout."));
    document.body.appendChild(script);
  });
}

const normalizeLegacyIndianPayment = (payment: MarketPaymentDetails): MarketPaymentDetails => {
  if (payment.currency !== "USD" || payment.baseFeeUsd !== 15 || payment.couponCode) return payment;
  const exchangeRate = 95;
  const gstPercent = 18;
  const gstUsd = payment.baseFeeUsd * (gstPercent / 100);
  const amountDue = Math.round((payment.baseFeeUsd + gstUsd) * exchangeRate);
  return {
    ...payment,
    gstPercent,
    gstUsd,
    baseFeeAmount: Math.round(payment.baseFeeUsd * exchangeRate),
    gstAmount: Math.round(gstUsd * exchangeRate),
    exchangeRate,
    amountDue,
    amount: amountDue * 100,
    currency: "INR",
  };
};

export function MarketVerificationPayment({ form, payment, onPaid }: {
  form: MarketForm;
  payment: MarketPaymentDetails;
  onPaid: () => void;
}) {
  const [isPaying, setIsPaying] = useState(false);
  const [isRequestingHelp, setIsRequestingHelp] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activePayment, setActivePayment] = useState(() => normalizeLegacyIndianPayment(payment));
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void refreshMarketPayment(form, payment)
      .then((result) => {
        if (!cancelled && result.data) {
          setActivePayment(normalizeLegacyIndianPayment(result.data));
          setError("");
        }
      })
      .catch((refreshError) => {
        if (!cancelled) {
          setError(refreshError instanceof Error ? refreshError.message : "Unable to refresh payment receipt.");
        }
      });
    return () => { cancelled = true; };
  }, [form, payment]);

  const money = (currency: "USD" | "INR", amount: number) =>
    new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency", currency, maximumFractionDigits: currency === "INR" ? 0 : 2,
    }).format(amount);

  const openPayment = async () => {
    setError(""); setMessage(""); setIsPaying(true);
    try {
      const refreshed = await refreshMarketPayment(form, activePayment);
      if (!refreshed.data) throw new Error("Updated payment order was not returned.");
      const checkoutPayment = refreshed.data;
      setActivePayment(normalizeLegacyIndianPayment(checkoutPayment));
      if (
        checkoutPayment.contact.startsWith("+91") &&
        checkoutPayment.currency !== "INR"
      ) {
        throw new Error("Indian payments must be processed in INR. Please refresh and try again.");
      }
      await loadRazorpay();
      if (!window.Razorpay) throw new Error("Payment checkout is unavailable.");
      const checkout = new window.Razorpay({
        key: checkoutPayment.checkoutKey,
        order_id: checkoutPayment.orderId,
        amount: checkoutPayment.amount,
        currency: checkoutPayment.currency,
        name: "Chinaindiasourcing",
        description: "Registration payment",
        prefill: { name: checkoutPayment.name, email: checkoutPayment.email, contact: checkoutPayment.contact },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          paylater: true,
          emi: true,
        },
        config: {
          display: {
            blocks: {
              upi: { name: "UPI", instruments: [{ method: "upi" }] },
              cards: { name: "Cards", instruments: [{ method: "card" }] },
              banks: { name: "Netbanking", instruments: [{ method: "netbanking" }] },
              wallets: { name: "Wallets", instruments: [{ method: "wallet" }] },
              paylater: { name: "Pay Later", instruments: [{ method: "paylater" }] },
              emi: { name: "EMI", instruments: [{ method: "emi" }] },
            },
            sequence: [
              "block.upi",
              "block.cards",
              "block.banks",
              "block.wallets",
              "block.paylater",
              "block.emi",
            ],
            preferences: { show_default_blocks: false },
          },
        },
        theme: { color: "#111827" },
        modal: { ondismiss: () => setIsPaying(false) },
        handler: async (result: RazorpayResult) => {
          try {
            await verifyMarketPayment(form, checkoutPayment, result.razorpay_payment_id, result.razorpay_signature);
            onPaid();
          } catch (paymentError) {
            setError(paymentError instanceof Error ? paymentError.message : "Payment verification failed.");
          } finally { setIsPaying(false); }
        },
      });
      checkout.on("payment.failed", (response) => {
        setError(response.error?.description || "Payment failed. Please try again.");
        setIsPaying(false);
      });
      checkout.open();
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Unable to start payment.");
      setIsPaying(false);
    }
  };

  const applyCoupon = async () => {
    setError(""); setMessage(""); setIsApplyingCoupon(true);
    try {
      const result = await applyMarketPaymentCoupon(form, activePayment, couponCode);
      if (!result.data) throw new Error("Updated receipt was not returned.");
      setActivePayment(result.data);
      setCouponCode("");
      setMessage(result.message || "Coupon applied successfully.");
    } catch (couponError) {
      setError(couponError instanceof Error ? couponError.message : "Unable to apply coupon.");
    } finally { setIsApplyingCoupon(false); }
  };

  const requestHelp = async () => {
    setError(""); setMessage(""); setIsRequestingHelp(true);
    try {
      const result = await requestMarketPaymentHelp(form, activePayment);
      setMessage(result.message || "Thanks for your concern, we will be back to you very shortly.");
    } catch (helpError) {
      setError(helpError instanceof Error ? helpError.message : "Unable to request payment help.");
    } finally { setIsRequestingHelp(false); }
  };

  return (
    <Card className="mx-auto max-w-xl border-border/60 bg-card/95 shadow-lg backdrop-blur-sm">
      <CardHeader className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ReceiptText className="size-6" />
        </span>
        <CardTitle className="mt-3 text-2xl">Payment receipt</CardTitle>
        <p className="text-sm text-muted-foreground">Your details have been saved. Please review the amount below.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3 rounded-xl border bg-muted/30 p-5 text-sm">
          <div className="flex justify-between gap-4"><span>Registration fee</span><strong>{money(activePayment.currency, activePayment.baseFeeAmount ?? activePayment.baseFeeUsd)}</strong></div>
          {activePayment.gstPercent > 0 && (
            <div className="flex justify-between gap-4"><span>GST ({activePayment.gstPercent}%)</span><strong>{money(activePayment.currency, activePayment.gstAmount ?? activePayment.gstUsd)}</strong></div>
          )}
          {activePayment.couponCode && (
            <div className="flex justify-between gap-4 text-emerald-700"><span>Coupon applied</span><strong>{activePayment.couponCode}</strong></div>
          )}
          <div className="flex justify-between gap-4 border-t pt-3 text-lg"><span className="font-semibold">Total payable</span><strong>{money(activePayment.currency, activePayment.amountDue)}</strong></div>
        </div>

        {!activePayment.couponCode && (
          <div className="space-y-2">
            <label htmlFor="market-coupon" className="text-sm font-semibold">Have a coupon?</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input id="market-coupon" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter coupon code" className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <Button type="button" variant="outline" onClick={applyCoupon} disabled={isApplyingCoupon || !couponCode.trim()}>
                {isApplyingCoupon ? <Loader2 className="size-4 animate-spin" /> : "Apply"}
              </Button>
            </div>
          </div>
        )}

        <Button type="button" size="lg" className="w-full gap-2" onClick={openPayment} disabled={isPaying}>
          {isPaying ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
          {isPaying ? "Opening secure checkout..." : `Pay ${money(activePayment.currency, activePayment.amountDue)}`}
        </Button>
        <div className="text-center">
          <button type="button" onClick={requestHelp} disabled={isRequestingHelp} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline disabled:opacity-60">
            {isRequestingHelp ? <Loader2 className="size-3.5 animate-spin" /> : <Headphones className="size-3.5" />} Need help with payment?
          </button>
        </div>
        {message && <p role="status" className="rounded-md bg-emerald-50 p-3 text-center text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{message}</p>}
        {error && <p role="alert" className="rounded-md bg-rose-50 p-3 text-center text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}
      </CardContent>
    </Card>
  );
}
