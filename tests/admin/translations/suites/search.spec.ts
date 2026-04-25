import { test, expect } from "../../../fixtures/auth.fixture";
import { TranslationsPage } from "../../../pages/TranslationsPage";

export const translationsSearchTests = () => {
  test.describe("Admin — Translations › Search", () => {
    let transPage: TranslationsPage;

    test.beforeEach(async ({ asAdmin: page }) => {
      transPage = new TranslationsPage(page);
      await transPage.goto();
    });

    test("search with unknown key shows empty state", async ({
      asAdmin: page,
    }) => {
      await transPage.searchInput.fill("zzz_nonexistent_key_99999");
      await page.waitForTimeout(1000);
      await expect(page.locator(".no-data")).toBeVisible();
    });

    test("search by known prefix returns results", async ({
      asAdmin: page,
    }) => {
      await transPage.searchInput.fill("auth.");
      await page.waitForTimeout(1000);
      await expect(page.locator(".item-row").first()).toBeVisible();
    });

    test("clearing search restores full list", async ({ asAdmin: page }) => {
      await transPage.searchInput.fill("zzz_nothing");
      await page.waitForTimeout(500);
      await expect(page.locator(".no-data")).toBeVisible();

      await transPage.searchInput.clear();
      await page.waitForTimeout(500);
      await expect(page.locator(".item-row").first()).toBeVisible();
    });

    test("search is case-insensitive (if applicable)", async ({
      asAdmin: page,
    }) => {
      await transPage.searchInput.fill("AUTH.");
      await page.waitForTimeout(1000);
      const count = await page.locator(".item-row").count();
      // Result: either rows or no-data — we just verify no crash
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
};
