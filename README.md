# Project LOOP — AI Customer-Feedback Intelligence Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Google Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

Project LOOP is a corporate-grade multi-tenant web application that helps product teams ingest scattered customer feedback (support tickets, app reviews, survey responses, sales notes, community posts), auto-classify and cluster feedback using **Google Gemini AI**, surface real-time sentiment analytics, and answer plain-English questions using grounded Retrieval-Augmented Generation (RAG).

---

## 🔑 Pre-Configured Demo Credentials Checklist

The database is pre-seeded with **120+ realistic feedback items**, themes, embeddings, and 3 test user accounts representing each Role-Based Access Control (RBAC) tier:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@zidio-loop.com` | `password123` | Full workspace management, member invitation, role configuration, ingestion, and triage |
| ⚡ **Analyst** | `analyst@zidio-loop.com` | `password123` | Single & CSV feedback ingestion, inline status triage, AI re-classification, VoC report generation |
| 👁️ **Viewer** | `viewer@zidio-loop.com` | `password123` | Read-only access to dashboard, inbox, trends, Ask LOOP AI, and VoC reports |

---

## ✨ Features & Architecture Highlights

### 1. Multi-Tenant Isolation & RBAC Security
- Strict workspace-level isolation on every database query (`workspaceId` scoping).
- Server-side role enforcement returning proper `403 Forbidden` responses for unauthorized operations.

### 2. Feedback Ingestion & Triage
- **Single Entry Form**: Direct feedback submission with real-time Google Gemini auto-classification.
- **CSV Bulk Ingestion**: Parses rows with `papaparse`, reports imported vs. failed items with detailed error reporting.
- **Simulated Integration Connector**: Single-click simulation of Zendesk, App Store, and Twitter live feed pulls.
- **Inline Triage Workflow**: Status progression (`NEW` ➔ `REVIEWED` ➔ `ACTIONED`).

### 3. Google Gemini AI Engine
- **Structured Auto-Classification (AI1)**: Classifies sentiment (`POS` / `NEU` / `NEG`), sentiment score (-1.0 to +1.0), theme tags, feature area, and rationale validated via Zod schemas.
- **Theme Clustering & Spike Detection (AI2)**: Automatic grouping into theme clusters with week-over-week spike indicators (+35% alerts).
- **Ask LOOP Grounded RAG Q&A (AI3)**: Vector cosine similarity retrieval over feedback embeddings before calling Google Gemini, guaranteeing 100% grounded answers with source citations.
- **Voice-of-Customer Digest (AI4)**: Pre-computed quantitative metrics combined with Google Gemini narrative synthesis, exportable to printable PDF reports.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Vanilla Tailwind CSS + Glassmorphism UX Design
- **Database & ORM**: PostgreSQL / SQLite + Prisma ORM
- **Authentication**: NextAuth.js (JWT Sessions + Password Hashing)
- **AI Intelligence**: Google Gemini API (`@google/generative-ai`)
- **Visualizations**: Recharts (Volume Area Chart, Sentiment Pie Chart, Theme Bar Chart)
- **Validation**: Zod runtime schema validation

---

## 🚀 Quickstart & Local Setup Instructions

### Prerequisites
- Node.js 18 LTS or newer
- Git

### 1. Clone & Install Dependencies
```bash
cd TASK_1(LOOP)
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory (or use `.env.example`):
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="loop_jwt_secret_key_zidio_2026_safe_dev"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your_google_gemini_api_key_here"
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
TASK_1(LOOP)/
├── prisma/
│   ├── schema.prisma        # Multi-tenant data model (Workspace, User, Feedback, Theme, Embedding, Report)
│   └── seed.ts              # Populates 120+ feedback items & 3 role accounts
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login & Signup pages with quick-fill demo buttons
│   │   ├── (app)/           # Protected app routes (Dashboard, Inbox, Trends, Ask, Reports, Settings)
│   │   ├── api/             # REST API handlers with Zod validation & RBAC guards
│   │   │   ├── auth/        # NextAuth handler & registration endpoint
│   │   │   ├── feedback/    # CRUD, CSV bulk upload, simulated channel, re-classify
│   │   │   ├── ask/         # RAG grounded semantic search query handler
│   │   │   ├── reports/     # VoC digest generator & list
│   │   │   ├── members/     # Team member & role management (Admin only)
│   │   │   └── dashboard/   # Analytics stats & Recharts datasets
│   │   ├── globals.css      # Tailwind base & glassmorphic styling
│   │   └── layout.tsx       # Root layout & providers
│   ├── lib/
│   │   ├── ai.ts            # Google Gemini AI classification, Q&A, and VoC synthesis
│   │   ├── auth.ts          # NextAuth options & RBAC security guards
│   │   ├── db.ts            # Prisma client singleton
│   │   └── search.ts        # Vector cosine similarity search engine
└── README.md
```
