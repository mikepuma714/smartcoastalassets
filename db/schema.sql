-- Smart Coastal Assets: inquiries and marketing-consent records.
-- Apply with: pnpm db:migrate

CREATE TABLE IF NOT EXISTS leads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  first_name      text NOT NULL,
  last_name       text NOT NULL,
  email           text NOT NULL,
  phone           text NOT NULL,
  phone_e164      text,
  project_slug    text,
  project_name    text NOT NULL,
  message         text,
  page_url        text,
  referrer        text,
  utm             jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address      text,
  user_agent      text,
  notified_at     timestamptz
);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads (lower(email));
CREATE INDEX IF NOT EXISTS leads_phone_idx ON leads (phone_e164);
CREATE INDEX IF NOT EXISTS leads_ip_idx ON leads (ip_address, created_at DESC);

-- One row per form submission, whether or not the box was checked.
-- Rows are never updated or deleted; revocations are recorded in suppressions.
CREATE TABLE IF NOT EXISTS consent_records (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id           uuid NOT NULL REFERENCES leads(id),
  recorded_at       timestamptz NOT NULL DEFAULT now(),
  consent_given     boolean NOT NULL,
  consent_version   text NOT NULL,
  consent_heading   text NOT NULL,
  consent_text      text NOT NULL,
  consent_text_sha256 text NOT NULL,
  senders           jsonb NOT NULL,
  channels          jsonb NOT NULL,
  form_version      text NOT NULL,
  email             text NOT NULL,
  phone             text NOT NULL,
  phone_e164        text,
  project_slug      text,
  project_name      text NOT NULL,
  page_url          text,
  ip_address        text,
  user_agent        text
);
CREATE INDEX IF NOT EXISTS consent_records_email_idx ON consent_records (lower(email), recorded_at DESC);
CREATE INDEX IF NOT EXISTS consent_records_phone_idx ON consent_records (phone_e164, recorded_at DESC);

-- Opt-outs. A suppression newer than the latest granted consent blocks marketing on that channel.
CREATE TABLE IF NOT EXISTS suppressions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  email        text,
  phone_e164   text,
  channel      text NOT NULL DEFAULT 'all',
  source       text NOT NULL,
  note         text,
  ip_address   text,
  CHECK (email IS NOT NULL OR phone_e164 IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS suppressions_email_idx ON suppressions (lower(email));
CREATE INDEX IF NOT EXISTS suppressions_phone_idx ON suppressions (phone_e164);
