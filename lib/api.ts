const apiBaseUrl = String(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1",
).replace(/\/+$/, "");

export type MarketForm = "buyers" | "sellers";

export type OtpChannel = "email" | "whatsapp";

type ApiResult<T = unknown> = {
  success?: boolean;
  message?: string;
  resendAfter?: number;
  verificationToken?: string;
  marketApplicationId?: string;
  code?: string;
  field?: "email" | "whatsapp";
  data?: T;
};

async function readApiResult<T = unknown>(response: Response) {
  const result = (await response.json().catch(() => null)) as ApiResult<T> | null;

  if (!response.ok || !result?.success) {
    const error = new Error(
      result?.message || "Something went wrong. Please try again.",
    ) as Error & { code?: string; field?: "email" | "whatsapp" };
    error.code = result?.code;
    error.field = result?.field;
    throw error;
  }

  return result;
}

export function buildWhatsappNumber(
  countryCode: string,
  customCountryCode: string,
  localNumber: string,
) {
  const selectedCode = countryCode === "custom" ? customCountryCode : countryCode;
  const dialCode = selectedCode.replace(/-CA$/i, "").replace(/\D/g, "");
  const subscriberNumber = localNumber.replace(/\D/g, "").replace(/^0+/, "");

  if (!dialCode || !subscriberNumber) return "";
  return `+${dialCode}${subscriberNumber}`;
}

export async function sendVerificationOtp(
  channel: OtpChannel,
  target: string,
  marketForm?: MarketForm,
  marketApplicationId?: string,
  related?: { email?: string; whatsappNumber?: string },
) {
  const path = channel === "email" ? "email" : "whatsapp";
  const body = channel === "email"
    ? {
        email: target,
        whatsappNumber: related?.whatsappNumber || "",
        verificationContext: "market",
        marketForm,
        marketApplicationId,
      }
    : {
        whatsappNumber: target,
        email: related?.email || "",
        verificationContext: "market",
        marketForm,
        marketApplicationId,
      };
  const response = await fetch(`${apiBaseUrl}/live-chat/${path}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return readApiResult(response);
}

export async function verifyVerificationOtp(
  channel: OtpChannel,
  target: string,
  otp: string,
  marketForm?: MarketForm,
  marketApplicationId?: string,
) {
  const path = channel === "email" ? "email" : "whatsapp";
  const body =
    channel === "email"
      ? { email: target, otp, verificationContext: "market", marketForm, marketApplicationId }
      : { whatsappNumber: target, otp, verificationContext: "market", marketForm, marketApplicationId };
  const response = await fetch(`${apiBaseUrl}/live-chat/${path}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await readApiResult(response);

  if (!result.verificationToken) {
    throw new Error("Verification proof was not returned. Please request a new OTP.");
  }

  return result;
}

export async function submitMarketForm(
  form: MarketForm,
  payload: Record<string, unknown>,
) {
  const response = await fetch(`${apiBaseUrl}/market/${form}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return readApiResult<MarketPaymentDetails>(response);
}

export type MarketDraftCredentials = {
  draftId: string;
  draftToken: string;
};

export type MarketPaymentDetails = {
  applicationId: string;
  accessToken: string;
  checkoutKey: string;
  orderId: string;
  amount: number;
  currency: "USD" | "INR";
  feeUsd: number;
  baseFeeUsd: number;
  baseFeeAmount: number;
  gstPercent: number;
  gstUsd: number;
  gstAmount: number;
  exchangeRate: number;
  amountDue: number;
  couponCode: string;
  name: string;
  email: string;
  contact: string;
};

export type MarketRegistrationStatus = {
  status: "available" | "pending_payment" | "paid";
  payment?: MarketPaymentDetails;
};

export async function checkMarketRegistration(
  form: MarketForm,
  email: string,
  marketApplicationId?: string,
) {
  const response = await fetch(`${apiBaseUrl}/market/${form}/registration-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, marketApplicationId }),
  });
  return readApiResult<MarketRegistrationStatus>(response);
}

export async function saveMarketDraft(
  form: MarketForm,
  payload: Record<string, unknown>,
  currentStep: number,
  credentials?: MarketDraftCredentials | null,
) {
  const response = await fetch(`${apiBaseUrl}/market/${form}/draft`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: payload,
      currentStep,
      draftId: credentials?.draftId,
      draftToken: credentials?.draftToken,
    }),
  });
  return readApiResult<MarketDraftCredentials & { currentStep: number }>(response);
}

export async function getMarketDraft(
  form: MarketForm,
  credentials: MarketDraftCredentials,
) {
  const response = await fetch(
    `${apiBaseUrl}/market/${form}/draft/${credentials.draftId}`,
    { headers: { "x-market-draft-token": credentials.draftToken } },
  );
  return readApiResult<{
    draftId: string;
    currentStep: number;
    formData: Record<string, unknown>;
  }>(response);
}

export async function verifyMarketPayment(
  form: MarketForm,
  payment: MarketPaymentDetails,
  razorpayPaymentId: string,
  razorpaySignature: string,
) {
  const response = await fetch(
    `${apiBaseUrl}/market/${form}/${payment.applicationId}/payment/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-market-payment-token": payment.accessToken,
      },
      body: JSON.stringify({ razorpayPaymentId, razorpaySignature }),
    },
  );
  return readApiResult(response);
}

export async function requestMarketPaymentHelp(
  form: MarketForm,
  payment: MarketPaymentDetails,
) {
  const response = await fetch(
    `${apiBaseUrl}/market/${form}/${payment.applicationId}/payment/help`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-market-payment-token": payment.accessToken,
      },
    },
  );
  return readApiResult(response);
}

export async function applyMarketPaymentCoupon(
  form: MarketForm,
  payment: MarketPaymentDetails,
  couponCode: string,
) {
  const response = await fetch(
    `${apiBaseUrl}/market/${form}/${payment.applicationId}/payment/coupon`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-market-payment-token": payment.accessToken,
      },
      body: JSON.stringify({ couponCode }),
    },
  );
  return readApiResult<MarketPaymentDetails>(response);
}

export async function refreshMarketPayment(
  form: MarketForm,
  payment: MarketPaymentDetails,
) {
  const response = await fetch(
    `${apiBaseUrl}/market/${form}/${payment.applicationId}/payment/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-market-payment-token": payment.accessToken,
      },
    },
  );
  return readApiResult<MarketPaymentDetails>(response);
}
