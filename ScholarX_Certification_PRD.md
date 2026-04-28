# ScholarX Certification Module â€” PRD

**Document Version:** 1.0.0
**Status:** Draft â€” Pending EM Review
**Author:** Principal Software Engineer
**Date:** April 27, 2026
**Product:** ScholarX V2 â€” Certification Feature Module
**Classification:** Internal â€” Confidential

---

## Table of Contents

1. [Executive Summary & Product Vision](#1-executive-summary--product-vision)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Scope, Assumptions & Constraints](#3-scope-assumptions--constraints)
4. [Personas & User Journeys](#4-personas--user-journeys)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [System Architecture](#7-system-architecture)
8. [Backend Modules & API Design](#8-backend-modules--api-design)
9. [Data Models & ERD](#9-data-models--erd)
10. [Security & Verification Model](#10-security--verification-model)
11. [Frontend Architecture](#11-frontend-architecture)
12. [UI/UX Flows & Screen Inventory](#12-uiux-flows--screen-inventory)
13. [State Management & API Integration](#13-state-management--api-integration)
14. [Milestones & Delivery Timeline](#14-milestones--delivery-timeline)
15. [Risks, Dependencies & Mitigations](#15-risks-dependencies--mitigations)
16. [Open Questions & Appendix](#16-open-questions--appendix)

---

## 1. Executive Summary & Product Vision

### 1.1 Context

ScholarX is an internal mentorship platform that connects mentees with industry mentors across structured seasonal programs. Upon completing a program, both mentors and mentees currently receive **no formal, verifiable recognition** of their participation and achievement. Certificates â€” if issued â€” are informal PDFs attached to emails, untracked, and unverifiable.

This PRD defines the **ScholarX Certification Module**: a first-class feature integrated into ScholarX V2 (Next.js) that automatically issues branded, cryptographically verifiable digital certificates to program participants and makes them shareable, downloadable, and publicly verifiable.

### 1.2 Problem Statement

| Problem | Impact |
|---|---|
| No formal credential issued after program completion | Mentors and mentees cannot prove participation to employers, universities, or professional networks |
| Manual PDF issuance (if any) is error-prone and untracked | Admin overhead; no visibility into who received or claimed a cert |
| Certificates cannot be verified | Recipients' credentials are untrusted; potential for forgery |
| No LinkedIn integration | Participants miss professional recognition; platform loses virality |

### 1.3 Product Vision

> **Every ScholarX program completion deserves a credential that participants are proud to share and employers trust to verify â€” issued automatically, styled to ScholarX's brand, and publicly verifiable with one click.**

### 1.4 Strategic Fit

The Certification Module directly advances ScholarX's platform goals:

| Platform Goal | Module Contribution |
|---|---|
| Increase mentor & mentee program completion rates | Certificate as a completion incentive |
| Grow ScholarX brand reach | LinkedIn shares expose ScholarX to professional networks virally |
| Improve platform credibility | Verifiable, tamper-proof credentials signal institutional quality |
| Support ScholarX V2 migration | Built natively in Next.js; no legacy dependencies |

### 1.5 Migration Note

The current stack (React + Express) will **not** receive the certification feature. The module is built exclusively for **ScholarX V2 (Next.js + upgraded backend)**, serving as a flagship V2 feature that incentivizes migration. The backend API design is stack-agnostic (REST), allowing gradual migration of the Express layer to Next.js API routes or a dedicated NestJS service.
---

## 2. Goals & Success Metrics

### 2.1 Business Goals

| ID | Goal | Priority |
|---|---|---|
| BG-01 | Automatically issue a branded certificate to every participant who completes a ScholarX program season | P0 |
| BG-02 | Enable public, zero-friction certificate verification via unique URL and QR code | P0 |
| BG-03 | Drive LinkedIn shares of ScholarX certificates to grow brand reach | P0 |
| BG-04 | Provide ScholarX admins with full visibility into certificate issuance and claim status | P1 |
| BG-05 | Reduce admin effort for certificate issuance from manual to fully automated | P1 |

### 2.2 Success Metrics (OKRs)

#### Objective 1: Automate and trust certificate issuance

| Key Result | Target | How Measured |
|---|---|---|
| % of program completions auto-issued a certificate | 100% | Backend job monitoring |
| Certificate PDF/PNG generation time (P95) | < 5 seconds | APM (Sentry performance) |
| Zero false-positive verification results | 100% accuracy | Automated verification test suite |

#### Objective 2: Drive credential sharing and engagement

| Key Result | Target | How Measured |
|---|---|---|
| LinkedIn share rate per issued certificate | > 35% within 14 days of issuance | Event tracking |
| Public verification page load time (LCP) | < 1.5s on 4G | Lighthouse CI |
| Certificate claim rate | > 90% within 30 days | Admin dashboard metric |

#### Objective 3: Reduce admin overhead

| Key Result | Target | How Measured |
|---|---|---|
| Manual effort to issue all certs for a season | < 5 minutes (bulk trigger) | Admin workflow audit |
| Support tickets related to lost/unfound certificates | Reduced by 80% | Helpdesk data |

### 2.3 Anti-Goals

- **Not** building a multi-tenant SaaS for external organizations
- **Not** implementing blockchain anchoring in V2 (roadmap item)
- **Not** replacing the existing ScholarX program management system â€” this module is additive
- **Not** building a native mobile app; web only for V2

---

## 3. Scope, Assumptions & Constraints

### 3.1 In-Scope (V2 Launch)

| # | Feature |
|---|---|
| S-01 | Automatic certificate issuance triggered on program completion event |
| S-02 | Manual / bulk issuance by ScholarX admin |
| S-03 | Certificate output: PDF (download) + PNG (share-optimized) |
| S-04 | Unique verification URL + embedded QR code per certificate |
| S-05 | Public verification page (no login required) |
| S-06 | Recipient email notification with claim link |
| S-07 | Recipient credential wallet (view, download, share) |
| S-08 | LinkedIn one-click share with Open Graph preview |
| S-09 | Admin issuance dashboard (status tracking per recipient) |
| S-10 | Google OAuth 2.0 for recipient login (claim without separate account creation) |
| S-11 | Certificate revocation by admin (with reason) |
| S-12 | Audit log for all certificate lifecycle events |

### 3.2 Out-of-Scope (Future Roadmap)

| # | Feature | Target |
|---|---|---|
| OS-01 | Open Badges 3.0 / W3C Verifiable Credentials | V2.5 |
| OS-02 | Blockchain anchoring (Polygon) | V3 |
| OS-03 | Custom certificate template designer | V2.5 |
| OS-04 | Multi-organization / multi-tenant support | V3 |
| OS-05 | SAML/Okta SSO | V2.5 |
| OS-06 | Native iOS / Android app | V3 |
| OS-07 | Certificate expiry & renewal workflows | V2.5 |

### 3.3 Assumptions

- ScholarX V2 backend will expose a `program_completion` event (webhook or internal event) that the certification module subscribes to
- ScholarX already stores participant emails and names â€” no new data collection required
- ScholarX brand assets (logo, colors, typography) are finalized before template implementation
- Email delivery uses an existing transactional email provider (e.g. Resend or SendGrid already configured for V2)

### 3.4 Constraints

| Constraint | Impact |
|---|---|
| Single organization (ScholarX only) | No multi-tenancy complexity; simpler schema and auth model |
| Web-only (Next.js V2) | No React Native / Expo work required |
| GDPR compliance for participant PII | Email + name handled per existing ScholarX data policy |
| Existing Express backend in V1 | Certification module is V2-only; no backport |
| Team size: estimated 2â€“3 engineers for this module | Timeline must be realistic for small team |
---

## 3. Scope, Assumptions & Constraints [UPDATED]

### 3.1 In-Scope (V2 Migration)

| # | Feature | Source |
|---|---|---|
| S-01 | Migrate Certificate list page (`My Certificates`) | V1 â†’ V2 |
| S-02 | Migrate Certificate public verification page | V1 â†’ V2 |
| S-03 | Migrate Certificate PDF download (streaming route) | V1 â†’ V2 |
| S-04 | PDF generation via `pdf-lib` (template manipulation) | Refactor |
| S-05 | `dbCourseCompletions` Drizzle schema + migration | New |
| S-06 | Server Actions: `getUserCertificates`, `verifyCertificate` | New |
| S-07 | Recipient claim email + unique verification URL + QR code | Carry-over |
| S-08 | LinkedIn one-click share + Open Graph meta | Carry-over |
| S-09 | **Change Password** settings page (better-auth) | **NEW** |
| S-10 | Admin certificate issuance dashboard | Carry-over |
| S-11 | Certificate revocation by admin | Carry-over |
| S-12 | Audit log for certificate lifecycle events | Carry-over |
| S-13 | Google OAuth 2.0 via better-auth | V1 â†’ V2 |

### 3.2 Out-of-Scope (V2 â€” Future)

| # | Feature | Target |
|---|---|---|
| OS-01 | Blockchain / W3C Verifiable Credentials | V2.5 |
| OS-02 | Custom template designer UI | V2.5 |
| OS-03 | Open Badges 3.0 | V2.5 |
| OS-04 | Multi-tenant / external org support | V3 |
| OS-05 | Native mobile app | V3 |

### 3.3 Migration Strategy

This is a **feature migration** (V1 React + Express â†’ V2 Next.js), not a greenfield build.

| Principle | Detail |
|---|---|
| No Redux | Replace all Redux state with Server Actions + TanStack Query |
| No Express routes | Replace Express handlers with Next.js API Routes + Server Actions |
| No TypeORM | Replace with Drizzle ORM schema + migrations |
| No NextAuth.js | Use **better-auth** (already chosen for V2) |
| Parallel run | V1 stays live until V2 feature is verified in production |

### 3.4 Assumptions

- ScholarX V2 already has better-auth configured with Google OAuth
- Drizzle ORM is already set up in V2 with an existing DB connection
- A `pdf-lib`-compatible certificate template (PDF form/base) exists or will be created
- `dbUsers` and `dbCourses` tables already exist in the V2 Drizzle schema
- shadcn/ui is available in V2 for UI components

### 3.5 Constraints

| Constraint | Impact |
|---|---|
| Web-only (Next.js V2 App Router) | No React Native work |
| Drizzle ORM (not TypeORM) | Schema defined in Drizzle syntax; migrations via `drizzle-kit` |
| better-auth (not NextAuth.js) | Change Password uses `authClient.changePassword()` API |
| pdf-lib (not Puppeteer) | PDF generation via template manipulation, not HTML render |
| GDPR compliance | PII minimized; right-to-erasure path defined |
---

## 4. Personas & User Journeys

### 4.1 Personas

#### P1 â€” Aisha, the ScholarX Admin
- **Role**: Program Coordinator at ScholarX
- **Goal**: Ensure every mentee and mentor who completes a season receives their certificate automatically; track claim status; handle exceptions
- **Pain Points**: Currently manually creates PDFs and emails them one by one; no tracking; participants ask "where's my certificate?"
- **Key Needs**: Dashboard showing who received/claimed; bulk issue trigger; resend option

#### P2 â€” Kasun, the Mentee (Recipient)
- **Role**: University student who completed a 6-month mentorship program
- **Goal**: Add the ScholarX mentorship certificate to his LinkedIn profile and CV before applying for internships
- **Pain Points**: Received a PDF attachment that got lost in email; can't share a live, verifiable link
- **Key Needs**: One-click LinkedIn share, permanent public URL, downloadable PDF + PNG

#### P3 â€” Nimal, the Mentor (Recipient)
- **Role**: Senior engineer who volunteered as a ScholarX mentor
- **Goal**: Add mentorship credential to LinkedIn to demonstrate community contribution
- **Key Needs**: Same as Kasun; also values the "Mentor" designation on the certificate being visually distinct

#### P4 â€” Emma, the Hiring Manager (Verifier)
- **Role**: HR at a tech company reviewing Kasun's application
- **Goal**: Quickly verify the ScholarX certificate is genuine
- **Key Needs**: Zero login, instant result, issuer branding visible, clear VALID/INVALID status

### 4.2 User Journeys

#### Journey 1: Automated Season Completion Issuance (Aisha)

```
[1] ScholarX platform marks program season as "Completed"
    â†“
[2] Completion event fires â†’ Certification Module receives event payload
    { programId, participants: [{ name, email, role: 'mentee'|'mentor' }] }
    â†“
[3] For each participant:
    â€¢ Generate certificate (correct template per role: Mentee / Mentor)
    â€¢ Sign certificate â†’ generate unique ID + QR code
    â€¢ Render PDF + PNG
    â€¢ Upload to storage
    â€¢ Store certificate record
    â€¢ Send claim email
    â†“
[4] Aisha opens Admin Dashboard â†’ sees all issued certificates
    with status: PENDING CLAIM / CLAIMED / REVOKED
    â†“
[5] For any unclaimed after 7 days â†’ Aisha clicks "Resend" per row
    OR triggers "Bulk Resend to Unclaimed"
```

#### Journey 2: Claiming the Certificate (Kasun)

```
[1] Kasun receives email:
    "ًںژ“ Your ScholarX Mentorship Certificate is Ready!"
    [Claim Your Certificate â†’] button
    â†“
[2] Clicks â†’ lands on /claim/:token (no login required by default)
    OR prompted to "Sign in with Google" to save to wallet
    â†“
[3] Certificate displayed in full visual:
    â€¢ ScholarX logo, Kasun's name, program name, season, completion date
    â€¢ "Mentee" or "Mentor" role designation
    â€¢ Verification URL + QR code visible on certificate
    â†“
[4] Available actions:
    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
    â”‚ [â¬‡ Download PDF]  [ًں–¼ Download PNG]          â”‚
    â”‚ [ًں”— Copy Link]    [in Share to LinkedIn]     â”‚
    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
    â†“
[5] Kasun clicks "Share to LinkedIn":
    â†’ Opens LinkedIn share dialog with pre-filled text:
      "Proud to have completed the ScholarX Mentorship Program!
       Verified credential: https://scholarx.lk/verify/abc123"
    â†’ LinkedIn card shows Open Graph preview of certificate
    â†“
[6] Certificate saved in Kasun's wallet (if signed in)
```

#### Journey 3: Verification (Emma)

```
[1] Emma clicks certificate link in Kasun's application:
    https://scholarx.lk/verify/abc123
    â†“
[2] Lands on public verification page â€” no login, loads in < 2s
    â†“
[3] Sees:
    âœ…  CERTIFICATE VALID
    ScholarX [logo] | Kasun Perera | Mentee â€” Program X, Season 5
    Issued: January 15, 2026  |  No expiry
    â†“
[4] Emma satisfied â†’ proceeds with application review
    (Verification event logged silently in background)
```
---

## 5. Functional Requirements [UPDATED]

### Priority Legend
- **P0** â€” Must have at V2 launch (migration parity with V1)
- **P1** â€” Should have (enhancements over V1)
- **P2** â€” Nice to have (post-launch)

---

### 5.1 Authentication & Authorization

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-AUTH-01 | Google OAuth 2.0 via better-auth | P0 | Already in V2 auth setup |
| FR-AUTH-02 | Session check guard on protected routes `(protected)/` | P0 | better-auth session middleware |
| FR-AUTH-03 | Admin role guard on issuance/revocation APIs | P0 | better-auth role claims |
| FR-AUTH-04 | Public certificate verify page â€” zero auth required | P0 | â€” |

### 5.2 Change Password (NEW)

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-PWD-01 | Settings page at `(protected)/settings/change-password/page.tsx` | P0 | â€” |
| FR-PWD-02 | Form fields: Current Password, New Password, Confirm New Password | P0 | Current Password was missing in V1 â€” add it |
| FR-PWD-03 | Call `authClient.changePassword({ currentPassword, newPassword })` from better-auth | P0 | â€” |
| FR-PWD-04 | Display inline error for wrong current password | P0 | better-auth returns structured error |
| FR-PWD-05 | Display inline error for mismatched new/confirm password | P0 | Client-side validation |
| FR-PWD-06 | Success toast on successful password change | P0 | shadcn/ui `toast` |
| FR-PWD-07 | Styled with shadcn/ui form components (Input, Button, Label) | P0 | Consistent with V2 design |
| FR-PWD-08 | Loading state on submit button while request in flight | P0 | â€” |

### 5.3 Certificate Issuance (Backend)

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-ISS-01 | Auto-issue on course/program completion event | P0 | Insert into `dbCourseCompletions` |
| FR-ISS-02 | Manual single issuance by admin | P0 | â€” |
| FR-ISS-03 | Bulk issuance for all completions of a season/course | P0 | â€” |
| FR-ISS-04 | Generate certificate PDF via `pdf-lib` (template + injected data) | P0 | Replaces legacy approach |
| FR-ISS-05 | Generate certificate PNG (1200أ—630) for OG sharing | P0 | â€” |
| FR-ISS-06 | Embed QR code pointing to `/certificates/verify/:id` | P0 | â€” |
| FR-ISS-07 | HMAC-SHA256 sign certificate payload | P0 | Tamper detection |
| FR-ISS-08 | Upload PDF + PNG to cloud storage | P0 | â€” |
| FR-ISS-09 | Send claim email with unique link | P0 | â€” |
| FR-ISS-10 | Revoke certificate with reason (admin) | P0 | â€” |
| FR-ISS-11 | Resend claim email (admin) | P0 | â€” |

### 5.4 Certificate Viewing & Downloading

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-DL-01 | `GET /api/certificates/[courseId]/download` â€” stream PDF response | P0 | Next.js API route; replaces Express stream |
| FR-DL-02 | Response uses standard Web Stream (`ReadableStream`) not Node.js `Stream` | P0 | Next.js Edge/Node runtime compatible |
| FR-DL-03 | Download button on Certificate card triggers route | P0 | â€” |
| FR-DL-04 | PNG download available separately | P0 | â€” |

### 5.5 Certificate Wallet (Recipient)

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-WALL-01 | Page: `(protected)/certificates/page.tsx` â€” lists user's certificates | P0 | Server Component; replaces V1 `Certificates.jsx` |
| FR-WALL-02 | Data fetched via Server Action `getUserCertificates()` â€” no Redux | P0 | â€” |
| FR-WALL-03 | Certificate card: program name, completion date, status badge | P0 | â€” |
| FR-WALL-04 | Download PDF button â†’ calls `/api/certificates/[courseId]/download` | P0 | â€” |
| FR-WALL-05 | Download PNG button | P0 | â€” |
| FR-WALL-06 | Copy shareable verification URL | P0 | â€” |
| FR-WALL-07 | Share to LinkedIn (pre-filled URL share) | P0 | â€” |
| FR-WALL-08 | Empty state when no certificates | P0 | â€” |

### 5.6 Public Verification

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-VER-01 | Page: `app/certificates/verify/[certificateId]/page.tsx` | P0 | Public, no auth; replaces V1 `CertificateVerify.jsx` |
| FR-VER-02 | Data fetched server-side via `verifyCertificate(id)` Server Action | P0 | SSR for SEO + performance |
| FR-VER-03 | Display VALID / INVALID / REVOKED status clearly | P0 | â€” |
| FR-VER-04 | Handle non-existent `certificateId` gracefully (not found state) | P0 | Show clear "not found" UI, not 500 |
| FR-VER-05 | Display recipient name, course, completion date, issuer | P0 | â€” |
| FR-VER-06 | Open Graph meta tags generated via `generateMetadata()` | P0 | Dynamic per-cert OG image using PNG |
| FR-VER-07 | QR code on PDF resolves to this page | P0 | â€” |
| FR-VER-08 | Log verification event on page load | P1 | â€” |

### 5.7 Admin Dashboard

| ID | Requirement | Priority |
|---|---|---|
| FR-ADM-01 | List all issued certificates (filter by course, status) | P0 |
| FR-ADM-02 | Per-certificate status: PENDING / CLAIMED / REVOKED | P0 |
| FR-ADM-03 | Revoke, Resend, View actions per row | P0 |
| FR-ADM-04 | Bulk issuance trigger for a course/season | P1 |
| FR-ADM-05 | Export as CSV | P1 |
---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Target | Notes |
|---|---|---|
| Single certificate generation (PDF + PNG) | < 5s P95 | Acceptable for async delivery |
| Public verification page LCP | < 1.5s on 4G | SSR; no client-side data fetch |
| Verification API response time | < 200ms | Simple DB lookup + HMAC verify |
| Claim email delivery | < 60 seconds after issuance | Transactional email SLA |
| Concurrent verifications supported | 1,000 req/min | Stateless endpoint; CDN cacheable |

### 6.2 Security

| Requirement | Implementation |
|---|---|
| Certificate tamper detection | HMAC-SHA256 of canonical certificate payload; stored server-side |
| Claim token security | UUID v4, single-use, 30-day expiry; invalidated on first use |
| Transport security | TLS 1.3 enforced; HSTS headers |
| File access control | PDF/PNG served via signed URLs (time-limited); not publicly guessable |
| Input validation | Zod (frontend) + class-validator (backend) on all inputs |
| Rate limiting | 60 req/min per IP on `/verify/*` and auth endpoints |
| CORS | Strict allowlist; only scholarx.lk origins in production |
| Secrets | Server HMAC secret stored in environment; never in code or DB |

### 6.3 Reliability

| Requirement | Target |
|---|---|
| Certificate generation job retry on failure | 3 retries with exponential backoff |
| Email delivery failure handling | Log + surface in admin dashboard for manual resend |
| Storage (PDF/PNG) redundancy | Multi-AZ S3 or equivalent; 99.999999999% durability |
| System uptime | Inherits ScholarX V2 platform SLA (target: 99.5%) |

### 6.4 Accessibility

| Standard | Target |
|---|---|
| WCAG compliance | 2.1 AA â€” verification and wallet pages |
| Screen reader support | Full ARIA on interactive elements |
| Keyboard navigation | All flows operable via keyboard |
| Color contrast | Min 4.5:1 for all text against backgrounds |

### 6.5 Observability

| Tool | Purpose |
|---|---|
| **Sentry** | Frontend + backend error tracking |
| **Console logs (structured)** | Job success/failure; email delivery; verification events |
| **Admin dashboard metrics** | Claim rates, issuance counts visible to admin without code access |

---

## 7. System Architecture

### 7.1 Architecture Overview

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚                    CLIENT LAYER (Browser)                    â”‚
â”‚                                                              â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ â”‚
â”‚  â”‚  ScholarX V2 Web     â”‚   â”‚  Public Verification Page    â”‚ â”‚
â”‚  â”‚  (Next.js App Router)â”‚   â”‚  /verify/:id  (SSR, no auth) â”‚ â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
            â”‚ HTTPS                           â”‚ HTTPS
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚              ScholarX V2 Backend (API Layer)                  â”‚
â”‚                                                              â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ  â”‚
â”‚  â”‚  Auth Module    â”‚  â”‚  Certification     â”‚  â”‚  Program  â”‚  â”‚
â”‚  â”‚  (Google OAuth) â”‚  â”‚  Module            â”‚  â”‚  Module   â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک  â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ  â”‚  â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”ک  â”‚
â”‚                        â”‚  â”‚ Issue Serviceâ”‚  â”‚        â”‚        â”‚
â”‚                        â”‚  â”‚ Sign Service â”‚  â”‚â—„â”€â”€â”€â”€â”€â”€â”€â”ک        â”‚
â”‚                        â”‚  â”‚ Verify Svc   â”‚  â”‚  completion     â”‚
â”‚                        â”‚  â”‚ Notify Svc   â”‚  â”‚  event          â”‚
â”‚                        â”‚  â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”ک  â”‚                 â”‚
â”‚                        â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک                 â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
                                   â”‚
            â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
            â”‚                      â”‚                      â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”گ   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”گ   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”گ
â”‚   PostgreSQL      â”‚   â”‚   Job Queue       â”‚   â”‚   Cloud        â”‚
â”‚   (Certificates,  â”‚   â”‚   (BullMQ/Redis   â”‚   â”‚   Storage      â”‚
â”‚    Events, Audit) â”‚   â”‚    OR pg-boss)    â”‚   â”‚   (S3/R2)      â”‚
â”‚                   â”‚   â”‚   PDF+PNG gen     â”‚   â”‚   PDFs, PNGs   â”‚
â”‚                   â”‚   â”‚   Email dispatch  â”‚   â”‚   Templates    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
            â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚  External Services                           â”‚
â”‚  â€¢ Resend / SendGrid (transactional email)   â”‚
â”‚  â€¢ Google OAuth 2.0 (recipient login)        â”‚
â”‚  â€¢ LinkedIn Share URL API (no key needed)    â”‚
â”‚  â€¢ Puppeteer / html-pdf-node (PDF/PNG gen)   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
```

### 7.2 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Next.js 14 (App Router, RSC) | V2 platform standard; SSR for verification page SEO |
| **Styling** | Tailwind CSS + shadcn/ui | Consistent with ScholarX V2 design system |
| **Backend** | Express (V2 migration) â†’ Next.js API Routes (target) | Incremental migration; cert module can be API routes from day 1 |
| **Database** | PostgreSQL (existing ScholarX DB) | Add certification tables to existing schema |
| **Queue** | pg-boss (Postgres-backed) OR BullMQ (Redis) | pg-boss avoids Redis dependency if not already present |
| **PDF/PNG** | Puppeteer (headless Chromium) | Pixel-perfect HTMLâ†’PDF/PNG with custom fonts & branding |
| **Storage** | AWS S3 or Cloudflare R2 | Scalable, durable object storage |
| **Email** | Resend | Modern API; React Email templates; generous free tier |
| **Auth** | Google OAuth 2.0 (NextAuth.js in V2) | Re-use ScholarX V2 auth stack |
| **QR Codes** | `qrcode` npm package | Server-side QR generation; no external API |
| **Signing** | Node.js `crypto.createHmac` (HMAC-SHA256) | No external KMS needed for single-org; simple and reliable |

### 7.3 Certificate Generation Pipeline

```
Trigger (event / manual)
    â†“
Enqueue job: { participantId, programId, role, season }
    â†“
Job Processor picks up:
  1. Fetch participant data (name, email, program, season dates)
  2. Select template (Mentor / Mentee HTML template)
  3. Inject data â†’ render HTML in memory
  4. Launch Puppeteer â†’ render HTML â†’ export PDF (A4)
  5. Puppeteer screenshot PNG (1200أ—630 OG size)
  6. Generate HMAC-SHA256 signature of canonical payload
  7. Generate QR code PNG pointing to /verify/:id
  8. Embed QR code into PDF template â†’ final PDF
  9. Upload PDF + PNG to S3
  10. Insert Certificate record to DB (status: PENDING)
  11. Dispatch claim email via Resend
    â†“
Done â€” Admin dashboard reflects new PENDING certificate
```
---

## 7. System Architecture [UPDATED]

### 7.1 Architecture Overview

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚                  CLIENT LAYER (Browser)                        â”‚
â”‚                                                                â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ  â”‚
â”‚  â”‚              ScholarX V2 â€” Next.js App Router            â”‚  â”‚
â”‚  â”‚                                                          â”‚  â”‚
â”‚  â”‚  (protected)/certificates/page.tsx  â†گ Server Component   â”‚  â”‚
â”‚  â”‚  (protected)/settings/change-password/page.tsx           â”‚  â”‚
â”‚  â”‚  certificates/verify/[certificateId]/page.tsx â†گ Public   â”‚  â”‚
â”‚  â”‚  claim/[token]/page.tsx              â†گ Public            â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
                          â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚              ScholarX V2 â€” Server Layer (same Next.js process) â”‚
â”‚                                                                â”‚
â”‚  Server Actions                   Next.js API Routes           â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ â”‚
â”‚  â”‚ getUserCertificates()   â”‚      â”‚ /api/certificates/       â”‚ â”‚
â”‚  â”‚ verifyCertificate(id)   â”‚      â”‚   [courseId]/download    â”‚ â”‚
â”‚  â”‚ issueCertificate()      â”‚      â”‚   â†’ Stream PDF response  â”‚ â”‚
â”‚  â”‚ revokeCertificate()     â”‚      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک                                   â”‚
â”‚             â”‚                                                  â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ  â”‚
â”‚  â”‚              Domain Services                             â”‚  â”‚
â”‚  â”‚  certificate.service.ts  (pdf-lib, HMAC sign, QR gen)   â”‚  â”‚
â”‚  â”‚  certificates.actions.ts (Server Action wrappers)       â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
              â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚                      DATA LAYER                                â”‚
â”‚                                                                â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ  â”‚
â”‚  â”‚  PostgreSQL          â”‚  â”‚  Job Queue   â”‚  â”‚  Cloud        â”‚  â”‚
â”‚  â”‚  (Drizzle ORM)       â”‚  â”‚  (pg-boss)   â”‚  â”‚  Storage      â”‚  â”‚
â”‚  â”‚  dbCourseCompletions â”‚  â”‚  PDF gen     â”‚  â”‚  S3/R2        â”‚  â”‚
â”‚  â”‚  dbUsers, dbCourses  â”‚  â”‚  Email send  â”‚  â”‚  PDFs, PNGs   â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
              â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚  External Services                                             â”‚
â”‚  â€¢ better-auth     (session, Google OAuth, changePassword)     â”‚
â”‚  â€¢ Resend          (transactional email)                       â”‚
â”‚  â€¢ pdf-lib         (PDF template manipulation)                 â”‚
â”‚  â€¢ qrcode (npm)    (QR code generation)                        â”‚
â”‚  â€¢ LinkedIn Share  (URL-based, no API key)                     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
```

### 7.2 Technology Stack [UPDATED]

| Layer | Technology | V1 (Legacy) | V2 (Target) |
|---|---|---|---|
| **Frontend** | React â†’ Next.js 14 (App Router, RSC) | CRA / Vite | Next.js |
| **Styling** | CSS Modules â†’ Tailwind CSS + shadcn/ui | CSS Modules | Tailwind |
| **State** | Redux â†’ Server Actions + TanStack Query | Redux | Server Actions |
| **Backend** | Express â†’ Next.js API Routes + Server Actions | Express | Next.js |
| **ORM** | TypeORM â†’ **Drizzle ORM** | TypeORM | **Drizzle** |
| **Auth** | Custom / Passport â†’ **better-auth** | Passport | **better-auth** |
| **PDF** | Legacy PDF gen â†’ **pdf-lib** | Unspecified | **pdf-lib** |
| **Database** | PostgreSQL | PostgreSQL | PostgreSQL |
| **Email** | Legacy mailer â†’ **Resend** | Nodemailer | **Resend** |
| **Storage** | Local/S3 â†’ S3 / Cloudflare R2 | S3 | S3 / R2 |
| **QR Codes** | â€” | â€” | `qrcode` npm |

### 7.3 Certificate Generation Pipeline (pdf-lib)

```
Trigger (completion event / admin manual)
    â†“
Enqueue job (pg-boss): { userId, courseId, completionDate }
    â†“
Job Processor (certificate.service.ts):
  1. Fetch user name + email from dbUsers
  2. Fetch course name from dbCourses
  3. Load base PDF template from /assets/templates/certificate-base.pdf
  4. Use pdf-lib to inject text fields:
     - Recipient name â†’ name field coordinates
     - Course name   â†’ course field
     - Completion date â†’ date field
     - Certificate ID â†’ id field
  5. Generate QR code PNG (qrcode npm) â†’ embed into PDF at QR slot
  6. Flatten PDF form â†’ finalize
  7. Export PDF bytes â†’ upload to S3 (pdf key)
  8. Export PNG screenshot (pdf-lib â†’ canvas â†’ png) â†’ upload to S3 (png key)
  9. Compute HMAC-SHA256 signature of canonical payload
  10. Insert dbCourseCompletions record (status: PENDING)
  11. Dispatch claim email (Resend) with /claim/:token link
    â†“
Admin dashboard reflects new PENDING certificate
```

### 7.4 Change Password Flow (better-auth)

```
User on /settings/change-password
    â†“
Fills: Current Password, New Password, Confirm New Password
    â†“
Client-side: confirm === new? â†’ if not, show inline error, stop
    â†“
Submit â†’ calls authClient.changePassword({
  currentPassword: "...",
  newPassword: "...",
})
    â†“
better-auth validates current password hash
  âœ… Match â†’ updates password hash â†’ returns success
  â‌Œ Mismatch â†’ returns { error: 'INVALID_PASSWORD' }
    â†“
UI: success â†’ toast "Password updated"; error â†’ inline field error
```
---

## 8. Backend Modules & API Design [UPDATED]

### 8.1 File Structure (V2 Next.js)

```
src/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â””â”€â”€ certificates/
â”‚   â”‚       â””â”€â”€ [courseId]/
â”‚   â”‚           â””â”€â”€ download/
â”‚   â”‚               â””â”€â”€ route.ts          # PDF streaming API route
â”‚   â”œâ”€â”€ (protected)/
â”‚   â”‚   â”œâ”€â”€ certificates/
â”‚   â”‚   â”‚   â””â”€â”€ page.tsx                  # My Certificates (Server Component)
â”‚   â”‚   â””â”€â”€ settings/
â”‚   â”‚       â””â”€â”€ change-password/
â”‚   â”‚           â””â”€â”€ page.tsx              # Change Password settings page
â”‚   â””â”€â”€ certificates/
â”‚       â””â”€â”€ verify/
â”‚           â””â”€â”€ [certificateId]/
â”‚               â””â”€â”€ page.tsx              # Public verification page (SSR)
â”‚
â”œâ”€â”€ domain/
â”‚   â”œâ”€â”€ certificates/
â”‚   â”‚   â”œâ”€â”€ certificate.service.ts        # pdf-lib gen, HMAC sign, QR, storage
â”‚   â”‚   â””â”€â”€ certificates.actions.ts       # Server Actions (getUserCertificates, verifyCertificate, issue, revoke)
â”‚   â””â”€â”€ courses/
â”‚       â””â”€â”€ infrastructure/
â”‚           â””â”€â”€ db/
â”‚               â””â”€â”€ courses-db.schema.ts  # dbCourseCompletions Drizzle table
â”‚
â””â”€â”€ components/
    â””â”€â”€ certificates/
        â””â”€â”€ certificate.tsx               # Certificate UI card component (V1 â†’ V2 migration)
```

### 8.2 Next.js API Route â€” PDF Download

```typescript
// src/app/api/certificates/[courseId]/download/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { certificateService } from '@/domain/certificates/certificate.service';
import { auth } from '@/lib/auth';                     // better-auth

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  const session = await auth.getSession(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pdfBytes = await certificateService.getPdfBytes(
    session.user.id,
    params.courseId
  );

  if (!pdfBytes) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Web Stream (not Node.js Stream) â€” compatible with Next.js Edge + Node runtime
  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="scholarx-certificate.pdf"`,
    },
  });
}
```

### 8.3 Server Actions

```typescript
// src/domain/certificates/certificates.actions.ts
'use server';

import { db } from '@/lib/db';                    // Drizzle instance
import { dbCourseCompletions } from '@/domain/courses/infrastructure/db/courses-db.schema';
import { eq, and } from 'drizzle-orm';
import { certificateService } from './certificate.service';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

/** Get all certificates for the currently logged-in user */
export async function getUserCertificates() {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) throw new Error('Unauthorized');

  return db.query.dbCourseCompletions.findMany({
    where: eq(dbCourseCompletions.userId, session.user.id),
    with: { course: true },
    orderBy: (t, { desc }) => [desc(t.completedAt)],
  });
}

/** Verify a certificate by ID â€” public, no auth required */
export async function verifyCertificate(certificateId: string) {
  const record = await db.query.dbCourseCompletions.findFirst({
    where: eq(dbCourseCompletions.certificateId, certificateId),
    with: { course: true, user: { columns: { name: true, email: false } } },
  });

  if (!record) return { status: 'INVALID' as const };
  if (record.status === 'REVOKED') return { status: 'REVOKED' as const };

  const isValid = certificateService.verifyHmac(record);
  return isValid
    ? { status: 'VALID' as const, certificate: record }
    : { status: 'INVALID' as const };
}
```

### 8.4 Admin REST Endpoints (Next.js API Routes)

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/admin/certificates/issue` | ًں”’ Admin | Issue single certificate |
| POST | `/api/admin/certificates/bulk-issue` | ًں”’ Admin | Bulk issue for a course/season |
| GET | `/api/admin/certificates` | ًں”’ Admin | List all with filters |
| PATCH | `/api/admin/certificates/[id]/revoke` | ًں”’ Admin | Revoke + reason |
| PATCH | `/api/admin/certificates/[id]/resend` | ًں”’ Admin | Resend claim email |
| GET | `/api/admin/certificates/export` | ًں”’ Admin | CSV export |

---

## 9. Data Models & ERD [UPDATED â€” Drizzle ORM]

### 9.1 Drizzle Schema

```typescript
// src/domain/courses/infrastructure/db/courses-db.schema.ts
import {
  pgTable, uuid, varchar, integer, timestamp, pgEnum
} from 'drizzle-orm/pg-core';
import { dbUsers } from '@/domain/users/infrastructure/db/users-db.schema';
import { dbCourses } from '@/domain/courses/infrastructure/db/courses-db.schema';

export const certificateStatusEnum = pgEnum('certificate_status', [
  'PENDING', 'CLAIMED', 'REVOKED'
]);

export const dbCourseCompletions = pgTable('course_completions', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  userId:               uuid('user_id').notNull().references(() => dbUsers.id),
  courseId:             uuid('course_id').notNull().references(() => dbCourses.id),
  completedAt:          timestamp('completed_at', { withTimezone: true }).notNull(),
  certificateId:        uuid('certificate_id').notNull().unique().defaultRandom(),
  completionPercentage: integer('completion_percentage').notNull().default(100),
  completedLessons:     integer('completed_lessons').notNull(),
  status:               certificateStatusEnum('status').notNull().default('PENDING'),
  revokeReason:         varchar('revoke_reason', { length: 500 }),
  claimToken:           uuid('claim_token').unique().defaultRandom(),
  claimTokenExpiresAt:  timestamp('claim_token_expires_at', { withTimezone: true }),
  claimedAt:            timestamp('claimed_at', { withTimezone: true }),
  pdfStorageKey:        varchar('pdf_storage_key', { length: 500 }),
  pngStorageKey:        varchar('png_storage_key', { length: 500 }),
  hmacSignature:        varchar('hmac_signature', { length: 64 }).notNull(),
  createdAt:            timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:            timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Relations
export const courseCompletionsRelations = relations(dbCourseCompletions, ({ one }) => ({
  user:   one(dbUsers,   { fields: [dbCourseCompletions.userId],   references: [dbUsers.id] }),
  course: one(dbCourses, { fields: [dbCourseCompletions.courseId], references: [dbCourses.id] }),
}));
```

### 9.2 Migration Command

```bash
# Generate migration after schema changes
npx drizzle-kit generate

# Apply migration to local dev DB
npx drizzle-kit migrate
```

### 9.3 ERD (Simplified)

```
dbUsers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
  id (PK)                                 â”‚ FK: userId
  name                                    â”‚
  email                               â”Œâ”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
                                      â”‚  dbCourseCompletions             â”‚
dbCourses â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤  id (PK, UUID)                   â”‚
  id (PK)                        FK â”€â”€â”¤  userId                          â”‚
  name                    courseId    â”‚  courseId                        â”‚
  ...                                 â”‚  completedAt                     â”‚
                                      â”‚  certificateId (UNIQUE)          â”‚
                                      â”‚  completionPercentage            â”‚
                                      â”‚  completedLessons                â”‚
                                      â”‚  status (PENDING/CLAIMED/REVOKED)â”‚
                                      â”‚  claimToken (UNIQUE)             â”‚
                                      â”‚  pdfStorageKey                   â”‚
                                      â”‚  pngStorageKey                   â”‚
                                      â”‚  hmacSignature                   â”‚
                                      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
```
---

## 9. Data Models & ERD

### 9.1 New Tables Added to ScholarX DB

```
(Existing ScholarX Tables)
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚     users        â”‚     â”‚    programs           â”‚
â”‚ id (PK)          â”‚     â”‚ id (PK)               â”‚
â”‚ email            â”‚     â”‚ name                  â”‚
â”‚ name             â”‚     â”‚ ...                   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
         â”‚                          â”‚
(New Certification Tables)          â”‚
         â”‚                          â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚                  certificates                   â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ id               UUID         PRIMARY KEY        â”‚
â”‚ short_id         VARCHAR(20)  UNIQUE  NOT NULL   â”‚
â”‚ recipient_email  VARCHAR      NOT NULL           â”‚
â”‚ recipient_name   VARCHAR      NOT NULL           â”‚
â”‚ program_id       UUID         FK â†’ programs.id   â”‚
â”‚ program_name     VARCHAR      NOT NULL           â”‚
â”‚ season_number    INTEGER      NOT NULL           â”‚
â”‚ role             ENUM(mentee, mentor) NOT NULL   â”‚
â”‚ completion_date  DATE         NOT NULL           â”‚
â”‚ issued_at        TIMESTAMPTZ  NOT NULL DEFAULT NOWâ”‚
â”‚ claim_token      UUID         UNIQUE NOT NULL    â”‚
â”‚ claim_token_exp  TIMESTAMPTZ  NOT NULL           â”‚
â”‚ claimed_at       TIMESTAMPTZ  NULL               â”‚
â”‚ status           ENUM         NOT NULL           â”‚
â”‚                  (PENDING, CLAIMED, REVOKED)     â”‚
â”‚ revoke_reason    TEXT         NULL               â”‚
â”‚ pdf_storage_key  VARCHAR      NOT NULL           â”‚
â”‚ png_storage_key  VARCHAR      NOT NULL           â”‚
â”‚ hmac_signature   VARCHAR(64)  NOT NULL           â”‚
â”‚ created_at       TIMESTAMPTZ  DEFAULT NOW        â”‚
â”‚ updated_at       TIMESTAMPTZ  DEFAULT NOW        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
                         â”‚ 1-to-many
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚              certificate_events                  â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ id               UUID         PRIMARY KEY        â”‚
â”‚ certificate_id   UUID         FK â†’ certificates  â”‚
â”‚ event_type       ENUM         NOT NULL           â”‚
â”‚   (ISSUED, CLAIMED, VIEWED, VERIFIED,            â”‚
â”‚    SHARED_LINKEDIN, DOWNLOADED_PDF,              â”‚
â”‚    DOWNLOADED_PNG, REVOKED, EMAIL_SENT,          â”‚
â”‚    EMAIL_RESENT)                                 â”‚
â”‚ actor_email      VARCHAR      NULL  (admin email)â”‚
â”‚ ip_hash          VARCHAR      NULL  (SHA-256)    â”‚
â”‚ user_agent       VARCHAR      NULL               â”‚
â”‚ metadata         JSONB        NULL               â”‚
â”‚ created_at       TIMESTAMPTZ  DEFAULT NOW        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
```

### 9.2 Indexes

```sql
-- High-frequency lookup indexes
CREATE INDEX idx_certs_recipient_email ON certificates(recipient_email);
CREATE INDEX idx_certs_status ON certificates(status);
CREATE INDEX idx_certs_program_id ON certificates(program_id);
CREATE INDEX idx_certs_claim_token ON certificates(claim_token);
CREATE INDEX idx_cert_events_cert_id ON certificate_events(certificate_id);
CREATE INDEX idx_cert_events_type ON certificate_events(event_type);
```

### 9.3 Data Retention & Privacy

| Decision | Detail |
|---|---|
| PII fields | `recipient_email`, `recipient_name` â€” encrypted at rest via Postgres `pgcrypto` or application-level AES-256 |
| Right to erasure | On GDPR erasure request: anonymize `recipient_email` â†’ `deleted@scholarx.lk`, `recipient_name` â†’ `[Redacted]`; retain event records |
| Soft delete | No hard deletes; revocation + anonymization is the erasure path |
| Retention | Certificate records + assets retained for minimum 5 years per edu standards |

---

## 10. Security & Verification Model

### 10.1 Why HMAC-SHA256 (Not RSA/KMS)

For a **single-org, internal system** like ScholarX, HMAC-SHA256 provides:

| Property | HMAC-SHA256 | RSA (KMS) |
|---|---|---|
| Tamper detection | âœ… Yes | âœ… Yes |
| Implementation complexity | Low | High |
| Infrastructure cost | $0 | AWS KMS costs |
| Key rotation | Simple env var rotation | KMS key rotation workflow |
| Public verifiability without server | â‌Œ No | âœ… Yes |
| Right fit for internal single-org | âœ… **Yes** | Overkill |

> **Recommendation**: HMAC-SHA256 for V2. RSA/KMS and W3C Verifiable Credentials earmarked for V2.5 when open/public verifiability becomes a hard requirement.

### 10.2 Signing Flow

```typescript
// Certificate signing (server-side, at generation time)
import { createHmac } from 'crypto';

function signCertificate(cert: CanonicalCertPayload): string {
  const canonical = JSON.stringify({
    id: cert.id,
    recipientEmail: cert.recipientEmail,
    recipientName: cert.recipientName,
    programId: cert.programId,
    seasonNumber: cert.seasonNumber,
    role: cert.role,
    completionDate: cert.completionDate,
    issuedAt: cert.issuedAt,
  });
  return createHmac('sha256', process.env.CERT_HMAC_SECRET!)
    .update(canonical)
    .digest('hex');
}
```

### 10.3 Verification Flow

```
[1] GET /api/v1/certificates/verify/:id
    â†“
[2] Fetch Certificate record by ID
    If not found â†’ { status: 'INVALID' }
    â†“
[3] If status === 'REVOKED' â†’ { status: 'REVOKED' } (short-circuit)
    â†“
[4] Reconstruct canonical JSON from stored fields (same fields, same order)
    â†“
[5] Recompute HMAC-SHA256 with server secret
    â†“
[6] Compare computed HMAC === stored hmac_signature (timing-safe compare)
    Match â†’ { status: 'VALID', certificate: {...} }
    No match â†’ { status: 'INVALID' } (data tampered)
    â†“
[7] Log certificate_events(VERIFIED) with anonymized IP hash + user-agent
    â†“
[8] Return response (cached at CDN edge for 60 seconds for VALID status)
```

### 10.4 Claim Token Security

| Property | Value |
|---|---|
| Format | UUID v4 (128-bit random) |
| Expiry | 30 days from issuance |
| Usage | Single-use: invalidated on first successful claim |
| Delivery | HTTPS link only; never in query string of log-able URLs |
| Exposure | Only in email body; not stored in browser history via redirect |

### 10.5 Threat Model

| Threat | Mitigation |
|---|---|
| Forged certificate PDF | HMAC verify always done server-side; QR points to live API |
| Tampered certificate data (name, dates) | HMAC signature mismatch â†’ INVALID on verify |
| Claim link forwarded and reused | Single-use token; after claim, token nulled in DB |
| Expired claim link | `claim_token_exp` checked; admin can resend fresh link |
| Verification page scraping / DDoS | Rate limit 60 req/min per IP; CDN edge caching for VALID results |
| Brute-force certificate ID guessing | UUID v4 (2^122 space); practically impossible |
| PDF download link sharing | Signed, time-limited S3 URLs (15-min TTL) |
---

## 11. Frontend Architecture [UPDATED]

### 11.1 File Structure (V2 Next.js App Router)

```
src/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ (protected)/
â”‚   â”‚   â”œâ”€â”€ certificates/
â”‚   â”‚   â”‚   â””â”€â”€ page.tsx              # My Certificates â€” Server Component
â”‚   â”‚   â””â”€â”€ settings/
â”‚   â”‚       â””â”€â”€ change-password/
â”‚   â”‚           â””â”€â”€ page.tsx          # Change Password â€” Client Component
â”‚   â””â”€â”€ certificates/
â”‚       â””â”€â”€ verify/
â”‚           â””â”€â”€ [certificateId]/
â”‚               â””â”€â”€ page.tsx          # Public Verification â€” SSR, no auth
â”‚
â””â”€â”€ components/
    â””â”€â”€ certificates/
        â”œâ”€â”€ certificate.tsx           # Certificate card UI (migrated from V1)
        â”œâ”€â”€ certificate-actions.tsx   # Download PDF/PNG, Copy link, LinkedIn share
        â”œâ”€â”€ verification-badge.tsx    # VALID / INVALID / REVOKED status badge
        â””â”€â”€ empty-certificates.tsx    # Empty wallet state
```

### 11.2 Page Implementations

#### `(protected)/certificates/page.tsx` â€” My Certificates

```tsx
// Server Component â€” no Redux, data fetched server-side
import { getUserCertificates } from '@/domain/certificates/certificates.actions';
import { CertificateCard } from '@/components/certificates/certificate';
import { EmptyCertificates } from '@/components/certificates/empty-certificates';

export default async function CertificatesPage() {
  const certificates = await getUserCertificates();  // Server Action

  if (certificates.length === 0) return <EmptyCertificates />;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">My Certificates</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
      </div>
    </div>
  );
}
```

#### `certificates/verify/[certificateId]/page.tsx` â€” Public Verification

```tsx
// SSR, no auth â€” replaces V1 CertificateVerify.jsx
import { verifyCertificate } from '@/domain/certificates/certificates.actions';
import { VerificationBadge } from '@/components/certificates/verification-badge';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await verifyCertificate(params.certificateId);
  if (result.status !== 'VALID' || !result.certificate) {
    return { title: 'Certificate Verification â€” ScholarX' };
  }
  const cert = result.certificate;
  return {
    title: `${cert.user.name} â€” ScholarX Certificate`,
    description: `Verified ScholarX credential for ${cert.course.name}`,
    openGraph: {
      images: [{ url: cert.pngStorageUrl, width: 1200, height: 630 }],
    },
  };
}

export default async function VerifyPage({ params }: Props) {
  const result = await verifyCertificate(params.certificateId);
  return <VerificationBadge result={result} />;
}
```

#### `(protected)/settings/change-password/page.tsx` â€” Change Password

```tsx
'use client';
import { authClient } from '@/lib/auth-client';    // better-auth client
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const schema = z.object({
  currentPassword:  z.string().min(1, 'Required'),
  newPassword:      z.string().min(8, 'Min 8 characters'),
  confirmPassword:  z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function ChangePasswordPage() {
  const form = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const result = await authClient.changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    if (result.error) {
      form.setError('currentPassword', { message: 'Incorrect current password' });
    } else {
      toast.success('Password updated successfully');
      form.reset();
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input type="password" placeholder="Current password"
          {...form.register('currentPassword')}
          error={form.formState.errors.currentPassword?.message} />
        <Input type="password" placeholder="New password"
          {...form.register('newPassword')}
          error={form.formState.errors.newPassword?.message} />
        <Input type="password" placeholder="Confirm new password"
          {...form.register('confirmPassword')}
          error={form.formState.errors.confirmPassword?.message} />
        <Button type="submit" className="w-full"
          disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
}
```

### 11.3 Rendering Strategy

| Page | Strategy | Auth | Key Decision |
|---|---|---|---|
| `/certificates` | **Server Component** | Required | `getUserCertificates()` called server-side; no Redux |
| `/certificates/verify/:id` | **SSR + generateMetadata** | None | SEO + OG tags; `verifyCertificate()` server-side |
| `/claim/:token` | **SSR** | None | Token resolved server-side |
| `/settings/change-password` | **Client Component** | Required | `authClient.changePassword()` is a client call |

### 11.4 V1 â†’ V2 Component Migration Map

| V1 Component | V2 Replacement | Strategy |
|---|---|---|
| `Certificates.jsx` (Redux) | `(protected)/certificates/page.tsx` | Server Component + Server Action |
| `CertificateVerify.jsx` | `certificates/verify/[certificateId]/page.tsx` | SSR Server Component |
| `Certificate.jsx` (card UI) | `components/certificates/certificate.tsx` | Rewrite with Tailwind + shadcn/ui |
| `ChangePassword.jsx` (no current pwd) | `settings/change-password/page.tsx` | Client Component + better-auth |
| Redux `certificatesSlice` | `getUserCertificates()` Server Action | **Deleted** â€” no Redux in V2 |
| Express `/certificates` routes | Next.js API Routes + Server Actions | Replaced |
---

## 11. Frontend Architecture

### 11.1 Next.js App Router File Structure (Certification Module)

```
app/
â”œâ”€â”€ (recipient)/
â”‚   â”œâ”€â”€ claim/
â”‚   â”‚   â””â”€â”€ [token]/
â”‚   â”‚       â””â”€â”€ page.tsx          # Claim certificate (SSR, resolves token)
â”‚   â”œâ”€â”€ wallet/
â”‚   â”‚   â””â”€â”€ page.tsx              # Recipient credential wallet (auth required)
â”‚   â””â”€â”€ verify/
â”‚       â””â”€â”€ [certificateId]/
â”‚           â””â”€â”€ page.tsx          # Public verification page (SSR, no auth)
â”‚
â”œâ”€â”€ (admin)/
â”‚   â””â”€â”€ admin/
â”‚       â””â”€â”€ certificates/
â”‚           â”œâ”€â”€ page.tsx          # Admin certificate list + filters
â”‚           â”œâ”€â”€ issue/
â”‚           â”‚   â””â”€â”€ page.tsx      # Single issue form
â”‚           â”œâ”€â”€ bulk/
â”‚           â”‚   â””â”€â”€ page.tsx      # Bulk season issuance trigger
â”‚           â””â”€â”€ [id]/
â”‚               â””â”€â”€ page.tsx      # Certificate detail + actions

components/
â”œâ”€â”€ certificates/
â”‚   â”œâ”€â”€ CertificateCard.tsx       # Wallet: card with download/share actions
â”‚   â”œâ”€â”€ CertificatePreview.tsx    # Visual certificate preview (iframe/image)
â”‚   â”œâ”€â”€ VerificationBadge.tsx     # VALID / INVALID / REVOKED status badge
â”‚   â”œâ”€â”€ ShareActions.tsx          # Download PDF, PNG, LinkedIn, Copy link
â”‚   â””â”€â”€ CertificateTable.tsx      # Admin: sortable, filterable cert list
â”œâ”€â”€ admin/
â”‚   â”œâ”€â”€ IssueForm.tsx             # Single issue form with validation
â”‚   â”œâ”€â”€ BulkIssuePanel.tsx        # Season selector + bulk trigger
â”‚   â”œâ”€â”€ RevokeModal.tsx           # Revoke with reason input
â”‚   â””â”€â”€ CertStatusBadge.tsx       # PENDING / CLAIMED / REVOKED pill
â””â”€â”€ shared/
    â”œâ”€â”€ QRCodeDisplay.tsx         # Renders QR code image
    â””â”€â”€ CopyButton.tsx            # Copy-to-clipboard with feedback
```

### 11.2 Rendering Strategy Per Page

| Page | Rendering | Auth | Rationale |
|---|---|---|---|
| `/verify/:id` | **SSR** (generateMetadata) | None | SEO, Open Graph, zero client flash |
| `/claim/:token` | **SSR** | None | Token resolved server-side; no client flicker |
| `/wallet` | **SSR** + client hydration | Required (Google OAuth) | Initial data fetched server-side |
| `/admin/certificates` | **SSR** + client pagination | Admin session | Fast initial load + dynamic filtering |

### 11.3 Open Graph / SEO for Verification Page

```typescript
// app/verify/[certificateId]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cert = await verifyCertificate(params.certificateId);

  return {
    title: `${cert.recipientName} â€” ScholarX ${cert.role === 'mentor' ? 'Mentor' : 'Mentee'} Certificate`,
    description: `Verified ScholarX credential for ${cert.programName}, Season ${cert.seasonNumber}`,
    openGraph: {
      title: `${cert.recipientName}'s ScholarX Certificate`,
      description: `${cert.programName} آ· Season ${cert.seasonNumber} آ· ${cert.role}`,
      images: [{ url: cert.pngUrl, width: 1200, height: 630, alt: 'ScholarX Certificate' }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image' },
  };
}
```

---

## 12. UI/UX Flows & Screen Inventory

### 12.1 Screen Inventory

| ID | Screen | Route | Auth | Type |
|---|---|---|---|---|
| SCR-01 | Public Verification | `/verify/:id` | None | Public SSR |
| SCR-02 | Certificate Claim | `/claim/:token` | None | Public SSR |
| SCR-03 | Recipient Wallet | `/wallet` | Google OAuth | Authenticated |
| SCR-04 | Admin: Certificate List | `/admin/certificates` | Admin | Dashboard |
| SCR-05 | Admin: Issue Single | `/admin/certificates/issue` | Admin | Dashboard |
| SCR-06 | Admin: Bulk Issue | `/admin/certificates/bulk` | Admin | Dashboard |
| SCR-07 | Admin: Certificate Detail | `/admin/certificates/:id` | Admin | Dashboard |

### 12.2 Screen Specs

#### SCR-01 â€” Public Verification Page

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚  [ScholarX Logo]                    scholarx.lk      â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                      â”‚
â”‚     âœ…  CERTIFICATE VERIFIED                         â”‚
â”‚         (Green check, 56px bold)                     â”‚
â”‚                                                      â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ  â”‚
â”‚  â”‚          [Certificate PNG Preview]             â”‚  â”‚
â”‚  â”‚    (1200أ—630 image, rounded corners)           â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک  â”‚
â”‚                                                      â”‚
â”‚  Recipient     Kasun Perera                          â”‚
â”‚  Role          Mentee                                â”‚
â”‚  Program       ScholarX Mentorship Program           â”‚
â”‚  Season        Season 5                              â”‚
â”‚  Completed     January 15, 2026                      â”‚
â”‚  Issued by     ScholarX [logo]                       â”‚
â”‚                                                      â”‚
â”‚  Fingerprint   A3F9C21B  â“ک                          â”‚
â”‚                                                      â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€   â”‚
â”‚  Verified on April 27, 2026 at 23:46 UTC             â”‚
â”‚  [â†“ Download PDF]          [âڑ‘ Report Issue]         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
```

**REVOKED state**: Replace green âœ… with red â›” `CERTIFICATE REVOKED`; hide download button.
**INVALID state**: Red â‌Œ `UNABLE TO VERIFY` with guidance to contact ScholarX.

#### SCR-02 â€” Certificate Claim Page

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚  ًںژ“  Congratulations, Kasun!                         â”‚
â”‚  Your ScholarX Certificate is Ready                  â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ  â”‚
â”‚  â”‚          [Certificate PNG Preview]             â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک  â”‚
â”‚                                                      â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ    â”‚
â”‚  â”‚  [â¬‡ Download PDF]    [ًں–¼ Download PNG]       â”‚    â”‚
â”‚  â”‚  [ًں”— Copy Link]      [in Share on LinkedIn]  â”‚    â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک    â”‚
â”‚                                                      â”‚
â”‚  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€   â”‚
â”‚  [Sign in with Google to save to your Wallet â†’]      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
```

#### SCR-04 â€” Admin Certificate List

```
Certificates                              [+ Issue Single] [âڑ، Bulk Issue]

Filters: [Season â–¼] [Status â–¼] [Role â–¼]           ًں”چ Search recipient...

â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚ Short ID   â”‚ Recipient    â”‚ Program  â”‚ Role     â”‚ Status   â”‚ Actions  â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚ SX-2026-01 â”‚ Kasun Perera â”‚ Season 5 â”‚ Mentee   â”‚ ًںں، PEND  â”‚ â‹¯        â”‚
â”‚ SX-2026-02 â”‚ Nimal Silva  â”‚ Season 5 â”‚ Mentor   â”‚ ًںں¢ CLMD  â”‚ â‹¯        â”‚
â”‚ SX-2026-03 â”‚ Emma Watson  â”‚ Season 5 â”‚ Mentee   â”‚ ًں”´ RVKD  â”‚ â‹¯        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک

Page 1 of 12                                    [Export CSV]
```

---

## 13. State Management & API Integration

### 13.1 State Strategy

| Layer | Tool | Scope |
|---|---|---|
| **Server state** | TanStack Query v5 | Certificate lists, verification results, wallet |
| **Global auth state** | NextAuth.js session | Google OAuth session |
| **Form state** | React Hook Form + Zod | Issue form, revoke modal |
| **URL state** | `useSearchParams` | Filters (season, status, role), pagination |

### 13.2 Critical API Hooks

```typescript
// Verification (public â€” no auth)
export const useCertificateVerification = (id: string) =>
  useQuery({
    queryKey: ['verify', id],
    queryFn: () => fetchVerification(id),
    staleTime: 60_000,        // Cache 60s; VALID status doesn't change often
    retry: 1,
  });

// Recipient wallet
export const useMyWallet = () =>
  useQuery({
    queryKey: ['wallet'],
    queryFn: fetchMyCertificates,
    enabled: !!session,       // Only fetch when authenticated
  });

// Admin: issue certificate
export const useIssueCertificate = () =>
  useMutation({
    mutationFn: issueCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'certificates'] });
      toast.success('Certificate issued and email sent!');
    },
    onError: (err) => toast.error(err.message),
  });

// Admin: bulk issue
export const useBulkIssue = () =>
  useMutation({
    mutationFn: (seasonId: string) => bulkIssueSeason(seasonId),
    onSuccess: (data) =>
      toast.success(`Issued ${data.issued} certificates. ${data.failed} failed.`),
  });
```

### 13.3 LinkedIn Share Implementation

LinkedIn share uses the native share URL pattern (no API key required):

```typescript
// components/certificates/ShareActions.tsx
const shareToLinkedIn = (verificationUrl: string, recipientName: string) => {
  const text = encodeURIComponent(
    `Proud to have completed the ScholarX Mentorship Program! ًںژ“\n\nVerified credential: ${verificationUrl}`
  );
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verificationUrl)}`;
  window.open(linkedInUrl, '_blank', 'width=600,height=500');

  // Track share event
  trackEvent('SHARED_LINKEDIN', certificateId);
};
```
---

