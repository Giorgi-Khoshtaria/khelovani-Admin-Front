# Plan: Support Organization & Individual (Physical Person) Partners

## Goal

Today every partner is treated as an organization (company name, 9-digit org ID, contact-person required). Add a second registration type — **physical person / individual** (personal name, 11-digit personal number, no contact-person).

This change ripples through: backend schema/validation/controller/auth, public web registration UX + header, admin listings/details/filters for both partners and products, and tests across all three projects.

---

## Design decisions (locked in)

### D1. Discriminator field on the `Organisation` collection

Add `partnerType: "organization" | "individual"` (default `"organization"`). **Reuse** `companyNameGe`, `companyNameEn`, `identificationCode` for both types — the field stores either company name or person's name; validation is what diverges.

**Why reuse, not rename:**
- Renaming `companyNameGe` → `nameGe` touches 50+ files across three projects, all tests, and existing data. Reusing keeps the migration to a one-line default.
- Conceptually the field is still "registered display name." Frontend renders different labels per type.
- Existing API consumers are unaffected.

**Identification code length:** 9 digits for org, 11 digits for individual. Both share the unique index — they cannot collide (different lengths) and "find partner by ID code" stays a single field query.

**`contactPerson`:** kept on schema, becomes **optional** at the schema level. Required only when `partnerType="organization"` (enforced in Zod, not Mongoose).

### D2. Validation: Zod discriminated union

```ts
partnerRegistrationSchema = z.discriminatedUnion("partnerType", [
  organizationBranch,   // 9-digit ID, contactPerson required
  individualBranch,     // 11-digit ID, contactPerson rejected
])
```

This gives type-safe branching with clear per-type errors and refuses cross-type smuggling (e.g., `partnerType="individual"` + 9-digit ID).

### D3. Product ownership: denormalize `ownerType` onto the product

Add `ownerType: "organization" | "individual"` to the Product schema, set at create time from the logged-in partner's `partnerType`. **Why denormalize:**
- "Filter products by owner type" becomes a single indexed field query — no `$lookup`/aggregation pipeline.
- `partnerType` never changes after registration, so denormalization is safe (no sync risk).
- Display ("added by ფიზიკური პირი / ორგანიზაცია") needs no extra populate per row.

Backfill: a one-shot script reads each product's `owner.partnerType` and stamps `ownerType`.

### D4. Auth context exposes partner type to the public web

When a partner logs in, `/me` (or whatever returns the auth payload) includes `partnerType`. Header renders different label/icon, and the "add product" controller stamps `ownerType` from `req.user.partnerType`.

---

## 1. Backend (`khelovani-Web-admin-Back`)

### 1.1 Schema — `src/modules/organization.modules.ts`

```ts
partnerType: {
  type: String,
  enum: ["organization", "individual"],
  default: "organization",
  required: true,
  index: true,
},
contactPerson: {
  type: String,
  required: false,   // was true → allow individuals to omit
  trim: true,
},
identificationCode: {
  type: String,
  required: true,
  unique: true,
  // remove minlength/maxlength from schema — Zod enforces per-type length
},
```

**Why the schema lengths come off:** Mongoose can't conditionally validate based on another field cleanly. Zod owns the per-type rules. The DB-level uniqueness stays.

### 1.2 Schema — `src/modules/product.modules.ts`

```ts
ownerType: {
  type: String,
  enum: ["organization", "individual"],
  required: true,
  index: true,
},
```

### 1.3 Validation — `src/validations/schemas/orgPartner.schema.ts`

Replace single `partnerRegistrationSchema` body with discriminated union:

```ts
const sharedFields = { phone, email, city, address, addressEn, description, descriptionEn,
  website, facebook, instagram, tiktok, categories, terms };

const orgBranch = z.object({
  partnerType: z.literal("organization"),
  companyNameGe: ge_name_regex_min2_max100,
  companyNameEn: en_name_regex_min1_max100,
  identificationCode: z.string().regex(/^\d{9}$/, "id_code_invalid_org"),
  contactPerson: z.string().min(2).max(100),
  ...sharedFields,
});

const individualBranch = z.object({
  partnerType: z.literal("individual"),
  companyNameGe: ge_person_name_regex,           // person name, not company
  companyNameEn: en_person_name_regex,
  identificationCode: z.string().regex(/^\d{11}$/, "personal_number_invalid"),
  contactPerson: z.undefined().or(z.literal("")), // refuse contactPerson for individuals
  ...sharedFields,
});

export const partnerRegistrationSchema = {
  body: z.discriminatedUnion("partnerType", [orgBranch, individualBranch])
        .or(orgBranch),  // back-compat: missing partnerType → org branch
};
```

