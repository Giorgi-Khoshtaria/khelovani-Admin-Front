import { test, expect } from "../../../fixtures/auth.fixture";
import { ProductsPage } from "../../../pages/ProductsPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { createTestProduct } from "../../../helpers/product.helper";

test.describe("Admin — Products › Listing", () => {
  let productsPage: ProductsPage;
  let api: ApiHelper;
  let testPartnerId: string;
  let createdIds: string[] = [];

  test.beforeEach(async ({ asAdmin: page }) => {
    productsPage = new ProductsPage(page);
    api = new ApiHelper();
    await api.login();
    testPartnerId = resolveTestPartnerId();
    await productsPage.goto();
  });

  test.afterEach(async () => {
    for (const id of createdIds) {
      try {
        await api.deleteProduct(id);
      } catch {}
    }
    createdIds = [];
  });

  test("lists all products and shows status", async ({ asAdmin: page }) => {
    const product = await createTestProduct(api, testPartnerId);
    if (product.id) createdIds.push(product.id);
    await page.reload();
    const row = page
      .locator(".product-row")
      .filter({ hasText: product.titleEn! })
      .first();
    await expect(row).toBeVisible();
    await expect(row.locator(".col-status")).toBeVisible();
  });

  test("admin cannot add or edit products", async ({ asAdmin: page }) => {
    await expect(page.locator(".add-product-btn")).not.toBeVisible();
    // Optionally: try to navigate to add/edit and expect redirect or error
  });

  // Add more: filter, search, pagination, etc.
});
