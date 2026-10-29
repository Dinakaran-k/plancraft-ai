# PlanCraft AI — GenAI-Powered Event Planning Assistant

> Built for the **PromptWars Challenge 5: Event Planning Assistant** (Hack2skill).  
> **Problem Statement:** *Create a GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas.*

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.5%20Flash-orange.svg)](https://ai.google.dev)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-purple.svg)](https://www.prisma.io)
[![Tests](https://img.shields.io/badge/Tests-36%20Passed-brightgreen.svg)]()

---

## Table of Contents

- [Core Capabilities](#core-capabilities)
- [How Generative AI is Utilized (and Where)](#how-generative-ai-is-utilized-and-where)
- [Alignment with Hack2skill Evaluation Criteria](#alignment-with-hack2skill-evaluation-criteria)
- [Tech Stack & Architecture](#tech-stack--architecture)
- [Quick Start / Local Setup](#quick-start--local-setup)
- [Running Automated Tests](#running-automated-tests)
- [Step-by-Step Evaluator Verification Guide](#step-by-step-evaluator-verification-guide)
- [Hack2skill Submission Reference](#hack2skill-submission-reference)

---

## Core Capabilities

PlanCraft AI delivers end-to-end event orchestration across **Weddings**, **Birthdays**, and **Community Gatherings** covering all four essential planning pillars:

1. 💰 **Dynamic Budget Management:**
   - Real-time expense breakdown across 8 categories (Venue, Catering, Decor, Entertainment, Media, Logistics, Contingency, Other).
   - Live analytics: Total Allocated vs. Estimated vs. Actual Paid, remaining balance, and visual budget utilization progress.
   - Per-item payment status tracking and AI cost-saving optimizations.

2. ⏱️ **Milestone & Schedule Timelines:**
   - Multi-phase countdown planning (`EARLY_PLANNING`, `MID_PLANNING`, `FINAL_PREP`, `DAY_OF`, `POST_EVENT`).
   - Granular Day-Of run-of-show hour-by-hour schedules with checklist toggles.
   - Live completion rate calculation and phase filtering.

3. 📋 **Vendor Checklists & Screening Pipeline:**
   - Complete vendor management pipeline (`NOT_CONTACTED` → `INQUIRED` → `SHORTLISTED` → `BOOKED` → `CONFIRMED`).
   - Tracks quoted pricing, contact info, notes, and contracts.
   - **AI Screening Advice:** Gemini generates tailored interview questions and contract pitfalls to watch out for each vendor category.

4. 💡 **Personalized Creative Ideas & Themes:**
   - Tailored aesthetic themes, visual color palettes, and sensory touches (lighting, soundscapes, aromas).
   - Bespoke interactive experiences with cost-tier badges (`LOW`, `MEDIUM`, `HIGH`).
   - Contextually tuned to guest size, season, budget, and vibe.

5. 🤖 **Interactive AI Planning Co-Pilot:**
   - Real-time on-demand consultation modal powered by Gemini.
   - Instant answers for budget cuts (e.g. *"How can we cut 15% from catering without guests noticing?"*), rain contingencies, dietary adjustments, or vendor contract negotiations.

---

## How Generative AI is Utilized (and Where)

| Feature | GenAI Endpoint | Model | Purpose & Implementation |
|---|---|---|---|
| **Intelligent Event Blueprint** | `POST /api/events/generate-plan` | Google Gemini `gemini-2.5-flash` (`@google/generative-ai`) | Takes user inputs (event type, guest count, budget, date, vibe, notes) and synthesizes a complete structured JSON blueprint in a single call: executive overview, creative concept, categorized budget items, milestone schedule, vendor requirements, and 3–5 personalized ideas. |
| **Interactive Planning Co-Pilot** | `POST /api/events/:id/ai-consult` | Google Gemini `gemini-2.5-flash` | Contextual consultation assistant. Analyzes the event's live budget state, guest count, and notes to provide practical tradeoff analysis and step-by-step recommendations. |
| **AI Vendor Screening Assistant** | Integrated in Blueprint | Google Gemini `gemini-2.5-flash` | Injects category-specific interview questions and negotiation checklists into each vendor item to protect organizers from contract traps. |
| **Resilient Offline Fallback** | `server/services/geminiService.js` | Built-in fallback engine | Employs automatic retry with strict schema enforcement. If API keys are unset or network is unreachable, it seamlessly provides a realistic, structured blueprint and marks `aiStatus: "UNAVAILABLE"` without crashing or blocking user actions. |

---

## Alignment with Hack2skill Evaluation Criteria

### 1. Code Quality
- **Layered Architecture:** Clear separation of concerns across `server/routes`, `server/controllers`, `server/services`, `server/middleware`, and React component-driven architecture.
- **Maintainable Standards:** Clean modular ES6+ Javascript, JSDoc documentation, descriptive variable naming, and consistent formatting.
- **Centralized Error Handling:** All errors pass through custom middleware, returning structured error messages without crashing the runtime.

### 2. Security
- **Security Headers:** `helmet` applies strict HTTP security headers (XSS filtering, frameguard, nosniff, etc.).
- **Host-Verified CORS:** Restricted cross-origin policies allowing only verified hosts and trusted origins.
- **DDoS & Rate Limiting:** `express-rate-limit` enforces rate caps (standard routes: 300 req/15m; Gemini AI routes: 30 req/5m).
- **Strict Input Sanitization:** Regex-based UUID validation, string length clamps, and HTML-tag stripping (`validatorService.js`).
- **SQL Injection Prevention:** Parameterized database access using Prisma ORM.
- **Zero Secret Leakage:** No keys or credentials committed to repository (`.env` strictly excluded via `.gitignore`).

### 3. Efficiency
- **Optimized Bundle Footprint:** Client built with Vite — total production bundle is under 300 kB uncompressed (~88 kB gzipped).
- **Zero-Friction Anonymous Sessions:** Evaluators test instantly via an auto-generated client UUID (`X-Session-Id`) without registration friction.
- **Repository Size Strictly Under 10 MB:** Clean architecture with comprehensive `.gitignore` keeps repository footprint well under 2 MB.

### 4. Testing
- **100% Automated Suite Pass:** 36 automated tests spanning unit, integration, end-to-end, and UI components.
  - `server/tests/validation.test.js`: Input boundaries, sanitization, budget analytical service tests.
  - `server/tests/geminiParser.test.js`: JSON schema extraction and markdown code fence cleaning.
  - `server/tests/eventsApi.test.js`: API routes, session guards, sub-resource CRUD.
  - `server/tests/e2e.test.js`: Full end-to-end user journey (blueprint generation → budget edit → milestone complete → vendor booked → AI co-pilot consult).
  - `client/src/tests/`: Component unit tests verifying React form inputs, budget metrics, and milestone toggles.

### 5. Accessibility (a11y)
- **WCAG 2.1 AA/AAA Compliance:** High-contrast text colors on slate backgrounds.
- **Semantic HTML5:** Strict use of `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, and form labels.
- **Screen Reader Support:** Live region announcer (`AccessibilityAnnouncer.jsx` using `aria-live="polite"`).
- **Full Keyboard Navigation:** Explicit `:focus-visible` ring indicators, tab index order, and ESC-to-close modals.

### 6. Problem Statement Alignment
- Dedicated workflows for **Weddings**, **Birthdays**, and **Community Events**.
- Explicit implementations for **Budgets**, **Timelines**, **Vendor Checklists**, and **Personalized Ideas**.

---

## Tech Stack & Architecture

- **Frontend:** React 18 + Vite + Tailwind CSS + Lucide Icons
- **Backend:** Node.js + Express
- **Database:** Prisma ORM with SQLite (zero-config local dev & testing) / PostgreSQL (production)
- **Generative AI:** `@google/generative-ai` (Gemini 2.5 Flash)
- **Testing:** Jest + Supertest (server) & Vitest + React Testing Library (client)
- **Deployment Strategy:** Single combined service — Express serves the pre-built React SPA from `client/dist`, eliminating multi-origin CORS complexities on Render, Railway, or Fly.io.

---

## Quick Start / Local Setup

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd plancraft-ai
npm run install:all
```

### 2. Configure Environment
```bash
# In server directory:
cp server/.env.example server/.env

# Optional: Add your Google Gemini API Key to server/.env:
# GEMINI_API_KEY="your-gemini-key"
```
*(Note: If GEMINI_API_KEY is not set, the app gracefully runs with the built-in resilient blueprint generator so all features remain testable!)*

### 3. Initialize Database
```bash
cd server
npx prisma db push
cd ..
```

### 4. Run Development Servers
```bash
npm run dev
```
Open **http://localhost:5174** in your browser.

---

## Running Automated Tests

Run the complete test suite (36 tests) with a single command:
```bash
npm test
```

Or run suites individually:
```bash
npm run test:server   # 28 Jest tests (Unit, Integration, E2E)
npm run test:client   # 8 Vitest tests (React Components)
```

---

## Step-by-Step Evaluator Verification Guide

1. **Open the Application:** Open http://localhost:5174 (or deployed URL). No registration is required.
2. **Launch Event Wizard:** Click **"New Event"** or use the setup card on first load.
3. **Choose Preset:** Select **Wedding**, **Birthday**, or **Community Event**. Observe preset parameters update dynamically.
4. **Generate Blueprint:** Click **"Generate AI Event Blueprint"**. Gemini will synthesize the plan and redirect to your dashboard.
5. **Inspect All 4 Pillars:**
   - **Theme & Ideas Tab:** Review the creative concept, visual color palette, and personalized experience cards with cost badges.
   - **Budget Tab:** Review category allocations and estimated costs. Click **"Add Item"** to insert a custom expense or check off a paid item.
   - **Timeline Tab:** Filter by phase (Early Planning, Day-Of Run-of-Show). Click a milestone checkbox to mark it complete and watch the progress bar advance.
   - **Vendors Tab:** Review required vendors with AI screening questions. Change a vendor's status to `BOOKED`.
6. **Consult AI Co-Pilot:** Click **"Ask AI Co-Pilot"** in the top bar. Pick a prompt (e.g., *"How can we cut 15% from catering?"*) or type a question to receive tailored event advice.

---

## Hack2skill Submission Reference

- **Challenges:** Challenge 5: Event Planning Assistant
- **Public GitHub Repository Link:** `<Your GitHub Repository URL>`
- **Project Deployed Link:** `<Your Deployed URL>`
- **Mention Gen AI services utilized & where:**
  > *Google Gemini 2.5 Flash (@google/generative-ai) is utilized in two core workflows: (1) POST /api/events/generate-plan synthesizes a comprehensive event blueprint including category budget allocations, phased timeline schedules with day-of run-of-show, vendor requirements with interview screening questions, and personalized creative ideas customized to event type (wedding, birthday, community), guest size, and vibe; (2) POST /api/events/:id/ai-consult provides an interactive planning co-pilot for on-demand budget tradeoff analysis, contingency planning, and personalized dilemma resolution.*
- **Describe the changes/updates made in the deployed version:**
  > *Initial release of PlanCraft AI: (1) Implemented GenAI Event Blueprint Architect generating dynamic budgets, milestones, vendor checklists, and creative ideas; (2) Added interactive AI Co-Pilot consultation modal for real-time adjustments; (3) Added live analytical budget aggregations and milestone progress tracking; (4) Built WCAG AA/AAA compliant accessible UI with keyboard navigation; (5) Implemented Helmet security headers, rate limiting, and zero-leakage input validation; (6) 36 passing automated tests.*
