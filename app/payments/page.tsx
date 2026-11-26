"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MarketForm, MarketPaymentDetails } from "@/lib/api";
import { marketPaymentUrl } from "@/lib/payment-url";

export default function PaymentsPage() {
  const [hasPayment, setHasPayment] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const applicationId = params.get("id");
    const accessToken = params.get("token");
    if (applicationId && accessToken) {
      const form = params.get("form") === "sellers" ? "sellers" : "buyers";
      window.location.replace(marketPaymentUrl(
        form, { applicationId, accessToken }, params.get("return_url") || undefined,
      ));
      return;
    }

    try {
      const raw = sessionStorage.getItem("market_payment_data");
      const saved = raw ? JSON.parse(raw) as { form: MarketForm; payment: MarketPaymentDetails } : null;
      if (saved?.payment?.applicationId && saved.payment.accessToken) {
        window.location.replace(marketPaymentUrl(saved.form, saved.payment));
        return;
      }
    } catch {
      // An unavailable or unreadable session can be resumed from the registration form.
    }
    setHasPayment(false);
  }, []);

  return (
    <main className="mx-auto max-w-xl space-y-4 px-6 py-16 text-center">
      {hasPayment ? <p role="status">Opening SellersLogin checkout…</p> : (
        <>
          <h1 className="text-2xl font-semibold">No active payment found</h1>
          <p>Return to your form to start or resume checkout.</p>
          <div className="flex justify-center gap-4">
            <Link className="underline" href="/buyers">Buyer enquiry</Link>
            <Link className="underline" href="/sellers">Seller registration</Link>
          </div>
        </>
      )}
    </main>
  );
}