## 14. Milestones & Delivery Timeline [UPDATED]

### 14.1 Team Assumption

| Role | Count | Responsibility |
|---|---|---|
| Full-Stack Engineer (lead) | 1 | Drizzle schema, Server Actions, pdf-lib, API routes |
| Frontend Engineer | 1 | Next.js pages, components, Change Password, LinkedIn share |
| QA (part-time) | 0.5 | Migration verification, E2E tests |

**Total**: ~2.5 engineers over **4 sprints (8 weeks)**

---

### Sprint 1 â€” Foundation & Schema (Weeks 1â€“2)
**Goal**: DB schema live, pdf-lib generation working, storage connected

| Task | Owner | Est. | Notes |
|---|---|---|---|
| Define `dbCourseCompletions` Drizzle schema | BE | 1d | Extend `courses-db.schema.ts` |
| Run `drizzle-kit generate` + `drizzle-kit migrate` | BE | 0.5d | Validate migration locally |
| Map relations: `dbUsers`, `dbCourses` â†” `dbCourseCompletions` | BE | 0.5d | â€” |
| Install `pdf-lib`, `qrcode` packages | BE | 0.5d | â€” |
| Build `certificate.service.ts`: pdf-lib template + data injection | BE | 3d | Map field coordinates to template |
| QR code generation + embed in PDF | BE | 1d | â€” |
| PNG export from pdf-lib | BE | 1d | â€” |
| HMAC-SHA256 signing in `certificate.service.ts` | BE | 1d | â€” |
| Cloud storage upload (S3/R2) abstraction | BE | 1d | â€” |

