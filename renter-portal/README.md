# 21 Tatman St — Renter Portal

A tenant-facing web portal for the 3-unit residential property at 21 Tatman Street, Worcester, MA. Tenants can view unit details, submit maintenance requests, send messages to management, and track the status of their requests. The landlord has a dedicated admin dashboard for managing everything.

## Tech Stack

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5, runes mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) via `@tailwindcss/vite`
- **Database**: PostgreSQL 16 (Dockerized)
- **DB Client**: [postgres.js](https://github.com/porsager/postgres)
- **Auth**: Cookie-based sessions with bcrypt password hashing
- **Email**: [Resend](https://resend.com/) for transactional emails
- **Language**: TypeScript

## Features

### Tenant Portal
- **Login** — Email/password authentication, session cookie (30-day expiry)
- **Password Reset** — Token-based reset flow via email (`/forgot-password` → `/reset-password`)
- **Home** — Personalized welcome with quick links and announcements
- **My Unit** — Unit-specific details (layout, appliances, fixtures) scoped to the logged-in tenant
- **Maintenance** — Submit requests (category, urgency, description), track status history, and exchange comments with management
- **Property Info** — Shared building systems, shutoff locations, basement, grounds
- **Contact** — Send messages directly to property management

### Rental Applications (`/apply`)
- **Multi-step form** (7 steps) — Move-in details, personal info, current residence, employment, occupants/pets/vehicles, background/references, review & submit
- **Public route** — No login required
- **Email notification** — Admin notified when new application is submitted

### Admin Dashboard (`/admin`)
- **Overview** — Stats cards (pending requests, in progress, unread messages, tenant count) and recent activity
- **Requests** — View all maintenance requests, filter by status, update status inline, comment thread per request (admin comments notify tenant via email)
- **Messages** — Read tenant messages, mark read/unread, bulk mark all read
- **Tenants** — Add/remove tenants, view roster with unit assignments and roles
- **Applications** — Review rental applications with expandable detail view (all 50+ fields), update status (pending/reviewed/approved/rejected)

### Email Notifications
- Maintenance request submitted → Admin notified
- Maintenance status updated → Tenant notified
- Contact message sent → Admin notified
- Rental application submitted → Admin notified
- Password reset requested → Reset link sent to tenant

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (for PostgreSQL)

### 1. Start the database

```sh
cd renter-portal
docker compose up -d
```

This starts PostgreSQL on **port 5435** with database `tatman_portal`.

### 2. Install dependencies

```sh
npm install
```

### 3. Configure email (optional)

Create a `.env` file:

```sh
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=mail.cmyers@gmail.com
FROM_EMAIL=notifications@21tatman.com
```

Without this, the app works but emails are silently skipped (except password reset, which shows an error message).

### 4. Seed the database (first run)

```sh
npx tsx scripts/seed.ts
```

This creates the default accounts:

| Role   | Email                    | Password  | Unit |
|--------|--------------------------|-----------|------|
| Admin  | mail.cmyers@gmail.com    | admin123  | 1    |
| Tenant | unit1@21tatman.com       | tenant1   | 1    |
| Tenant | unit2@21tatman.com       | tenant2   | 2    |
| Tenant | unit3@21tatman.com       | tenant3   | 3    |

### 5. Start the dev server

```sh
npm run dev
```

The app runs at [http://localhost:5173](http://localhost:5173).

## Project Structure

```
src/
├── lib/
│   ├── server/
│   │   ├── db.ts          # PostgreSQL connection (port 5435)
│   │   ├── auth.ts        # Password hashing, sessions, reset tokens
│   │   ├── email.ts       # Resend email templates (maintenance, contact, reset, applications)
│   │   └── migrate.ts     # Auto-creates tables on startup
│   └── assets/            # Static assets (favicon)
├── routes/
│   ├── +layout.svelte     # App shell (nav, footer)
│   ├── +page.svelte       # Home / welcome
│   ├── login/             # Authentication
│   ├── logout/            # Session teardown
│   ├── forgot-password/   # Request password reset email
│   ├── reset-password/    # Set new password via token
│   ├── units/             # Per-tenant unit info
│   ├── maintenance/       # Request submission + history + comments
│   ├── property/          # Shared property details
│   ├── contact/           # Message form
│   ├── apply/             # Rental application (7-step form, public)
│   └── admin/             # Admin dashboard
│       ├── requests/      # Manage maintenance requests + comments
│       ├── messages/      # View tenant messages
│       ├── tenants/       # Tenant CRUD
│       └── applications/  # Review rental applications
├── hooks.server.ts        # Auth middleware, auto-migration
├── app.css                # Tailwind + CSS custom properties
└── app.d.ts               # Type definitions (App.Locals)
```

## Database

Tables are auto-created on server startup via `hooks.server.ts` → `migrate.ts`:

- **tenants** — id, email, password_hash, name, phone, unit, is_admin
- **sessions** — id, tenant_id, expires_at
- **maintenance_requests** — id, tenant_id, unit, name, phone, category, urgency, description, preferred_time, status, timestamps
- **request_comments** — id, request_id, tenant_id, author_name, is_admin, comment, created_at
- **messages** — id, tenant_id, name, unit, message, read, created_at
- **rental_applications** — id, status, 50+ fields (personal, residence, employment, background, references, consent), created_at
- **password_reset_tokens** — id, tenant_id, token, expires_at, used

### Connection Details (local dev)

| Field    | Value            |
|----------|------------------|
| Host     | localhost        |
| Port     | 5435             |
| Database | tatman_portal    |
| User     | tatman           |
| Password | tatman_dev_2026  |

## Scripts

| Command             | Description                          |
|---------------------|--------------------------------------|
| `npm run dev`       | Start development server             |
| `npm run build`     | Production build                     |
| `npm run preview`   | Preview production build             |
| `npm run check`     | Type-check with svelte-check         |
| `npx tsx scripts/seed.ts` | Seed default tenant accounts   |

## Auth Flow

1. User submits email/password on `/login`
2. Server verifies bcrypt hash, creates a session row with a random 64-char hex token
3. Token stored in `session` httpOnly cookie (30-day expiry)
4. `hooks.server.ts` validates the cookie on every request, populates `locals.tenant`
5. Unauthenticated users are redirected to `/login`; non-admins are blocked from `/admin` routes
6. Public routes (`/login`, `/apply`, `/forgot-password`, `/reset-password`) bypass auth

### Password Reset Flow

1. User enters email on `/forgot-password`
2. Server generates a 64-char hex token (1-hour expiry), sends reset link via Resend
3. User clicks link → `/reset-password?token=...` validates token and shows new password form
4. On submit: password is updated, token consumed, all existing sessions invalidated
5. If email service is not configured, an error message is shown
