# Item Category — Full-stack Plan

Convert the hardcoded `ProductCategory` enum into a DB-backed `Category` collection with admin CRUD (admin-only). Frontend gets a listing page with modal "Add" and inline "Edit" + "Delete". Backend gets a module, controllers, zod schema, routes, seed, and tests. Permissions `categories.create / .edit / .delete` already exist in `PERMISSIONS.ADMIN` — reuse them.

---

## 1. Backend — `khelovani-Web-admin-Back`

### 1.1 Model — `src/modules/category.modules.ts`

Mongoose schema with bilingual labels + a slug used as the stable key:

```ts
{
  slug:    String  // unique, lowercase, [a-z0-9_-]+, used by Item.category
  nameGe:  String  // required, trim, min 2 max 50
  nameEn:  String  // required, trim, min 2 max 50
  isActive:Boolean // default true (soft-disable instead of delete when in use)
  timestamps: true
}
```

Indexes: unique on `slug`, unique compound on `nameGe`, unique on `nameEn` (case-insensitive collation).

### 1.2 Types — `src/types/itemsCategory.enum.ts`

After seeding, **delete** the enum + `PRODUCT_CATEGORY_LABELS`. Replace with:

```ts
export type CategorySlug = string; // resolved at runtime against Category collection
```

Update `src/modules/item.modules.ts`:
- `category: { type: String, required: true }` (drop the `enum` constraint)
- Optional: validator that checks slug exists in `Category` collection on save (or rely on controller).

### 1.3 Validation — `src/validations/schemas/category.schema.ts`

```ts
import { z } from "zod";

const GE = /^[Ⴀ-ჿ\s'-]+$/;          // Georgian letters + space/-/'
const EN = /^[A-Za-z\s'-]+$/;                  // Latin letters + space/-/'
const SLUG = /^[a-z0-9_-]+$/;

const baseBody = z.object({
  slug:    z.string().trim().min(2, "slug_too_short").max(50, "slug_too_long").regex(SLUG, "slug_invalid"),
  nameGe:  z.string().trim().min(2, "nameGe_too_short").max(50, "nameGe_too_long").regex(GE, "nameGe_invalid"),
  nameEn:  z.string().trim().min(2, "nameEn_too_short").max(50, "nameEn_too_long").regex(EN, "nameEn_invalid"),
  isActive: z.boolean().optional(),
});

export const categorySchema = { body: baseBody };
export const updateCategorySchema = {
  body: baseBody.partial().refine(d => Object.keys(d).length > 0, { message: "empty_update_body" }),
};
```

### 1.4 Controllers — `src/controllers/admin/category/`

One file per action, plus `index.ts` barrel:

- `getCategories.ts` — list, supports `?lang=ge|en` and `?active=true`.
- `getCategoryById.ts`
- `createCategory.ts` — duplicate-slug → 409 (`category_already_exists`).
- `updateCategory.ts` — partial; if slug changes, also update referencing `Item` documents (atomic via session, OR forbid slug edit and only allow name/isActive).
- `deleteCategory.ts` — hard delete only if `Item.countDocuments({ category: slug }) === 0`; otherwise 409 (`category_in_use`) — UI should soft-disable via `isActive=false`.

Follow the exact pattern in [`src/controllers/admin/permission/`](../khelovani-Web-admin-Back/src/controllers/admin/permission/) — `asyncHandler`, `useTranslation`, `sendResponse`, `AppError`.

### 1.5 Routes — `src/routes/adminRoutes/category.routes.ts`

Mirror `permission.routes.ts`:
- `authenticate` on all
- GET routes → `requirePermission(PERMISSIONS.ADMIN.PRODUCT_VIEW_ALL)` (anyone who can see products)
- POST → `requirePermission(PERMISSIONS.ADMIN.CATEGORY_CREATE)`
- PUT  → `requirePermission(PERMISSIONS.ADMIN.CATEGORY_EDIT)`
- DELETE → `requirePermission(PERMISSIONS.ADMIN.CATEGORY_DELETE)`
- `twoMinutesLimiter` on writes
- `validate(categorySchema)` / `validate(updateCategorySchema)` / `validate(commonParamsSchema)`

Wire in `src/routes/index.ts`:
```ts
apiRouter.use("/admin/categories", categoryRoutes);
```

### 1.6 Seed — `src/utils/seeds/seedCategories.ts`

