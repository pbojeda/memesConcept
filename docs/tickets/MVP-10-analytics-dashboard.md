# Admin Feature: Analytics Dashboard

**Status**: COMPLETED
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
- Admin can filter metrics by arbitrary Date Ranges and specific Products.
- Admin can see marketing KPIs: Page Views, Checkouts Initiated, Purchases, Conversion Rate, and Traffic Sources.
- Data accurately reflects the database state.

## Implementation Plan

### Existing Code to Reuse
- `Order` Mongoose Model: Used to aggregate `totalRevenue`, `totalOrders`, and `purchasesCompleted`.
- `adminAuth`: Middleware to secure UI analytics route.
- `Product`: For fetching Product names and populating filters.

### Files to Create
- `backend/src/domain/models/TrackingEvent.ts`: A new Mongoose schema to store frontend events (`eventType: string`, `productId?: string`, `source?: string`, `createdAt`). This is faster for MVP than relying on external PostHog APIs.
- `backend/src/application/services/AnalyticsService.ts`: Application service housing:
    1. Tracking logic (store an event).
    2. Aggregation pipeline logic taking `startDate`, `endDate`, and `productId` filters to calculate Revenue, Top Products, Funnels, and Traffic.
- `backend/src/presentation/controllers/AnalyticsController.ts`: Controller managing filters `req.query` and interacting with the `AnalyticsService`.

### Files to Modify
- `backend/src/presentation/routes/analyticsRoutes.ts`: Create generic route for `POST /analytics/track`.
- `backend/src/presentation/routes/adminAnalyticsRoutes.ts`: Create authenticated route for `GET /admin/analytics`.
- `backend/src/app.ts`: Mount `app.use('/analytics', analyticsRouter)` and `app.use('/admin/analytics', adminAuth, adminAnalyticsRouter)`.

### Implementation Order
1. **Domain Layer**: Create `TrackingEvent.ts` model.
2. **Application Layer**: Create `AnalyticsService.ts` with `trackEvent()` and `getDashboardStats(filters)`. Write Mongoose `$match` statements that apply `startDate` and `endDate` boundaries.
3. **Presentation Layer**: Create `AnalyticsController.ts`.
4. **Route Layer**: Create and mount `analyticsRoutes.ts` (public tracking) and `adminAnalyticsRoutes.ts` (protected dashboard).
5. **Testing Layer**: Update `analytics.test.ts` to validate $match queries correctly filter by date and product id, and funnel math is correct.

### Testing Strategy
- Create `backend/tests/integration/analytics.test.ts`.
- **Happy Path**: Setup test DB with events and orders crossing different date ranges. Assert that filtering restricts metrics to exactly what falls within bounding dates for a specific product.
- **Security Path**: Ensure 401 Unauthorized for `/admin/analytics`.

### Key Patterns
- **Mongoose `$match` Filtering**: Ensure dates passed from frontend (ISO strings) are parsed into `new Date()` before Mongoose aggregation.
- **Funnel Calculation**: Event `page_view` -> Event `initiate_checkout` -> Paid `Order`. Conversion rate = `Paid Orders` / `Views` * 100.
- **Fire-and-Forget Tracking**: The `POST /analytics/track` endpoint will be hit often by the frontend. Keep it lightweight.
