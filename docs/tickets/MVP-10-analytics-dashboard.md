# Admin Feature: Analytics Dashboard

**Status**: PLANNED
**Priority**: MEDIUM
**Assignee**: @frontend-planner / @backend-planner

## Description
The administrator needs visibility into key business metrics directly from the Admin Dashboard. This includes tracking product views, initiated checkouts, completed sales, and generic store access metrics. Since PostHog is already integrated into the frontend for analytics, we can either pull data from PostHog via its API to display in our custom dashboard, or implement basic database-level tracking for sales and views.

## Requirements
1. **At-a-glance Metrics**:
   - Total sales (revenue).
   - Total orders (count).
   - Top viewed products.
   - Abandoned checkouts vs Completed orders.
2. **Dashboard UI**:
   - Create an `Analytics` or `Overview` tab inside `/admin`.
   - Use simple charts (e.g., Recharts) or metric cards to visualize data.
3. **Data Source Strategy**:
   - *Option A*: Create a backend generic endpoint `/admin/analytics` that aggregates data from our `Order` collection (sales, revenue) and integrates with the PostHog API for pageviews.
   - *Option B*: Pure database aggregation (requires tracking 'views' on the `Product` model locally).

## Technical Impact
- **Backend**: New aggregate queries in Mongoose (`Order` collection).
- **Frontend**: New UI components in `/admin/page.tsx`, fetching data from the backend.
- **Dependencies**: Potential addition of a lightweight charting library (e.g., `recharts`).

## Acceptance Criteria
- Admin can see total revenue and number of orders for the last 30 days.
- Admin can see a list of the top 5 most viewed/purchased products.
- Data accurately reflects the database state.