Read the existing `PRODUCT_CATEGORY_LABELS` (one last time, before deletion) and upsert each into `Category`. Use the enum value as `slug`. Like `seedPermissions.ts`: idempotent + cleanup of categories no longer referenced by either seed list or any Item.

```ts
const SEED = [
  { slug: "jewelry",   nameGe: "სამკაული",       nameEn: "Jewelry"   },
  { slug: "ceramics",  nameGe: "კერამიკა",       nameEn: "Ceramics"  },
  // ... rest from PRODUCT_CATEGORY_LABELS
];
for (const c of SEED) {
  await Category.updateOne({ slug: c.slug }, { $setOnInsert: c }, { upsert: true });
}
```

Register in the seed runner (wherever `seedPermissions` is called from — likely the bootstrap script).

After confirming the seed is in place and the `Item` model no longer uses the enum, **delete** `src/types/itemsCategory.enum.ts` and remove every import. Front-end and backend should reference categories by slug strings only.

### 1.7 Tests — `tests/api/admin/categories/`

Mirror `tests/api/admin/permissions/`:
```
tests/api/admin/categories/
├── categories.api.spec.ts        # imports & runs all suites
├── categories.helpers.ts         # VALID_CATEGORY, uniqueSlug(), createCategory(), deleteCategory()
└── suites/
    ├── createCategory.suite.ts        # 201, 409 dup, 422 missing/short/long/invalid chars, BVA min=2/max=50
    ├── updateCategory.suite.ts        # partial, empty body 422, slug-collision 409
    ├── deleteCategory.suite.ts        # 204 free, 409 in-use (seed an Item referencing it)
    ├── getCategoryById.suite.ts       # 200, 404, 422 invalid id
    ├── listCategories.suite.ts        # filter ?active, ?lang
    ├── categoryValidation.suite.ts    # GE regex, EN regex, slug regex, type coercion
    └── categoriesSecurity.suite.ts    # 401 unauthenticated, 403 partner, 403 missing-perm admin
```

Add to `tests/constants/endpoints.ts`:
```ts
ADMIN_CATEGORIES: "/api/admin/categories",
```

Reuse existing `tests/helpers/shared/users.helpers.ts` for partner/admin login fixtures and `tests/helpers/utils/generators.ts` for `randomId()`. Add scenario data to `categories.helpers.ts` (`VALID_CATEGORY`, `uniqueSlug`, `createCategory`, `deleteCategory`) — same shape as `permissions.helpers.ts` so other suites can compose it.

If any product/item test currently relies on `ProductCategory.JEWELRY` etc., update them to use the seeded slug string directly (or read it from `categories.helpers.ts`).

**Run gate:** `npx playwright test tests/api/admin/categories` must be green; full `npx playwright test` must remain green.

---

## 2. Frontend — `Khelovani-Admin-Front`

### 2.1 Types — `src/types/category.types.ts`

```ts
export interface Category {
  _id: string;
  slug: string;
  nameGe: string;
  nameEn: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
export type CategoryFormValues = Pick<Category, "slug" | "nameGe" | "nameEn">;
```

(For places that previously imported `ProductCategory`, switch to `string` — Item types just store the slug.)

### 2.2 API — `src/apiCalls/categoryApiCalls/`

Use the shared `api` axios instance (auth interceptor already in place):
```
category.req.ts          // getCategories, getCategoryById, createCategory, updateCategory, deleteCategory
```
Pattern: same as [`src/apiCalls/roleApiCalls/permission.req.ts`](src/apiCalls/roleApiCalls/permission.req.ts).

### 2.3 Hook — `src/hooks/categories/useCategoryManagement.ts`

State: `categories`, `loading`, `error`, `editingId`, `editDraft`. Actions: `refresh`, `create(form)`, `startEdit(id)`, `commitEdit()`, `cancelEdit()`, `remove(id)`. Use `useFormHandler.ts` for the modal form (matches `useRoleManagement.ts`).

Validate on submit with the same zod schema duplicated client-side (`src/lib/validation/categorySchema.ts`) — keep regex/min/max identical to backend so messages stay in sync. Surface errors via `react-toastify` + inline field error state.

### 2.4 Page — `src/pages/categories/CategoryListing.tsx` + `.scss`

