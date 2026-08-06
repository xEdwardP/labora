<div align="center">

<img src="public/logo.png" alt="Labora" width="120" />

# Labora

**A freelance marketplace that connects clients with independent professionals.**
*Un marketplace freelance que conecta clientes con profesionales independientes.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-9333EA?style=flat-square&logo=auth0&logoColor=white)](https://authjs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**🇬🇧 [English](#-english) · 🇪🇸 [Español](#-español)**

</div>

---

# 🇬🇧 English

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Project Structure](#project-structure)
6. [Data Model](#data-model)
7. [Routes & Access Control](#routes--access-control)
8. [Server Actions Reference](#server-actions-reference)
9. [Getting Started](#getting-started)
10. [Environment Variables](#environment-variables)
11. [Available Scripts](#available-scripts)
12. [Deployment](#deployment)
13. [Development Roadmap](#development-roadmap)
14. [Conventions & Notes](#conventions--notes)
15. [Known Issues](#known-issues)

---

## Overview

**Labora** is a two-sided freelance marketplace built as the capstone project for *Seminario de Software*. It supports two user roles that share one application shell:

| Role | What they do |
| :--- | :--- |
| **`CLIENT`** | Publishes projects, reviews incoming proposals, and accepts or rejects freelancers. |
| **`FREELANCER`** | Browses open projects, submits proposals, builds a public profile, and tracks application status. |

The application is a **Next.js 16 App Router** project written entirely in TypeScript. All data mutations run through **Server Actions** — there is no bespoke REST layer — and authorization is enforced server-side on every action.

---

## Key Features

### 🔐 Authentication & Roles
- Email + password authentication via **Auth.js (NextAuth v5)** with a Credentials provider.
- Passwords hashed with **bcrypt** (cost factor 12).
- **JWT session strategy**, with `id` and `role` propagated into the token and session through custom callbacks.
- Role chosen at registration (`CLIENT` or `FREELANCER`) and persisted on the user record.
- Route protection at two levels: the **proxy** (edge) layer and the `(dashboard)` layout guard.

### 📋 Project Management
- Clients publish projects with title, description, category, budget and budget type.
- Public catalogue of `OPEN` projects with filters by **category** and **budget range**.
- Detail page per project including client information and a proposal call-to-action.
- Project lifecycle: `OPEN → IN_PROGRESS → COMPLETED / CANCELLED`.

### ✉️ Proposal System
- Freelancers submit an amount, an estimated duration in days, and a cover message.
- **One proposal per freelancer per project**, enforced by a composite unique constraint.
- Proposals may only be sent to projects still in the `OPEN` state.
- When a client accepts a proposal, the system atomically:
  1. marks that proposal `ACCEPTED`,
  2. moves the project to `IN_PROGRESS`,
  3. bulk-rejects every other `PENDING` proposal,
  4. notifies every affected freelancer.

### 👤 Profiles & Talent Directory
- Extended profile: biography, skills, portfolio links, country and hourly rate.
- **Avatar upload to Supabase Storage** with validation for MIME type (JPG/PNG/WebP) and size (≤ 3 MB).
- Public freelancer directory with individual profile pages.

### 📊 Role-Aware Dashboards
- **Client dashboard** — total projects, active projects, proposals received, proposals pending.
- **Freelancer dashboard** — proposals sent, accepted, pending and rejected.
- Collapsible sidebar whose navigation items are filtered by the session role.

### 🔔 Notifications
- Persisted notification records for `NEW_PROPOSAL`, `PROPOSAL_ACCEPTED`, `PROPOSAL_REJECTED`, `NEW_MESSAGE` and `PROJECT_COMPLETED`.
- Toast feedback throughout the UI via **Sonner**.

---

## Tech Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.2.7` | Routing, RSC, Server Actions |
| **UI Runtime** | React | `19.2.4` | Server & Client Components |
| **Language** | TypeScript | `^5` | Strict mode enabled |
| **Styling** | Tailwind CSS | `^4` | Utility layer via `@tailwindcss/postcss` |
| **ORM** | Prisma | `^7.8` | Schema, migrations, typed client |
| **Driver** | `@prisma/adapter-pg` + `pg` | `^7.8` / `^8.21` | Pooled PostgreSQL connections |
| **Database** | PostgreSQL (Supabase) | — | Primary datastore |
| **Auth** | NextAuth / Auth.js | `^5.0.0-beta.31` | Credentials provider + Prisma adapter |
| **Hashing** | bcryptjs | `^3.0.3` | Password hashing |
| **Storage** | `@supabase/supabase-js` | `^2.107` | Avatar uploads (`avatars` bucket) |
| **Icons** | lucide-react | `^1.17` | Icon set |
| **Toasts** | sonner | `^2.0.7` | Notification toasts |
| **Linting** | ESLint + `eslint-config-next` | `^9` | Static analysis |

---

## Architecture

### Request flow

```mermaid
flowchart TD
    A[Browser] --> B["proxy.ts<br/>(edge auth guard)"]
    B -->|not authenticated + protected route| C[Redirect → /login]
    B -->|authenticated + auth page| D[Redirect → /home]
    B -->|allowed| E["App Router<br/>Server Component"]
    E --> F["(dashboard)/layout.tsx<br/>session guard"]
    F --> G[Page renders]
    G -->|form submit| H["Server Action<br/>actions/*.ts"]
    H --> I["auth() → role check"]
    I -->|authorized| J["Prisma Client<br/>lib/prisma.ts"]
    J --> K[(PostgreSQL / Supabase)]
    H --> L["revalidatePath()"]
    L --> G
    H -.avatar upload.-> M[(Supabase Storage)]
```

### Design decisions

- **Server Actions over API routes.** Every mutation lives in `actions/` and starts with `'use server'`. The only HTTP route in the project is the Auth.js catch-all handler.
- **Authorization is never trusted to the client.** Each action calls `auth()` and validates the role before touching the database. UI-level role checks are a convenience, not a security boundary.
- **Prisma client generated inside the app.** The generator output is `app/generated/prisma`, which is git-ignored, so `prisma generate` runs as part of `npm run build`.
- **A singleton Prisma client** (`lib/prisma.ts`) is cached on `globalThis` outside production to survive hot reloads.
- **Split connection strings.** `DATABASE_URL` (pooled) is used at runtime; `DIRECT_URL` (direct) is used by the Prisma CLI for migrations, as declared in `prisma.config.ts`.
- **Two Supabase clients are possible, one is used.** Only `supabaseAdmin` (service-role key, server-side only) is instantiated, for storage writes.

---

## Project Structure

```
labora/
├── actions/                       # Server Actions ('use server')
│   ├── auth.ts                    # registerUser, loginUser
│   ├── profile.ts                 # profile CRUD, avatar upload, freelancer listing
│   ├── projects.ts                # project creation and queries
│   └── proposals.ts               # proposal lifecycle + notifications
│
├── app/
│   ├── (auth)/                    # Public authentication pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/               # Authenticated area (guarded by layout)
│   │   ├── layout.tsx             # Sidebar shell + session redirect
│   │   ├── home/page.tsx          # Role-aware dashboard
│   │   ├── projects/
│   │   │   ├── page.tsx           # Catalogue + filters
│   │   │   ├── new/page.tsx       # CLIENT only
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Project detail
│   │   │       └── proposal/page.tsx  # FREELANCER only
│   │   ├── my-projects/page.tsx   # CLIENT only
│   │   ├── my-proposals/page.tsx  # FREELANCER only
│   │   ├── freelancers/
│   │   │   ├── page.tsx           # Talent directory
│   │   │   └── [id]/page.tsx      # Public profile
│   │   └── profile/edit/page.tsx  # Profile editor + avatar
│   ├── (landing)/                 # Marketing shell
│   ├── api/[...nextauth]/route.ts # Auth.js GET/POST handlers
│   ├── generated/prisma/          # Generated Prisma client (git-ignored)
│   ├── globals.css                # Tailwind entry + CSS variables
│   ├── layout.tsx                 # Root layout: SessionProvider + Toaster
│   └── page.tsx                   # Landing page (redirects to /home if logged in)
│
├── components/
│   ├── dashboard/                 # ClientDashboard, FreelancerDashboard
│   ├── landing/                   # Navbar, Hero, TrustBar, Categories,
│   │                              # HowItWorks, FeaturedFreelancers, CtaBanner, Footer
│   ├── layout/Sidebar.tsx         # Collapsible, role-filtered navigation
│   ├── profile/                   # AvatarUpload, ProfileForm, FreelancerCard
│   ├── projects/                  # NewProjectForm, ProjectCard, ProjectFilters, MyProjectsClient
│   └── proposals/                 # ProposalForm, ProposalCard, MyProposalCard
│
├── lib/
│   ├── prisma.ts                  # Prisma singleton (pg adapter + Pool)
│   ├── project-utils.ts           # Enum → Spanish labels, status colours
│   └── supabase.ts                # Service-role Supabase admin client
│
├── prisma/
│   ├── migrations/                # Four migrations, one per sprint milestone
│   └── schema.prisma              # Single source of truth for the data model
│
├── types/next-auth.d.ts           # Session augmentation (id, role)
├── auth.ts                        # NextAuth configuration
├── proxy.ts                       # Edge guard (Next.js 16 replacement for middleware.ts)
├── next.config.ts                 # External packages, remote image patterns
└── prisma.config.ts               # Prisma CLI config (uses DIRECT_URL)
```

---

## Data Model

```mermaid
erDiagram
    USER ||--o{ PROJECT      : "publishes"
    USER ||--o{ PROPOSAL     : "submits"
    USER ||--o| PROFILE      : "has"
    USER ||--o{ ACCOUNT      : "links"
    USER ||--o{ SESSION      : "opens"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ MESSAGE      : "sends / receives"
    PROJECT ||--o{ PROPOSAL  : "receives"
    PROJECT ||--o{ MESSAGE   : "scopes"

    USER {
        string id PK
        string email UK
        string password
        Role   role
        string name
        string image
    }
    PROJECT {
        string        id PK
        string        title
        text          description
        Category      category
        float         budget
        BudgetType    budgetType
        ProjectStatus status
        string        clientId FK
    }
    PROPOSAL {
        string         id PK
        string         projectId FK
        string         freelancerId FK
        float          amount
        int            estimatedDays
        text           message
        ProposalStatus status
    }
    PROFILE {
        string   id PK
        string   userId FK,UK
        string   avatarUrl
        text     bio
        string[] skills
        string[] portfolio
        string   country
        float    hourlyRate
    }
    NOTIFICATION {
        string           id PK
        string           userId FK
        NotificationType type
        string           title
        boolean          read
        string           link
    }
    MESSAGE {
        string  id PK
        text    content
        string  senderId FK
        string  receiverId FK
        string  projectId FK
        boolean read
    }
```

### Enumerations

| Enum | Values |
| :--- | :--- |
| **`Role`** | `CLIENT`, `FREELANCER` |
| **`Category`** | `IT_PROGRAMMING`, `DESIGN_MULTIMEDIA`, `WRITING_TRANSLATION`, `SALES_MARKETING`, `FINANCE_MANAGEMENT`, `LEGAL`, `ADMIN_SUPPORT`, `ENGINEERING` |
| **`BudgetType`** | `FIXED`, `HOURLY` |
| **`ProjectStatus`** | `OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| **`ProposalStatus`** | `PENDING`, `ACCEPTED`, `REJECTED` |
| **`NotificationType`** | `NEW_PROPOSAL`, `PROPOSAL_ACCEPTED`, `PROPOSAL_REJECTED`, `NEW_MESSAGE`, `PROJECT_COMPLETED` |

### Integrity constraints

- `User.email` — unique.
- `Profile.userId` — unique (one profile per user).
- `Proposal (projectId, freelancerId)` — composite unique; prevents duplicate applications.
- Every relation cascades on delete, so removing a user removes their projects, proposals, profile, messages and notifications.

> **Note** — `Message` and `Notification` exist in the schema and are written to by the proposal flow. The messaging **UI** is not yet exposed; the notifications sidebar entry is currently commented out in `components/layout/Sidebar.tsx`.

---

## Routes & Access Control

| Route | Method of protection | Who can access |
| :--- | :--- | :--- |
| `/` | — | Public; authenticated users are redirected to `/home` |
| `/login` | `proxy.ts` | Public; authenticated users are redirected to `/home` |
| `/register` | `proxy.ts` | Public; authenticated users are redirected to `/home` |
| `/home` | `proxy.ts` + layout guard | Any authenticated user (view depends on role) |
| `/projects` | `(dashboard)` layout guard | Any authenticated user |
| `/projects/new` | Page-level role check | `CLIENT` only |
| `/projects/[id]` | `(dashboard)` layout guard | Any authenticated user |
| `/projects/[id]/proposal` | Page-level role check | `FREELANCER` only |
| `/my-projects` | Page-level role check | `CLIENT` only |
| `/my-proposals` | Page-level role check | `FREELANCER` only |
| `/freelancers` | `(dashboard)` layout guard | Any authenticated user |
| `/freelancers/[id]` | `(dashboard)` layout guard | Any authenticated user |
| `/profile/edit` | `(dashboard)` layout guard | Any authenticated user |
| `/api/[...nextauth]` | — | Auth.js handler (`GET`, `POST`) |

**How the two guard layers differ.** `proxy.ts` only matches `/home` and `/dashboard` prefixes, so it is *not* the primary defence for the rest of the private area. Everything under `(dashboard)` is additionally guarded by `app/(dashboard)/layout.tsx`, which calls `auth()` and redirects unauthenticated visitors to `/login`. Role-specific pages add a third check. Server Actions re-validate independently, so a crafted request cannot bypass the UI.

---

## Server Actions Reference

### `actions/auth.ts`

| Action | Signature | Behaviour |
| :--- | :--- | :--- |
| `registerUser` | `({ name, email, password, role })` | Rejects duplicate emails, hashes the password with bcrypt (12 rounds), creates the user and signs them in, redirecting to `/home`. Invalid role values fall back to `CLIENT`. |
| `loginUser` | `({ email, password })` | Signs in through the Credentials provider; returns a localized error message on `CredentialsSignin`. |

### `actions/projects.ts`

| Action | Signature | Behaviour |
| :--- | :--- | :--- |
| `createProject` | `({ title, description, category, budget, budgetType })` | Requires an authenticated `CLIENT`. Creates the project and revalidates `/projects`. |
| `getProjects` | `(filters?: { category, budgetMin, budgetMax })` | Returns `OPEN` projects with the client relation, newest first. |
| `getProjectById` | `(id)` | Returns a single project with its client. |
| `getMyProjects` | `()` | Returns the authenticated client's own projects. |

### `actions/proposals.ts`

| Action | Signature | Behaviour |
| :--- | :--- | :--- |
| `createProposal` | `({ projectId, amount, estimatedDays, message })` | Requires a `FREELANCER`; rejects duplicates and non-`OPEN` projects; creates the proposal and a `NEW_PROPOSAL` notification for the client. |
| `getProposalsByProject` | `(projectId)` | Owner-only: throws `Forbidden` unless the caller owns the project. |
| `getMyProposals` | `()` | Returns the freelancer's proposals with project summaries. |
| `updateProposalStatus` | `(proposalId, 'ACCEPTED' \| 'REJECTED')` | Owner-only. Accepting also sets the project to `IN_PROGRESS`, bulk-rejects the remaining `PENDING` proposals and notifies each affected freelancer. |
| `hasAlreadyApplied` | `(projectId) → boolean` | Duplicate-application guard used by the UI and by `createProposal`. |

### `actions/profile.ts`

| Action | Signature | Behaviour |
| :--- | :--- | :--- |
| `upsertProfile` | `({ bio, skills, hourlyRate, country, portfolio })` | Creates or updates the caller's profile and revalidates the affected paths. |
| `getProfileByUserId` | `(userId)` | Returns a profile joined with public user fields. |
| `getOwnProfile` | `()` | Convenience wrapper around the session user. |
| `uploadAvatar` | `(formData)` | Validates MIME type (JPG/PNG/WebP) and size (≤ 3 MB), uploads to the Supabase `avatars` bucket with `upsert`, then writes the cache-busted public URL to both `Profile.avatarUrl` and `User.image`. |
| `getFreelancers` | `()` | Lists every `FREELANCER` with their public profile fields. |

---

## Getting Started

### Prerequisites

- **Node.js 20+** and npm
- A **PostgreSQL** database — a free [Supabase](https://supabase.com) project covers both the database and the storage bucket

### 1. Clone and install

```bash
git clone https://github.com/xEdwardP/labora.git
cd labora
npm install
```

### 2. Configure the environment

Create a `.env` file in the project root — see [Environment Variables](#environment-variables) for the full list:

```env
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"

AUTH_SECRET="<generate with: npx auth secret>"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Prepare the storage bucket

In the Supabase dashboard, create a **public** storage bucket named `avatars`. Uploads are written server-side with the service-role key, so no additional row-level policy is required for writes; public read access is what makes avatar URLs resolvable.

### 4. Set up the database

```bash
npm run db:migrate     # applies prisma/migrations and generates the client
```

For a throwaway database you may prefer `npm run db:push`, which syncs the schema without creating migration files.

### 5. Run the development server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**. Register two accounts — one `CLIENT` and one `FREELANCER` — to exercise the full flow end to end.

---

## Environment Variables

| Variable | Scope | Required | Description |
| :--- | :--- | :---: | :--- |
| `DATABASE_URL` | Server | ✅ | Pooled connection string used by the runtime Prisma client. |
| `DIRECT_URL` | CLI | ✅ | Direct (non-pooled) connection used by the Prisma CLI for migrations. |
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | ✅ | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | ✅ | Public anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | ✅ | Service-role key for storage writes. **Never expose this to the browser.** |
| `AUTH_SECRET` | Server | ✅ | Secret used to sign JWT sessions. Generate with `npx auth secret`. |
| `NEXTAUTH_URL` | Server | ✅ | Canonical application URL (`http://localhost:3000` in development). |

> ⚠️ **Security** — `.env*` is git-ignored. Rotate `SUPABASE_SERVICE_ROLE_KEY` and `AUTH_SECRET` immediately if either is ever committed or shared.

---

## Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `dev` | `next dev` | Starts the development server. |
| `build` | `prisma generate && next build` | Regenerates the Prisma client, then builds for production. |
| `start` | `next start` | Serves the production build. |
| `lint` | `eslint` | Runs ESLint with the Next.js configuration. |
| `db:migrate` | `prisma migrate dev` | Creates and applies a development migration. |
| `db:push` | `prisma db push` | Pushes the schema without generating a migration. |
| `db:studio` | `prisma studio` | Opens the Prisma Studio data browser. |
| `db:generate` | `prisma generate` | Regenerates the typed client into `app/generated/prisma`. |
| `db:reset` | `prisma migrate reset` | ⚠️ Drops the database and replays all migrations. |

---

## Deployment

The project targets **Vercel**, but any Node-capable host works.

1. Import the repository into Vercel.
2. Add all seven environment variables from the table above to the project settings.
3. Set `NEXTAUTH_URL` to the production domain.
4. Deploy — the `build` script already runs `prisma generate`, which is mandatory because `app/generated/prisma` is git-ignored.
5. Apply migrations against the production database with `prisma migrate deploy` (using `DIRECT_URL`).

`next.config.ts` already declares:

- `serverExternalPackages: ['@prisma/client', 'pg']` — keeps native Node dependencies out of the bundler.
- `images.remotePatterns` for `*.supabase.co` — authorizes avatar URLs for `next/image`.

---

## Development Roadmap

The project was delivered in five sprints, each on its own branch and merged through a pull request.

| Sprint | Branch | Scope | Migration |
| :--- | :--- | :--- | :--- |
| **1** | `sprint-1/auth` | Landing page, registration and login, `CLIENT`/`FREELANCER` roles | `20260605055420_init`, `20260611002230_sprint1_user_roles` |
| **2** | `sprint-2/projects` | Project creation, catalogue, detail view, category filters | `20260611011141_sprint2_projects` |
| **3** | `sprint-3/proposals` | Proposal submission, review, accept/reject flow | `20260611013620_complet_db` |
| **4** | `sprint-4/profiles` | Extended profiles, avatar upload, talent directory, dashboards | — |
| **5** | `sprint-5/deploy` | Production deployment, build fixes, role selection at registration | — |

### Possible next steps

- Surface the messaging UI on top of the existing `Message` model.
- Expose the notification centre (the sidebar entry is already scaffolded).
- Add project completion and a review/rating system.
- Introduce automated tests — the project currently ships none.

---

## Conventions & Notes

- **`proxy.ts`, not `middleware.ts`.** Next.js 16 renamed the middleware file convention to `proxy`; the legacy name is deprecated. This project uses `proxy.ts`, exporting the Auth.js `auth()` wrapper as the default export.
- **The Auth.js handler lives at `app/api/[...nextauth]/route.ts`**, which resolves to `/api/*` rather than the more familiar `/api/auth/*`.
- **Async dynamic params.** Route params are a `Promise` and must be awaited: `const { id } = await params`.
- **Styling is intentionally mixed.** Tailwind CSS 4 is configured and used by the layout shells, while most feature components use inline styles. The brand colour is `#6B2FDB`.
- **Interface language.** User-facing copy is predominantly Spanish; code, identifiers and commit messages are in English.
- **The generated Prisma client is not committed.** Run `npm run db:generate` after cloning or after any schema change.
- **Commit style.** [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `docs:`, `chore:`.

---

## Known Issues

- **Duplicate root route.** Both `app/page.tsx` and `app/(landing)/page.tsx` resolve to `/`. The two files render the same landing composition, but only `app/page.tsx` redirects authenticated users to `/home`. The `(landing)` group is redundant and should be removed.
- **Messaging is schema-only.** `Message` is modelled and migrated but has no UI or server actions yet.
- **Notifications are write-only.** Records are created by the proposal flow, but there is no page to read them; the sidebar link is commented out.
- **No automated test suite.** There is no test runner configured in `package.json`.
- **`allowedDevOrigins`** in `next.config.ts` is pinned to `172.28.176.1`, a machine-specific development address that may need adjusting on other setups.

---
---

<div align="center">

**🇬🇧 [English](#-english) · 🇪🇸 [Español](#-español)**

</div>

---

# 🇪🇸 Español

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Funcionalidades Principales](#funcionalidades-principales)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Arquitectura](#arquitectura)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Modelo de Datos](#modelo-de-datos)
7. [Rutas y Control de Acceso](#rutas-y-control-de-acceso)
8. [Referencia de Server Actions](#referencia-de-server-actions)
9. [Puesta en Marcha](#puesta-en-marcha)
10. [Variables de Entorno](#variables-de-entorno)
11. [Scripts Disponibles](#scripts-disponibles)
12. [Despliegue](#despliegue)
13. [Hoja de Ruta](#hoja-de-ruta)
14. [Convenciones y Notas](#convenciones-y-notas)
15. [Problemas Conocidos](#problemas-conocidos)

---

## Descripción General

**Labora** es un marketplace freelance de doble cara, desarrollado como proyecto final de *Seminario de Software*. Soporta dos roles de usuario que comparten una misma aplicación:

| Rol | Qué hace |
| :--- | :--- |
| **`CLIENT`** | Publica proyectos, revisa las propuestas recibidas y acepta o rechaza freelancers. |
| **`FREELANCER`** | Explora proyectos abiertos, envía propuestas, construye un perfil público y da seguimiento al estado de sus postulaciones. |

La aplicación está construida con **Next.js 16 (App Router)** e íntegramente escrita en TypeScript. Todas las mutaciones de datos se realizan mediante **Server Actions** — no existe una capa REST propia — y la autorización se valida en el servidor en cada acción.

---

## Funcionalidades Principales

### 🔐 Autenticación y Roles
- Autenticación con email y contraseña mediante **Auth.js (NextAuth v5)** y proveedor de credenciales.
- Contraseñas cifradas con **bcrypt** (factor de coste 12).
- Estrategia de sesión **JWT**, con `id` y `role` propagados al token y a la sesión mediante callbacks personalizados.
- El rol se elige durante el registro (`CLIENT` o `FREELANCER`) y se persiste en el usuario.
- Protección de rutas en dos niveles: la capa **proxy** (edge) y el guard del layout `(dashboard)`.

### 📋 Gestión de Proyectos
- Los clientes publican proyectos con título, descripción, categoría, presupuesto y tipo de presupuesto.
- Catálogo público de proyectos `OPEN` con filtros por **categoría** y **rango de presupuesto**.
- Página de detalle por proyecto con información del cliente y llamada a la acción para postularse.
- Ciclo de vida del proyecto: `OPEN → IN_PROGRESS → COMPLETED / CANCELLED`.

### ✉️ Sistema de Propuestas
- Los freelancers envían un monto, una duración estimada en días y un mensaje de presentación.
- **Una propuesta por freelancer y proyecto**, garantizado por una restricción única compuesta.
- Solo se pueden enviar propuestas a proyectos en estado `OPEN`.
- Cuando un cliente acepta una propuesta, el sistema de forma coordinada:
  1. marca esa propuesta como `ACCEPTED`,
  2. cambia el proyecto a `IN_PROGRESS`,
  3. rechaza en bloque el resto de propuestas `PENDING`,
  4. notifica a cada freelancer afectado.

### 👤 Perfiles y Directorio de Talento
- Perfil extendido: biografía, habilidades, enlaces de portafolio, país y tarifa por hora.
- **Carga de avatar a Supabase Storage** con validación de tipo MIME (JPG/PNG/WebP) y tamaño (≤ 3 MB).
- Directorio público de freelancers con páginas de perfil individuales.

### 📊 Paneles según el Rol
- **Panel de cliente** — proyectos totales, proyectos activos, propuestas recibidas y propuestas pendientes.
- **Panel de freelancer** — propuestas enviadas, aceptadas, pendientes y rechazadas.
- Barra lateral colapsable cuyos elementos de navegación se filtran según el rol de la sesión.

### 🔔 Notificaciones
- Registros persistentes de notificación para `NEW_PROPOSAL`, `PROPOSAL_ACCEPTED`, `PROPOSAL_REJECTED`, `NEW_MESSAGE` y `PROJECT_COMPLETED`.
- Retroalimentación visual mediante toasts con **Sonner**.

---

## Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.2.7` | Enrutado, RSC, Server Actions |
| **Runtime de UI** | React | `19.2.4` | Componentes de servidor y cliente |
| **Lenguaje** | TypeScript | `^5` | Modo estricto activado |
| **Estilos** | Tailwind CSS | `^4` | Capa de utilidades vía `@tailwindcss/postcss` |
| **ORM** | Prisma | `^7.8` | Esquema, migraciones y cliente tipado |
| **Driver** | `@prisma/adapter-pg` + `pg` | `^7.8` / `^8.21` | Conexiones PostgreSQL con pool |
| **Base de datos** | PostgreSQL (Supabase) | — | Almacén principal |
| **Autenticación** | NextAuth / Auth.js | `^5.0.0-beta.31` | Proveedor de credenciales + adaptador Prisma |
| **Cifrado** | bcryptjs | `^3.0.3` | Hash de contraseñas |
| **Almacenamiento** | `@supabase/supabase-js` | `^2.107` | Carga de avatares (bucket `avatars`) |
| **Iconos** | lucide-react | `^1.17` | Conjunto de iconos |
| **Toasts** | sonner | `^2.0.7` | Notificaciones emergentes |
| **Linting** | ESLint + `eslint-config-next` | `^9` | Análisis estático |

---

## Arquitectura

### Flujo de una petición

```mermaid
flowchart TD
    A[Navegador] --> B["proxy.ts<br/>(guard de autenticación)"]
    B -->|sin sesión + ruta protegida| C[Redirige → /login]
    B -->|con sesión + página de auth| D[Redirige → /home]
    B -->|permitido| E["App Router<br/>Server Component"]
    E --> F["(dashboard)/layout.tsx<br/>guard de sesión"]
    F --> G[Renderiza la página]
    G -->|envío de formulario| H["Server Action<br/>actions/*.ts"]
    H --> I["auth() → validación de rol"]
    I -->|autorizado| J["Cliente Prisma<br/>lib/prisma.ts"]
    J --> K[(PostgreSQL / Supabase)]
    H --> L["revalidatePath()"]
    L --> G
    H -.carga de avatar.-> M[(Supabase Storage)]
```

### Decisiones de diseño

- **Server Actions en lugar de rutas API.** Cada mutación vive en `actions/` y comienza con `'use server'`. La única ruta HTTP del proyecto es el handler catch-all de Auth.js.
- **La autorización nunca se delega al cliente.** Cada acción invoca `auth()` y valida el rol antes de tocar la base de datos. Las comprobaciones de rol en la UI son una comodidad, no una frontera de seguridad.
- **El cliente Prisma se genera dentro de la aplicación.** La salida del generador es `app/generated/prisma`, que está en `.gitignore`, por lo que `prisma generate` se ejecuta como parte de `npm run build`.
- **Cliente Prisma singleton** (`lib/prisma.ts`) cacheado en `globalThis` fuera de producción para sobrevivir al hot reload.
- **Cadenas de conexión separadas.** `DATABASE_URL` (con pool) se usa en tiempo de ejecución; `DIRECT_URL` (directa) la usa el CLI de Prisma para las migraciones, según se declara en `prisma.config.ts`.
- **Solo se instancia un cliente de Supabase.** Únicamente `supabaseAdmin` (clave service-role, exclusivo del servidor) se crea, para escrituras en el storage.

---

## Estructura del Proyecto

```
labora/
├── actions/                       # Server Actions ('use server')
│   ├── auth.ts                    # registerUser, loginUser
│   ├── profile.ts                 # CRUD de perfil, avatar, listado de freelancers
│   ├── projects.ts                # creación y consultas de proyectos
│   └── proposals.ts               # ciclo de vida de propuestas + notificaciones
│
├── app/
│   ├── (auth)/                    # Páginas públicas de autenticación
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/               # Área autenticada (protegida por el layout)
│   │   ├── layout.tsx             # Shell con sidebar + redirección de sesión
│   │   ├── home/page.tsx          # Panel según el rol
│   │   ├── projects/
│   │   │   ├── page.tsx           # Catálogo + filtros
│   │   │   ├── new/page.tsx       # Solo CLIENT
│   │   │   └── [id]/
│   │   │       ├── page.tsx       # Detalle del proyecto
│   │   │       └── proposal/page.tsx  # Solo FREELANCER
│   │   ├── my-projects/page.tsx   # Solo CLIENT
│   │   ├── my-proposals/page.tsx  # Solo FREELANCER
│   │   ├── freelancers/
│   │   │   ├── page.tsx           # Directorio de talento
│   │   │   └── [id]/page.tsx      # Perfil público
│   │   └── profile/edit/page.tsx  # Editor de perfil + avatar
│   ├── (landing)/                 # Shell de marketing
│   ├── api/[...nextauth]/route.ts # Handlers GET/POST de Auth.js
│   ├── generated/prisma/          # Cliente Prisma generado (no versionado)
│   ├── globals.css                # Entrada de Tailwind + variables CSS
│   ├── layout.tsx                 # Layout raíz: SessionProvider + Toaster
│   └── page.tsx                   # Landing (redirige a /home si hay sesión)
│
├── components/
│   ├── dashboard/                 # ClientDashboard, FreelancerDashboard
│   ├── landing/                   # Navbar, Hero, TrustBar, Categories,
│   │                              # HowItWorks, FeaturedFreelancers, CtaBanner, Footer
│   ├── layout/Sidebar.tsx         # Navegación colapsable filtrada por rol
│   ├── profile/                   # AvatarUpload, ProfileForm, FreelancerCard
│   ├── projects/                  # NewProjectForm, ProjectCard, ProjectFilters, MyProjectsClient
│   └── proposals/                 # ProposalForm, ProposalCard, MyProposalCard
│
├── lib/
│   ├── prisma.ts                  # Singleton de Prisma (adaptador pg + Pool)
│   ├── project-utils.ts           # Etiquetas en español para enums y colores de estado
│   └── supabase.ts                # Cliente admin de Supabase (service-role)
│
├── prisma/
│   ├── migrations/                # Cuatro migraciones, una por hito de sprint
│   └── schema.prisma              # Única fuente de verdad del modelo de datos
│
├── types/next-auth.d.ts           # Ampliación de la sesión (id, role)
├── auth.ts                        # Configuración de NextAuth
├── proxy.ts                       # Guard edge (reemplazo de middleware.ts en Next.js 16)
├── next.config.ts                 # Paquetes externos, patrones de imagen remota
└── prisma.config.ts               # Configuración del CLI de Prisma (usa DIRECT_URL)
```

---

## Modelo de Datos

```mermaid
erDiagram
    USER ||--o{ PROJECT      : "publica"
    USER ||--o{ PROPOSAL     : "envia"
    USER ||--o| PROFILE      : "tiene"
    USER ||--o{ ACCOUNT      : "vincula"
    USER ||--o{ SESSION      : "abre"
    USER ||--o{ NOTIFICATION : "recibe"
    USER ||--o{ MESSAGE      : "envia / recibe"
    PROJECT ||--o{ PROPOSAL  : "recibe"
    PROJECT ||--o{ MESSAGE   : "delimita"

    USER {
        string id PK
        string email UK
        string password
        Role   role
        string name
        string image
    }
    PROJECT {
        string        id PK
        string        title
        text          description
        Category      category
        float         budget
        BudgetType    budgetType
        ProjectStatus status
        string        clientId FK
    }
    PROPOSAL {
        string         id PK
        string         projectId FK
        string         freelancerId FK
        float          amount
        int            estimatedDays
        text           message
        ProposalStatus status
    }
    PROFILE {
        string   id PK
        string   userId FK,UK
        string   avatarUrl
        text     bio
        string[] skills
        string[] portfolio
        string   country
        float    hourlyRate
    }
    NOTIFICATION {
        string           id PK
        string           userId FK
        NotificationType type
        string           title
        boolean          read
        string           link
    }
    MESSAGE {
        string  id PK
        text    content
        string  senderId FK
        string  receiverId FK
        string  projectId FK
        boolean read
    }
```

### Enumeraciones

| Enum | Valores |
| :--- | :--- |
| **`Role`** | `CLIENT`, `FREELANCER` |
| **`Category`** | `IT_PROGRAMMING`, `DESIGN_MULTIMEDIA`, `WRITING_TRANSLATION`, `SALES_MARKETING`, `FINANCE_MANAGEMENT`, `LEGAL`, `ADMIN_SUPPORT`, `ENGINEERING` |
| **`BudgetType`** | `FIXED`, `HOURLY` |
| **`ProjectStatus`** | `OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| **`ProposalStatus`** | `PENDING`, `ACCEPTED`, `REJECTED` |
| **`NotificationType`** | `NEW_PROPOSAL`, `PROPOSAL_ACCEPTED`, `PROPOSAL_REJECTED`, `NEW_MESSAGE`, `PROJECT_COMPLETED` |

### Restricciones de integridad

- `User.email` — único.
- `Profile.userId` — único (un perfil por usuario).
- `Proposal (projectId, freelancerId)` — único compuesto; impide postulaciones duplicadas.
- Todas las relaciones aplican borrado en cascada: eliminar un usuario elimina sus proyectos, propuestas, perfil, mensajes y notificaciones.

> **Nota** — `Message` y `Notification` existen en el esquema y el flujo de propuestas escribe en ellos. La **interfaz** de mensajería aún no está expuesta; la entrada de notificaciones en la barra lateral está comentada en `components/layout/Sidebar.tsx`.

---

## Rutas y Control de Acceso

| Ruta | Mecanismo de protección | Quién puede acceder |
| :--- | :--- | :--- |
| `/` | — | Pública; los usuarios con sesión se redirigen a `/home` |
| `/login` | `proxy.ts` | Pública; los usuarios con sesión se redirigen a `/home` |
| `/register` | `proxy.ts` | Pública; los usuarios con sesión se redirigen a `/home` |
| `/home` | `proxy.ts` + guard del layout | Cualquier usuario autenticado (la vista depende del rol) |
| `/projects` | Guard del layout `(dashboard)` | Cualquier usuario autenticado |
| `/projects/new` | Validación de rol en la página | Solo `CLIENT` |
| `/projects/[id]` | Guard del layout `(dashboard)` | Cualquier usuario autenticado |
| `/projects/[id]/proposal` | Validación de rol en la página | Solo `FREELANCER` |
| `/my-projects` | Validación de rol en la página | Solo `CLIENT` |
| `/my-proposals` | Validación de rol en la página | Solo `FREELANCER` |
| `/freelancers` | Guard del layout `(dashboard)` | Cualquier usuario autenticado |
| `/freelancers/[id]` | Guard del layout `(dashboard)` | Cualquier usuario autenticado |
| `/profile/edit` | Guard del layout `(dashboard)` | Cualquier usuario autenticado |
| `/api/[...nextauth]` | — | Handler de Auth.js (`GET`, `POST`) |

**Diferencia entre ambas capas de protección.** `proxy.ts` solo intercepta los prefijos `/home` y `/dashboard`, por lo que *no* es la defensa principal del resto del área privada. Todo lo que cuelga de `(dashboard)` está además protegido por `app/(dashboard)/layout.tsx`, que invoca `auth()` y redirige a `/login` a las visitas sin sesión. Las páginas específicas de un rol añaden una tercera comprobación. Las Server Actions validan de forma independiente, de modo que una petición manipulada no puede saltarse la interfaz.

---

## Referencia de Server Actions

### `actions/auth.ts`

| Acción | Firma | Comportamiento |
| :--- | :--- | :--- |
| `registerUser` | `({ name, email, password, role })` | Rechaza emails duplicados, cifra la contraseña con bcrypt (12 rondas), crea el usuario e inicia sesión redirigiendo a `/home`. Un rol inválido se degrada a `CLIENT`. |
| `loginUser` | `({ email, password })` | Inicia sesión mediante el proveedor de credenciales; devuelve un mensaje de error localizado ante `CredentialsSignin`. |

### `actions/projects.ts`

| Acción | Firma | Comportamiento |
| :--- | :--- | :--- |
| `createProject` | `({ title, description, category, budget, budgetType })` | Requiere un `CLIENT` autenticado. Crea el proyecto y revalida `/projects`. |
| `getProjects` | `(filters?: { category, budgetMin, budgetMax })` | Devuelve los proyectos `OPEN` con la relación del cliente, del más reciente al más antiguo. |
| `getProjectById` | `(id)` | Devuelve un proyecto con su cliente. |
| `getMyProjects` | `()` | Devuelve los proyectos del cliente autenticado. |

### `actions/proposals.ts`

| Acción | Firma | Comportamiento |
| :--- | :--- | :--- |
| `createProposal` | `({ projectId, amount, estimatedDays, message })` | Requiere un `FREELANCER`; rechaza duplicados y proyectos que no estén `OPEN`; crea la propuesta y una notificación `NEW_PROPOSAL` para el cliente. |
| `getProposalsByProject` | `(projectId)` | Solo el propietario: lanza `Forbidden` si quien llama no es dueño del proyecto. |
| `getMyProposals` | `()` | Devuelve las propuestas del freelancer con un resumen de cada proyecto. |
| `updateProposalStatus` | `(proposalId, 'ACCEPTED' \| 'REJECTED')` | Solo el propietario. Aceptar también pone el proyecto en `IN_PROGRESS`, rechaza en bloque las propuestas `PENDING` restantes y notifica a cada freelancer afectado. |
| `hasAlreadyApplied` | `(projectId) → boolean` | Guard contra postulaciones duplicadas, usado por la UI y por `createProposal`. |

### `actions/profile.ts`

| Acción | Firma | Comportamiento |
| :--- | :--- | :--- |
| `upsertProfile` | `({ bio, skills, hourlyRate, country, portfolio })` | Crea o actualiza el perfil del usuario en sesión y revalida las rutas afectadas. |
| `getProfileByUserId` | `(userId)` | Devuelve un perfil junto con los campos públicos del usuario. |
| `getOwnProfile` | `()` | Atajo sobre el usuario de la sesión. |
| `uploadAvatar` | `(formData)` | Valida el tipo MIME (JPG/PNG/WebP) y el tamaño (≤ 3 MB), sube al bucket `avatars` de Supabase con `upsert` y escribe la URL pública (con cache-busting) tanto en `Profile.avatarUrl` como en `User.image`. |
| `getFreelancers` | `()` | Lista todos los usuarios `FREELANCER` con los campos públicos de su perfil. |

---

## Puesta en Marcha

### Requisitos previos

- **Node.js 20+** y npm
- Una base de datos **PostgreSQL** — un proyecto gratuito de [Supabase](https://supabase.com) cubre tanto la base de datos como el bucket de almacenamiento

### 1. Clonar e instalar

```bash
git clone https://github.com/xEdwardP/labora.git
cd labora
npm install
```

### 2. Configurar el entorno

Crea un archivo `.env` en la raíz del proyecto — consulta [Variables de Entorno](#variables-de-entorno) para la lista completa:

```env
DATABASE_URL="postgresql://usuario:contraseña@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://usuario:contraseña@host:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"

AUTH_SECRET="<genéralo con: npx auth secret>"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Preparar el bucket de almacenamiento

En el panel de Supabase, crea un bucket de almacenamiento **público** llamado `avatars`. Las cargas se escriben desde el servidor con la clave service-role, por lo que no hace falta una política adicional para escribir; el acceso público de lectura es lo que permite resolver las URL de los avatares.

### 4. Preparar la base de datos

```bash
npm run db:migrate     # aplica prisma/migrations y genera el cliente
```

Para una base de datos desechable puede resultar más cómodo `npm run db:push`, que sincroniza el esquema sin crear archivos de migración.

### 5. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abre **[http://localhost:3000](http://localhost:3000)**. Registra dos cuentas —una `CLIENT` y otra `FREELANCER`— para recorrer el flujo completo de principio a fin.

---

## Variables de Entorno

| Variable | Ámbito | Requerida | Descripción |
| :--- | :--- | :---: | :--- |
| `DATABASE_URL` | Servidor | ✅ | Cadena de conexión con pool usada por el cliente Prisma en tiempo de ejecución. |
| `DIRECT_URL` | CLI | ✅ | Conexión directa (sin pool) que usa el CLI de Prisma para las migraciones. |
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente + Servidor | ✅ | URL del proyecto de Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente + Servidor | ✅ | Clave pública anónima. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo servidor** | ✅ | Clave service-role para escribir en el storage. **Nunca la expongas al navegador.** |
| `AUTH_SECRET` | Servidor | ✅ | Secreto para firmar las sesiones JWT. Genéralo con `npx auth secret`. |
| `NEXTAUTH_URL` | Servidor | ✅ | URL canónica de la aplicación (`http://localhost:3000` en desarrollo). |

> ⚠️ **Seguridad** — `.env*` está en `.gitignore`. Rota `SUPABASE_SERVICE_ROLE_KEY` y `AUTH_SECRET` de inmediato si alguna llega a versionarse o compartirse.

---

## Scripts Disponibles

| Script | Comando | Descripción |
| :--- | :--- | :--- |
| `dev` | `next dev` | Inicia el servidor de desarrollo. |
| `build` | `prisma generate && next build` | Regenera el cliente Prisma y compila para producción. |
| `start` | `next start` | Sirve la compilación de producción. |
| `lint` | `eslint` | Ejecuta ESLint con la configuración de Next.js. |
| `db:migrate` | `prisma migrate dev` | Crea y aplica una migración de desarrollo. |
| `db:push` | `prisma db push` | Sincroniza el esquema sin generar una migración. |
| `db:studio` | `prisma studio` | Abre el explorador de datos Prisma Studio. |
| `db:generate` | `prisma generate` | Regenera el cliente tipado en `app/generated/prisma`. |
| `db:reset` | `prisma migrate reset` | ⚠️ Elimina la base de datos y reaplica todas las migraciones. |

---

## Despliegue

El proyecto está orientado a **Vercel**, aunque funciona en cualquier host con soporte para Node.

1. Importa el repositorio en Vercel.
2. Añade las siete variables de entorno de la tabla anterior a la configuración del proyecto.
3. Establece `NEXTAUTH_URL` con el dominio de producción.
4. Despliega — el script `build` ya ejecuta `prisma generate`, algo obligatorio porque `app/generated/prisma` no está versionado.
5. Aplica las migraciones contra la base de datos de producción con `prisma migrate deploy` (usando `DIRECT_URL`).

`next.config.ts` ya declara:

- `serverExternalPackages: ['@prisma/client', 'pg']` — mantiene las dependencias nativas de Node fuera del bundler.
- `images.remotePatterns` para `*.supabase.co` — autoriza las URL de avatares en `next/image`.

---

## Hoja de Ruta

El proyecto se entregó en cinco sprints, cada uno en su propia rama e integrado mediante pull request.

| Sprint | Rama | Alcance | Migración |
| :--- | :--- | :--- | :--- |
| **1** | `sprint-1/auth` | Landing page, registro e inicio de sesión, roles `CLIENT`/`FREELANCER` | `20260605055420_init`, `20260611002230_sprint1_user_roles` |
| **2** | `sprint-2/projects` | Creación de proyectos, catálogo, vista de detalle, filtros por categoría | `20260611011141_sprint2_projects` |
| **3** | `sprint-3/proposals` | Envío de propuestas, revisión, flujo de aceptación y rechazo | `20260611013620_complet_db` |
| **4** | `sprint-4/profiles` | Perfiles extendidos, carga de avatar, directorio de talento, paneles | — |
| **5** | `sprint-5/deploy` | Despliegue a producción, correcciones de build, selección de rol en el registro | — |

### Próximos pasos posibles

- Exponer la interfaz de mensajería sobre el modelo `Message` ya existente.
- Habilitar el centro de notificaciones (la entrada de la barra lateral ya está preparada).
- Añadir la finalización de proyectos y un sistema de reseñas y valoraciones.
- Incorporar pruebas automatizadas — actualmente el proyecto no incluye ninguna.

---

## Convenciones y Notas

- **`proxy.ts`, no `middleware.ts`.** Next.js 16 renombró la convención de archivo *middleware* a *proxy*; el nombre anterior está obsoleto. Este proyecto usa `proxy.ts`, exportando por defecto el wrapper `auth()` de Auth.js.
- **El handler de Auth.js vive en `app/api/[...nextauth]/route.ts`**, que resuelve en `/api/*` y no en la ruta más habitual `/api/auth/*`.
- **Parámetros dinámicos asíncronos.** Los params de ruta son una `Promise` y deben esperarse: `const { id } = await params`.
- **El estilado es deliberadamente mixto.** Tailwind CSS 4 está configurado y lo usan los shells de layout, mientras que la mayoría de componentes de funcionalidad emplean estilos en línea. El color de marca es `#6B2FDB`.
- **Idioma de la interfaz.** Los textos visibles al usuario están mayoritariamente en español; el código, los identificadores y los mensajes de commit, en inglés.
- **El cliente Prisma generado no se versiona.** Ejecuta `npm run db:generate` tras clonar o después de cualquier cambio en el esquema.
- **Estilo de commits.** [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `docs:`, `chore:`.

---

## Problemas Conocidos

- **Ruta raíz duplicada.** Tanto `app/page.tsx` como `app/(landing)/page.tsx` resuelven en `/`. Ambos archivos renderizan la misma composición de landing, pero solo `app/page.tsx` redirige a `/home` a los usuarios con sesión. El grupo `(landing)` es redundante y convendría eliminarlo.
- **La mensajería solo existe en el esquema.** `Message` está modelado y migrado, pero todavía no tiene interfaz ni server actions.
- **Las notificaciones son de solo escritura.** El flujo de propuestas crea los registros, pero no hay ninguna página para leerlos; el enlace de la barra lateral está comentado.
- **Sin suite de pruebas automatizadas.** No hay ningún runner de tests configurado en `package.json`.
- **`allowedDevOrigins`** en `next.config.ts` está fijado a `172.28.176.1`, una dirección de desarrollo específica de una máquina que puede requerir ajuste en otros entornos.

---

<div align="center">

**Labora** · Seminario de Software
Built with Next.js 16 · Prisma 7 · Supabase

</div>
