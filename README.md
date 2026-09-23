# ZL Travel Agency

Next.js 15 (App Router) site for ZL Travel Agency — public marketing pages, lead/booking flows, and PIN-gated agent tools.

## Requirements

- Node.js 20+ (22 LTS recommended)
- npm 10+

## Local setup

```bash
npm install
cp .env.example .env.local
# fill server secrets in .env.local
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

Useful routes:

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/specials` | Public travel specials |
| `/contact` | Lead form |
| `/agent` | Agent package form (PIN) |
| `/agent/specials` | Specials admin (PIN) |

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint
```

## Environment variables

Copy `.env.example` → `.env.local`. Never commit `.env.local`.

### Public (`NEXT_PUBLIC_*`)

Safe for the browser: site name, phone, email, Calendly, social URLs, chat widget ID, booking labels.

### Server-only (no `NEXT_PUBLIC_` prefix)

| Variable | Purpose |
| --- | --- |
| `BACKEND_LEAD_WEBHOOK_URL` | Lead form webhook |
| `BACKEND_BOOKING_WEBHOOK_URL` | Appointment booking webhook |
| `BACKEND_AGENT_WEBHOOK_URL` | Agent package webhook |
| `BACKEND_MEDIA_TOKEN` | Private integration token |
| `AGENT_PIN` | Shared PIN for `/agent` tools |

Browser code never calls the backend CRM directly. Forms post to `/api/*`; the server forwards with secrets from env.

## Project layout

```
app/(site)/     Public pages + marketing layout
app/agent/      No-index agent tools
app/api/        Server integration boundaries
components/     UI + forms
content/        Legal HTML + FAQs/blog JSON
data/           Specials JSON
lib/            Env, auth, backend helpers, site config
legacy/         Archived static site (reference only)
public/         Static assets
styles/         Site CSS
```

## Security notes for handoff

- Webhooks, media token, and agent PIN live only in server env / API routes.
- Archived `legacy/` files have secrets redacted; do not redeploy `legacy/` as a public site.
- Agent routes should stay unlisted (`noindex`); PIN is verified server-side with constant-time compare.
- Rotate backend tokens/PIN if this repo was previously shared with secrets in static HTML.

## Deploy (Vercel)

1. Connect the repo.
2. Set the same env vars from `.env.example` in the Vercel project.
3. Build command: `npm run build`
4. Output: Next.js default (no static export required).

Pushing to remote is intentionally left to you.
