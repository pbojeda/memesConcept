# MEMES CONCEPT MVP

## Overview
A meme-based merchandising store created to validate the concept of selling viral meme-themed products (T-shirts, hoodies, mugs, etc.) online. This MVP focuses on efficient user flow from product discovery to purchase.

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS for modern, vibrant aesthetics.
- **UI Components**: Radix UI for accessibility.
- **Payments**: Stripe Embedded Checkout.

### Backend
- **Framework**: Node.js + Express.
- **Database**: MongoDB (Atlas) with **Mongoose**.
- **Validation**: **Zod** schema validation.
- **Logging**: **Pino**.

## Project Structure
```
memes/
├── backend/    # Express API
├── frontend/   # Next.js App
└── docs/       # Documentation & Plans
```

## Spec-Driven Development
This project strictly follows Spec-Driven Development. 
- All backend features start with an **OpenAPI 3.0 definition** in `docs/specs/openapi.yaml`.
- All frontend features start with a **UI Specification** in `docs/specs/ui-components.md`.

## Setup & Run

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI
- Stripe API Keys

### Development
1. **Clone**: `git clone ...`
2. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Documentation
- [Implementation Plan](docs/planning/implementation_plan.md)
- [Task List](docs/planning/task.md)
