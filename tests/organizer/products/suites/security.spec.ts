import { test, expect } from "../../../fixtures/auth.fixture";
import {
  callApiAs,
  expectForbidden,
  XSS_PAYLOADS,
} from "../../../helpers/security.helper";
import { assertNoXssDialog } from "../../../helpers/validation-assertions.helper";

export const organizerProductSecurityTests = () => {
  test.describe("Organizer — Products › Security", () => {
    // ── Role escalation via API ────────────────────────────────────────────

    test("organizer token on GET /api/products (global admin list) → 403/404", async () => {
      const res = await callApiAs("organizer", {
        method: "GET",
        url: "/api/products",
      });
      expectForbidden(res.status);
    });

    test("organizer token on GET /api/admin/partners → 403/404", async () => {
      const res = await callApiAs("organizer", {
        method: "GET",
        url: "/api/admin/partners",
      });
      expectForbidden(res.status);
    });

    test("organizer token on GET /api/admin/roles → 403/404", async () => {
      const res = await callApiAs("organizer", {
        method: "GET",
        url: "/api/admin/roles",
      });
      expectForbidden(res.status);
    });

    test("organizer token on GET /api/admin/translations → 403/404", async () => {
      const res = await callApiAs("organizer", {
        method: "GET",
        url: "/api/admin/translations",
      });
      expectForbidden(res.status);
    });

    // ── XSS stored: client should block before it reaches the server ──────

    for (const payload of XSS_PAYLOADS) {
      test(`XSS in titleGe [${payload.slice(0, 20)}] → no alert dialog fires`, async ({
        asOrganizer: page,
      }) => {
        await page.goto("/profile/products/add");
        await assertNoXssDialog(page, async () => {
          await page.locator('input[name="titleGe"]').fill(payload);
          await page.locator("button.save-btn").click();
          await page.waitForTimeout(600);
        });
        await expect(page).toHaveURL(/\/profile\/products\/(add|new|\w+\/edit)/, {
          timeout: 3000,
        });
      });
    }

    // ── NoSQL operator injection in search ────────────────────────────────

    test('search with NoSQL payload {"$gt":""} → no server crash', async ({
      asOrganizer: page,
    }) => {
      await page.goto("/profile/products");
      const searchInput = page.locator("input.filters__input");
      if (!(await searchInput.isVisible())) { test.skip(); return; }
      await searchInput.fill('{"$gt":""}');
      await page.waitForTimeout(700);
      await expect(page).not.toHaveURL(/error|crash/);
      await expect(
        page.locator(".product-row, .empty-state").first(),
      ).toBeVisible({ timeout: 6000 });
    });
  });
};