Layout (matches `RoleManagement.tsx`):
- Header: title + "კატეგორიის დამატება" button (opens modal).
- Table columns: Slug | სახელი (GE) | Name (EN) | სტატუსი | მოქმედებები.
- Inline edit: clicking the pencil icon swaps row cells for inputs; "შენახვა" / "გაუქმება" actions per row. While editing one row, others are readonly.
- Delete: trash icon → confirm dialog → DELETE; on 409 in-use, toast prompts to deactivate instead.

### 2.5 Components — `src/components/categories/`

```
CategoryTable.tsx + .scss            # presentational table, no fetching
CategoryTableRow.tsx + .scss         # display vs inline-edit modes
CategoryAddModal.tsx + .scss         # uses .modal-overlay/.modal-content from globals (see RoleModals.tsx)
ConfirmDeleteDialog.tsx              # reuse if one already exists in src/components/common/, otherwise add here
```

Styles: rely on existing tokens from `src/styles/` (`_buttons.scss`, `_inputs.scss`, `_badges.scss`, `colors.scss`). Don't redefine button/input styles — extend with BEM blocks `.category-table`, `.category-modal`, etc.

### 2.6 Routing — `src/App.tsx`

Add inside the admin-only `<ProtectedRoute allowedRoles={["admin"]}/>` group:
```tsx
{ path: "categories", element: <CategoryListing /> }
```

### 2.7 Sidebar — `src/components/sideManu/SideManu.tsx`

```ts
if (role === "admin") links.push({ path: "/categories", label: "კატეგორიები" });
```
Admin-only, matches the existing `/users` and `/export` gating.

### 2.8 Wherever `ProductCategory` was used (forms, filters)

Replace the static dropdown source with a fetched list from `getCategories()`. Keep a tiny in-memory cache (`useCategoriesQuery` hook or context) so the product form/filter doesn't refetch on every mount. Display `nameGe` / `nameEn` based on current `lang`.

### 2.9 Tests — Playwright (admin front)

Mirror existing structure under `tests/admin/`. Add:
```
tests/admin/categories/
├── index.spec.ts
└── suites/
    ├── listing.spec.ts        # table renders seeded categories
    ├── add.spec.ts            # modal validation (min 2, max 50, GE/EN regex), happy path
    ├── inlineEdit.spec.ts     # edit row, save, cancel
    ├── delete.spec.ts         # delete free + blocked-when-in-use
    └── access.spec.ts         # non-admin sees no /categories link, direct nav redirects
```

Add a `CategoriesPage.ts` page object under `tests/pages/` (model on `PartnersPage.ts`). Reuse `tests/helpers/api.helper.ts` for seeding via API where useful.

**Run gate:** `npx playwright test` (admin front) must be green end-to-end.

---

## 3. Best practices baked into this plan

- **Single source of truth.** Slug is stable; UI labels live in DB; never hardcode the list again on either side.
- **Zod schema is duplicated, not shared cross-repo.** Keep field rules identical (min 2 / max 50 / regex). Frontend validates for UX; backend re-validates for safety.
- **Soft-disable beats hard-delete** when a category is referenced by products. Surfaced as a 409 with clear i18n key, UI flips to "deactivate".
- **Permission gates already exist** (`categories.create/edit/delete`) — no new permission seeding required, just attach them in routes + sidebar.
- **Bilingual format enforcement** at the validator level — Georgian field rejects Latin, English field rejects Cyrillic/Georgian. Catches copy-paste errors that the UI alone would let through.
- **Tests mirror permissions module** — already battle-tested suite layout (helpers + per-suite files + barrel spec). Lower review cost, easier to extend.
- **No styles duplication** — components consume `src/styles/*` tokens, only feature-specific BEM blocks live next to components.
- **Seed is idempotent and self-cleaning** — re-runs are safe; deprecated categories that nothing references get pruned automatically.

---

## 4. Execution order (proposed)

1. Backend: model + types + zod schema + controllers + routes + wire in `routes/index.ts`.
2. Backend: seed script + run it once + verify in DB.
3. Backend: drop `ProductCategory` enum, switch `Item.category` to `String`, fix imports/tests.
4. Backend: write `categories/` test suites → `npx playwright test` green.
5. Frontend: types + apiCalls + hook + page + components + route + sidebar.
6. Frontend: replace `ProductCategory` usage in product forms/filters with fetched list.
7. Frontend: add Playwright suites → `npx playwright test` green.
8. Final pass: full backend + full frontend test runs both green before merge.
