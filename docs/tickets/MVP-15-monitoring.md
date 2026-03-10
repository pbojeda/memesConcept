# MVP-15: Monitoring & Alerts

## Status
PLANNED

## Requirements
Set up tracking to be notified when the Frontend or Backend fails, when payments fail repeatedly, or when integration with Printful goes out-of-sync unnoticed.

## Edge Cases & Improvements Identified
1. **Platform Selection**: `Sentry` is the industry standard for catching unhandled exceptions in both Next.js (client & SSR) and Node.js/Express. It provides extreme detail, stacktraces, and alerts to Slack/Email out of the box.
2. **Backend Express (Unhandled Logs)**: We currently have a Pino logger that prints to `stdout` locally. With Render in production, those logs vanish if we don't look at the console. We should plug the monitoring tool into our global error middleware in `src/app.ts`.
3. **Frontend Next.js (Client Crashes)**: If a React Component in production fails to mount, the user gets a blank screen. The tracking tool will catch this and report it instantly.
4. **Uptime Monitoring (UptimeRobot)**: We will create a `GET /api/health` endpoint on the backend. We will configure an external UptimeRobot bot knocking on this URL every 5 minutes (and similarly for the Frontend domain). If Render or Vercel are down, we get an instant email/notification.

## Implementation Plan
1. **Tool Setup (Sentry)**:
    - Install Sentry packages for both the backend (`@sentry/node`, `@sentry/profiling-node`) and frontend (`@sentry/nextjs`).
2. **Backend Integration**:
    - Update `src/app.ts` to initialize Sentry so that all routes are wrapped.
    - Setup the `Sentry.Handlers.errorHandler()` middleware *before* our custom `errorHandler`.
    - Create a light `GET /api/health` endpoint that returns `{ status: "ok", timestamp: "..." }` to confirm Database and App are alive.
3. **Frontend Integration**:
    - Run the automated Next.js Sentry wizard `npx @sentry/wizard@latest -i nextjs`.
    - It will wrap the `next.config.js` and add `sentry.server.config.ts`, `sentry.client.config.ts`, and `sentry.edge.config.ts`.
4. **Environment Variables**:
    - Manage generating `DSN` keys across both apps.
5. **UptimeRobot Setup**:
    - Configure an HTTP monitor pointing to our new Backend Health endpoint.
    - Configure an HTTP monitor pointing to the frontend production URL.