**Exit Criteria**: `certificateService.generate()` produces a signed, QR-embedded PDF + PNG in storage within 5s.

---

### Sprint 2 â€” Core Migration (Weeks 3â€“4)
**Goal**: Certificate list, verification, and download working in V2

| Task | Owner | Est. | Notes |
|---|---|---|---|
| Server Action: `getUserCertificates()` | BE | 1d | Query with Drizzle relations |
| Server Action: `verifyCertificate(id)` | BE | 1d | HMAC verify + status check |
| `/api/certificates/[courseId]/download/route.ts` | BE | 1d | Web Stream PDF response |
| `(protected)/certificates/page.tsx` (Server Component) | FE | 2d | Replaces V1 `Certificates.jsx` + Redux |
| `components/certificates/certificate.tsx` (card UI) | FE | 2d | Migrated + Tailwind + shadcn/ui |
| `certificates/verify/[certificateId]/page.tsx` (SSR) | FE | 2d | Replaces V1 `CertificateVerify.jsx` |
| `generateMetadata()` + OG tags on verify page | FE | 1d | LinkedIn/Slack preview |
| Handle invalid/not-found certificate ID gracefully | FE | 0.5d | Clear UI, not 500 error |

**Exit Criteria**: Full certificate flow in V2: issue â†’ wallet page â†’ download PDF â†’ verify page shows VALID.