The `orgSchema` (admin-side update) gets the same union but `.partial()` per branch.

### 1.4 Controller — `src/controllers/partners/registerPartner.ts`

Add at the top:
```ts
const partnerType = data.partnerType ?? "organization";
```
Pass through into `Organisation.create({...})`. Skip `contactPerson` when individual.

### 1.5 Controller — `src/controllers/products/addProduct.ts`

Read `req.user.partnerType` (from auth middleware) and stamp `ownerType` on the product at create time. **Never trust the client to send `ownerType`** — it's always derived server-side.

### 1.6 Auth — `/me` endpoint and JWT payload

- JWT payload: include `partnerType` alongside `_id` and `role`.
- `/api/partner/auth/me` (or whichever endpoint hydrates the logged-in partner): include `partnerType` in the response.

### 1.7 Public partners listing — `src/controllers/partners/getPublicPartners.ts`

Add optional query filter:
```ts
if (partnerType && ["organization", "individual"].includes(partnerType)) {
  query.partnerType = partnerType;
}
```

### 1.8 Admin partners listing — `src/controllers/admin/partners/getPartners.ts`

Same `partnerType` query filter. Already returns the field via the schema.

### 1.9 Admin products listing — `src/controllers/admin/products/getProducts.ts`

Add `ownerType` query filter analogous to category filter.

### 1.10 Migration scripts

**a) `src/utils/migrations/migratePartnerType.ts`** — sets `partnerType: "organization"` on every existing partner that lacks the field. Idempotent (`{ partnerType: { $exists: false } }`).

**b) `src/utils/migrations/migrateProductOwnerType.ts`** — for each product, populate `owner`, copy `owner.partnerType` into `product.ownerType`. Skip if already set.

Add corresponding npm scripts: `migrate:partner-type`, `migrate:product-owner-type`.

### 1.11 Backend tests

#### Existing test fixtures
- `tests/constants/endpoints.ts` `DEFAULT_PARTNER`: add `partnerType: "organization"` (so existing tests keep their semantics explicit).
- `tests/helpers/db/db.helper.ts`: add `partnerType: "organization"` to `createTestPartner()`.

#### New suites — `tests/api/partner/auth/suites/`

**`partnerTypeIndividual.suite.ts`** (functional)
- IND-001: register as individual with valid 11-digit ID → 201, partner created with `partnerType: "individual"`, no `contactPerson` stored.
- IND-002: register as individual with 9-digit ID → 422 `personal_number_invalid`.
- IND-003: register as individual with `contactPerson` field present → 422 (or silently dropped — document behavior).
- IND-004: register as organization with 11-digit ID → 422 `id_code_invalid_org`.
- IND-005: register without `partnerType` → defaults to organization (back-compat).
- IND-006: register with `partnerType: "invalid"` → 422.
- IND-007: same `identificationCode` cannot register twice across types (uniqueness).
- IND-008: case sensitivity / whitespace on `partnerType` value.
- IND-009: individual person name accepts Georgian letters incl. apostrophe and hyphen.
- IND-010: individual person name with company-style chars (`&`, `.`) rejected.

