import type { Metadata } from "next";
import Link from "next/link";
import { LegalDraftBanner } from "@/components/LegalDraftBanner";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${site.name}, including messaging terms and property information disclaimers.`,
  alternates: { canonical: "/terms" },
};

const EFFECTIVE = "November 12, 2026";

export default function TermsPage() {
  return (
    <article className="container-luxe max-w-3xl pt-32 pb-24 sm:pt-40">
      <LegalDraftBanner />
      <h1 className="text-5xl">Terms of Use</h1>
      <p className="mt-3 text-sm text-muted">Effective {EFFECTIVE}</p>

      <div className="mt-10 space-y-8 leading-relaxed text-ink/85 [&_h2]:mt-10 [&_h2]:text-3xl [&_li]:mt-1.5 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        <p>
          By using smartcoastalassets.com (the &ldquo;Site&rdquo;), operated by {site.brokerage}, you agree to these
          Terms of Use. If you do not agree, please do not use the Site.
        </p>

        <h2>Property information</h2>
        <ul>
          <li>Information on the Site is provided for general information only and is not an offer to sell or a solicitation where prohibited.</li>
          <li>Prices, availability, features, deposits, completion dates and terms are subject to change without notice and are governed by the purchase contract and developer documents.</li>
          <li>Renderings and illustrations are artist&rsquo;s conceptions. Dimensions and square footage are approximate.</li>
          <li>Rental income figures are estimates or historical figures from the sources noted and are not guaranteed.</li>
          <li>Nothing on the Site is tax, legal or financial advice. Consult your CPA, attorney and lender.</li>
        </ul>

        <h2>Text messaging terms</h2>
        <ul>
          <li>Program: {site.name} property updates and follow-up from {site.brokerage} and the affiliated brokerages named in the consent language.</li>
          <li>You will receive messages only if you provided express written consent. Consent is not a condition of purchase.</li>
          <li>Message frequency varies. Message and data rates may apply.</li>
          <li>Reply STOP to cancel at any time. Reply HELP for help, or contact {site.agent.phone}.</li>
          <li>Carriers are not liable for delayed or undelivered messages.</li>
          <li>
            See our <Link href="/privacy" className="text-navy-700 underline">Privacy Policy</Link> for how we handle your information.
          </li>
        </ul>

        <h2>Automated and AI-assisted communications</h2>
        <p>
          If you consent, communications may be made using automated technology, artificial or prerecorded voice,
          AI-generated voice and AI-assisted messaging. You may revoke consent at any time by any reasonable means,
          including replying STOP, using an email unsubscribe link, or visiting our{" "}
          <Link href="/unsubscribe" className="text-navy-700 underline">opt-out page</Link>.
        </p>

        <h2>Equal housing</h2>
        <p>We are committed to the letter and spirit of U.S. policy for fair housing. {site.legalFooter}</p>

        <h2>Intellectual property</h2>
        <p>Site content, including photography and renderings, is owned by us or our licensors and may not be reproduced without permission.</p>

        <h2>Limitation of liability</h2>
        <p>
          The Site is provided &ldquo;as is.&rdquo; To the fullest extent permitted by law, we are not liable for any
          damages arising from your use of the Site or reliance on its content.
        </p>

        <h2>Governing law</h2>
        <p>These Terms are governed by the laws of the State of Florida.</p>

        <h2>Contact</h2>
        <p>
          {site.brokerage} · {site.agent.email} · {site.agent.phone}
        </p>
      </div>
    </article>
  );
}
