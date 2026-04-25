import { test, expect } from "../../../fixtures/auth.fixture";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { createTestProduct } from "../../../helpers/product.helper";

export const productsAccessTests = () => {
  test.describe("Admin — Products › Access Control", () => {
    let api: ApiHelper;
    let testPartnerId: string;
    let createdIds: string[] = [];

    test.beforeEach(async () => {
      api = new ApiHelper();
      await api.login();
      testPartnerId = resolveTestPartnerId();
    });

    test.afterEach(async () => {
      for (const id of createdIds) {
        try {
          await api.deleteProduct(id);
        } catch {}
      }
      createdIds = [];
    });

    test("admin can open global /products listing", async ({ asAdmin: page }) => {
      await page.goto("/products");
      await expect(page.locator(".product-listing-page")).toBeVisible();
      await expect(page.locator("h1")).toContainText("ყველა პროდუქტი");
    });

    test("admin can open partner-scoped /partners/:id/products listing", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      await page.goto(`/partners/${testPartnerId}/products`);
      await expect(page.locator(".product-listing-page")).toBeVisible();
    });

    test("admin does NOT see Add Product button on global listing", async ({
      asAdmin: page,
    }) => {
      await page.goto("/products");
      await expect(page.locator(".add-product-btn")).not.toBeVisible();
    });

    test("admin does NOT see Add Product button on partner-scoped listing", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      await page.goto(`/partners/${testPartnerId}/products`);
      await expect(page.locator(".add-product-btn")).not.toBeVisible();
    });

    test("admin sees Toggle Visibility button on details page", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `Access_Toggle_${Date.now()}`,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".toggle-details-btn")).toBeVisible();
    });

    test("admin sees Delete button on details page", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `Access_Delete_${Date.now()}`,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".delete-details-btn")).toBeVisible();
    });

    test("admin does NOT see Edit button on details page", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `Access_NoEdit_${Date.now()}`,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".edit-details-btn")).not.toBeVisible();
    });

    test("admin row shows toggle button (not edit button) in product list", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `Access_RowBtn_${Date.now()}`,
      });
      createdIds.push(product.id);
      await page.goto("/products");
      const row = page
        .locator(".product-row")
        .filter({ hasText: product.titleEn! })
        .first();
      await expect(row.locator(".toggle-btn")).toBeVisible({ timeout: 10000 });
      await expect(row.locator(".edit-btn")).not.toBeVisible();
    });

    test("unauthenticated user is redirected to login from /products", async ({
      browser,
    }) => {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.goto("/products");
      await expect(page).toHaveURL(/login/, { timeout: 8000 });
      await ctx.close();
    });
  });
};