**`partnerTypeSecurity.suite.ts`** (security)
- SEC-T-001: tamper attempt — send `partnerType` via JWT-stripped payload, server still derives correctly.
- SEC-T-002: type smuggling — `partnerType: ["individual","organization"]` (array) → rejected.
- SEC-T-003: extra props beyond branch schema (e.g., individual sending `contactPerson`) — strict rejection.
- SEC-T-004: prototype pollution: `partnerType: "__proto__"` → safe rejection.
- SEC-T-005: enormous personal number (1000-char string) → 422 not crash.
- SEC-T-006: SQL/NoSQL injection in name fields (`{ $gt: "" }`) → escaped/rejected.
- SEC-T-007: XSS payload in name (`<script>alert(1)</script>`) → stored escaped or rejected by regex.
- SEC-T-008: ReDoS attempt with pathological regex input on name fields.
- SEC-T-009: race condition — two parallel registrations with same email/idCode, exactly one succeeds.
- SEC-T-010: rate-limit: 100 rapid registration attempts from same IP throttled (if rate limit middleware exists; if not, document gap).

**`productOwnerType.suite.ts`** (admin product tests)
- POT-001: organization-owner adds product → product has `ownerType: "organization"`.
- POT-002: individual-owner adds product → product has `ownerType: "individual"`.
- POT-003: client-supplied `ownerType` in body is ignored — server derives from JWT.
- POT-004: GET /admin/products?ownerType=individual returns only individual-owned products.
- POT-005: GET /admin/products?ownerType=invalid → 422 or filter ignored (document choice).

Update `tests/api/admin/partners/suites/list.suite.ts` to cover:
- LIST-PT-001: filter `?partnerType=organization` returns only orgs.
- LIST-PT-002: filter `?partnerType=individual` returns only individuals.
- LIST-PT-003: no filter returns both types.

---

## 2. Public Web Frontend (`Khelovani-Web-Front`)

### 2.1 Types — `src/lib/types/partnerTypes.ts`

```ts
export type PartnerType = "organization" | "individual";

export interface PartnerRegisterData {
  partnerType: PartnerType;
  companyNameGe: string;
  companyNameEn: string;
  identificationCode: string;     // 9 or 11 digits depending on type
  contactPerson?: string;          // org only
  // ...rest unchanged
}

export interface Partner {
  // ...
  partnerType?: PartnerType;
}

export interface PartnerFilterState {
  // ...
  partnerType?: PartnerType | "";
}
```

### 2.2 Validation — `src/lib/validations/becomePartnerValidations.ts`

Branch on `formData.partnerType`:
- `companyNameGe/En`: same regex chain
- `identificationCode`: `/^\d{9}$/` for org, `/^\d{11}$/` for individual
- `contactPerson`: required iff org, ignored iff individual

Error keys: `id_code_invalid_org`, `personal_number_invalid`, `contact_required`.

### 2.3 New UI component — `src/components/ui/PartnerTypeToggle.tsx` + `.scss`

Segmented two-card selector at the top of the form:

```
┌─────────────────────────┐  ┌─────────────────────────┐
│  🏢                     │  │  👤                     │
│  ორგანიზაცია          │  │  ფიზიკური პირი       │
│  კომპანია, შპს, ი/მ │  │  დამოუკიდებელი ხელო│
└─────────────────────────┘  └─────────────────────────┘
```

- Two cards, single-select, default = organization
- Active card: deep-red border + filled tick
- Smooth 150ms transitions
- Keyboard accessible (radio semantics, arrow keys to switch)

### 2.4 Registration page — `src/app/(main)/become-partner/page.tsx`

1. Mount `<PartnerTypeToggle />` above the existing grid.
2. Compute conditional labels via `useClientTranslation`:
   - Name fields: `label.company_name_ge` ↔ `label.person_name_ge`
   - ID field: `label.identification_code` ↔ `label.personal_number`
   - ID placeholder/maxLength: 9 vs 11
3. Conditionally render `<TextInput id="contactPerson">` only when org.
4. On type switch:
   - Reset `identificationCode` and `contactPerson` to clear stale validation.
   - Don't reset name fields (the user may have typed them).

### 2.5 Header — `src/components/header/auth-component/`

After login, the auth context exposes `partnerType`. Show:
- Organization: 🏢 + companyNameGe
- Individual: 👤 + companyNameGe (their personal name)

If a "logged in as partner" badge already exists, swap the icon/style based on type. Do not add a new component if the existing one can take a prop.

### 2.6 Auth context — `src/contexts/AuthContext.tsx`

Extend `User`/`Partner` shape with `partnerType`. Hydration source already returns it via `/me`.

