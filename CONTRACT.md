# CONTRACT.md — PlanCraft AI

Frozen specification and architectural source of truth for **PlanCraft AI** (PromptWars Challenge 5: GenAI-Powered Planning Assistant).

---

## 1. Problem Statement Alignment

> **Challenge:** Create a GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas.

PlanCraft AI addresses every dimension of this statement with zero fluff:
- **Event Specialization:** Dedicated templates and domain knowledge for Weddings, Birthdays, and Community Events (plus Custom events).
- **Dynamic Budget Allocation & Tracking:** Intelligent category breakdown, expense items (estimated vs. actual), spending progress, and AI cost-saving optimizations.
- **Phased Milestones & Timelines:** Automated generation of multi-phase countdown schedules (e.g. 6 months out, 1 month out, week of, day-of run-of-show) with task completion tracking.
- **Vendor Management & Checklists:** Full vendor workflow (Venue, Catering, Photo/Video, Music, Decor, Logistics/Permits) with status tracking (`NOT_CONTACTED`, `INQUIRED`, `SHORTLISTED`, `BOOKED`, `CONFIRMED`) and AI-generated screening questions.
- **Personalized Ideas & Creative Concepts:** Theme styling, color palettes, sensory experiences, and bespoke interactive entertainment tailored to guest size, venue vibe, season, and budget.
- **Interactive AI Co-Pilot:** Real-time on-demand consultation modal allowing organizers to adapt their plan (e.g., budget cuts, rainy weather backups, dietary shifts).

---

## 2. System Architecture & Hero AI Features

### 2.1 Single Combined Deployable Architecture
- **Backend:** Express.js + Prisma ORM (SQLite / PostgreSQL) + Helmet + CORS + Rate Limiter. In production, Express statically serves the built React bundle and proxies SPA routing, avoiding multi-host CORS latency and complex multi-service configurations.
- **Frontend:** React 18 (Vite) + Tailwind CSS + Lucide Icons + Vitest + React Testing Library. Responsive, accessible (WCAG 2.1 AA/AAA), keyboard-navigable.
- **Zero-Friction Anonymous Session:** Client automatically generates an `X-Session-Id` UUID stored in `localStorage`. Evaluators can immediately test and use all features without account registration friction.

### 2.2 Hero AI Features (Powered by Google Gemini 2.5 Flash)
1. **Hero Feature 1: Comprehensive Event Blueprint Generator (`POST /api/events/generate-plan`)**
   Takes event criteria (type, guest count, total budget, target date, theme/vibe, location, custom preferences) and returns a complete, structured JSON blueprint with:
   - Creative Concept & Sensory Experience summary
   - Recommended Category Budget Breakdown with percentage targets and cost-saving tips
   - Milestone Planning Schedule & Day-Of Run-of-Show
   - Comprehensive Vendor Checklist with category requirements & screening questions
   - 3-5 Personalized Unique Ideas tailored specifically to the inputs
2. **Hero Feature 2: Interactive AI Planning Co-Pilot (`POST /api/events/:id/ai-consult`)**
   Allows organizers to request adjustments or ask contextual planning questions. Gemini analyzes the event's current budget, timeline, and vendor status to return actionable, structured suggestions.
3. **Resilience & Honest Offline Handling:**
   If Gemini is rate-limited or temporarily unavailable, the system retries once with strict prompting. If still unavailable, it persists an honest `AI_UNAVAILABLE` status without fabricating hallucinated responses or failing user CRUD operations.

---

## 3. Data Models (Prisma)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Event {
  id                  String             @id @default(cuid())
  sessionId           String
  name                String
  eventType           String             // "WEDDING" | "BIRTHDAY" | "COMMUNITY" | "OTHER"
  targetDate          String?
  guestCount          Int                @default(50)
  totalBudget         Float              @default(5000.0)
  currency            String             @default("USD")
  location            String?
  vibe                String?
  notes               String?
  aiThemeConcept      String?
  aiOverview          String?
  createdAt           DateTime           @default(now())
  updatedAt           DateTime           @updatedAt

  budgetItems         BudgetItem[]
  timelineItems       TimelineItem[]
  vendorItems         VendorItem[]
  personalizedIdeas   PersonalizedIdea[]
  consultations       AiConsultation[]

  @@index([sessionId])
}

