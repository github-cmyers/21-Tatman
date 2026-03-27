# 21 Tatman St — Renter Portal

A tenant-facing web portal for the 3-unit residential property at 21 Tatman Street, Worcester, MA. Tenants can view unit details, submit maintenance requests, send messages to management, and track the status of their requests. The landlord has a dedicated admin dashboard for managing everything.

## Tech Stack

- **Framework**: [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5, runes mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) via `@tailwindcss/vite`
- **Database**: PostgreSQL 16 (Dockerized)
- **DB Client**: [postgres.js](https://github.com/porsager/postgres)
- **Auth**: Cookie-based sessions with bcrypt password hashing
- **Language**: TypeScript

## Features

### Tenant Portal
- **Login** — Email/password authentication, session cookie (30-day expiry)
- **Home** — Personalized welcome with quick links and announcements
- **My Unit** — Unit-specific details (layout, appliances, fixtures) scoped to the logged-in tenant
- **Maintenance** — Submit requests (category, urgency, description) and track status history
- **Property Info** — Shared building systems, shutoff locations, basement, grounds
- **Contact** — Send messages directly to property management

### Admin Dashboard (`/admin`)
- **Overview** — Stats cards (pending requests, in progress, unread messages, tenant count) and recent activity
- **Requests** — View all maintenance requests, filter by status, update status inline
- **Messages** — Read tenant messages, mark read/unread, bulk mark all read
- **Tenants** — Add/remove tenants, view roster with unit assignments and roles

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (for PostgreSQL)

### 1. Start the database

```sh
cd C:\Code\21-Tatman\renter-portal
docker compose up -d
```

This starts PostgreSQL on **port 5435** with database `tatman_portal`.

### 2. Install dependencies

```sh
npm install
```

### 3. Seed the database (first run)

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

### 4. Start the dev server

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
│   │   ├── auth.ts        # Password hashing, session management
│   │   └── migrate.ts     # Auto-creates tables on startup
│   └── assets/            # Static assets (favicon)
├── routes/
│   ├── +layout.svelte     # App shell (nav, footer)
│   ├── +page.svelte       # Home / welcome
│   ├── login/             # Authentication
│   ├── logout/            # Session teardown
│   ├── units/             # Per-tenant unit info
│   ├── maintenance/       # Request submission + history
│   ├── property/          # Shared property details
│   ├── contact/           # Message form
│   └── admin/             # Admin dashboard
│       ├── requests/      # Manage maintenance requests
│       ├── messages/      # View tenant messages
│       └── tenants/       # Tenant CRUD
├── hooks.server.ts        # Auth middleware, auto-migration
├── app.css                # Tailwind + CSS custom properties
└── app.d.ts               # Type definitions (App.Locals)
```

## Database

Tables are auto-created on server startup via `hooks.server.ts` → `migrate.ts`:

- **tenants** — id, email, password_hash, name, phone, unit, is_admin
- **sessions** — id, tenant_id, token, expires_at
- **maintenance_requests** — id, tenant_id, unit, name, phone, category, urgency, description, preferred_time, status, created_at, updated_at
- **messages** — id, tenant_id, name, unit, message, is_read, created_at

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
