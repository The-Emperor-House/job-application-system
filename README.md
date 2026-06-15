# Job Application System

A full-stack job application management system. Applicants can sign in (Google or email/password
with OTP verification), manage their profile and documents, submit applications (with
resume/photo uploads), and track application status. HR/Admin/Super Admin staff log in to manage
job postings, review applications, and (for Super Admins) manage user accounts.

## Tech Stack

- **Web** (`apps/web`) — Next.js (App Router) + TypeScript + MUI (Material UI)
- **API** (`apps/api`) — Express + TypeScript + Prisma ORM
- **Database** — MySQL
- **File storage** — Cloudinary (avatars, documents, resumes, photos)
- **Auth** — JWT issued by the API, stored in an httpOnly cookie by Next.js BFF routes; supports
  email/password (with OTP email verification) and Google sign-in

## Features

- Public job listing and job detail pages
- Applicant accounts: register with email/password (OTP email verification) or Google sign-in
- Applicant account area (`/account`): profile editing + avatar upload, personal document/resume
  uploads, application history with status
- Multi-section application form (personal info, education, work experience, languages,
  references) with resume/photo upload to Cloudinary, prefilled from the applicant's profile;
  requires login
- Staff login (JWT-based) protecting `/dashboard/*`
- Admin dashboard: job posting CRUD, application list with status filters, application detail
  with status updates and internal notes
- Super Admin: user account management (`/dashboard/users`) — change roles and activate/deactivate
  accounts

## Project Structure

```
apps/
├── api/   Express + Prisma + MySQL REST API
└── web/   Next.js frontend (public site + applicant account area + admin dashboard)
```

## Local Development

### Prerequisites

- Node.js 20+
- A MySQL database
- A Cloudinary account (free tier works) — required for avatar/document/resume uploads
- (Optional) SMTP credentials for sending OTP emails — if unset, OTP codes are logged to the API
  console instead
- (Optional) A Google OAuth client ID — required for the "Sign in with Google" button

### 1. Install dependencies

```bash
npm install
```

### 2. Start MySQL + phpMyAdmin (Docker)

```bash
docker compose up -d
```

This starts MySQL on `localhost:3307` (database `job_application_system`, user `root` / password
`root`) and phpMyAdmin at `http://localhost:8081`. If you'd rather use your own MySQL instance,
skip this step and point `DATABASE_URL` at it.

### 3. Configure the API

```bash
cd apps/api
cp .env.example .env
# edit .env: DATABASE_URL, JWT_SECRET, CLOUDINARY_*, CORS_ORIGIN, SMTP_* (optional), GOOGLE_CLIENT_ID (optional)
# default DATABASE_URL already matches the docker-compose MySQL above
npx prisma migrate dev
npm run seed   # creates admin@example.com / Admin123! and superadmin@example.com / SuperAdmin123!, plus sample job postings
```

> **Important:** `CLOUDINARY_CLOUD_NAME` must be the actual cloud name from your Cloudinary
> dashboard (Settings → Product environment → Cloud name) — not a placeholder/account name like
> `Root`. An incorrect cloud name causes avatar, document, resume, and photo uploads to fail with
> `Invalid cloud_name` (HTTP 500).

### 4. Configure the web app

```bash
cd apps/web
cp .env.example .env.local
# edit .env.local: API_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID (optional, must match GOOGLE_CLIENT_ID in apps/api/.env)
```

### 5. Run both apps

From the repo root:

```bash
npm run dev:api   # http://localhost:4000
npm run dev:web   # http://localhost:3000
```

Visit `http://localhost:3000` for the public site. Applicants can register at `/register` (or
sign in with Google) and manage their account at `/account`. Staff log in at `/login` with the
seeded admin/super admin accounts to access `/dashboard`.

## Deployment (Cloud)

This project is designed to be deployed across managed cloud services:

| Component  | Suggested platform                          |
| ---------- | -------------------------------------------- |
| `apps/web` | Vercel (Next.js)                             |
| `apps/api` | Railway or Render (Node + Dockerfile)        |
| MySQL      | Railway / PlanetScale / Aiven managed MySQL  |
| File storage | Cloudinary                                 |

### Deploy the API

1. Create a MySQL database (Railway, PlanetScale, or Aiven) and copy its connection string.
2. Create a Cloudinary account and copy the cloud name, API key, and API secret.
3. Deploy `apps/api` (Dockerfile included) to Railway/Render, setting the environment variables
   from `apps/api/.env.example`:
   - `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN` (set to your Vercel web URL),
     `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`,
     `OTP_EXPIRES_MINUTES` — for sending OTP verification emails
   - `GOOGLE_CLIENT_ID` — for verifying Google sign-in ID tokens
4. The container runs `prisma migrate deploy` on startup, then starts the server.
5. After the first deploy, run the seed script once (e.g. via the platform's shell/console):
   `npm run seed`

### Deploy the web app

1. Import `apps/web` into Vercel as the project root (Root Directory = `apps/web`).
2. Set environment variables from `apps/web/.env.example`:
   - `API_URL` — the public URL of your deployed API
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` — same Google OAuth client ID as the API, used by the
     "Sign in with Google" button
3. Deploy. `proxy.ts` protects `/dashboard/*`, `/account/*`, and `/jobs/*/apply` (redirecting
   unauthenticated users to `/login`), and the `/api/auth/*` routes act as a BFF layer that stores
   the JWT in an httpOnly cookie.

## Default Seed Accounts

```
Staff (HR/Admin):  admin@example.com / Admin123!
Super Admin:       superadmin@example.com / g8l
```

Change these immediately in any environment beyond local development.
# job-application-system
