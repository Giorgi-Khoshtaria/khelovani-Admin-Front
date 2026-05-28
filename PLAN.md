# Khelovani Admin Panel — Senior Full-Stack Code Review & Action Plan

> Reviewed by: Claude Sonnet 4.6 (acting as Senior Full-Stack Engineer)  
> Date: 2026-05-18  
> Scope: Frontend (`Khelovani-Admin-Front`) + Backend (`khelovani-Web-admin-Back`)  
> Overall Grade: **7 / 10**

---

## Executive Summary

A bilingual (Georgian/English) admin panel managing partners, products, users, roles, and permissions. Stack: React 19 + Vite (frontend) · Express 5 + MongoDB + Redis (backend). Architecture follows standard MVC with a clean middleware pipeline and hook-based state management.

Fundamental patterns are solid. The codebase is readable, organized, and functional. However, there are **security vulnerabilities, performance gaps, and insufficient testing** that must be resolved before production at scale.

---

## Part 1 — Security Issues

### 🔴 CRITICAL

#### 1.1 JWT Stored in `localStorage` (XSS Vector)

**File:** [src/apiCalls/authApiCalls/api.ts](src/apiCalls/authApiCalls/api.ts)

```typescript
// CURRENT — vulnerable
localStorage.setItem("adminToken", newToken);
```

Any injected script (XSS) can read this token and hijack sessions.

**Fix:** Migrate to `httpOnly` cookies. Requires backend changes:
- Set `res.cookie("adminToken", token, { httpOnly: true, secure: true, sameSite: "strict" })`
- Remove `Authorization: Bearer` header logic; cookie is sent automatically
- Add a `/api/admin/auth/me` endpoint to retrieve current user without exposing token

---

#### 1.2 No CSRF Protection

**Affects:** All POST / PATCH / DELETE endpoints.

An attacker can trick an admin browser into firing state-changing requests.

**Fix:** Install `csurf` (or roll a custom double-submit cookie). After httpOnly cookie migration, this becomes mandatory.

---

#### 1.3 No Rate Limiting on Login Endpoint

**File:** `src/controllers/admin/loginAdmin.ts`

Login brute-force is possible. The global rate limiter does not specifically protect `/api/admin/auth/login`.

**Fix:**
```typescript
import rateLimit from "express-rate-limit";
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
router.post("/auth/login", loginLimiter, validate(loginSchema), loginAdmin);
```

---

#### 1.4 Long JWT TTL, No Refresh Token

Current expiry is **7 days** with no refresh rotation. A stolen token is valid for a week.

**Fix:**
- Access token: **15 minutes**
- Refresh token: **7 days**, stored in `httpOnly` cookie
- Implement `POST /api/admin/auth/refresh` endpoint
- Store refresh token hash in Redis; invalidate on logout

---

#### 1.5 ProtectedRoute Ownership Check is Fail-Open

**File:** [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx) (or similar)

```typescript
const isOwner = requireOwnership && role !== "admin" && urlId
  ? urlId === userPartnerId
  : true; // <-- passes when urlId is undefined
```

If `urlId` is absent (e.g., a route param not yet loaded), check passes for all users.

**Fix:** Default to `false` when `urlId` is required but missing:
```typescript
const isOwner = !requireOwnership || role === "admin"
  ? true
  : !!urlId && urlId === userPartnerId;
```

---

### 🟡 HIGH

#### 1.6 Stack Traces Exposed in Development Logs

**File:** `src/utils/globalErrorHandler.ts`

`AppError` stack is conditionally logged but could leak internal paths if `NODE_ENV` is not set correctly on a staging server.

**Fix:** Explicitly check `process.env.NODE_ENV === "development"` and never include `stack` in response JSON in any environment.

---

## Part 2 — Performance Issues

### 🟡 HIGH

#### 2.1 Missing Database Indexes

**File:** `src/modules/product.modules.ts`, `organisation.modules.ts`

Queries filter on `status`, `ownerType`, `isOnSale`, `createdAt`, and `pinnedAt` — none have compound indexes.

**Fix (add to schema definitions):**
```typescript
ProductSchema.index({ ownerType: 1, status: 1, createdAt: -1 });
ProductSchema.index({ pinSection: 1, pinnedAt: -1 }, { sparse: true });
OrganisationSchema.index({ status: 1, partnerType: 1, createdAt: -1 });
```

---

#### 2.2 Full-Collection Scans for Text Search

Search is done with `$regex` (case-insensitive) against `titleGe`, `titleEn`, `tagsGe`.

**Fix:** Add MongoDB text index:
```typescript
ProductSchema.index({ titleGe: "text", titleEn: "text", tagsGe: "text" });
```
Then use `{ $text: { $search: searchTerm } }` in controller.

---

#### 2.3 Request Logger Writes Synchronously to MongoDB

**File:** `src/middleware/requestLogger.ts`

```typescript
RequestLog.create(payload).catch(...); // fire-and-forget
```

