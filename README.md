# Project LOOP — AI Customer-Feedback Intelligence Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![AI Engine](https://img.shields.io/badge/AI-Intelligence_Engine-6366F1?style=for-the-badge)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

Project LOOP is an enterprise-grade multi-tenant web application that helps product teams ingest scattered customer feedback (support tickets, app reviews, survey responses, sales notes, community posts), auto-classify and cluster feedback using **AI Intelligence**, surface real-time sentiment analytics, and answer plain-English questions using grounded Retrieval-Augmented Generation (RAG).

---

## 🔐 Security & Access Control

Project LOOP implements strict Role-Based Access Control (RBAC) and tenant isolation:

| Role | Permissions & Capabilities |
| :--- | :--- |
| 🛡️ **Admin** | Full workspace management, invite teammates, edit member roles, feedback ingestion, and triage |
| ⚡ **Analyst** | Single & CSV feedback ingestion, inline status triage, AI re-classification, VoC report generation |
| 👁️ **Viewer** | Read-only access to dashboard analytics, feedback inbox, theme trends, Ask LOOP AI, and VoC reports |

*To access the application, register your own private workspace at `/signup` or log in with credentials configured in your environment.*

---

## ✨ Features & Architecture Highlights

### 1. Multi-Tenant Isolation & RBAC Security
- Strict workspace-level isolation on every database query (`workspaceId` scoping).
- Server-side role enforcement returning proper `403 Forbidden` responses for unauthorized operations.

### 2. Feedback Ingestion & Triage
- **Single Entry Form**: Direct feedback submission with real-time AI auto-classification.
- **CSV Bulk Ingestion**: Parses rows with `papaparse`, reports imported vs. failed items with detailed error reporting.
- **Simulated Integration Connector**: Single-click simulation of Zendesk, App Store, and Twitter live feed pulls.
- **Inline Triage Workflow**: Status progression (`NEW` ➔ `REVIEWED` ➔ `ACTIONED`).

### 3. AI Intelligence Engine
- **Structured Auto-Classification (AI1)**: Classifies sentiment (`POS` / `NEU` / `NEG`), sentiment score (-1.0 to +1.0), theme tags, feature area, and rationale validated via Zod schemas.
- **Theme Clustering & Spike Detection (AI2)**: Automatic grouping into theme clusters with week-over-week spike indicators (+35% alerts).
- **Ask LOOP Grounded RAG Q&A (AI3)**: Vector cosine similarity retrieval over feedback embeddings before calling the AI engine, guaranteeing 100% grounded answers with source citations.
- **Voice-of-Customer Digest (AI4)**: Pre-computed quantitative metrics combined with AI narrative synthesis, exportable to printable PDF reports.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Vanilla Tailwind CSS + Glassmorphism UX Design
- **Database & ORM**: PostgreSQL (Supabase / Neon) + Prisma ORM
- **Authentication**: NextAuth.js (JWT Sessions + Password Hashing)
- **AI Intelligence**: Generative AI & Vector Semantic Embeddings
- **Visualizations**: Recharts (Volume Area Chart, Sentiment Pie Chart, Theme Bar Chart)
- **Validation**: Zod runtime schema validation

---

## 🚀 Quickstart & Local Setup Instructions

### Prerequisites
- Node.js 18 LTS or newer
- Git

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/DeathSHMASHER/LOOP.git
cd LOOP
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):
```env
DATABASE_URL="your_postgresql_database_url"
DIRECT_URL="your_postgresql_direct_url"
NEXTAUTH_SECRET="your_secure_random_secret"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your_api_key_here"
```

### 3. Run Database Migrations & Seed Data
```bash
npx prisma db push
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Repository Structure

```
LOOP/
├── prisma/
│   ├── schema.prisma        # Multi-tenant data model (Workspace, User, Feedback, Theme, Embedding, Report)
│   └── seed.ts              # Populates feedback items & test role accounts
├── public/
│   └── favicon.svg          # Application favicon asset
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login & Signup pages
│   │   ├── (app)/           # Protected app routes (Dashboard, Inbox, Trends, Ask, Reports, Settings)
│   │   ├── api/             # REST API handlers with Zod validation & RBAC guards
│   │   │   ├── auth/        # NextAuth handler & registration endpoint
│   │   │   ├── feedback/    # CRUD, CSV bulk upload, simulated channel, re-classify
│   │   │   ├── ask/         # RAG grounded semantic search query handler
│   │   │   ├── reports/     # VoC digest generator & list
│   │   │   ├── members/     # Team member & role management (Admin only)
│   │   │   └── dashboard/   # Analytics stats & Recharts datasets
│   │   ├── globals.css      # Tailwind base & glassmorphic styling
│   │   ├── icon.svg         # App Router native icon
│   │   └── layout.tsx       # Root layout & providers
│   ├── components/
│   │   ├── Header.tsx       # Top navigation header with status indicators
│   │   └── Sidebar.tsx      # Sidebar navigation & workspace context
│   └── lib/
│       ├── ai.ts            # AI classification, Q&A, and VoC synthesis
│       ├── auth.ts          # NextAuth options & RBAC security guards
│       ├── db.ts            # Prisma client singleton
│       └── search.ts        # Vector cosine similarity search engine
├── .env.example             # Documented environment variable template
└── README.md
```