---

### Sprint 3 â€” Change Password + Email + Admin (Weeks 5â€“6)
**Goal**: Change Password live; claim email working; admin panel functional

| Task | Owner | Est. | Notes |
|---|---|---|---|
| `(protected)/settings/change-password/page.tsx` | FE | 2d | better-auth `authClient.changePassword()` |
| "Current Password" field added (missing in V1) | FE | 0.5d | â€” |
| Inline error handling for wrong password (better-auth) | FE | 0.5d | â€” |
| Claim email template (React Email + Resend) | BE | 2d | ScholarX branded |
| Claim token resolution API + `/claim/[token]/page.tsx` | BE + FE | 2d | â€” |
| LinkedIn share button + OG validation | FE | 1d | URL-based share; test with LinkedIn Post Inspector |
| Admin certificate list page (filters: course, status) | FE | 2d | â€” |
| Revoke + Resend admin actions | BE + FE | 1.5d | â€” |

**Exit Criteria**: Change Password works with better-auth; claim email delivered; admin can revoke and resend.

---

### Sprint 4 â€” QA, Verification & Launch (Weeks 7â€“8)
**Goal**: All P0s passing; E2E green; production deployed

| Task | Owner | Est. | Notes |
|---|---|---|---|
| E2E: issue â†’ claim email â†’ wallet â†’ download PDF | QA | 2d | Playwright |
| E2E: verify page VALID / REVOKED / not-found paths | QA | 1d | â€” |
| E2E: Change Password â€” success + wrong current pwd error | QA | 1d | â€” |
| Drizzle migration validated on staging DB | QA + DevOps | 1d | â€” |
| PDF template field mapping validated (all fields render) | QA | 0.5d | â€” |
| Lighthouse CI: verify page LCP < 1.5s | QA | 0.5d | â€” |
| Accessibility pass (WCAG 2.1 AA) on public pages | FE + QA | 1d | â€” |
| Rate limiting on `/verify/:id` (60 req/min per IP) | BE | 0.5d | â€” |
| Remove legacy Redux `certificatesSlice` from V2 | FE | 0.5d | â€” |
| Production deploy + smoke test | DevOps | 1d | â€” |
| Launch ًںڑ€ | All | â€” | â€” |

