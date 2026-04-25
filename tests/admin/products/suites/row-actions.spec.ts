import { test, expect } from "../../../fixtures/auth.fixture";
import { ProductsPage } from "../../../pages/ProductsPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { createTestProduct, searchProduct } from "../../../helpers/product.helper";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const productsRowActionsTests = () => {
  test.describe("Admin — Products › Row Actions", () => {
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

    // ── Toggle visibility ──────────────────────────────────────────────────

    test("toggle from visible → hidden: PATCH fires, status flips, success toast", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `ToggleHide_${Date.now()}`,
        isShown: true,
      });
      createdIds.push(product.id);

      const row = await searchProduct(page, product.titleEn!);
      await expect(row.locator(".status-pill")).toHaveClass(/visible/);

      const patchPromise = page.waitForResponse(
        (r) =>
          r.url().includes(`/api/products/${product.id}`) &&
          r.request().method() === "PATCH",
      );
      await row.locator(".toggle-btn").click();
      await patchPromise;

      await expectSuccessToast(page, "პროდუქტი დაიმალა");
      await expect(row.locator(".status-pill")).toHaveClass(/hidden/);
      await expect(row.locator(".status-pill")).toContainText("დამალული");
    });

    test("toggle from hidden → visible: PATCH fires, status flips, success toast", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `ToggleShow_${Date.now()}`,
        isShown: false,
      });
      createdIds.push(product.id);

      const row = await searchProduct(page, product.titleEn!);
      await expect(row.locator(".status-pill")).toHaveClass(/hidden/);

      const patchPromise = page.waitForResponse(
        (r) =>
          r.url().includes(`/api/products/${product.id}`) &&
          r.request().method() === "PATCH",
      );
      await row.locator(".toggle-btn").click();
      await patchPromise;

      await expectSuccessToast(page, "პროდუქტი გამოჩნდა");
      await expect(row.locator(".status-pill")).toHaveClass(/visible/);
      await expect(row.locator(".status-pill")).toContainText("საჯარო");
    });

    test("toggle: clicking button does NOT navigate away from listing", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `ToggleNoNav_${Date.now()}`,
        isShown: true,
      });
      createdIds.push(product.id);

      const row = await searchProduct(page, product.titleEn!);
      const patchPromise = page.waitForResponse(
        (r) =>
          r.url().includes(`/api/products/${product.id}`) &&
          r.request().method() === "PATCH",
      );
      await row.locator(".toggle-btn").click();
      await patchPromise;

      await expect(page).toHaveURL(/\/products/);
      await expect(page.locator(".product-listing-page")).toBeVisible();
    });

    // ── Delete from row ────────────────────────────────────────────────────

    test("delete: confirm dialog shown with Georgian message", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `DelDialog_${Date.now()}`,
      });
      createdIds.push(product.id);

      const row = await searchProduct(page, product.titleEn!);

      let dialogMessage = "";
      page.once("dialog", async (d) => {
        dialogMessage = d.message();
        await d.dismiss();
      });
      await row.locator(".delete-btn").click();
      expect(dialogMessage).toContain("ნამდვილად გსურთ");
    });

    test("clicking delete button does NOT navigate (stopPropagation)", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `StopProp_${Date.now()}`,
      });
      createdIds.push(product.id);

      const row = await searchProduct(page, product.titleEn!);

      page.once("dialog", (d) => d.dismiss());
      await row.locator(".delete-btn").click();

      // Should still be on listing page
      await expect(page.locator(".product-listing-page")).toBeVisible();
      await expect(page).toHaveURL(/\/products/);
    });
  });
};
