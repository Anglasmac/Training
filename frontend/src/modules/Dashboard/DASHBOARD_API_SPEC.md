# /dashboard/summary API Spec

Purpose: provide a single, lightweight endpoint that returns aggregated metrics for the frontend dashboard so the UI can request one resource instead of multiple endpoints.

Endpoint
- GET /dashboard/summary
- Auth: use existing backend auth if required (cookies / bearer token). If unauthenticated, return 401.

Success response (200)
Content-Type: application/json

{
  "customersCount": 123,
  "mealsCount": 45,
  "mealsAvailable": 30,
  "orders": {
    "total": 500,
    "pending": 20,
    "delivered": 480,
    "totalRevenue": 1234500.0,
    "pendingRevenue": 45000.0,
    "deliveredRevenue": 1189500.0
  }
}

Notes
- Numeric fields use raw numbers (integers or floats). The frontend formats currency using Intl.NumberFormat('es-CO', ...).
- The endpoint should be efficient (aggregate queries in DB) and cacheable (set Cache-Control or implement server-side caching for short intervals).
- If some data is not available, return 0 for numeric counters.

Errors
- 401 Unauthorized — when authentication is required and missing/invalid
- 500 Internal Server Error — on unexpected failures

Examples (pseudo-code)
- SQL: SELECT COUNT(*) FROM customers;
- SQL: SELECT COUNT(*) FROM meals; SELECT COUNT(*) FROM meals WHERE is_available = true;
- Orders: aggregate counts and SUM(total_with_iva)

Implementation suggestions
- Add a lightweight route `/dashboard/summary` that performs aggregated DB queries and returns the JSON above.
- Consider adding optional query params for `?from=YYYY-MM-DD&to=YYYY-MM-DD` for date ranges.

*** End File