### 2.7 Public partner listing filter — `src/components/partnersPage/partnerListing/PartnerSidebar/PartnerFilters/PartnerFilters.tsx`

Add a new filter group above categories:
```
რეგისტრაციის ტიპი
[ ყველა ] [ 🏢 ორგანიზაცია ] [ 👤 ფიზიკური პირი ]
```
Wires into `PartnerFilterState.partnerType`, sent as `?partnerType=` query param.

### 2.8 Public partner card — `src/components/partnersPage/partnerListing/PartnerCard/PartnerCard.tsx`

Small badge under the name: 🏢 or 👤 + localized label.

### 2.9 Public products page

- Product card: a tiny "added by" badge — 🏢 / 👤.
- Filter sidebar (if exists): add `ownerType` chip filter mirroring partners. If product page doesn't have a filter sidebar, just badge on cards.

### 2.10 Web frontend tests — **NEW** `tests/e2e/`

Existing setup: Playwright is already configured. We need new specs.

**`tests/e2e/become-partner.spec.ts`** (functional)
- BP-001: page loads, default toggle = organization.
- BP-002: switch to individual → contact-person input disappears, ID maxLength becomes 11, label updates.
- BP-003: switch back to organization → contact-person reappears, validation reset.
- BP-004: submit empty form as org → all required errors render.
- BP-005: submit empty form as individual → no contact-person error, all others present.
- BP-006: submit org with 11-digit ID → `id_code_invalid_org`.
- BP-007: submit individual with 9-digit ID → `personal_number_invalid`.
- BP-008: submit individual with `contactPerson` somehow injected via DOM tools → server still rejects.
- BP-009: success flow — fill org form, submit, see success toast, redirect.
- BP-010: success flow — fill individual form, submit, see success toast, redirect.
- BP-011: language switch GE↔EN updates all labels including type toggle and conditional fields.

**`tests/e2e/become-partner-validation.spec.ts`** (per-field)
- Each field with bad input → specific error key renders.
- companyNameGe non-Georgian → `name_ge_letters_only`.
- companyNameEn non-Latin → `companyNameEn_invalid`.
- email malformed → `email_invalid`.
- phone wrong format → `phone_invalid`.
- categories: 0 selected → required; 6 selected → `category_too_many`.

**`tests/e2e/become-partner-security.spec.ts`** (security)
- SEC-001: XSS in companyNameGe (`<script>...`) → regex blocks before submit.
- SEC-002: tamper `partnerType` to `"__proto__"` via DevTools → backend 422.
- SEC-003: bypass disabled state by setting `disabled=false` in DOM → backend still validates.
- SEC-004: oversized payload (10MB description) → backend 413 or 422.
- SEC-005: rapid 50 submissions → backend rate limit kicks in (or document the gap).
- SEC-006: SQL/NoSQL operator strings in name (`{"$gt":""}`) → regex rejects.
- SEC-007: terms checkbox bypass — uncheck, send anyway via fetch → 422.
- SEC-008: same email registered twice → second attempt 409 with `email_already_exists`.
- SEC-009: same identificationCode (across both types) — second attempt 409.
- SEC-010: html injection in description renders as text not html on success page.

**`tests/e2e/header-after-login.spec.ts`**
- HD-001: logged-out header shows "Sign in" CTA.
- HD-002: org login → header shows 🏢 + name.
- HD-003: individual login → header shows 👤 + name.
- HD-004: logout clears the badge.

---

## 3. Admin Frontend (`Khelovani-Admin-Front`)

### 3.1 Types — `src/types/partner.types.ts`

```ts
export type PartnerType = "organization" | "individual";

export interface PartnerData {
  // ...
  partnerType?: PartnerType;
}
```

### 3.2 Types — `src/types/productTypes.ts`

```ts
export interface Product {
  // ...
  ownerType?: "organization" | "individual";
}
```

### 3.3 Partner listing — `src/pages/partnerListings/PartnerListing.tsx`

Add a filter dropdown next to the existing category/status filters:
```
[ ყველა ▼ | 🏢 ორგანიზაცია | 👤 ფიზიკური პირი ]
```
State key: `partnerTypeFilter`. Sent to API as `?partnerType=`.

