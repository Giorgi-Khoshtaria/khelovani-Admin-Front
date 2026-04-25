import { test, expect } from "../../../fixtures/auth.fixture";
import { ProductsPage } from "../../../pages/ProductsPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { expectSuccessToast } from "../../../helpers/validation.helper";
import {
  searchProduct,
  createTestProduct,
} from "../../../helpers/product.helper";

export const productsDeleteTests = () => {
  test.describe("Admin — Products › Delete", () => {
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
        } catch {
          /* skip */
        }
      }
      createdIds = [];
    });

    test("delete product from list → success toast + row gone", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) {
        test.skip();
        return;
      }

      const product = await createTestProduct(api, testPartnerId, {
        titleGe: "წაშლა",
        titleEn: `Delete_${Date.now()}`,
        descriptionGe: "წაშლის სატესტო აღწერა",
        descriptionEn: "Delete test description",
        price: 5,
      });
      if (product.id) createdIds.push(product.id);

      const loadPromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.reload();
      await loadPromise;
      const row = await searchProduct(page, product.titleEn!);
      await expect(row).toBeVisible();

      page.once("dialog", async (d) => {
        expect(d.message()).toContain("ნამდვილად გსურთ");
        await d.accept();
      });
      const deletePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") &&
          r.request().method() === "DELETE",
      );
      const refreshPromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await row.locator(".delete-btn").click();
      await deletePromise;
      await expectSuccessToast(page);
      await refreshPromise;
      await expect(row).not.toBeVisible();
      createdIds = [];
    });

    test("cancelling delete dialog keeps the product in the list", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) {
        test.skip();
        return;
      }

      const product = await createTestProduct(api, testPartnerId, {
        titleGe: "გაუქმება",
        titleEn: `Cancel_${Date.now()}`,
        descriptionGe: "გაუქმების სატესტო აღწერა",
        descriptionEn: "Cancel test description",
        price: 5,
      });
      if (product.id) createdIds.push(product.id);

      const loadPromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.reload();
      await loadPromise;
      const row = await searchProduct(page, product.titleEn!);
      await expect(row).toBeVisible();

      page.once("dialog", (d) => d.dismiss());
      await row.locator(".delete-btn").click();

      await expect(row).toBeVisible();
    });
  });
};