**Exit Criteria**: All P0 functional requirements passing; zero open P0 bugs; Lighthouse LCP < 1.5s.

---

### 14.2 Milestone Summary

| Milestone | Sprint | Criteria |
|---|---|---|
| **M1**: PDF generation + storage | Sprint 1 | `certificateService.generate()` produces signed PDF + PNG |
| **M2**: Core V1â†’V2 migration | Sprint 2 | Certificates page + verify page + download working in V2 |
| **M3**: Change Password + email | Sprint 3 | better-auth change password live; claim email delivered |
| **M4**: Launch ًںڑ€ | Sprint 4 | All P0s green; E2E passing; production deployed |

---

## 15. Risks, Dependencies & Mitigations [UPDATED]

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-01 | `pdf-lib` field coordinates don't match PDF template slots | High | High | Map coordinates manually Sprint 1 Day 1; use `pdf-lib` field inspector; allocate buffer time |
| R-02 | PNG export via pdf-lib quality insufficient | Medium | Medium | Test early Sprint 1; fallback: `sharp` package to convert PDF page to PNG |
| R-03 | Drizzle migration conflicts with existing schema | Medium | High | Review all existing tables before applying; run on a dev DB clone first |
| R-04 | better-auth `changePassword` returns undocumented error shape | Low | Medium | Test all error paths locally; read better-auth changelog before Sprint 3 |
| R-05 | Email delivery to spam (claim emails) | Medium | High | Configure SPF/DKIM/DMARC on sending domain Sprint 2 Day 1 |
| R-06 | LinkedIn OG preview doesn't show PNG (image URL not public) | Medium | Medium | Validate with LinkedIn Post Inspector; ensure PNG S3 URL is publicly readable |
| R-07 | Web Stream response for PDF doesn't work on Vercel Edge | Low | High | Test PDF download route on target deployment environment Sprint 2; use Node runtime if needed |

