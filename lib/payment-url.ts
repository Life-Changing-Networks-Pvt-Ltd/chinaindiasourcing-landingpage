import type { MarketForm, MarketPaymentDetails } from "@/lib/api";

export function marketPaymentUrl(
  form: MarketForm,
  payment: Pick<MarketPaymentDetails, "applicationId" | "accessToken">,
  returnUrl?: string,
) {
  const origin = process.env.NEXT_PUBLIC_SELLERSLOGIN_PAYMENT_ORIGIN || "https://sellerslogin.com";
  const url = new URL("/payments/chinaindiasourcing", origin);
  // Keep the short-lived payment credential out of HTTP URLs and referrers.
  const details = new URLSearchParams({ form, id: payment.applicationId, token: payment.accessToken });
  if (returnUrl) details.set("return_url", returnUrl);
  url.hash = details.toString();
  return url.toString();
}
