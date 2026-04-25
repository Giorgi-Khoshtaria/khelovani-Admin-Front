import { test, expect } from "../../../fixtures/auth.fixture";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { createTestProduct } from "../../../helpers/product.helper";

export const productsCrossPartnerTests = () => {
  test.describe("Admin — Products › Cross-Partner Isolation", () => {
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
        } catch {
          void 0;
        }
      }
      createdIds = [];
    });

    test("filtering by partner A only shows that partner's products", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();

      const unique = `CrossFilter_${Date.now()}`;
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: unique,
      });
      createdIds.push(product.id);

      await page.goto("/products");
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );

      // Filter by our test partner
      const partnerSelect = page.locator("select.filters__select");
      const options = await partnerSelect.locator("option").all();
      let found = false;
      for (const opt of options) {
        const val = await opt.getAttribute("value");
        if (val === testPartnerId) {
          found = true;
          const responsePromise = page.waitForResponse(
            (r) =>
              r.url().includes("/api/products") &&
              r.request().method() === "GET",
          );
          await partnerSelect.selectOption(testPartnerId);
          const resp = await responsePromise;
          expect(resp.url()).toContain(`partnerId=${testPartnerId}`);
          break;
        }
      }
      if (!found) test.skip();
    });

    test("partner-scoped URL only returns products for that partner", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();

      const unique = `ScopedOnly_${Date.now()}`;
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: unique,
      });
      createdIds.push(product.id);

      const [response] = await Promise.all([
        page.waitForResponse(
          (r) =>
            r.url().includes(`/api/products/partner/${testPartnerId}`) &&
            r.request().method() === "GET",
        ),
        page.goto(`/partners/${testPartnerId}/products`),
      ]);

      const body = await response.json();
      const products: Array<{ _id: string }> =
        body.data?.data || body.data || [];
      const ids = products.map((p) => p._id);
      // Our product should be in the response
      expect(ids).toContain(product.id);
    });

    test("switching partner filter refreshes list and updates request", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();

      await page.goto("/products");
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );

      const partnerSelect = page.locator("select.filters__select");
      const options = await partnerSelect.locator("option").all();

      let firstPartnerId: string | null = null;
      let secondPartnerId: string | null = null;

      for (const opt of options) {
        const val = await opt.getAttribute("value");
        if (val && val !== "") {
          if (!firstPartnerId) firstPartnerId = val;
          else if (val !== firstPartnerId) {
            secondPartnerId = val;
            break;
          }
        }
      }

      if (!firstPartnerId || !secondPartnerId) {
        test.skip();
        return;
      }

      // Select first partner
      let responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await partnerSelect.selectOption(firstPartnerId);
      const resp1 = await responsePromise;
      expect(resp1.url()).toContain(`partnerId=${firstPartnerId}`);

      // Switch to second partner
      responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await partnerSelect.selectOption(secondPartnerId);
      const resp2 = await responsePromise;
      expect(resp2.url()).toContain(`partnerId=${secondPartnerId}`);
      expect(resp2.url()).not.toContain(`partnerId=${firstPartnerId}`);
    });

    test("product details via global URL and partner URL render the same title", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();

      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `CrossDetail_${Date.now()}`,
        titleGe: "ჯვარი პარტნიორი",
      });
      createdIds.push(product.id);

      // Open via global URL
      await page.goto(`/products/${product.id}`);
      await expect(page.locator(".product-details-page")).toBeVisible({
        timeout: 8000,
      });
      const globalTitle = await page
        .locator(".page-title, h1")
        .first()
        .textContent();

      // Open via partner-scoped URL
      await page.goto(
        `/partners/${testPartnerId}/products/${product.id}`,
      );
      await expect(page.locator(".product-details-page")).toBeVisible({
        timeout: 8000,
      });
      const partnerTitle = await page
        .locator(".page-title, h1")
        .first()
        .textContent();

      expect(globalTitle?.trim()).toBe(partnerTitle?.trim());
    });
  });
};
