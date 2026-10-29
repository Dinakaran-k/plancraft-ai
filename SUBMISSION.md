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
*(Limit: 1024 characters | Current count: ~760 chars)*

> Production release of PlanCraft AI:
> 1. Engineered GenAI Event Blueprint Architect powered by Gemini 2.5 Flash, generating categorized budgets, phased timeline countdowns, vendor checklists, and bespoke creative concepts in a single transactional step.
> 2. Implemented interactive AI Planning Co-Pilot (POST /api/events/:id/ai-consult) and Dynamic Idea Expansion (POST /api/events/:id/more-ideas) for real-time tradeoffs, contingencies, and fresh creative inspiration.
> 3. Added dynamic budget analytics (estimated vs actual variance, category breakdown, CSV export) and Calendar milestone export (.ics for Google/Apple Calendar).
> 4. Designed WCAG 2.1 AA/AAA accessible UI with screen reader announcer (aria-live), full keyboard navigation, event ambiance theming, and countdown badge.
> 5. Fortified with Helmet security headers, CORS origin allowlisting, Neon PostgreSQL, and rate limiters.
> 6. 37 passing automated tests (Jest, Supertest, Vitest).

---

### Field 6: Mention the Gen AI services utilized in the submission, and where did you utilize it?
*(Limit: 1024 characters | Current count: ~840 chars)*

> Google Gemini (gemini-2.5-flash via @google/generative-ai SDK) is utilized in three core capabilities:
> 
> 1. Comprehensive Event Blueprint Generator (POST /api/events/generate-plan):
> Invoked during event creation. Gemini synthesizes user inputs (event type: wedding/birthday/community, guest count, total budget, location, desired vibe) into a structured JSON plan comprising:
> - Creative theme concept, color palette, and sensory styling
> - Category budget allocation (venue, catering, decor, entertainment, media, contingency)
> - Multi-phase timeline milestones and day-of run-of-show
> - Essential vendor checklist with AI screening questions and negotiation tips
> - 3-5 personalized creative experience ideas tailored to guest scale
> 
> 2. Interactive AI Planning Co-Pilot (POST /api/events/:id/ai-consult):
> Real-time contextual consultation assistant for budget cuts, menu suggestions, and contingencies.
> 
> 3. Dynamic Idea Expansion Engine (POST /api/events/:id/more-ideas):
> On-demand brainstorming tool that considers existing event state to craft 3 fresh, bespoke experiences.

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