### Dependencies

| Dependency | Needed By | Risk |
|---|---|---|
| `dbCourses` and `dbUsers` Drizzle tables exist in V2 | Sprint 1 Day 1 | ًں”´ High â€” blocks schema |
| Certificate PDF template file (base PDF) designed + placed in `/assets/` | Sprint 1 Day 1 | ًں”´ High â€” blocks pdf-lib |
| better-auth configured in V2 | Sprint 3 | ًںں، Medium |
| S3/R2 bucket + credentials provisioned | Sprint 1 | ًںں، Medium |
| Resend account + verified sending domain | Sprint 3 | ًںں، Medium |

---

## 16. Open Questions & Appendix [UPDATED]

### 16.1 Open Questions

| ID | Question | Impact | Target |
|---|---|---|---|
| OQ-01 | Is the certificate triggered by `courseCompletion` or `mentorshipProgramCompletion`? (Or both?) | Schema + event wiring | Sprint 1 kickoff |
| OQ-02 | Does the base PDF certificate template already exist, or does design need to create it? | Sprint 1 blocker | Immediately |
| OQ-03 | What `completedLessons` threshold counts as "complete"? 100% or configurable? | Business logic | Sprint 1 |
| OQ-04 | Should revoked certificates show REVOKED on public verify page, or return not-found? | UX + legal | Sprint 1 |
| OQ-05 | Are certificates ever issued for mentorship programs (not courses), or courses only in V2? | Scope | Sprint 1 kickoff |

