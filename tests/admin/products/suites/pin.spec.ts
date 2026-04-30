import { test, expect } from "../../../fixtures/auth.fixture";
import { ProductsPage } from "../../../pages/ProductsPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { createTestProduct, searchProduct } from "../../../helpers/product.helper";

export const productsPinTests = () => {
  test.describe("Admin — Products › Pin", () => {
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
        try { await api.deleteProduct(id); } catch {}
      }
      createdIds = [];
    });

    // ── Listing row ────────────────────────────────────────────────────────

    test("pin button visible on visible product row for admin", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, { isShown: true });
      createdIds.push(product.id);

      const row = await searchProduct(page, product.titleEn!);
      await expect(row.locator(".pin-btn")).toBeVisible();
    });

    test("pin button disabled on hidden product row", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, { isShown: false });
      createdIds.push(product.id);

      const row = await searchProduct(page, product.titleEn!);
      await expect(row.locator(".pin-btn")).toBeDisabled();
    });

    test("clicking pin toggles button to active state and shows success toast", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, { isShown: true });
      createdIds.push(product.id);

      const row = await searchProduct(page, product.titleEn!);
      await expect(row.locator(".pin-btn")).not.toHaveClass(/active/);

      const patchPromise = page.waitForResponse(
        (r) => r.url().includes("/pin") && r.request().method() === "PATCH",
      );
      await row.locator(".pin-btn").click();
      await patchPromise;

      await expect(row.locator(".pin-btn")).toHaveClass(/active/);
      await expect(page.getByText("პროდუქტი დაიპინა")).toBeVisible({ timeout: 6000 });
    });

    test("clicking unpin removes active state and shows success toast", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, { isShown: true });
      createdIds.push(product.id);
      await api.pinProduct(product.id, true);

      const row = await searchProduct(page, product.titleEn!);
      await expect(row.locator(".pin-btn")).toHaveClass(/active/);

      const patchPromise = page.waitForResponse(
        (r) => r.url().includes("/pin") && r.request().method() === "PATCH",
      );
      await row.locator(".pin-btn").click();
      await patchPromise;

      await expect(row.locator(".pin-btn")).not.toHaveClass(/active/);
      await expect(page.getByText("პინი მოიხსნა")).toBeVisible({ timeout: 6000 });
    });

    test("pinned row gets .pinned class for highlight styling", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, { isShown: true });
      createdIds.push(product.id);
      await api.pinProduct(product.id, true);

      const row = await searchProduct(page, product.titleEn!);
      await expect(row).toHaveClass(/pinned/);
    });

    // ── Details page ───────────────────────────────────────────────────────

    test("pin button visible on details page for visible product", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, { isShown: true });
      createdIds.push(product.id);

      await page.goto(`/products/${product.id}`);
      await expect(page.locator(".pin-details-btn")).toBeVisible();
      await expect(page.locator(".pin-details-btn")).not.toBeDisabled();
    });

    test("pin button disabled on details page for hidden product", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, { isShown: false });
      createdIds.push(product.id);

      await page.goto(`/products/${product.id}`);
      await expect(page.locator(".pin-details-btn")).toBeDisabled();
    });

    test("pin from details page toggles active state", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, { isShown: true });
      createdIds.push(product.id);

      await page.goto(`/products/${product.id}`);
      const pinBtn = page.locator(".pin-details-btn");
      await expect(pinBtn).not.toHaveClass(/active/);

      const patchPromise = page.waitForResponse(
        (r) => r.url().includes("/pin") && r.request().method() === "PATCH",
      );
      await pinBtn.click();
      await patchPromise;

      await expect(pinBtn).toHaveClass(/active/);
      await expect(page.getByText("პროდუქტი დაიპინა")).toBeVisible({ timeout: 6000 });
    });

    test("hiding a pinned product disables pin button immediately", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, { isShown: true });
      createdIds.push(product.id);
      await api.pinProduct(product.id, true);

      await page.goto(`/products/${product.id}`);
      const pinBtn = page.locator(".pin-details-btn");
      await expect(pinBtn).toHaveClass(/active/);

      // Hide the product via the toggle button
      const patchPromise = page.waitForResponse(
        (r) => r.url().includes(`/api/products/${product.id}`) && r.request().method() === "PATCH",
      );
      await page.locator(".toggle-details-btn").click();
      await patchPromise;

      await expect(pinBtn).toBeDisabled();
    });
  });
};
