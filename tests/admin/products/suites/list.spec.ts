import { test, expect } from "../../../fixtures/auth.fixture";
import { ProductsPage } from "../../../pages/ProductsPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { createTestProduct, searchProduct } from "../../../helpers/product.helper";

export const productsListTests = () => {
  test.describe("Admin — Products › Global Listing", () => {
    let productsPage: ProductsPage;
    let api: ApiHelper;
    let testPartnerId: string;
    let createdIds: string[] = [];

    test.beforeEach(async ({ asAdmin: page }) => {
      productsPage = new ProductsPage(page);
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

    test("shows heading 'ყველა პროდუქტი' on global view", async ({
      asAdmin: page,
    }) => {
      await productsPage.goto();
      await expect(page.locator("h1")).toContainText("ყველა პროდუქტი");
    });

    test("back button is absent on global admin view", async ({
      asAdmin: page,
    }) => {
      await productsPage.goto();
      await expect(page.locator(".back-btn")).not.toBeVisible();
    });

    test("count-badge is visible and numeric", async ({ asAdmin: page }) => {
      await productsPage.goto();
      const badge = page.locator(".count-badge");
      await expect(badge).toBeVisible();
      const text = await badge.textContent();
      expect(Number(text?.trim())).toBeGreaterThanOrEqual(0);
    });

    test("shows loading state then renders product list", async ({
      asAdmin: page,
    }) => {
      await page.goto("/products");
      await expect(page.locator(".product-listing-page")).toBeVisible();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await expect(
        page.locator(".products-list, .empty-state"),
      ).toBeVisible();
    });

    test("product row shows title, category, status, price, stock", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `RowCols_${Date.now()}`,
        titleGe: "სვეტები",
        price: 99,
        isShown: true,
        stockQuantity: 5,
      });
      createdIds.push(product.id);
      await productsPage.goto();
      const row = await searchProduct(page, product.titleEn!);
      await expect(row).toBeVisible();
      await expect(row.locator(".col-category")).toBeVisible();
      await expect(row.locator(".col-status")).toBeVisible();
      await expect(row.locator(".col-price")).toBeVisible();
      await expect(row.locator(".col-stock")).toBeVisible();
      await expect(row.locator(".col-image img")).toBeVisible();
    });

    test("visible product row has status pill 'საჯარო'", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `StatusVisible_${Date.now()}`,
        isShown: true,
      });
      createdIds.push(product.id);
      await productsPage.goto();
      const row = await searchProduct(page, product.titleEn!);
      await expect(row.locator(".status-pill")).toContainText("საჯარო");
      await expect(row.locator(".status-pill")).toHaveClass(/visible/);
    });

    test("hidden product row has status pill 'დამალული'", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `StatusHidden_${Date.now()}`,
        isShown: false,
      });
      createdIds.push(product.id);
      await productsPage.goto();
      const row = await searchProduct(page, product.titleEn!);
      await expect(row.locator(".status-pill")).toContainText("დამალული");
      await expect(row.locator(".status-pill")).toHaveClass(/hidden/);
    });

    test("row click navigates to /products/:productId", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `RowNav_${Date.now()}`,
      });
      createdIds.push(product.id);
      await productsPage.goto();
      const row = await searchProduct(page, product.titleEn!);
      await row.click();
      await expect(page).toHaveURL(
        new RegExp(`/products/${product.id}`),
        { timeout: 8000 },
      );
      await expect(page.locator(".product-details-page")).toBeVisible();
    });

  });
};