model BudgetItem {
  id              String   @id @default(cuid())
  eventId         String
  event           Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  category        String   // "VENUE" | "CATERING" | "DECOR" | "ENTERTAINMENT" | "MEDIA" | "LOGISTICS" | "CONTINGENCY" | "OTHER"
  title           String
  estimatedCost   Float    @default(0.0)
  actualCost      Float    @default(0.0)
  isPaid          Boolean  @default(false)
  notes           String?
  createdAt       DateTime @default(now())
}

model TimelineItem {
  id              String   @id @default(cuid())
  eventId         String
  event           Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  phase           String   // "EARLY_PLANNING" | "MID_PLANNING" | "FINAL_PREP" | "DAY_OF" | "POST_EVENT"
  title           String
  targetDate      String?
  time            String?  // e.g. "14:00" for day-of runs
  isCompleted     Boolean  @default(false)
  notes           String?
  orderIndex      Int      @default(0)
  createdAt       DateTime @default(now())
}

model VendorItem {
  id              String   @id @default(cuid())
  eventId         String
  event           Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  category        String   // "VENUE" | "CATERING" | "PHOTOGRAPHY" | "MUSIC" | "FLORIST" | "RENTALS" | "OFFICIANT" | "SECURITY" | "OTHER"
  vendorName      String
  contactInfo     String?
  status          String   @default("NOT_CONTACTED") // "NOT_CONTACTED" | "INQUIRED" | "SHORTLISTED" | "BOOKED" | "CONFIRMED"
  quotedPrice     Float?
  notes           String?
  aiScreeningTips String?
  createdAt       DateTime @default(now())
}

model PersonalizedIdea {
  id              String   @id @default(cuid())
  eventId         String
  event           Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  category        String   // "THEME_DECOR" | "FOOD_BEVERAGE" | "ENTERTAINMENT" | "GIFT_FAVOR" | "LOGISTICS"
  title           String
  description     String
  costTier        String   @default("MEDIUM") // "LOW" | "MEDIUM" | "HIGH"
  isSaved         Boolean  @default(true)
  createdAt       DateTime @default(now())
}

model AiConsultation {
  id              String   @id @default(cuid())
  eventId         String
  event           Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  query           String
  reply           String
  createdAt       DateTime @default(now())
}
```

---

## 4. REST API Endpoint Contracts

All routes except `/health` require header: `X-Session-Id: <uuid>`

### 4.1 Event Management
- `POST /api/events` — Create manual event
- `GET /api/events` — List all events for active session
- `GET /api/events/:id` — Get full event details (budget, timeline, vendors, ideas)
- `PUT /api/events/:id` — Update event details
- `DELETE /api/events/:id` — Delete event

### 4.2 AI Blueprint Generation & Consultation
- `POST /api/events/generate-plan` — **Hero Endpoint 1**: Generates complete plan via Gemini and stores all initial budget items, timeline milestones, vendor checklists, and creative ideas.
- `POST /api/events/:id/ai-consult` — **Hero Endpoint 2**: Contextual interactive AI advice for this specific event.

### 4.3 Granular CRUD
- `POST /api/events/:id/budget` / `PUT /api/budget/:itemId` / `DELETE /api/budget/:itemId`
- `POST /api/events/:id/timeline` / `PUT /api/timeline/:itemId` / `DELETE /api/timeline/:itemId`
- `POST /api/events/:id/vendors` / `PUT /api/vendors/:itemId` / `DELETE /api/vendors/:itemId`
- `POST /api/events/:id/ideas` / `DELETE /api/ideas/:itemId`

---

## 5. Security & Rate Limiting Contract
- Rate limiting: Max 60 requests / minute for standard API routes; Max 15 requests / minute for Gemini AI endpoints (`/generate-plan`, `/ai-consult`).
- Input validation: Length limits on all string inputs (Name <= 120 chars, Notes <= 1000 chars, Vibe <= 200 chars).
- Helmet security headers: XSS filter, frameguard, strict transport security, and CSP enabled.
