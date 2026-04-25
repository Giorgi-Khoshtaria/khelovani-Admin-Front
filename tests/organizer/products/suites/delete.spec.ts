import { test, expect } from "../../../fixtures/auth.fixture";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId, loadOrganizerPassword } from "../../../helpers/auth.helper";
import { createTestProduct, searchProduct } from "../../../helpers/product.helper";
import { assertSuccessToast } from "../../../helpers/validation-assertions.helper";

export const organizerDeleteTests = () => {
  test.describe("Organizer — Products › Delete", () => {
    let api: ApiHelper;
    let partnerId: string;
    let createdIds: string[] = [];

    test.beforeAll(async () => {
      api = new ApiHelper();
      await api.login(process.env.ORGANIZER_EMAIL, loadOrganizerPassword());
      partnerId = resolveTestPartnerId();
    });

    test.afterEach(async () => {
      for (const id of createdIds) {
        try {
          await api.deleteProduct(id);
        } catch {}
      }
      createdIds = [];
    });

    test("organizer can delete own product → success toast + row gone", async ({
      asOrganizer: page,
    }) => {
      if (!partnerId) { test.skip(); return; }

      const product = await createTestProduct(api, partnerId, {
        titleGe: "წაშლა",
        titleEn: `OrgDel_${Date.now()}`,
        descriptionGe: "წაშლის სატესტო პროდუქტი",
        descriptionEn: "Organizer delete test product",
        price: 5,
      });
      if (product.id) createdIds.push(product.id);

      const loadPromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.goto("/profile/products");
      await loadPromise;

      const row = await searchProduct(page, product.titleEn!);
      await expect(row).toBeVisible();

      await row.click();
      await expect(page.locator(".product-details-page")).toBeVisible({
        timeout: 8000,
      });

      page.once("dialog", (d) => d.accept());
      const deletePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") &&
          r.request().method() === "DELETE",
      );
      await page.locator(".delete-details-btn").click();
      await deletePromise;
      await assertSuccessToast(page);
      createdIds = [];
    });

    test("cancelling delete dialog keeps the product on details page", async ({
      asOrganizer: page,
    }) => {
      if (!partnerId) { test.skip(); return; }

      const product = await createTestProduct(api, partnerId, {
        titleGe: "გაუქმება",
        titleEn: `OrgCancel_${Date.now()}`,
        descriptionGe: "გაუქმების სატესტო პროდუქტი",
        descriptionEn: "Cancel delete test product",
        price: 5,
      });
      if (product.id) createdIds.push(product.id);

      const loadPromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.goto("/profile/products");
      await loadPromise;

      const row = await searchProduct(page, product.titleEn!);
      await expect(row).toBeVisible();

      await row.click();
      await expect(page.locator(".product-details-page")).toBeVisible({
        timeout: 8000,
      });

      page.once("dialog", (d) => d.dismiss());
      await page.locator(".delete-details-btn").click();

      await expect(page.locator(".product-details-page")).toBeVisible({
        timeout: 3000,
      });
    });
  });
};