### 16.2 Glossary [UPDATED]

| Term | Definition |
|---|---|
| **better-auth** | Authentication library used in ScholarX V2 for session management, Google OAuth, and password operations |
| **Drizzle ORM** | TypeScript ORM used in V2; type-safe schema definition + migrations via `drizzle-kit` |
| **pdf-lib** | Node.js library for creating and manipulating PDF files; used to inject recipient data into a base PDF template |
| **Server Action** | Next.js App Router feature: async server-side functions callable directly from React components; replaces Express API routes for most data operations |
| **dbCourseCompletions** | Drizzle table storing course completion records, certificate metadata, claim tokens, and HMAC signatures |
| **HMAC-SHA256** | Hash-based Message Authentication Code â€” used to sign certificate payloads for tamper detection |
| **QR Code** | Machine-readable image embedded in PDF linking to `/certificates/verify/:certificateId` |
| **pg-boss** | PostgreSQL-backed job queue; used for async PDF generation and email dispatch |
| **Claim Token** | UUID sent in claim email; single-use, 30-day expiry; consumed on first successful access |

### 16.3 Revision History

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | 2026-04-27 | Principal SWE | Initial generic draft |
| 1.0 | 2026-04-27 | Principal SWE | Scoped to ScholarX; single org; HMAC, PDF+PNG, LinkedIn+OAuth |
| 1.1 | 2026-04-27 | Principal SWE | **Updated**: Drizzle ORM, better-auth, pdf-lib, Server Actions, Change Password feature, exact V2 file paths, V1â†’V2 migration map |
