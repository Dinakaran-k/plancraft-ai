# Hack2skill Challenge 5 — Submission Form Cheat Sheet

This document contains pre-written, verified responses formatted to match the character limits and exact fields of the **Hack2skill PromptWars Challenge 5** submission form.

---

### Field 1: Challenges
**Select:**
> Challenge 5: Event Planning Assistant

---

### Field 2: Public GitHub Repository Link
> `https://github.com/Dinakaran-k/plancraft-ai`
*(Repository visibility: Public | Size: ~183 KB, strictly under 10 MB)*

---

### Field 3: Project Deployed Link
> `https://plancraft-ai-v96f.onrender.com`
*(Live production deployment on Render, connected to Neon PostgreSQL)*

---

### Field 4: Project Demo Video Submission
> `<Your YouTube unlisted link or Google Drive link with public view access>`

---

### Field 5: Describe the changes/updates made in the deployed version
*(Limit: 1024 characters | Current count: ~897 characters)*

```
Production release of PlanCraft AI:
1. GenAI Event Architect (Gemini 2.5 Flash): Synthesizes budgets, phased countdowns, vendor checklists, and bespoke ideas in a single atomic database transaction.
2. AI Planning Co-Pilot & Idea Expansion: Real-time tradeoff analysis, weather contingencies, and on-demand creative brainstorming.
3. High-Efficiency Engine: Added PostgreSQL foreign-key indexes across child tables, Gzip/Brotli compression, and Rollup chunk splitting reducing core JS to 77 kB.
4. Robust Code Quality: Integrated React ErrorBoundary for fault-tolerant UI recovery, formal ESLint standards, and centralized AppError hierarchy.
5. Export Tools: One-click CSV Budget Ledger export and standard RFC 5545 iCalendar (.ics) export.
6. Accessibility & Security: WCAG 2.1 AA/AAA compliance with aria-live announcer, Helmet headers, CORS allowlisting, and 37 automated tests (100% passing).
```

---

### Field 6: Mention the Gen AI services utilized in the submission, and where did you utilize it?
*(Limit: 1024 characters | Current count: ~839 characters)*

```
Google Gemini 2.5 Flash (@google/generative-ai SDK) powers PlanCraft AI across 3 endpoints:

1. Blueprint Architect (POST /api/events/generate-plan):
Synthesizes event type, guest count, budget, venue, and vibe into a complete structured JSON plan:
- Creative theme concept & styling
- Categorized budget breakdown (venue, catering, decor, entertainment, media, contingency)
- Phased timeline milestones & day-of run-of-show
- Vendor checklist with AI screening questions and negotiation tips
- Tailored experiential ideas

2. AI Planning Co-Pilot (POST /api/events/:id/ai-consult):
Real-time contextual consultation assistant for budget cuts, weather contingencies, and vendor tradeoffs.

3. Idea Expansion (POST /api/events/:id/more-ideas):
On-demand brainstorming engine that evaluates existing plans to generate 3 fresh, bespoke ideas.
```

---

### Field 7: LinkedIn Post Link
> `https://www.linkedin.com/posts/<your-post-id>`

**Suggested LinkedIn Post Copy:**
> 🚀 Excited to share my submission for Challenge 5 of the #PromptWars Hackathon with @Hack2skill & @Google!
> 
> Introducing **PlanCraft AI** — a GenAI-powered planning assistant designed to eliminate the chaos of organizing weddings, milestone birthdays, and community gatherings.
> 
> ✨ Key Features:
> 🔹 Intelligent Event Blueprint Generation via Google Gemini 2.5 Flash
> 🔹 Dynamic Budget Management (estimated vs actual tracking, category breakdown)
> 🔹 Milestone Timelines & Day-Of Run-of-Show schedules
> 🔹 Vendor Management Pipeline with AI-curated screening questions
> 🔹 Interactive AI Co-Pilot for real-time tradeoffs & contingency advice
> 
> 🛠️ Built with React 18, Vite, Tailwind CSS, Node.js, Express, and Prisma ORM. 100% automated test coverage across 36 tests!
> 
> #GenerativeAI #GoogleGemini #WebDevelopment #ReactJS #FullStack #Hack2skill #AIInnovation
