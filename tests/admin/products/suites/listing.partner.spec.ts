import { test, expect } from "../../../fixtures/auth.fixture";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { createTestProduct, searchProduct } from "../../../helpers/product.helper";

export const productsPartnerListingTests = () => {
  test.describe("Admin — Products › Partner-Scoped Listing", () => {
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

    test("shows heading 'პროდუქტები' not 'ყველა პროდუქტი'", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      await page.goto(`/partners/${testPartnerId}/products`);
      const heading = page.locator("h1");
      await expect(heading).toContainText("პროდუქტები");
      await expect(heading).not.toContainText("ყველა პროდუქტი");
    });

    test("back button is visible and labeled for partner profile", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      await page.goto(`/partners/${testPartnerId}/products`);
      const backBtn = page.locator(".back-btn");
      await expect(backBtn).toBeVisible();
      await expect(backBtn).toContainText("პარტნიორის პროფილზე");
    });

    test("back button navigates to /partners/:id", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      await page.goto(`/partners/${testPartnerId}/products`);
      await page.locator(".back-btn").click();
      await expect(page).toHaveURL(
        new RegExp(`/partners/${testPartnerId}$`),
        { timeout: 8000 },
      );
    });

    test("partner dropdown filter is NOT shown on scoped view", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      await page.goto(`/partners/${testPartnerId}/products`);
      await expect(page.locator("select.filters__select")).not.toBeVisible();
    });

    test("API request targets /api/products/partner/:id", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const [response] = await Promise.all([
        page.waitForResponse(
          (r) =>
            r.url().includes(`/api/products/partner/${testPartnerId}`) &&
            r.request().method() === "GET",
        ),
        page.goto(`/partners/${testPartnerId}/products`),
      ]);
      expect(response.status()).toBe(200);
    });

    test("row click navigates to /partners/:id/products/:productId", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `PartnerNav_${Date.now()}`,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products`);
      const row = await searchProduct(page, product.titleEn!);
      await row.click();
      await expect(page).toHaveURL(
        new RegExp(`/partners/${testPartnerId}/products/${product.id}`),
        { timeout: 8000 },
      );
      await expect(page.locator(".product-details-page")).toBeVisible();
    });

  });
};