Under high traffic, unresolved promises pile up in memory.

**Fix:** Use a lightweight queue (e.g., `Bull` with Redis already in the stack):
```typescript
logQueue.add("request-log", payload);
// worker picks up and writes to MongoDB
```

---

#### 2.4 `/admin/permissions` Returns All Records

No pagination on the permissions listing endpoint — will degrade as permissions grow.

**Fix:** Apply the same `page` / `limit` pattern used on products and partners.

---

#### 2.5 Category Placeholder Called Per-Product Per-Request

**File:** `src/controllers/products/getProducts.ts`

`getCategoryPlaceholder(category)` is called for every product that has no image. No memoization.

**Fix:** Cache results in a `Map` at module scope or in Redis (TTL 1 hour).

---

### 🟢 MEDIUM

#### 2.6 Overly Large Hook State in `useProductListing`

Managing 15+ state variables in one hook creates complex re-render trees.

**Fix:** Split into focused hooks:
- `useProductFilters` — search, category, price range, status filters
- `useProductPagination` — page, limit, totalCount
- `useProductActions` — pin, toggle visibility, delete

Or adopt **Zustand** for shared product state (avoids prop-drilling and re-renders).

---

## Part 3 — Type Safety & Code Quality

### 🟡 HIGH

#### 3.1 API Functions Lack Return Types

**Files:** `src/apiCalls/**/*.ts`

```typescript
// CURRENT
const loginRequest = async (email: string, password: string) => {
  return (await api.post("/api/admin/auth/login", { email, password })).data;
};
// return type: any
```

**Fix:** Define shared response interfaces:
```typescript
interface LoginResponse { token: string; id: string; }
const loginRequest = async (email: string, password: string): Promise<LoginResponse> => { ... };
```

---

#### 3.2 Frontend and Backend Types Are Manually Synced

`Product` in `src/types/productTypes.ts` and `IProduct` in `src/modules/product.modules.ts` must be kept in sync manually.

**Fix (two options):**
- **Option A (simple):** Generate a `shared-types` package and import it in both projects.
- **Option B (recommended long-term):** Add Swagger/OpenAPI spec to backend, auto-generate frontend types with `openapi-typescript`.

---

#### 3.3 Token Field Detection is Fragile

**File:** `src/pages/loginPage.tsx` (or login hook)

```typescript
const token = response.token || response.accessToken || response.jwt || response.data?.token;
```

This works but will silently break if backend changes field name.

**Fix:** Standardize to `response.token` and enforce that in `sendResponse` helper.

---

#### 3.4 `useEffect` Stale Closure on `fetchProducts`

**File:** Custom product listing hook

```typescript
useEffect(() => {
  fetchProducts();
}, [fetchProducts]); // recreated every render → infinite loop risk
```

**Fix:**
```typescript
const fetchProducts = useCallback(async () => { ... }, [page, limit, filters]);
useEffect(() => { fetchProducts(); }, [fetchProducts]);
```
Ensure all dependencies are listed in `useCallback` and nothing else causes recreation.

---

### 🟢 MEDIUM

#### 3.5 Enable TypeScript `strict` Mode

**File:** `tsconfig.app.json`

Add:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

This will surface hidden `undefined` / `null` bugs across the codebase.

---

#### 3.6 No `discriminated union` for API Response Types

Controllers return either `{ success: true, data }` or `{ success: false, message }` but the frontend types don't reflect this.

**Fix:**
```typescript
type ApiResponse<T> =
  | { success: true; data: T; meta?: PaginationMeta }
  | { success: false; message: string; errors?: FieldError[] };
```

---

## Part 4 — Testing

### 🟡 HIGH

#### 4.1 No Unit Tests for Frontend Hooks or Utilities

Playwright e2e tests exist but unit tests are absent. Business logic in hooks is not covered.

**Fix:** Add Vitest (already in Vite ecosystem):
```bash
npm install -D vitest @testing-library/react @testing-library/user-event
```
Priority targets:
- `useDebounce`
- `parseJwt`
- `getErrorMessage`
- All Zod validation schemas

---

#### 4.2 No Backend Unit Tests for Utils / Models

**Fix:** Add Jest + `mongodb-memory-server` for unit testing controllers in isolation without a real DB connection.

Priority targets:
- `escapeRegex`
- `generateJWTToken`
- `globalErrorHandler`
- All Zod schemas in `src/validations/schemas/`

---

### 🟢 MEDIUM

#### 4.3 Load Testing Not Present

No load tests to know how many concurrent admins the system can handle.

**Fix:** Add `k6` or `Artillery` script that simulates 50 concurrent product listing requests.

---

## Part 5 — Architecture & Observability

### 🟡 HIGH

#### 5.1 No Error Monitoring Service

Errors are only logged to `console.error` in development.

**Fix:** Integrate **Sentry**:
```typescript
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN });
// In globalErrorHandler:
if (statusCode >= 500) Sentry.captureException(err);
```

