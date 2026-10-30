# Security Policy & Fortification — PlanCraft AI

PlanCraft AI adheres to enterprise-grade security practices to protect user data and ensure resilient, safe GenAI orchestration.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Controls & Fortifications

1. **Session & Identity Isolation**:
   - Every request is guarded by strict UUID v4 `X-Session-Id` header enforcement.
   - Cross-session data leakage is mathematically impossible through parameterized Prisma ORM queries bound to `req.sessionId`.

2. **HTTP Security Headers (Helmet)**:
   - Enforces strict HTTP security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-DNS-Prefetch-Control`.

3. **Cross-Origin Resource Sharing (CORS)**:
   - Configured with strict origin allowlisting matching verified hostnames and `onrender.com` subdomains.
   - Preflight requests are verified and credentials flags strictly controlled.

4. **Multi-Tier Rate Limiting**:
   - `standardApiLimiter`: 100 requests per 15-minute window per IP to eliminate brute-force and DDoS vectors.
   - `aiGenerationLimiter`: Dedicated strict burst quota (20 requests per 15-minute window) protecting Gemini LLM consumption against denial-of-wallet attacks.

5. **Input Validation & Sanitization**:
   - Strict typing, boundary enforcement, string sanitization (stripping HTML `<script>` tags), and range validation on all endpoints preventing SQL injection, XSS, and prototype pollution.

6. **Safe Error Handling**:
   - Production error handler explicitly masks internal database errors, query details, and stack traces, serving standardized opaque error responses.

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it via GitHub Security Advisories or email the maintainer directly. Valid reports will receive prompt triage within 24 hours.
