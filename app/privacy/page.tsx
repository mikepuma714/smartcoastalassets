import type { Metadata } from "next";
import Link from "next/link";
import { LegalDraftBanner } from "@/components/LegalDraftBanner";
import { CONSENT_SENDERS } from "@/lib/consent";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} and ${site.brokerage} collect, use and protect your information, including marketing consent and opt-outs.`,
  alternates: { canonical: "/privacy" },
};

const EFFECTIVE = "November 12, 2026";

export default function PrivacyPage() {
  return (
    <article className="container-luxe max-w-3xl pt-32 pb-24 sm:pt-40">
      <LegalDraftBanner />
      <h1 className="text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted">Effective {EFFECTIVE}</p>

      <div className="mt-10 space-y-8 leading-relaxed text-ink/85 [&_h2]:mt-10 [&_h2]:text-3xl [&_li]:mt-1.5 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        <p>
          This Privacy Policy describes how {site.brokerage} (&ldquo;we,&rdquo; &ldquo;us&rdquo;), operating{" "}
          {site.name} at smartcoastalassets.com, collects, uses, shares and protects information when you visit this
          website or submit an inquiry.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>Information you provide: first and last name, email address, mobile phone number, project of interest and any message.</li>
          <li>
            Consent records: whether you checked the optional marketing consent box, the exact consent language and
            version displayed, the date and time, the page URL, your IP address and browser user agent.
          </li>
          <li>Campaign information from the link you used (for example UTM parameters or QR code source) and the referring page.</li>
          <li>Standard technical information collected by our hosting provider, such as IP address and request logs.</li>
        </ul>

        <h2>How we use information</h2>
        <ul>
          <li>To respond to your inquiry about a specific property, including by phone, text or email.</li>
          <li>To maintain records of your communication preferences and consent for compliance purposes.</li>
          <li>
            If, and only if, you provide marketing consent: to send marketing and promotional calls, texts and emails,
            which may use automated technology, artificial or prerecorded voice, AI-generated voice and AI-assisted
            messaging, as described in the consent language.
          </li>
          <li>To operate, secure and improve this website.</li>
        </ul>

        <h2>Who may contact you</h2>
        <p>Marketing communications you consent to may be sent by the following companies, identified in the consent language:</p>
        <ul>
          {CONSENT_SENDERS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h2>Sharing</h2>
        <p>
          We do not sell your personal information. We share information with service providers that help us operate
          the website and communicate with you (for example hosting, database, email, text messaging, telephony and AI
          communication providers), who may use it only to provide services to us. We may disclose information if
          required by law or to protect our rights.
        </p>
        <p>
          <strong>
            Mobile phone numbers and text-messaging opt-in data and consent are not shared with third parties or
            affiliates for their own marketing or promotional purposes.
          </strong>{" "}
          This does not apply to the companies named above acting under the consent you provided, or to service
          providers acting on our behalf.
        </p>

        <h2>Your choices and opting out</h2>
        <ul>
          <li>Marketing consent is optional and is not required to submit an inquiry or make any purchase.</li>
          <li>Reply STOP to any text message to stop texts. Reply HELP for help.</li>
          <li>Use the unsubscribe link in any marketing email.</li>
          <li>
            Use our <Link href="/unsubscribe" className="text-navy-700 underline">opt-out page</Link>, or contact us
            at {site.agent.email} or {site.agent.phone}, to revoke consent for any or all channels.
          </li>
        </ul>
        <p>We honor opt-outs across our calling, texting, email and AI follow-up systems within a reasonable time and as required by law.</p>

        <h2>Retention and security</h2>
        <p>
          We retain inquiry and consent records for at least five years, or longer if required by law, so that consent
          can be verified. Records are stored with access controls and encryption in transit. No method of transmission
          or storage is completely secure.
        </p>

        <h2>Children</h2>
        <p>This website is not directed to children under 18, and we do not knowingly collect their information.</p>

        <h2>Changes</h2>
        <p>We may update this policy. The effective date above shows when it was last changed.</p>

        <h2>Contact</h2>
        <p>
          {site.brokerage}
          <br />
          {site.agent.email} · {site.agent.phone}
        </p>
      </div>
    </article>
  );
}
