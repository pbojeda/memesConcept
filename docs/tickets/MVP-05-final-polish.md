# Ticket: Final Polish & Deployment

**Status**: PLANNED
**Assignee**: @qa-engineer, @ops-engineer

## Description
Prepare the application for production release (MVP v0).

## Tasks

### 1. Verification & Testing
-   [ ] **Cypress**: Install `cypress` and write a robust "Happy Path" E2E test.
    -   Visitor -> Product -> Checkout -> Success.
-   [ ] **PostHog**: Verify events are firing in `Test` environment.

### 2. SEO Optimization (Missing MVP Analysis)
-   [x] **Metadata**: Implement `generateMetadata` for dynamic Product Pages.
-   [x] **Sitemap**: Generate `sitemap.xml`.
-   [x] **Robots**: Configure `robots.txt`.
-   [x] **OpenGraph**: Ensure social sharing cards work (using product images).

### 3. Documentation
-   [x] **README.md**:
    -   Project Setup (Node, Mongo).
    -   Env Vars (Template).
    -   Run Locally (`npm run dev`).
    -   Run Tests.
    -   Deployment Guide (Vercel/Render).

### 3. CI/CD
-   [ ] **GitHub Actions**:
    -   Split `unit-test` job.
    -   Add `e2e-test` job (using Cypress container).

### 4. Deployment
-   [ ] **Frontend**: Deploy to Vercel.
-   [ ] **Backend**: Deploy to Render.
-   [ ] **Smoke Test**: Live purchase simulation.

## Acceptance Criteria
-   [ ] `npm run cypress:run` passes.
-   [ ] README is complete and helpful.
-   [ ] App is live on Vercel/Render.