### 3.4 Partner card (admin) — `src/components/partners/PartnerCard/PartnerCard.tsx`

Inline badge under company name:
```tsx
<span className={`partner-card__type-badge type--${partner.partnerType}`}>
  {partner.partnerType === "individual" ? "👤 ფიზიკური პირი" : "🏢 ორგანიზაცია"}
</span>
```

### 3.5 Partner detail page — `src/components/partners/detailed/PartnerHeader.tsx` + `PartnerInfoGrid.tsx`

- Header: badge prominently next to status pill.
- InfoGrid: label adapts ("საიდენტიფიკაციო კოდი" vs "პირადი ნომერი", "კონტაქტ პირი" hidden for individuals).
- Edit mode: `partnerType` is **read-only after registration** (changing it would conflict with stored ID code length). Document: to switch type, partner re-registers.

### 3.6 Product listing — `src/pages/products/listing/ProductListingPage.tsx` + `ProductFilters.tsx`

Add owner-type filter chip group:
```
პროდუქტის მფლობელი:  [ ყველა ] [ 🏢 ორგანიზაცია ] [ 👤 ფიზიკური პირი ]
```

### 3.7 Product table row — `src/components/products/listing/ProductTableRow.tsx`

Add a small badge in the existing info column (under the title):
```
სათაური ge / სათაური en
🏢 ორგანიზაციამ დაამატა
```

### 3.8 Product detail page — `src/pages/products/details/ProductDetailsPage.tsx`

Show owner-type badge near the owner section. Click → links to the partner detail page (already there if owner is populated).

### 3.9 Admin frontend tests — **Playwright**

#### Existing test fixtures
- `tests/helpers/api.helper.ts` `createPartner`: add `partnerType` parameter (default `"organization"`).
- `tests/helpers/organizer-setup.helper.ts`: parameterize `partnerType` for setup.
- `tests/helpers/product.helper.ts`: no change needed (server derives `ownerType`).

#### New suites under `tests/admin/partners/suites/`

**`partnerTypeFilter.spec.ts`**
- PT-FIL-001: default filter "all" shows both types.
- PT-FIL-002: filter "organization" hides individuals.
- PT-FIL-003: filter "individual" hides organizations.
- PT-FIL-004: filter persists across pagination.
- PT-FIL-005: combined filter (partnerType + category) intersects correctly.

**`partnerTypeDisplay.spec.ts`**
- PT-DIS-001: org partner card shows 🏢 badge.
- PT-DIS-002: individual partner card shows 👤 badge.
- PT-DIS-003: detail page header shows correct badge.
- PT-DIS-004: detail page hides contact-person row for individuals.
- PT-DIS-005: detail page label is "პირადი ნომერი" for individuals, "საიდენტიფიკაციო კოდი" for orgs.

**`partnerTypeSecurity.spec.ts`**
- PT-SEC-001: non-admin cannot access `?partnerType=` filter (auth check).
- PT-SEC-002: HTML injection in companyNameGe renders as text, not html.
- PT-SEC-003: cannot edit `partnerType` via inline form patch.
- PT-SEC-004: API responds 401 if JWT absent on listing endpoints.
- PT-SEC-005: query string `?partnerType=<script>` doesn't execute (escaped/rejected).

#### New suites under `tests/admin/products/suites/`

**`productOwnerTypeFilter.spec.ts`**
- POT-FIL-001: filter "organization" returns only org-owned products.
- POT-FIL-002: filter "individual" returns only individual-owned products.
- POT-FIL-003: combined filter (ownerType + category + search) intersects correctly.

**`productOwnerTypeDisplay.spec.ts`**
- POT-DIS-001: row badge displays correct icon per row.
- POT-DIS-002: detail page shows owner type next to owner link.
- POT-DIS-003: clicking owner navigates to partner detail.

**`productOwnerTypeSecurity.spec.ts`**
- POT-SEC-001: organizer cannot tamper `ownerType` on create — server overrides.
- POT-SEC-002: organizer cannot create product with `ownerType: "organization"` if they are individual — server-side ownerType from JWT wins.
- POT-SEC-003: deleting partner cascades / soft-deletes products correctly (existing behavior — verify still works after schema change).

