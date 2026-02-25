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

## Implementation Plan

### Existing Code to Reuse
- `Order` Mongoose Model (`backend/src/domain/models/Order.ts`): Has the necessary data (`status: 'paid'`, `amountTotal`, `productId`) to aggregate revenue and sales.
- `Product` Mongoose Model (`backend/src/domain/models/Product.ts`): Used for looking up product names.
- `adminAuth` middleware (`backend/src/middleware/adminAuth.ts`): To secure the analytics route.
- `adminProductRoutes` (`backend/src/presentation/routes/adminProductRoutes.ts`): The optimal place to add the new `GET /admin/analytics` endpoint.

### Files to Create
- `backend/src/application/services/AnalyticsService.ts`: Application service housing the Mongoose aggregation pipeline logic to calculate `totalRevenue`, `totalOrders`, and aggregate `topProducts`.
- `backend/src/presentation/controllers/AnalyticsController.ts`: Express controller specifically mapping HTTP requests to `AnalyticsService`.

### Files to Modify
- `backend/src/presentation/routes/adminProductRoutes.ts`: Technically changing the name of this file to `adminRoutes.ts` would make sense eventually, but for now we can append `router.get('/analytics', adminAuth, AnalyticsController.getDashboardStats);`.
*(Alternatively, register a new `adminAnalyticsRoutes.ts` in `app.ts` if keeping it clean)*.
**Decision for MVP**: Create `adminRoutes.ts` or add to `app.ts` as `app.use('/admin/analytics', adminAuth, analyticsRouter)`.
- `backend/src/app.ts`: Add `app.use('/admin/analytics', analyticsRouter)`
- `docs/tickets/MVP-10-analytics-dashboard.md`: Complete and mark `PLANNED`.

### Implementation Order
1. **Application Layer**: Create `AnalyticsService.ts` containing `getDashboardStats()`. Use Mongoose `aggregate()` on the `Order` collection tracking `status: 'paid'`.
2. **Presentation Layer**: Create `AnalyticsController.ts` wrapping the service.
3. **Route Layer**: Create `adminAnalyticsRoutes.ts` and mount in `app.ts`.
4. **Testing Layer**: Update or create `analytics.test.ts` validating that the aggregates correctly process math for multiple paid orders.

### Testing Strategy
- Create `backend/tests/integration/analytics.test.ts`.
- **Happy Path**: Setup test DB with 2 Paid Orders and 1 Pending Order. Verify that `/admin/analytics` returns `totalOrders` = 2, `totalRevenue` = sum of the 2, and `topProducts` correctly maps the names.
- **Security Path**: Ensure 401 Unauthorized is returned without a valid JWT token.

### Key Patterns
- **Mongoose Aggregations**: We are pivoting to `Option A/B hybrid` (pure database aggregation of Orders) as the PostHog API requires external auth handling that complicates MVP. We'll derive "performance" simply by identifying which products *sell* the most instead of *views*, which is actually more accurate for MVP business health.
- **AmountTotal**: Stripe sends amounts in cents (e.g. `2999`), wait/convert accurately in aggregation (`$divide: ["$amountTotal", 100]`).
