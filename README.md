# Smart Coastal Assets

Marketing site for luxury coastal residences in Pinellas County, FL. It is built with Next.js on Vercel.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build (run before pushing)
```

## Managing projects

Each project is a single JSON file in `content/projects/`. The file name must match the `slug` inside it, and the slug is used as the page URL: `/projects/<slug>`. There is no admin screen: you edit the file, commit it, and Vercel redeploys.

The `status` field controls where a project appears:

| status     | Homepage, map, cards | Project page | Use for                               |
| ---------- | -------------------- | ------------ | ------------------------------------- |
| `active`   | Yes                  | Yes          | Currently selling                     |
| `soldout`  | No                   | Yes, marked sold out | Sold out but kept for search and history |
| `draft`    | No                   | No           | Coming soon / still gathering details |
| `archived` | No                   | No           | Retired; file kept for records        |

`order` sets the sort order. Lower numbers appear first.

### Add a project

1. Copy an existing file, for example `content/projects/capri-townhomes.json`, to `content/projects/<new-slug>.json`.
2. Download the photos from a shared Google Drive folder (the folder must be shared as "anyone with the link"):
   ```bash
   pnpm fetch-drive <new-slug> "<drive folder link>"
   ```
   Files go to `assets-raw/<new-slug>/`, which is not committed. A subfolder whose name contains "floor" is saved as floor plans.
3. Compress the photos into web-ready WebP files:
   ```bash
   pnpm images
   ```
   This writes `public/projects/<new-slug>/…webp` and updates `content/image-manifest.json`. Rename the files to readable names before running it if you like.
4. Fill in the JSON:
   - **Required:** `name`, `address`, and `geo` (latitude and longitude for the map pin). To get coordinates, right-click the address in Google Maps.
   - **Price and stats:** `price` and `stats`.
   - **Photos:** `heroImage`, `gallery` (6–8 photos is ideal), and `floorplans`.
   - **Selling points:** up to 5 `highlights`, plus `amenities`.
   - **Terms:** `details` (deposit, financing, DSCR, rental minimum, management), plus `income`, `tax`, and `faqs`.
   - **Verification:** set `lastVerified` (YYYY-MM-DD) and the source for any income figure.
   - **Leave out anything that isn't confirmed.** Every optional section is hidden automatically when it is empty. `internalNotes` is never shown on the site.
5. Set `"status": "active"`, then run `pnpm build`. The build fails with a clear message if the file doesn't match the schema in `lib/project-schema.ts`.

The new project then appears on the homepage, the map, the inquiry form's project list, the sitemap, `llms.txt`, the FAQ, and the comparison guide.

### Edit, hide, or retire a project

- **Edit:** change the JSON and update `lastVerified`.
- **Sold out:** set `"status": "soldout"`. The project leaves the homepage and map, but its page stays live.
- **Hide or retire:** set the status to `draft` or `archived`. Never delete the file, because past inquiries reference its slug.

Placeholders already exist for Sandalwood, the 14500 Gulf Blvd resort, and Coastal Elegance (all `draft`).

## Leads and marketing consent

- Every inquiry is saved together with a consent record, whether or not the box was checked. The record holds:
  - the exact consent text shown, its version, and its SHA-256 hash
  - the checkbox value
  - the timestamp, IP address, and user agent
  - the page URL and UTM tags
  - the project and the form version
- Consent records are append-only.
- The consent wording lives in `lib/consent.ts`. If it ever changes, bump `CONSENT_VERSION`; older records keep the text that was actually shown.
- Each inquiry emails the team, with the project in the subject line.
- **Before any automated or AI call, text, or email,** check `canContact()` in `lib/leads.ts`. It returns true only when the person consented and has not opted out since.
- **Opt-outs:** people can opt out themselves at `/unsubscribe`. SMS, dialer, and AI providers should POST STOP events to `/api/optout` with `Authorization: Bearer $OPTOUT_WEBHOOK_SECRET` and a JSON body of `{ "email"?: "...", "phone"?: "...", "channel"?: "sms|email|phone|all", "source"?: "..." }`.
- **Compliance export:** open `/api/compliance/export?type=consent` (or `leads` or `suppressions`) in a browser. Log in with any username and `COMPLIANCE_EXPORT_TOKEN` as the password. The result is a CSV download.

## Environment and launch checklist

Copy `.env.example` to `.env.local` for local work, and set the same values in Vercel under Project → Settings → Environment Variables.

1. **Database:** add Neon Postgres from the Vercel Marketplace, which sets `DATABASE_URL`. Then run `pnpm db:migrate` once. In production, inquiries fail rather than being silently lost if the database is missing. Locally, without a database, they are written to `.data/inquiries.jsonl`.
2. **Email:** create a Resend account and verify the `smartcoastalassets.com` sending domain. Then set `RESEND_API_KEY`, `INQUIRY_NOTIFY_TO`, and `INQUIRY_FROM_EMAIL`.
3. **Compliance secrets:** set `COMPLIANCE_EXPORT_TOKEN` and `OPTOUT_WEBHOOK_SECRET` to long random strings.
4. **Map key (recommended):** for commercial use of the satellite map, create a free ArcGIS Location Platform key and set `NEXT_PUBLIC_ARCGIS_API_KEY`.
5. **Domain:** add `smartcoastalassets.com` to the Vercel project.
6. **Legal approval:** legal counsel must approve the consent language, the consent implementation, `/privacy`, and `/terms`. Then set `NEXT_PUBLIC_LEGAL_APPROVED=true` to remove the draft banners.

## AI search

The site is built to be quoted by AI assistants:

- Every page has JSON-LD structured data (listings with offers, FAQ, breadcrumbs, articles).
- AI-readable versions:
  - `/llms.txt` gives an index of the site.
  - `/llms-full.txt` contains all project facts and FAQs.
  - `/projects/<slug>.md` gives each project as clean Markdown.
- The buyer guides answer common questions and cite official sources. Their comparison tables are generated from the project files, so they never go stale.
- `robots.txt` explicitly allows the major AI crawlers.
