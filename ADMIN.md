# Admin panel + analytics

A private dashboard at `/admin` with first-party, cookieless analytics — the same
system the SIMA site runs, adapted for this portfolio.

## What it does

- **Analytics collector** (`/api/t`): page views, section views, scroll depth, clicks
  (email, LinkedIn, GitHub, CV download, project opens, outbound links) and time on
  page. Visitor ids are random per-browser values, hashed with `AUTH_SECRET` before
  storage. Location comes from Vercel's edge headers, never from a third party.
- **Dashboard** (`/admin`): KPIs with period comparison, visitors chart, live view,
  people, visits, pages, sources, countries, devices, and a per-visitor drawer with
  the full journey.
- **Messages**: `POST /api/contact` stores a message first, emails it second, so a
  failed send never loses it. Wire the contact form to it when you want it.
- **Security**: login-code sign-in, active admin sessions, revoke, login attempt log.
- **CSV export**: `/api/admin/export?range=30d`.

## Keys you need

| Variable | Where to get it | Required |
|---|---|---|
| `DATABASE_URL` | [neon.com](https://neon.com) → new project → **Connect** → pooled connection string. Free tier is enough. | yes |
| `AUTH_SECRET` | Generate: `openssl rand -base64 48`. 32+ characters. | yes |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → **API Keys**. Free tier: 3,000 emails/month. | yes in production |
| `AUTH_FROM` / `CONTACT_FROM` | A sender on a domain verified in Resend, or `onboarding@resend.dev`. | optional |

Put them in `.env.local` locally and in the Vercel project's environment variables
for production. Without `RESEND_API_KEY` in development, the login code is printed
to the dev server console instead of being emailed.

## Setup

```bash
npm install
npm run db:setup     # creates the tables in Neon
npm run dev          # open http://localhost:3000/admin
```

The tables are also created automatically on first use, so `db:setup` is optional.

## Who can sign in

Only the emails in `ADMIN_EMAILS` in `src/lib/server/auth.ts`. Changing that list
needs a code change and a deploy — there is no sign-up.

Sign-in is a 6-digit code emailed to that address: valid 30 minutes, one use, 5
attempts, rate limited per IP and per email. The session cookie lasts 12 hours.
Every successful login emails all admins an alert with time, place and device.

## Keeping your own visits out of the numbers

- Signing in to `/admin` marks that browser as yours for a year.
- On a phone or laptop you never sign in from, open `/api/own` once. `/api/own?off=1`
  clears it.
- A browser once known to be yours stays yours on later visits, even if the cookie is
  gone by then.
- Sharing a network with you does **not** count. Your phone on the same Wi-Fi, or any
  visitor behind the same mobile carrier address, is a normal visitor — mark your own
  devices with `/api/own` instead.
- In the dashboard, **This is me** / **Not me** on any visitor moves all of that
  browser's visits in or out of the numbers.

Your own visits are stored and labelled, never deleted — they are just excluded from
every metric.
