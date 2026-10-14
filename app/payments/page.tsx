"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, FileQuestion, Loader2 } from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketVerificationPayment } from "@/components/market-verification-payment";
import {
  type MarketForm,
  type MarketPaymentDetails,
  refreshMarketPayment,
} from "@/lib/api";

function PaymentsContent() {
  const searchParams = useSearchParams();
  const formParam = (searchParams.get("form") as MarketForm) || "buyers";
  const idParam = searchParams.get("id") || "";
  const tokenParam = searchParams.get("token") || "";

  const [form, setForm] = useState<MarketForm>(formParam);
  const [payment, setPayment] = useState<MarketPaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const initPayment = async () => {
      try {
        // 1. Try reading from sessionStorage
        const savedSession = sessionStorage.getItem("market_payment_data");
        if (savedSession) {
          const parsed = JSON.parse(savedSession) as {
            form: MarketForm;
            payment: MarketPaymentDetails;
          };
          if (parsed?.payment) {
            setForm(parsed.form || formParam);
            setPayment(parsed.payment);
            setIsLoading(false);

            // Refresh latest order/pricing from backend
            try {
              const refreshed = await refreshMarketPayment(parsed.form || formParam, parsed.payment);
              if (!cancelled && refreshed.data) {
                setPayment(refreshed.data);
                sessionStorage.setItem(
                  "market_payment_data",
                  JSON.stringify({ form: parsed.form || formParam, payment: refreshed.data })
                );
              }
            } catch {
              // Keep active session payment if refresh fails
            }
            return;
          }
        }

        // 2. Fallback: try restoring from URL query parameters (id & token)
        if (idParam && tokenParam) {
          const targetForm = formParam === "sellers" ? "sellers" : "buyers";
          setForm(targetForm);
          const stubPayment = {
            applicationId: idParam,
            accessToken: tokenParam,
          } as MarketPaymentDetails;

          const refreshed = await refreshMarketPayment(targetForm, stubPayment);
          if (!cancelled && refreshed.data) {
            setPayment(refreshed.data);
            sessionStorage.setItem(
              "market_payment_data",
              JSON.stringify({ form: targetForm, payment: refreshed.data })
            );
            setIsLoading(false);
            return;
          }
        }

        if (!cancelled) {
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to retrieve payment details.");
          setIsLoading(false);
        }
      }
    };

    void initPayment();

    return () => {
      cancelled = true;
    };
  }, [formParam, idParam, tokenParam]);

  const handlePaid = () => {
    sessionStorage.removeItem("market_payment_data");
    sessionStorage.removeItem("market-buyers-draft");
    sessionStorage.removeItem("market-sellers-draft");
    setIsPaid(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-md shadow-xs">
        <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo compactOnMobile />
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-2 hover:bg-white/50 dark:hover:bg-white/10"
            >
              <Link href="/">
                <ArrowLeft className="size-4" />
                <span>Back to Market</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden md:inline-flex hover:bg-white/50 dark:hover:bg-white/10"
            >
              <Link href="/terms">Terms</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-1 hero-ambient-flow py-12 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="animate-float-slow absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-600/15 sm:h-96 sm:w-96" />
          <div className="animate-float-reverse absolute -right-20 top-10 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-600/15 sm:h-96 sm:w-96" />
          <div className="animate-float-drift absolute left-1/4 top-1/3 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-600/15 sm:h-80 sm:w-80" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl">
          {isLoading ? (
            <Card className="mx-auto border-border/60 bg-card/95 p-12 text-center shadow-lg backdrop-blur-sm">
              <Loader2 className="mx-auto size-8 animate-spin text-primary" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                Loading payment details...
              </p>
            </Card>
          ) : isPaid ? (
            <Card className="mx-auto border-border/60 bg-card/95 p-8 text-center shadow-lg backdrop-blur-sm">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-8" />
              </span>
              <CardTitle className="mt-4 text-2xl font-bold">Payment Successful!</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Your verification payment has been received and verified successfully.
              </p>
              <div className="my-6 rounded-xl border bg-muted/30 p-4 text-sm space-y-2">
                <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                  Your Basic B2B plan is now active for one month.
                </p>
                <p className="text-xs text-muted-foreground">
                  Your dashboard credentials and login details have been emailed to your registered email address.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/">Back to Marketplace</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={form === "sellers" ? "/sellers" : "/buyers"}>
                    {form === "sellers" ? "Seller Registration" : "Submit Another Requirement"}
                  </Link>
                </Button>
              </div>
            </Card>
          ) : payment ? (
            <MarketVerificationPayment
              form={form}
              payment={payment}
              onPaid={handlePaid}
            />
          ) : (
            <Card className="mx-auto border-border/60 bg-card/95 p-8 text-center shadow-lg backdrop-blur-sm">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <FileQuestion className="size-6" />
              </span>
              <CardTitle className="mt-4 text-xl">No active payment found</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                {error || "We could not find an active payment receipt session. Please submit your registration or enquiry to proceed."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild>
                  <Link href="/buyers">Post a Requirement</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/sellers">Register as Seller</Link>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <PaymentsContent />
    </Suspense>
  );
}