---

## 4. File-by-file checklist

### Backend (`khelovani-Web-admin-Back`)
- `src/modules/organization.modules.ts` — add `partnerType`, relax `contactPerson` and `identificationCode` length.
- `src/modules/product.modules.ts` — add `ownerType`.
- `src/validations/schemas/orgPartner.schema.ts` — discriminated union for register + update.
- `src/controllers/partners/registerPartner.ts` — pass `partnerType` to create.
- `src/controllers/products/addProduct.ts` — derive `ownerType` from `req.user.partnerType`.
- `src/controllers/partners/getPublicPartners.ts` — filter by `partnerType`.
- `src/controllers/admin/partners/getPartners.ts` — filter by `partnerType`.
- `src/controllers/admin/products/getProducts.ts` — filter by `ownerType`.
- `src/controllers/auth/me.ts` (or equivalent) — include `partnerType`.
- `src/middleware/auth/*` — JWT payload includes `partnerType`.
- `src/utils/migrations/migratePartnerType.ts` (new) + runner + npm script.
- `src/utils/migrations/migrateProductOwnerType.ts` (new) + runner + npm script.
- All test fixtures + 4 new suites listed in 1.11.

### Public web (`Khelovani-Web-Front`)
- `src/lib/types/partnerTypes.ts`
- `src/lib/validations/becomePartnerValidations.ts`
- `src/components/ui/PartnerTypeToggle.tsx` (new) + `.scss`
- `src/app/(main)/become-partner/page.tsx`
- `src/contexts/AuthContext.tsx`
- `src/components/header/auth-component/*` — type-aware badge
- `src/components/partnersPage/partnerListing/PartnerSidebar/PartnerFilters/PartnerFilters.tsx`
- `src/components/partnersPage/partnerListing/PartnerCard/PartnerCard.tsx`
- `src/components/productsPage/productCard/ProductCard.tsx`
- `src/lib/hooks/usePartners.ts` — pass `partnerType` to API
- 4 new e2e specs listed in 2.10.

### Admin frontend (`Khelovani-Admin-Front`)
- `src/types/partner.types.ts`
- `src/types/productTypes.ts`
- `src/pages/partnerListings/PartnerListing.tsx` — filter UI
- `src/components/partners/PartnerCard/PartnerCard.tsx` — badge
- `src/components/partners/detailed/PartnerHeader.tsx` — badge
- `src/components/partners/detailed/PartnerInfoGrid.tsx` — conditional labels & rows
- `src/pages/products/listing/ProductListingPage.tsx` + `src/components/products/listing/ProductFilters.tsx` — filter
- `src/components/products/listing/ProductTableRow.tsx` — badge
- `src/pages/products/details/ProductDetailsPage.tsx` — badge
- 6 new Playwright specs listed in 3.9.

---

## 5. Translation keys

Checked against live DB (284 docs, 2026-04-27). DB already has a compound unique index on `{namespace, key}`.

### Already in DB — reuse these keys in code, do NOT re-add

| key to use in code | DB key to use | ge value |
|---|---|---|
| `inputs.label.personal_number` | `inputs.label.id_number` | პირადი ნომერი |
| `inputs.placeholder.personal_number` | `inputs.placeholder.id_number` | 11-ნიშნა პირადი ნომერი |
| `inputs.placeholder.id_code` | `inputs.placeholder.id_code` | 9-ნიშნა საიდენტიფიკაციო კოდი ✓ |
| `inputs.label.person_name_ge` | `inputs.label.full_name_ge` | სახელი და გვარი (ქართულად) |
| `inputs.label.person_name_en` | `inputs.label.full_name_en` | სახელი და გვარი (ლათინურად) |
| `inputs.placeholder.person_name` | `inputs.placeholder.full_name` | სახელი გვარი |
| `inputs.placeholder.person_name_en` | `inputs.placeholder.full_name` | სახელი გვარი |
| `validation.personal_number_invalid` | `validation.validation.id_number_length` | პირადი ნომერი უნდა შეიცავდეს ზუსტად 11 ციფრს |
| `validation.personal_number_required` | `validation.validation.id_number_required` | პირადი ნომერი სავალდებულოა |
| `validation.person_name_ge_letters_only` | `validation.validation.name_ge_letters` | სახელი (ქართულად) უნდა შეიცავდეს მხოლოდ ქართულ ასოებს |
| `validation.person_name_en_letters_only` | `validation.validation.name_en_letters` | სახელი (ინგლისურად) უნდა შეიცავდეს მხოლოდ ლათინურ ასოებს |
| `common.partner_type_filter_all` | `pages.status.all` | ყველა |
| `alerts.register_as_organization_success` | `auth.partner_registered` | ორგანიზაცია წარმატებით დარეგისტრირდა... |

