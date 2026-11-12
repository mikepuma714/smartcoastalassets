/**
 * Marketing communications consent shown on every inquiry form.
 *
 * Any change to CONSENT_TEXT must ship with a new CONSENT_VERSION so stored
 * consent records always identify the exact language the visitor saw.
 * Final language and implementation must be approved by legal counsel.
 */
export const CONSENT_VERSION = "2026-11-12.v1";
export const FORM_VERSION = "inquiry-form.v1";

export const CONSENT_HEADING = "MARKETING COMMUNICATIONS CONSENT";

export const CONSENT_TEXT =
  "By checking this box, I agree to receive marketing and promotional telephone calls, text messages, and emails from Century 21 Beggins Enterprises and the specifically identified affiliated real estate brokerages listed here Beggins Enterprises, BE3,LLC Jeffrey James Beggins, PA, List with Beggins, LLC, My Way, LLC, regarding Smart Coastal Assets properties and related real estate opportunities, at the telephone number and email address I provided. I authorize these communications to be made using automated technology, automated telephone dialing systems, artificial or prerecorded voice messages, AI-generated voice calls, and AI-assisted messaging or follow-up. I understand that my consent is not required to purchase any property or service or to submit an inquiry. Message and data rates may apply. Message frequency varies. I may revoke my consent at any time, including by replying STOP to a text message or following the unsubscribe instructions in an email. By checking this box and clicking Submit, I provide my electronic signature authorizing these communications. See our Privacy Policy and Terms of Use.";

/** Senders named in CONSENT_TEXT, recorded with each consent for verification. */
export const CONSENT_SENDERS = [
  "Century 21 Beggins Enterprises",
  "Beggins Enterprises",
  "BE3, LLC",
  "Jeffrey James Beggins, PA",
  "List with Beggins, LLC",
  "My Way, LLC",
];

export const CONSENT_CHANNELS = ["phone_call", "sms", "email", "automated_dialer", "prerecorded_voice", "ai_voice", "ai_messaging"] as const;
