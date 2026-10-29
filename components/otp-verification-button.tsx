"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, CreditCard, Loader2, Mail, MessageCircle, RotateCcw, ShieldCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  checkMarketRegistration,
  type MarketPaymentDetails,
  type OtpChannel,
  type MarketForm,
  sendVerificationOtp,
  verifyVerificationOtp,
} from "@/lib/api";

type OtpVerificationButtonProps = {
  channel: OtpChannel;
  target: string;
  verified: boolean;
  onVerified: (verificationToken: string) => void;
  onAvailabilityChange?: (available: boolean, message?: string) => void;
  className?: string;
  label?: string;
  verifiedVariant?: "outline" | "secondary";
  marketForm?: MarketForm;
  marketApplicationId?: string;
  onMarketApplicationCreated?: (applicationId: string) => void;
  relatedEmail?: string;
  relatedWhatsapp?: string;
};

const isValidTarget = (channel: OtpChannel, target: string) => {
  if (channel === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target);
  return /^\+\d{8,15}$/.test(target);
};

const maskTarget = (channel: OtpChannel, target: string) => {
  if (channel === "email") {
    const [name = "", domain = ""] = target.split("@");
    return `${name.slice(0, 2)}${name.length > 2 ? "***" : ""}@${domain}`;
  }
  return `${target.slice(0, 3)}••••••${target.slice(-3)}`;
};