### New keys to seed into DB (15 total — genuinely missing)

#### `inputs` namespace
```
label.partner_type                      ge: რეგისტრაციის ტიპი                    en: Registration type
label.partner_type_organization         ge: ორგანიზაცია                          en: Organization
label.partner_type_individual           ge: ფიზიკური პირი                        en: Individual
label.partner_type_organization_hint    ge: კომპანია, შპს, ი/მ                   en: Company, LLC, IE
label.partner_type_individual_hint      ge: დამოუკიდებელი ხელოსანი              en: Independent craftsman
```

#### `validation` namespace
```
id_code_invalid_org                     ge: საიდენტიფიკაციო კოდი უნდა შეიცავდეს ზუსტად 9 ციფრს    en: ID code must be exactly 9 digits
partner_type_invalid                    ge: რეგისტრაციის ტიპი არასწორია                              en: Registration type is invalid
contact_person_not_allowed_individual   ge: კონტაქტ პირი დასაშვებია მხოლოდ ორგანიზაციისთვის        en: Contact person is only allowed for organizations
```

#### `common` namespace
```
partner_type_filter_label               ge: რეგისტრაციის ტიპი                en: Registration type
partner_type_badge_organization         ge: ორგანიზაცია                      en: Organization
partner_type_badge_individual           ge: ფიზიკური პირი                    en: Individual
product_owner_organization              ge: ორგანიზაციამ დაამატა            en: Added by organization
product_owner_individual                ge: ფიზიკურმა პირმა დაამატა         en: Added by individual
product_owner_filter_label              ge: პროდუქტის მფლობელი              en: Product owner
```

#### `alerts` namespace
```
register_as_individual_success          ge: ფიზიკური პირი წარმატებით დარეგისტრირდა    en: Individual registered successfully
```

---

## 6. Execution order (so nothing breaks mid-way)

1. Backend schema + Zod (D1, D2) — backend tests still green because default = organization.
2. Backend migrations — run on dev DB, verify spot-checks.
3. Backend `addProduct` controller derives `ownerType`. Run product migration.
4. JWT/me endpoint exposes `partnerType`.
5. Backend new test suites (all pass before touching frontend).
6. Public web types + validation + new toggle component.
7. Public web `become-partner` page integration.
8. Public web header / auth context.
9. Public web partner listing filter + card badge.
10. Public web product card badge.
11. Public web e2e specs.
12. Admin frontend types.
13. Admin frontend partner listing filter + card + detail.
14. Admin frontend product listing filter + row + detail.
15. Admin frontend Playwright specs.
16. Full TS check across all three projects.
17. Translation keys handed off to user.

---

## 7. Verification checklist

- [ ] `migrate:partner-type` then `migrate:product-owner-type` run cleanly on staging.
- [ ] Existing org partner can still register (default partnerType, back-compat).
- [ ] New individual can register, log in, add a product, see their type in admin.
- [ ] Admin partner listing filter works with pagination + other filters.
- [ ] Admin product listing filter works with pagination + other filters.
- [ ] Detail pages show correct labels per type.
- [ ] Header in public web swaps icon/label after login.
- [ ] All three TS projects compile clean.
- [ ] Backend `npm test` green; web e2e green; admin Playwright green.
- [ ] Security suites: cannot tamper type, cannot inject XSS/NoSQL, cannot bypass disabled fields.
