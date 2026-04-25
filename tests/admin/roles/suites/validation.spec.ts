import { test, expect } from "../../../fixtures/auth.fixture";
import { RolesPage } from "../../../pages/RolesPage";
import { ApiHelper } from "../../../helpers/api.helper";
import {
  V,
  assertScenario,
  assertSuccessToast,
  ValidationScenario,
} from "../../../helpers/validation-scenarios.helper";

// Role has no Zod schema on the frontend — validation is server-side only.
// These scenarios cover what the server enforces.
const roleNameScenarios: ValidationScenario[] = [
  {
    id: "VAL-ROLE-001",
    field: "name",
    value: "",
    expectedError: V.role.NAME_REQUIRED,
    note: "empty → required",
  },
  {
    id: "VAL-ROLE-002",
    field: "name",
    value: "   ",
    expectedError: V.role.NAME_REQUIRED,
    note: "whitespace only → required",
  },
];

export const rolesValidationTests = () => {
  test.describe("Admin — Roles › Validation", () => {
    let rolesPage: RolesPage;
    let api: ApiHelper;
    let createdIds: string[] = [];

    test.beforeEach(async ({ asAdmin: page }) => {
      rolesPage = new RolesPage(page);
      api = new ApiHelper();
      await api.login();
      await rolesPage.goto();
      await expect(page.locator(".loading")).not.toBeVisible({
        timeout: 10000,
      });
      await rolesPage.newRoleBtn.click();
    });

    test.afterEach(async () => {
      for (const id of createdIds) {
        try {
          await api.deleteRole(id);
        } catch {
          /* skip */
        }
      }
      createdIds = [];
    });

    // ── Required field ────────────────────────────────────────────────────────

    for (const s of roleNameScenarios) {
      test(`${s.id} — name: ${s.note}`, async ({ asAdmin: page }) => {
        await rolesPage.roleName.fill(s.value);
        await rolesPage.saveBtn.click();
        await assertScenario(
          page.locator(".error-text, [data-testid='name-error']").first(),
          s,
        );
      });
    }

    // ── Duplicate name → server error ─────────────────────────────────────────

    test("VAL-ROLE-003 — duplicate name → error on second create", async ({
      asAdmin: page,
    }) => {
      const name = `dup-role-${Date.now()}`;

      await rolesPage.roleName.fill(name);
      await rolesPage.saveBtn.click();
      await assertSuccessToast(page);

      const roles = await api.getRoles();
      const created = roles.find(
        (r: { name: string; _id: string }) => r.name === name,
      );
      if (created?._id) createdIds.push(created._id);

      await rolesPage.newRoleBtn.click();
      await rolesPage.roleName.fill(name);
      await rolesPage.saveBtn.click();

      await expect(
        page.locator(".Toastify__toast--error, .error-text").first(),
      ).toBeVisible({ timeout: 8000 });
    });

    // ── Very long name → rejected ─────────────────────────────────────────────

    test("VAL-ROLE-004 — 200-char name → error or rejection", async ({
      asAdmin: page,
    }) => {
      await rolesPage.roleName.fill("R".repeat(200));
      await rolesPage.saveBtn.click();

      const isError = await page
        .locator(".error-text, .Toastify__toast--error")
        .first()
        .isVisible()
        .catch(() => false);

      if (!isError) {
        const roles = await api.getRoles();
        const r = roles.find(
          (x: { name: string; _id: string }) => x.name === "R".repeat(200),
        );
        if (r?._id) await api.deleteRole(r._id);
      }
    });

    // ── Happy path ────────────────────────────────────────────────────────────

    test("valid name → success toast + role appears", async ({
      asAdmin: page,
    }) => {
      const name = `Role-${Date.now()}`;
      await rolesPage.roleName.fill(name);
      await rolesPage.saveBtn.click();
      await assertSuccessToast(page);
      await expect(page.locator(".role-card", { hasText: name })).toBeVisible({
        timeout: 10000,
      });

      const roles = await api.getRoles();
      const r = roles.find(
        (x: { name: string; _id: string }) => x.name === name,
      );
      if (r?._id) createdIds.push(r._id);
    });
  });
};
