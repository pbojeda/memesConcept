# Memes Concept Store MVP 🚀

A modern, high-performance E-commerce MVP for selling viral meme-based merchandise. Built with **Next.js 15 (App Router)** and **Express/Node.js**, designed for speed, SEO, and conversion optimization.

## ✨ Features

- **Storefront**:
  - 🎨 Modern UI with Tailwind CSS & Radix Primitives.
  - 🔍 **SEO Optimized**: Dynamic Metadata, Sitemap, and OpenGraph images.
  - 🛍️ **Product Variants**: Size & Color selection with live inventory checks.
  - 💳 **Stripe Embedded Checkout**: Seamless payment flow without leaving the site.
  - 📊 **Analytics**: Integrated PostHog tracking.

- **Admin Dashboard**:
  - 🖼️ **Image Management**: Cloudinary integration for product uploads.
  - 📦 **CRUD Operations**: Create, Edit, Delete products with real-time updates.
  - 🔒 **Secure Access**: API Key protection.

## 🛠️ Tech Stack

**Frontend** (`/frontend`):
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **State/Query**: TanStack Query v5
- **Testing**: Cypress (E2E)

**Backend** (`/backend`):
- **Runtime**: Node.js + Express
- **Database**: MongoDB Atlas (Mongoose)
- **Validation**: Zod (Shared schemas with frontend)
- **Testing**: Jest (Integration)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas Account (Connection String)
- Stripe Account (Test Keys)
- Cloudinary Account (API Keys)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd memes
   ```

2. **Install Dependencies**:
   ```bash
   # Install root dependencies (if any)
   npm install

   # Install Backend
   cd backend && npm install

   # Install Frontend
   cd ../frontend && npm install
   ```

### Configuration (Environment Variables)

Create `.env` files in `backend` and `frontend` folders based on the provided examples.

**Backend (`backend/.env`):**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI, Stripe Secret, and Cloudinary keys
```

**Frontend (`frontend/.env.local`):**
```bash
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your Stripe Publishable Key
```

> **⚠️ Important**: Ensure your IP address is whitelisted in MongoDB Atlas or allow access from anywhere (`0.0.0.0/0`) during development.

---

## 💻 Development

Start both servers concurrently:

1. **Backend** (Port 4000):
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend** (Port 3000):
   ```bash
   cd frontend
   npm run dev
   ```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Testing

- **Backend Integration Tests**:
  ```bash
  cd backend
  npm test
  ```

- **Frontend E2E Tests**:
  ```bash
  cd frontend
  npm run cypress:open
  ```

---

## 🌍 Deployment

### Frontend (Vercel)
1. Import the repo to Vercel.
2. Select `frontend` as the Root Directory.
3. Add Environment Variables from `.env.local`.
4. Deploy.

### Backend (Render/Railway)
1. Creating a Web Service pointing to `/backend`.
2. Set Build Command: `npm install && npm run build` (ensure TS compiles).
3. Set Start Command: `npm start`.
4. Add Environment Variables from `.env`.

---

## 📚 Documentation
- [Implementation Plan](docs/planning/implementation_plan.md)
- [Task List](docs/planning/task.md)
- [SEO Specification](docs/specs/seo.md)
