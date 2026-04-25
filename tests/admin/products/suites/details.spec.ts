import { test, expect } from "../../../fixtures/auth.fixture";
import { ProductsPage } from "../../../pages/ProductsPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import {
  createTestProduct,
  createAndNavigateToProductDetails,
} from "../../../helpers/product.helper";

export const productsDetailsTests = () => {
  test.describe("Admin — Products › Details Page", () => {
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

    test("details page renders for a valid product", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createAndNavigateToProductDetails(
        page,
        api,
        testPartnerId,
      );
      if (product.id) createdIds.push(product.id);
      await expect(page.locator(".product-details-page")).toBeVisible();
    });

    test("shows product titleGe as page heading", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `Title_${Date.now()}`,
        titleGe: "სათაური სატესტო",
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".page-title, h1")).toContainText(
        "სათაური სატესტო",
      );
    });

    test("shows back button on details page", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `BackBtn_${Date.now()}`,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".back-btn")).toBeVisible();
    });

    test("back button navigates back to listing", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `BackNav_${Date.now()}`,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products`);
      const row = page
        .locator(".product-row")
        .filter({ hasText: product.titleEn! })
        .first();
      await expect(row).toBeVisible({ timeout: 10000 });
      await row.click();
      await expect(page.locator(".product-details-page")).toBeVisible();
      await page.locator(".back-btn").click();
      await expect(page.locator(".product-listing-page")).toBeVisible();
    });

    test("status dot is 'shown' class for a visible product", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `StatusDotOn_${Date.now()}`,
        isShown: true,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".status-dot")).toHaveClass(/shown/);
      await expect(page.locator(".status-indicator")).toContainText("საჯარო");
    });

    test("status dot is 'hidden' class for a hidden product", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `StatusDotOff_${Date.now()}`,
        isShown: false,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".status-dot")).toHaveClass(/hidden/);
      await expect(page.locator(".status-indicator")).toContainText("დამალული");
    });

    test("renders price and currency in content card", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `PriceInfo_${Date.now()}`,
        price: 77,
        currency: "GEL",
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      const card = page.locator(".content-card");
      await expect(card).toContainText("77");
      await expect(card).toContainText("GEL");
    });

    test("renders descriptions in both Georgian and English", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `Desc_${Date.now()}`,
        descriptionGe: "ქართული აღწერა",
        descriptionEn: "English description",
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".product-details-page")).toContainText(
        "ქართული აღწერა",
      );
      await expect(page.locator(".product-details-page")).toContainText(
        "English description",
      );
    });

    test("shipping shows 'ხელმისაწვდომია' when shippingAvailable=true", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `Ship_${Date.now()}`,
        shippingAvailable: true,
        shippingPrice: 10,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".additional-info")).toContainText(
        "ხელმისაწვდომია",
      );
    });

    test("shipping shows 'არა' when shippingAvailable=false", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `NoShip_${Date.now()}`,
        shippingAvailable: false,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".additional-info")).toContainText("არა");
    });

    test("location renders when locationGe provided", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `Loc_${Date.now()}`,
        locationGe: "თბილისი",
        locationEn: "Tbilisi",
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".additional-info")).toContainText("თბილისი");
    });

    test("'უნიკალური' row visible when isOneOfAKind=true", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `Unique_${Date.now()}`,
        isOneOfAKind: true,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".additional-info")).toContainText("უნიკალური");
    });

    test("'უნიკალური' row absent when isOneOfAKind=false", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `NotUnique_${Date.now()}`,
        isOneOfAKind: false,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".additional-info")).not.toContainText(
        "უნიკალური",
      );
    });

    test("image gallery renders at least one image", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createAndNavigateToProductDetails(
        page,
        api,
        testPartnerId,
      );
      if (product.id) createdIds.push(product.id);
      await expect(
        page.locator(".product-image-gallery img, .left-column img").first(),
      ).toBeVisible();
    });

    test("invalid productId navigates away or shows error state", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      await page.goto(
        `/partners/${testPartnerId}/products/000000000000000000000000`,
      );
      // The hook navigates away on 404, or shows error-state
      await expect(
        page.locator(".error-state, .product-listing-page"),
      ).toBeVisible({ timeout: 10000 });
    });
  });
};