export function OtpVerificationButton({
  channel,
  target,
  verified,
  onVerified,
  onAvailabilityChange,
  className,
  label = "Verify",
  verifiedVariant = "outline",
  marketForm,
  marketApplicationId,
  onMarketApplicationCreated,
  relatedEmail,
  relatedWhatsapp,
}: OtpVerificationButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [otpTarget, setOtpTarget] = useState("");
  const [resolvedApplicationId, setResolvedApplicationId] = useState(marketApplicationId || "");
  const [pendingPayment, setPendingPayment] = useState<MarketPaymentDetails | null>(null);
  const [checkingRegistration, setCheckingRegistration] = useState(false);

  const verificationStorageKey = marketForm
    ? `market-${marketForm}-${channel}-verification`
    : "";

  useEffect(() => {
    if (!verificationStorageKey || !isValidTarget(channel, target)) return;
    try {
      const saved = JSON.parse(
        window.sessionStorage.getItem(verificationStorageKey) || "null",
      ) as {
        target?: string;
        verificationToken?: string;
        marketApplicationId?: string;
        expiresAt?: number;
      } | null;
      if (
        saved?.target === target &&
        saved.verificationToken &&
        Number(saved.expiresAt || 0) > Date.now()
      ) {
        if (saved.marketApplicationId) {
          setResolvedApplicationId(saved.marketApplicationId);
          onMarketApplicationCreated?.(saved.marketApplicationId);
        }
        onAvailabilityChange?.(true);
        onVerified(saved.verificationToken);
      }
    } catch {
      window.sessionStorage.removeItem(verificationStorageKey);
    }
    // Parent callbacks are intentionally omitted because forms pass inline
    // handlers; restoration should run only when the saved target changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, marketForm, target, verificationStorageKey]);

  useEffect(() => {
    if (marketApplicationId) setResolvedApplicationId(marketApplicationId);
  }, [marketApplicationId]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timerId = window.setInterval(
      () => setResendTimer((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => window.clearInterval(timerId);
  }, [resendTimer]);

  const sendOtp = async (applicationIdOverride?: string) => {
    setError("");
    if (!isValidTarget(channel, target)) {
      setError(
        channel === "email"
          ? "Please enter a valid email address first."
          : "Please enter a valid WhatsApp number with country code first.",
      );
      return;
    }

    try {
      setIsSending(true);
      const result = await sendVerificationOtp(
        channel,
        target,
        marketForm,
        applicationIdOverride || resolvedApplicationId || marketApplicationId,
        {
          email: relatedEmail?.trim().toLowerCase(),
          whatsappNumber: relatedWhatsapp?.trim(),
        },
      );
      if (result.marketApplicationId) {
        setResolvedApplicationId(result.marketApplicationId);
        onMarketApplicationCreated?.(result.marketApplicationId);
      }
      onAvailabilityChange?.(true);
      setOtpTarget(target);
      setOtpSent(true);
      setOtp("");
      setResendTimer(result.resendAfter || 30);
    } catch (caughtError) {
      const requestError = caughtError as Error & { code?: string };
      const message = requestError instanceof Error ? requestError.message : "Unable to send OTP.";
      if (requestError?.code === "MEMBER_EXISTS") {
        onAvailabilityChange?.(false, message);
        setOtpSent(false);
        setOpen(false);
      } else {
        setError(message);
      }
    } finally {
      setIsSending(false);
    }
  };

  const startVerification = async () => {
    if (!target || !target.trim()) {
      alert(
        channel === "email"
          ? "Please enter your email address first."
          : "Please enter your WhatsApp number first.",
      );
      return;
    }

    if (!isValidTarget(channel, target)) {
      alert(
        channel === "email"
          ? "Please enter a valid email address before requesting an OTP."
          : "Please enter a valid WhatsApp number with country code before requesting an OTP.",
      );
      return;
    }

    if (otpTarget !== target) {
      setOtp("");
      setOtpSent(false);
      setError("");
      setResendTimer(0);
    }
    if (channel === "email" && marketForm) {
      try {
        setCheckingRegistration(true);
        const result = await checkMarketRegistration(
          marketForm,
          target,
          resolvedApplicationId || marketApplicationId,
        );
        if (result.data?.status === "pending_payment" && result.data.payment) {
          onAvailabilityChange?.(true);
          setPendingPayment(result.data.payment);
          return;
        }
        if (result.data?.status === "paid") {
          onAvailabilityChange?.(false, "This email address is already registered and payment is complete.");
          return;
        }
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Unable to check registration status.");
        setOpen(true);
        return;
      } finally {
        setCheckingRegistration(false);
      }
    }
    setOpen(true);
    if (otpTarget !== target || !otpSent) void sendOtp();
  };

  const continueToPayment = () => {
    if (!pendingPayment || !marketForm) return;
    window.sessionStorage.setItem(
      "market_payment_data",
      JSON.stringify({ form: marketForm, payment: pendingPayment }),
    );
    router.push(
      `/payments?form=${marketForm}&id=${pendingPayment.applicationId}&token=${encodeURIComponent(pendingPayment.accessToken)}`,
    );
  };

  const fillAgain = () => {
    if (!pendingPayment) return;
    const applicationId = pendingPayment.applicationId;
    setResolvedApplicationId(applicationId);
    onMarketApplicationCreated?.(applicationId);
    onAvailabilityChange?.(true);
    setPendingPayment(null);
    setOpen(true);
    window.setTimeout(() => void sendOtp(applicationId), 0);
  };

  const verifyOtp = async () => {
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    if (otpTarget !== target) {
      setError("This value changed. Please request a new OTP.");
      return;
    }

    try {
      setIsVerifying(true);
      const result = await verifyVerificationOtp(
        channel,
        target,
        otp,
        marketForm,
        resolvedApplicationId || marketApplicationId,
      );
      const verificationToken = result.verificationToken as string;
      if (verificationStorageKey) {
        window.sessionStorage.setItem(
          verificationStorageKey,
          JSON.stringify({
            target,
            verificationToken,
            marketApplicationId: resolvedApplicationId || marketApplicationId || "",
            // Kept only for this browser session and aligned with the backend token TTL.
            expiresAt: Date.now() + 12 * 60 * 60 * 1000,
          }),
        );
      }
      onVerified(verificationToken);
      setOpen(false);
    } catch (caughtError) {
      const requestError = caughtError as Error & { code?: string };
      const message = requestError instanceof Error ? requestError.message : "OTP verification failed.";
      if (requestError?.code === "MEMBER_EXISTS") {
        onAvailabilityChange?.(false, message);
        setOtpSent(false);
        setOpen(false);
      } else {
        setError(message);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const hasTarget = Boolean(target && target.trim());

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant={verified ? verifiedVariant : "outline"}
        onClick={startVerification}
        disabled={verified || !hasTarget || checkingRegistration}
        title={
          verified
            ? "Already verified"
            : !hasTarget
            ? channel === "email"
              ? "Please enter an email address first"
              : "Please enter a WhatsApp number first"
            : "Click to verify with OTP"
        }
        className={className}
      >
        {checkingRegistration ? (
          <Loader2 className="size-4 animate-spin" />
        ) : verified ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="size-3.5" /> Verified
          </span>
        ) : (
          label
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mb-1 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              {channel === "email" ? <Mail className="size-5" /> : <MessageCircle className="size-5" />}
            </div>
            <DialogTitle>
              Verify your {channel === "email" ? "email" : "WhatsApp number"}
            </DialogTitle>
            <DialogDescription>
              {otpSent
                ? `Enter the 6-digit code sent to ${maskTarget(channel, target)}. It expires in 5 minutes.`
                : `We are sending a verification code to ${maskTarget(channel, target)}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <input
              aria-label="6-digit OTP"
              autoComplete="one-time-code"
              autoFocus
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void verifyOtp();
                }
              }}
              disabled={!otpSent || isSending}
              className="w-full rounded-md border border-input bg-background px-3 py-3 text-center font-mono text-lg tracking-[0.35em] shadow-xs outline-none transition-colors placeholder:text-sm placeholder:tracking-normal focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
            />
            {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
          </div>

          <DialogFooter className="items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isSending || resendTimer > 0}
              onClick={() => void sendOtp()}
            >
              {isSending ? (
                <><Loader2 className="size-4 animate-spin" /> Sending...</>
              ) : resendTimer > 0 ? (
                `Resend in ${resendTimer}s`
              ) : (
                "Resend OTP"
              )}
            </Button>
            <Button
              type="button"
              disabled={!otpSent || otp.length !== 6 || isVerifying}
              onClick={() => void verifyOtp()}
            >
              {isVerifying ? (
                <><Loader2 className="size-4 animate-spin" /> Verifying...</>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(pendingPayment)} onOpenChange={(nextOpen) => !nextOpen && setPendingPayment(null)}>
        <DialogContent
          className="overflow-hidden border-0 p-0 shadow-2xl sm:max-w-[500px]"
          overlayClassName="bg-slate-950/60 backdrop-blur-[2px]"
        >
          <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-primary" />
          <DialogHeader className="gap-0 px-6 pb-0 pt-6 text-left sm:px-8 sm:pt-8">
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-8 ring-amber-50 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/5">
              <CreditCard className="size-7" />
            </div>
            <DialogTitle className="text-2xl font-semibold tracking-tight sm:text-[26px]">
              Your profile is ready
            </DialogTitle>
            <DialogDescription className="mt-2 text-[15px] leading-6">
              Your profile is complete, but the verification payment is still pending.
            </DialogDescription>
          </DialogHeader>

          <div className="mx-6 flex items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 dark:border-amber-500/20 dark:bg-amber-500/10 sm:mx-8">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300" />
            <div>
              <p className="text-sm font-semibold text-foreground">No need to create a new profile</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Continue to your receipt to complete payment, or reopen the form if you need to change any details first.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-3 border-t bg-muted/30 px-6 py-5 sm:flex-row sm:px-8">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={fillAgain}
              className="h-11 flex-1 rounded-lg bg-background"
            >
              <RotateCcw className="size-4" />
              Fill Again
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={continueToPayment}
              className="h-11 flex-1 rounded-lg shadow-md shadow-primary/20"
            >
              Go to Payment
              <ArrowRight className="size-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
