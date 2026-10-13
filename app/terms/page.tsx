import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileCheck,
  FileText,
  Gavel,
  HelpCircle,
  Lock,
  Mail,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteOrigin } from "@/url";

export const metadata: Metadata = {
  title: "Chinaindiasourcing: Terms & Conditions",
  description:
    "Terms and Conditions for Chinaindiasourcing operated by Life Changing Networks Pvt. Ltd., an authorised partner of SellersLogin.com.",
  alternates: {
    canonical: `${siteOrigin}/terms`,
  },
};

const sections = [
  { id: "operator-partnership", number: "1", title: "Operator and Partnership" },
  { id: "acceptance-eligibility", number: "2", title: "Acceptance and Eligibility" },
  { id: "role-of-platform", number: "3", title: "Role of the Platform" },
  { id: "registration-verification", number: "4", title: "Registration and Verification" },
  { id: "agent-obligations", number: "5", title: "Agent Obligations" },
  { id: "buyer-obligations", number: "6", title: "Buyer Obligations" },
  { id: "lead-sharing", number: "7", title: "Lead Sharing and Lead Sales" },
  { id: "data-access-sellerslogin", number: "8", title: "Data Access by SellersLogin" },
  { id: "data-use-privacy", number: "9", title: "Data Use and Privacy" },
  { id: "off-platform-dealings", number: "10", title: "Off-Platform Dealings and Fraud Disclaimer" },
  { id: "non-circumvention", number: "11", title: "Non-Circumvention" },
  { id: "fees-subscriptions-refunds", number: "12", title: "Fees, Subscriptions and Refunds" },
  { id: "content-ip", number: "13", title: "Content and Intellectual Property" },
  { id: "prohibited-conduct", number: "14", title: "Prohibited Conduct" },
  { id: "disclaimer-liability", number: "15", title: "Disclaimer and Limitation of Liability" },
  { id: "indemnity", number: "16", title: "Indemnity" },
  { id: "suspension-termination", number: "17", title: "Suspension and Termination" },
  { id: "governing-law-jurisdiction", number: "18", title: "Governing Law and Jurisdiction" },
  { id: "grievance-officer", number: "19", title: "Grievance Officer" },
  { id: "changes-to-terms", number: "20", title: "Changes to Terms" },
  { id: "general-clauses", number: "21", title: "General Clauses" },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-50 transition-colors duration-200 border-b border-transparent bg-transparent backdrop-blur-md">
        <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo compactOnMobile />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex gap-2">
              <Link href="/">
                <ArrowLeft className="size-4" />
                <span>Back to Market</span>
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Title Section */}
      <section className="relative -mt-16 overflow-hidden border-b border-border/40 hero-ambient-flow pt-24 pb-12 sm:pb-16">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-start">
            <Badge variant="secondary" className="px-3 py-1 font-medium">
              <Scale className="mr-1.5 size-3.5" /> Legal Terms
            </Badge>
            <Badge variant="outline" className="px-3 py-1 font-medium text-muted-foreground">
              Last Updated: October 5, 2026
            </Badge>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Chinaindiasourcing: Terms &amp; Conditions
          </h1>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            This Platform is owned and operated by <strong className="text-foreground font-semibold">Life Changing Networks Pvt. Ltd.</strong>, an authorised partner of <strong className="text-foreground font-semibold">SellersLogin.com</strong>. Please read these terms carefully before accessing or registering on the platform.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <Button size="sm" variant="default" asChild>
              <a href="#safety">
                <ShieldAlert className="size-4" /> Sourcing Safety Notices
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="#consent-checkboxes">
                <CheckCircle2 className="size-4" /> User Consent Disclosures
              </a>
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <a href="#grievance-officer">
                <HelpCircle className="size-4" /> Grievance Officer
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Safety Notices Alert Banner */}
      <section id="safety" className="scroll-mt-24 py-8 bg-amber-50/50 dark:bg-amber-950/15 border-b border-amber-200/50 dark:border-amber-900/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Alert className="border-amber-300/80 bg-amber-100/70 dark:border-amber-800/60 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 shadow-xs">
            <ShieldAlert className="size-5 text-amber-700 dark:text-amber-400 mt-0.5" />
            <AlertTitle className="text-base font-semibold text-amber-900 dark:text-amber-200">
              Crucial Safety &amp; Anti-Fraud Notice for All Buyers
            </AlertTitle>
            <AlertDescription className="mt-2 text-sm leading-6 text-amber-900/90 dark:text-amber-200/90 space-y-2">
              <p className="font-medium text-base">
                &ldquo;Never pay advance money to unverified parties. Inspect goods before shipment.&rdquo;
              </p>
              <p>
                Always engage certified third-party inspection agencies and utilize protected payment channels for all China and India sourcing transactions. Any direct payments made outside verified platform escrow or authorized mechanisms are conducted at your sole risk.
              </p>
              <p className="pt-1 text-xs font-semibold">Suspected fraud should be reported through the platform support channel.</p>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Consent Checkboxes Highlight Banner */}
      <section id="consent-checkboxes" className="scroll-mt-24 py-8 bg-blue-50/40 dark:bg-blue-950/10 border-b border-border/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-blue-200/70 bg-card p-6 shadow-xs dark:border-blue-900/50">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
              <CheckCircle2 className="size-4" />
              <span>Mandatory Registration Consent Disclosures</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              In strict accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and international data protection standards, the following consents are gathered via explicit, separate, unticked checkboxes during user onboarding:
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/70 bg-background/80 p-4">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Consent Box 1 — Lead Sharing
                </span>
                <blockquote className="mt-2 text-sm italic text-foreground font-medium border-l-2 border-primary pl-3">
                  &ldquo;I agree that my inquiries and business details may be shared with verified Agents for sourcing and lead-generation purposes.&rdquo;
                </blockquote>
                <p className="mt-2 text-xs text-muted-foreground">
                  Can be withdrawn at any time through the platform support channel.
                </p>
              </div>

              <div className="rounded-lg border border-border/70 bg-background/80 p-4">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Consent Box 2 — SellersLogin Data Access
                </span>
                <blockquote className="mt-2 text-sm italic text-foreground font-medium border-l-2 border-primary pl-3">
                  &ldquo;I understand that Chinaindiasourcing is operated by Life Changing Networks Pvt. Ltd., an authorized partner of SellersLogin.com, and I consent to SellersLogin accessing my Platform data for the purposes described in the Terms and Privacy Policy.&rdquo;
                </blockquote>
                <p className="mt-2 text-xs text-muted-foreground">
                  Access granted for service operation, lead generation, verification, and compliance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout with Table of Contents */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[260px_1fr] items-start">
            {/* Sticky Table of Contents on Desktop */}
            <aside className="hidden lg:block sticky top-24 rounded-xl border border-border/60 bg-card p-4 max-h-[calc(100vh-8rem)] overflow-y-auto text-xs space-y-1">
              <p className="font-semibold text-foreground mb-3 text-sm px-2">Table of Contents</p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground line-clamp-1"
                >
                  <span className="font-medium mr-1">{section.number}.</span> {section.title}
                </a>
              ))}
            </aside>

            {/* Document Body */}
            <div className="space-y-10 text-foreground leading-relaxed text-sm sm:text-base">
              {/* Section 1 */}
              <article id="operator-partnership" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">1</span>
                  <h2>Operator and Partnership</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    The Platform (known as <strong>Chinaindiasourcing</strong>) is owned, managed, and operated by <strong className="text-foreground">Life Changing Networks Pvt. Ltd.</strong> (hereinafter referred to as the &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;).
                  </p>
                  <p>
                    The Company is an authorized partner of <strong className="text-foreground">SellersLogin.com</strong>, an established e-commerce enablement company that helps businesses sell products online worldwide.
                  </p>
                  <p>
                    Certain Platform services, operational tools, matchmaking algorithms, lead delivery systems, and underlying technology infrastructure are provided, maintained, or supported directly through this strategic partnership.
                  </p>
                </div>
              </article>

              {/* Section 2 */}
              <article id="acceptance-eligibility" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">2</span>
                  <h2>Acceptance and Eligibility</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    By browsing, accessing, registering an account on, or submitting inquiries to the Platform, you acknowledge that you have read, understood, and unconditionally agree to be bound by these Terms and Conditions in full.
                  </p>
                  <p>
                    All users must be at least <strong className="text-foreground">18 years of age</strong> and have the legal capacity to enter into binding agreements.
                  </p>
                  <p>
                    If you are registering or transacting on behalf of a company, partnership, or other commercial entity, you represent and warrant that you are duly authorized to represent and legally bind that business entity to these Terms.
                  </p>
                </div>
              </article>

              {/* Section 3 */}
              <article id="role-of-platform" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">3</span>
                  <h2>Role of the Platform</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    Chinaindiasourcing operates strictly as an <strong>introduction, directory, and lead-generation platform</strong> for international trade.
                  </p>
                  <p>
                    The Platform is <strong>not a party to any contract, negotiation, agreement, purchase order, or arrangement</strong> executed between a Buyer and an Agent, Sourcing Partner, Manufacturer, or Seller.
                  </p>
                  <p>
                    The Platform does not manufacture, store, inspect, pack, or ship goods, nor does it guarantee the merchantability, quality, technical compliance, pricing, delivery schedule, payment release, solvency, or commercial outcomes of any transaction arranged between users.
                  </p>
                </div>
              </article>

              {/* Section 4 */}
              <article id="registration-verification" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">4</span>
                  <h2>Registration and Verification</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    All information provided during registration or profile creation must be authentic, accurate, complete, and kept current at all times.
                  </p>
                  <p>
                    <strong>Verification Badges:</strong> Verification badges or status indicators shown on user profiles signify solely that basic documentation (such as business registration, tax certificates, or contact verifications) was submitted for administrative screening. They do not constitute an endorsement, warranty, or guarantee of a user&apos;s honesty, technical capability, financial standing, or performance.
                  </p>
                  <p>
                    Users are permitted only <strong>one account per business entity</strong>. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
                  </p>
                </div>
              </article>

              {/* Section 5 */}
              <article id="agent-obligations" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">5</span>
                  <h2>Agent Obligations</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    Sourcing agents, buying agents, freight forwarders, and service providers must provide true, verifiable company information, credentials, and operational capabilities.
                  </p>
                  <p>
                    Agents must not misrepresent factory ownership, direct manufacturing relationships, product certifications, export licenses, or sample pricing.
                  </p>
                  <p>
                    Agents must respond to Buyer inquiries and requests for quotation (RFQs) in a prompt, professional, and transparent manner.
                  </p>
                </div>
              </article>

              {/* Section 6 */}
              <article id="buyer-obligations" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">6</span>
                  <h2>Buyer Obligations</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    Buyers must submit genuine, bona fide trade inquiries with valid commercial specifications, quantities, and realistic delivery targets.
                  </p>
                  <p>
                    The posting of fake inquiries, false RFQs, automated data harvesting, price-testing spam, or competitor espionage is strictly prohibited and subject to immediate account termination.
                  </p>
                  <p>
                    Buyers must act in good faith and conduct their own independent due diligence, factory inspections, sample verifications, and credit checks prior to committing commercial funds.
                  </p>
                </div>
              </article>

              {/* Section 7 */}
              <article id="lead-sharing" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">7</span>
                  <h2>Lead Sharing and Lead Sales</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    Buyers&apos; submitted inquiries, RFQs, business names, contact details, and sourcing requirements may be shared with or sold to verified Agents or sourcing providers, with or without a fee.
                  </p>
                  <p>
                    <strong>Explicit Consent:</strong> Buyers consent to lead sharing through an explicit, separate, unticked checkbox at the time of registration or inquiry submission.
                  </p>
                  <p>
                    Consent may be revoked at any time by submitting written notice through the platform support channel. Any revocation takes effect prospectively for future lead sharing and does not affect data already transmitted in good faith.
                  </p>
                  <p>
                    Sharing is strictly restricted to legitimate sourcing, procurement, and international trade purposes.
                  </p>
                  <p>
                    Agents receiving leads may use them solely to communicate directly with the Buyer in response to the specific inquiry. Reselling, republishing, syndicating, transferring, or spamming leads is strictly forbidden.
                  </p>
                  <p>
                    All leads are provided on an <strong>&ldquo;as is&rdquo; basis</strong>, with no warranty of conversion, response rate, financial viability, or exclusivity unless expressly confirmed in writing.
                  </p>
                  <p>
                    Lead purchase fees are non-refundable, except where invalid contact details (e.g., non-working phone number and invalid email address) are formally reported within our defined Lead Refund Policy window.
                  </p>
                </div>
              </article>

              {/* Section 8 */}
              <article id="data-access-sellerslogin" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">8</span>
                  <h2>Data Access by SellersLogin</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    Because the Company is an authorized partner of SellersLogin.com, SellersLogin has access to data collected through the Platform, including but not limited to: registration information, company profiles, product listings, trade inquiries, RFQ specifications, contact details, lead history, and on-platform interactions.
                  </p>
                  <p>
                    <strong>Permitted Purposes:</strong> Operating and maintaining the Platform, customer support, identity and account verification, fraud prevention, matchmaking automation, trade analytics, related e-commerce service offerings, and statutory legal compliance.
                  </p>
                  <p>
                    All shared data is handled under strict confidentiality safeguards in compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>. For further details on how SellersLogin processes data, please consult the{" "}
                    <a
                      href="https://www.sellerslogin.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline font-medium"
                    >
                      SellersLogin Privacy Policy
                    </a>.
                  </p>
                  <p>
                    Consent for SellersLogin data access is captured via an explicit, separate, unticked checkbox at registration. Users may withdraw consent or request data erasure at any time, subject to legal record-keeping obligations. Note that withdrawing consent may limit access to specific integrated Platform services.
                  </p>
                </div>
              </article>

              {/* Section 9 */}
              <article id="data-use-privacy" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">9</span>
                  <h2>Data Use and Privacy</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    Business profiles, trade inquiries, and relevant contact details are made visible to other registered users for commercial trade discovery and matchmaking.
                  </p>
                  <p>
                    Information may be processed with vetted third-party technical vendors (e.g., hosting, SMS/WhatsApp notification, payment gateways) under binding non-disclosure agreements.
                  </p>
                  <p>
                    Anonymized, aggregated trade data may be utilized by the Company for industry benchmarking, market analytics, and platform optimization.
                  </p>
                  <p>
                    Personal data is <strong>never sold to unrelated third parties</strong> by either Life Changing Networks Pvt. Ltd. or SellersLogin without explicit consent.
                  </p>
                  <p>
                    Data handling adheres strictly to the <strong>DPDP Act 2023</strong> and the <strong>Information Technology Act, 2000</strong>. For users accessing the Platform from the European Union or the People&apos;s Republic of China, compliance with the General Data Protection Regulation (GDPR) and the Personal Information Protection Law (PIPL) is maintained where applicable.
                  </p>
                </div>
              </article>

              {/* Section 10 */}
              <article id="off-platform-dealings" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">10</span>
                  <h2>Off-Platform Dealings and Fraud Disclaimer</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    Any communication, negotiation, agreement, wire transfer, or cash payment conducted outside the Platform takes place entirely at the users&apos; own risk.
                  </p>
                  <p>
                    The Company, its partners, and directors <strong>bear no liability whatsoever for fraud, misrepresentation, non-delivery of merchandise, transit defects, customs seizure, or payment defaults</strong> resulting from off-platform dealings, regardless of whether the counterparties originally met through Chinaindiasourcing.
                  </p>
                  <p>
                    Users must thoroughly verify counterparty credentials, utilize independent pre-shipment inspection agencies, and rely on secure, documented escrow or letter of credit mechanisms.
                  </p>
                  <p>
                    Suspected fraud, unethical behavior, or impersonation should be reported immediately through the platform support channel.
                    The Platform reserves the right to suspend offending accounts and cooperate fully with law enforcement authorities, but holds no obligation to recover private financial losses.
                  </p>
                </div>
              </article>

              {/* Section 11 */}
              <article id="non-circumvention" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">11</span>
                  <h2>Non-Circumvention</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    Users agree not to exploit introductions, quotes, or supplier connections established via the Platform to knowingly circumvent the Platform, its service fees, verification requirements, or package terms.
                  </p>
                  <p>
                    This non-circumvention covenant applies for a reasonable period of <strong className="text-foreground">twelve (12) to twenty-four (24) months</strong> following the date of first introduction between the respective parties on the Platform.
                  </p>
                </div>
              </article>

              {/* Section 12 */}
              <article id="fees-subscriptions-refunds" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">12</span>
                  <h2>Fees, Subscriptions and Refunds</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    All membership plans, agent listing packages, buyer assistance subscriptions, applicable Goods and Services Tax (GST), billing cycles, and renewal terms are clearly displayed at checkout.
                  </p>
                  <p>
                    Platform subscription and lead fees purchase access to matchmaking tools, visibility, and coordination features. <strong>Fees do not guarantee completed commercial orders, factory acceptance, or specific business turnover.</strong>
                  </p>
                  <p>
                    Refunds are issued solely under the specific terms of the purchased package or our documented refund commitment policy.
                  </p>
                </div>
              </article>

              {/* Section 13 */}
              <article id="content-ip" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">13</span>
                  <h2>Content and Intellectual Property</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    Users retain ownership of their company logos, product photography, and proprietary catalog data. By uploading content, you grant the Platform a non-exclusive, worldwide, royalty-free license to display, translate, index, and promote such content in connection with our services.
                  </p>
                  <p>
                    The listing, manufacturing request, or brokering of counterfeit goods, unauthorized replicas, copyrighted designs, or patented inventions without valid manufacturer authorization is strictly prohibited.
                  </p>
                  <p>
                    The Platform reserves the right to promptly delist, redact, or purge any content that infringes upon third-party intellectual property rights upon notification.
                  </p>
                </div>
              </article>

              {/* Section 14 */}
              <article id="prohibited-conduct" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">14</span>
                  <h2>Prohibited Conduct</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>Users shall not engage in any of the following activities on the Platform:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Fraud, fraudulent RFQs, counterfeit escrow attempts, identity theft, or money laundering.</li>
                    <li>Advertising, offering, or sourcing hazardous, restricted, contraband, or illegal goods under Indian, Chinese, US, or international trade sanctions.</li>
                    <li>Automated web scraping, bot crawling, API abuse, bulk unsolicited messaging, or commercial spamming.</li>
                    <li>Harassment, defamation, extortion, posting fictitious reviews, hacking, injecting malware, or attempting unauthorized system access.</li>
                  </ul>
                </div>
              </article>

              {/* Section 15 */}
              <article id="disclaimer-liability" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">15</span>
                  <h2>Disclaimer and Limitation of Liability</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    The Platform and all tools are provided on an <strong className="text-foreground">&ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo;</strong> basis without warranties of any kind, whether express, implied, or statutory.
                  </p>
                  <p>
                    To the maximum extent permitted by applicable law, neither Life Changing Networks Pvt. Ltd., SellersLogin.com, nor their directors, officers, or affiliates shall be held liable for counterparty fraud, supplier breach, quality discrepancies, freight delays, demurrage, customs clearance penalties, lost profits, business interruption, or any indirect, incidental, special, or consequential damages.
                  </p>
                  <p>
                    In all circumstances, the Company&apos;s total cumulative liability arising out of or related to these Terms or the Platform shall be strictly capped at the <strong>total fees actually paid by the user to the Company in the twelve (12) months</strong> immediately preceding the claim.
                  </p>
                </div>
              </article>

              {/* Section 16 */}
              <article id="indemnity" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">16</span>
                  <h2>Indemnity</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    You agree to indemnify, defend, and hold harmless Life Changing Networks Pvt. Ltd., SellersLogin.com, and their directors, employees, and agents from any claims, suits, liabilities, losses, costs, damages, or expenses (including reasonable attorney fees) arising from:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Your use or misuse of the Platform;</li>
                    <li>Any content, listing, or inquiry submitted by you;</li>
                    <li>Any breach of these Terms or violation of applicable laws;</li>
                    <li>Any commercial dispute between you and any Buyer, Agent, or third party.</li>
                  </ul>
                </div>
              </article>

              {/* Section 17 */}
              <article id="suspension-termination" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">17</span>
                  <h2>Suspension and Termination</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    The Platform reserves the right to suspend or terminate user accounts, withdraw verification badges, or cancel active listings immediately and without notice in cases of:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Suspected fraud or misrepresentation;</li>
                    <li>Material breach of these Terms;</li>
                    <li>Unresolved buyer or agent grievances;</li>
                    <li>Legal or regulatory directive.</li>
                  </ul>
                  <p>
                    Users may terminate their account at any time by contacting support, provided all pending transactions and inquiries have been cleared.
                  </p>
                </div>
              </article>

              {/* Section 18 */}
              <article id="governing-law-jurisdiction" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">18</span>
                  <h2>Governing Law and Jurisdiction</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    These Terms, and all disputes arising out of or in connection with the Platform, shall be governed by, construed, and enforced in accordance with the substantive laws of <strong className="text-foreground">India</strong>.
                  </p>
                  <p>
                    <strong>Exclusive Jurisdiction:</strong> Any legal action, suit, claim, or dispute arising out of or relating to these Terms or the use of the Platform will be handled <strong>exclusively in Ghaziabad, Uttar Pradesh, India</strong>. The courts situated at Ghaziabad shall have sole and exclusive jurisdiction.
                  </p>
                  <p>
                    <strong>Arbitration:</strong> In the event the parties refer a dispute to arbitration, the seat and venue of arbitration shall be <strong className="text-foreground">Ghaziabad, Uttar Pradesh, India</strong>. The arbitration proceedings shall be conducted in the English language pursuant to the <strong>Arbitration and Conciliation Act, 1996</strong>.
                  </p>
                  <p>
                    Users are strongly encouraged to first attempt resolving any concerns or disputes amicably and in good faith through the platform support channel.
                  </p>
                </div>
              </article>

              {/* Section 19 */}
              <article id="grievance-officer" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">19</span>
                  <h2>Grievance Officer</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    In accordance with the Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the designated Grievance Officer details are published below:
                  </p>
                  <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm space-y-1.5 text-foreground">
                    <p><strong>Designation:</strong> Grievance Officer, Chinaindiasourcing</p>
                    <p><strong>Operating Entity:</strong> Life Changing Networks Pvt. Ltd.</p>
                    <p><strong>Jurisdiction / Office:</strong> Ghaziabad, Uttar Pradesh, India</p>
                    <p><strong>Contact:</strong> Platform support channel</p>
                    <p><strong>Response Timeline:</strong> Acknowledgment within 24 to 48 hours; full resolution within 15 business days.</p>
                  </div>
                </div>
              </article>

              {/* Section 20 */}
              <article id="changes-to-terms" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">20</span>
                  <h2>Changes to Terms</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    The Company reserves the right to amend, update, or revise these Terms at its sole discretion. Any material changes will be communicated via email or posted prominently on the Platform.
                  </p>
                  <p>
                    Your continued access or use of the Platform after the effective date of revisions constitutes acceptance of the modified Terms.
                  </p>
                  <p>
                    The &ldquo;Last updated&rdquo; timestamp at the top of this page indicates the effective date of the current version.
                  </p>
                </div>
              </article>

              {/* Section 21 */}
              <article id="general-clauses" className="scroll-mt-24 rounded-xl border border-border/50 bg-card p-6 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-sm">21</span>
                  <h2>General Clauses</h2>
                </div>
                <div className="mt-4 space-y-3 text-muted-foreground leading-7">
                  <p>
                    <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy and any written subscription terms, constitute the entire agreement between you and Life Changing Networks Pvt. Ltd. with respect to the Platform.
                  </p>
                  <p>
                    <strong>Severability:</strong> If any provision of these Terms is deemed unlawful or unenforceable by a court of competent jurisdiction, that provision shall be limited or severed, and the remaining provisions shall continue in full force and effect.
                  </p>
                  <p>
                    <strong>No Waiver:</strong> Our failure to exercise or enforce any right or provision shall not operate as a waiver of that right or future rights.
                  </p>
                  <p>
                    <strong>Assignment:</strong> The Company may assign its rights and duties under these Terms to an affiliate or successor without restriction. You may not assign your account or rights without our prior written consent.
                  </p>
                  <p>
                    <strong>Force Majeure:</strong> Neither party shall be held liable for non-performance or delay resulting from causes beyond reasonable control, including acts of God, global pandemics, government trade restrictions, civil unrest, war, port embargoes, customs gridlock, or major telecommunication outages.
                  </p>
                </div>
              </article>

              {/* Contact Summary Box */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
                <div className="flex items-center gap-3 text-foreground font-semibold text-lg">
                  <Building2 className="size-6 text-primary" />
                  <h3>Questions, Consent Changes, or Legal Notices?</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-6">
                  For formal legal communications, data consent withdrawal, or inquiries regarding Chinaindiasourcing, reach out to:
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
                  <div className="rounded-lg bg-card p-4 border border-border/60">
                    <p className="font-semibold text-foreground">Operating Company</p>
                    <p className="mt-1 text-muted-foreground">Life Changing Networks Pvt. Ltd.</p>
                    <p className="text-muted-foreground">Authorized Partner of SellersLogin.com</p>
                    <p className="text-muted-foreground">Ghaziabad, Uttar Pradesh, India</p>
                  </div>
                  <div className="rounded-lg bg-card p-4 border border-border/60 space-y-1">
                    <p className="font-semibold text-foreground">Direct Inquiries</p>
                    <p className="text-muted-foreground">Use the platform support channel for support, fraud, legal, or grievance inquiries.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
