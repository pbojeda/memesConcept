# Admin Feature: System Authentication

**Status**: PLANNED
**Priority**: HIGH
**Assignee**: @backend-planner / @frontend-planner

## Description
Currently, the `/admin` routes in the frontend and the `AdminAuth` middleware in the backend rely on a simple, hardcoded `secret-key` logic passed as a header/cookie. This lacks a proper session management system, making the dashboard vulnerable to unauthorized access. We need a robust, scalable admin authentication method before exposing the admin panel to the wider internet.

## Requirements
1. **Authentication Strategy**:
   - Implement an Auth provider (e.g., NextAuth.js / Auth.js, Clerk, or custom JWT).
   - *Recommendation*: Use NextAuth (Auth.js) with simple Credentials (Admin username/password) or Magic Links, combined with a JWT that the frontend passes to the backend for API access.
2. **Backend Protection**:
   - Replace the simplistic `config.ADMIN_API_KEY` middleware with robust token verification (e.g., verifying a JWT signature or checking against a session DB).
3. **Frontend Protection**:
   - Secure the `app/admin/...` layout via a server-side middleware (`middleware.ts` in Next.js) to block unauthenticated users from even loading the dashboard bundles.
   - Create a dedicated `/admin/login` page.

## Technical Impact
- **Backend**: Update `AdminMiddleware` in Express to read `Authorization: Bearer <TOKEN>` instead of checking static keys.
- **Frontend**: Add NextAuth config, protect routes, setup Login UI.

## Acceptance Criteria
- Visiting `/admin` redirects to a login gate if not authenticated.
- API requests to `POST /admin/products` from outside fail with a 401 Unauthorized without a valid authenticated token.