---

#### 5.2 No API Versioning

All routes are `/api/admin/*` with no version prefix. Breaking changes require coordination.

**Fix:** Prefix all routes with `/api/v1/admin/*` now, before external consumers rely on the current paths.

---

### 🟢 MEDIUM

#### 5.3 No Health / Readiness Endpoints

Only a basic health check exists. No readiness probe (checks DB + Redis connectivity).

**Fix:**
```typescript
router.get("/health/ready", async (req, res) => {
  await mongoose.connection.db.admin().ping();
  await redis.ping();
  res.json({ status: "ready" });
});
```

---

#### 5.4 No APM / Slow Query Tracking

No way to detect which endpoints are slow in production.

**Fix:** Add `mongoose-explain` logging for queries that take > 100ms, or install **Datadog APM** / **New Relic**.

---

## Part 6 — Prioritized Action Plan

### Sprint 1 — Security Hardening (Do First)

| # | Task | Files Affected | Effort |
|---|------|----------------|--------|
| S1 | Migrate JWT to httpOnly cookies | `api.ts`, `loginAdmin.ts`, all auth routes | M |
| S2 | Add CSRF middleware | `app.ts`, all POST/PATCH/DELETE routes | S |
| S3 | Rate-limit login endpoint | `adminRoutes/auth.ts` | S |
| S4 | Implement access + refresh token rotation | `loginAdmin.ts`, new `refreshAdmin.ts` | L |
| S5 | Fix fail-open ownership check in ProtectedRoute | `ProtectedRoute.tsx` | S |

---

### Sprint 2 — Performance & DB Optimization

| # | Task | Files Affected | Effort |
|---|------|----------------|--------|
| P1 | Add compound indexes on Product + Organisation schemas | `product.modules.ts`, `organisation.modules.ts` | S |
| P2 | Replace regex search with MongoDB text index | `getProducts.ts`, `getAllPartners.ts` | M |
| P3 | Move request logger writes to Bull queue | `requestLogger.ts`, new `workers/logWorker.ts` | M |
| P4 | Paginate `/admin/permissions` | `getPermissions.ts`, permissions route | S |
| P5 | Cache category placeholder URLs | `getProducts.ts` | S |

---

### Sprint 3 — Type Safety & DX

| # | Task | Files Affected | Effort |
|---|------|----------------|--------|
| T1 | Add return types to all `apiCalls/**` functions | `src/apiCalls/**` | M |
| T2 | Enable TypeScript `strict` mode and fix errors | `tsconfig.app.json` + all files | L |
| T3 | Add discriminated union `ApiResponse<T>` type | `src/types/api.types.ts` | S |
| T4 | Fix `useCallback` dependency arrays in product hook | product listing hook | S |
| T5 | Standardize `token` field in login response | `loginAdmin.ts`, login page hook | S |

---

### Sprint 4 — Testing

| # | Task | Files Affected | Effort |
|---|------|----------------|--------|
| Q1 | Add Vitest + Testing Library for FE | `package.json`, `vitest.config.ts` | S |
| Q2 | Unit tests for all Zod schemas (FE + BE) | `validations/**` | M |
| Q3 | Unit tests for hooks (`useDebounce`, `parseJwt`, etc.) | `src/hooks/**` | M |
| Q4 | Backend unit tests with `mongodb-memory-server` | `tests/unit/**` | M |
| Q5 | Basic k6 load test for product listing endpoint | `tests/load/**` | S |

---

### Sprint 5 — Observability & Architecture

| # | Task | Files Affected | Effort |
|---|------|----------------|--------|
| O1 | Integrate Sentry (FE + BE) | `main.tsx`, `app.ts`, `globalErrorHandler.ts` | M |
| O2 | Add `/api/v1` versioning prefix | All route files | M |
| O3 | Add readiness health endpoint | `routes/health.ts` | S |
| O4 | Slow-query logging for Mongoose | `src/db/mongoose.ts` | S |

---

## Strengths Worth Keeping

- Clean hook-based architecture (business logic out of components)
- `asyncHandler` wrapper eliminates boilerplate try/catch in controllers
- `escapeRegex()` prevents NoSQL injection in search queries
- Zod `.strict()` + `superRefine()` for cross-field business rule validation
- Role/permission system properly follows middleware composition pattern
- Optimistic UI updates with proper rollback on error
- Bilingual support is consistent throughout both layers

---

## Quick Wins (< 1 hour each)

1. Add `sparse: true` to `pinnedAt` index in product schema
2. Remove `stack` from error responses unconditionally (not just in production check)
3. Lower `MAX_LIMIT` from 100 to 50 in `getAllPartners.ts`
4. Replace 4-key token detection with single `response.token`
5. Add `"strict": true` to `tsconfig.app.json` (fix compilation errors as they appear)

---

*End of review. Address items in sprint order — security first, then performance, then quality.*
