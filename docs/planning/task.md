# Task List - MemesConcept MVP

- [ ] **Project Configuration & Standards**
  - [x] Configure `GEMINI.md` (Project Rules & Stack) <!-- id: 18 -->
  - [x] Create `README.md` (Project Overview) <!-- id: 19 -->
  - [x] Define "Spec-Driven" Workflow/Skill <!-- id: 20 -->

- [/] **Project Setup**
  - [x] Initialize Monorepo Structure (`backend`, `frontend`) <!-- id: 0 -->
  - [x] Setup Backend (Express/Zod/Pino) <!-- id: 1 -->
  - [x] Setup Frontend (Next.js/Tailwind/Radix) <!-- id: 2 -->
  - [x] Configure CI/CD (GitHub Actions) <!-- id: 3 -->

- [/] **Specifications (Spec Driven Development)**
  - [x] Create OpenAPI Specification for Backend API <!-- id: 4 -->
  - [x] Create Frontend Component/Page Specification <!-- id: 5 -->
  - [ ] Review Specifications with User <!-- id: 6 -->

  - [x] Ticket: [MVP-01-backend-implementation.md](docs/tickets/MVP-01-backend-implementation.md) <!-- id: 7 -->
  - [x] Implement Product Endpoints (List, Detail) <!-- id: 8 -->
  - [x] Implement Order/Purchase Endpoints (Stripe Integration) <!-- id: 9 -->
  - [ ] Implement Admin Endpoints (Basic) <!-- id: 10 -->
  - [x] Verify Backend with Tests (Jest) <!-- id: 11 -->

- [x] **Frontend Implementation**
  - [x] Ticket: [MVP-02-frontend-implementation.md](docs/tickets/MVP-02-frontend-implementation.md) <!-- id: 12 -->
  - [x] Implement Product Detail Page (Primary Landing) <!-- id: 13 -->
  - [x] Bug: [BUG-01-image-host-config.md](docs/bugs/BUG-01-image-host-config.md) <!-- id: 21 -->
  - [x] Implement Checkout Flow (Stripe) <!-- id: 14 -->
  - [x] Implement Order Confirmation Page <!-- id: 15 -->
  - [x] Implement Product List Page (Secondary) <!-- id: 16 -->
  - [x] Verify Frontend with E2E Tests (Cypress) <!-- id: 17 -->

- [ ] **MVP Refinement & Features**
  - [x] Ticket: [MVP-03-refinement.md](docs/tickets/MVP-03-refinement.md) <!-- id: 22 -->
  - [x] Fix: Checkout Modal Close Button <!-- id: 23 -->
  - [x] Feature: Stripe Shipping Address Collection <!-- id: 24 -->
  - [x] Feature: Analytics Integration (PostHog) <!-- id: 25 -->
  - [x] Feature: Footer & Legal Pages <!-- id: 26 -->
  - [x] Feature: Cookie Banner <!-- id: 27 -->

- [x] **Admin & Cloudinary**
  - [x] Ticket: [MVP-04-admin-dashboard.md](docs/tickets/MVP-04-admin-dashboard.md)
  - [x] Backend: Cloudinary & CRUD
  - [x] Frontend: Admin Dashboard & Upload (Implemented)
  - [x] Fixes: Admin List Images, Delete Modal, Variants on Store, Stripe Integration
  - [x] Ticket: [MVP-07-image-upload-refactor.md](docs/tickets/MVP-07-image-upload-refactor.md) (Tech Debt: Multipart Uploads)
  - [x] Backend: Multer & Cloudinary Streams
  - [x] Frontend: Refactor `ImageUpload` component

- [ ] **Deployment Analysis & Verification**
  - [x] Analyze Deployment Options (Vercel, VPS, etc.)
  - [x] Ticket: [MVP-05-final-polish.md](docs/tickets/MVP-05-final-polish.md)
  - [x] Ticket: [MVP-06-db-retry.md](docs/tickets/MVP-06-db-retry.md) (Database Resilience)
  - [x] Implement MongoDB Retry Policy (Initial Connection)
  - [x] Install & Configure Cypress
  - [x] Update README.md
  - [x] CI/CD Optimization
  - [x] Configure Build/Deploy artifacts (Dockerfile for Render Backend)
  - [x] Final Deployment (Vercel/Render)
