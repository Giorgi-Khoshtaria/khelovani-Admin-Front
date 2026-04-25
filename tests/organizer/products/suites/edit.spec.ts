import { test, expect } from "../../../fixtures/auth.fixture";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId, loadOrganizerPassword } from "../../../helpers/auth.helper";
import { createTestProduct } from "../../../helpers/product.helper";
import { assertSuccessToast } from "../../../helpers/validation-assertions.helper";

export const editTests = () => {
  test.describe("Organizer — Products › Edit", () => {
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

    test("organizer can navigate to own product edit page", async ({
      asOrganizer: page,
    }) => {
      if (!partnerId) { test.skip(); return; }
      const product = await createTestProduct(api, partnerId, {
        titleEn: `EditNav_${Date.now()}`,
      });
      if (product.id) createdIds.push(product.id);

      await page.goto(`/profile/products/${product.id}/edit`);
      await expect(page).toHaveURL(/\/profile\/products\/.+\/edit/);
      await expect(
        page.locator('input[name="titleGe"], input[name="titleEn"]').first(),
      ).toBeVisible({ timeout: 8000 });
    });

    test("organizer can update titleGe and save → success toast", async ({
      asOrganizer: page,
    }) => {
      if (!partnerId) { test.skip(); return; }
      const product = await createTestProduct(api, partnerId, {
        titleGe: "რედაქტირება",
        titleEn: `EditSave_${Date.now()}`,
        descriptionGe: "რედაქტირების სატესტო პროდუქტი",
        descriptionEn: "Edit test product description",
        price: 10,
      });
      if (product.id) createdIds.push(product.id);

      await page.goto(`/profile/products/${product.id}/edit`);
      await expect(page).toHaveURL(/\/profile\/products\/.+\/edit/);

      const titleGeInput = page.locator('input[name="titleGe"]');
      await expect(titleGeInput).toBeVisible({ timeout: 8000 });
      await titleGeInput.fill("განახლებული");

      await page.locator("button.save-btn").click();
      await assertSuccessToast(page);
    });

    test("organizer cannot navigate to another partner's product edit page", async ({
      asOrganizer: page,
    }) => {
      const fakePartnerId = "000000000000000000000001";
      const fakeProductId = "000000000000000000000002";
      await page.goto(
        `/partners/${fakePartnerId}/products/${fakeProductId}/edit`,
      );
      await expect(page).not.toHaveURL(
        /\/partners\/000000000000000000000001\/products\/.+\/edit/,
        { timeout: 8000 },
      );
    });
  });
};
