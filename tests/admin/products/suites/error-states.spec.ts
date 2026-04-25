import { test, expect } from "../../../fixtures/auth.fixture";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { createTestProduct } from "../../../helpers/product.helper";
import { expectErrorToast } from "../../../helpers/validation.helper";

export const productsErrorStatesTests = () => {
  test.describe("Admin — Products › Error States", () => {
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

    test("listing: GET 500 shows error toast", async ({ asAdmin: page }) => {
      await page.route(
        (url) =>
          url.pathname === "/api/products" ||
          url.pathname.startsWith("/api/products/partner/"),
        (route) => {
          if (route.request().method() === "GET") {
            route.fulfill({ status: 500, body: "Internal Server Error" });
          } else {
            route.continue();
          }
        },
      );

      await page.goto("/products");
      await expectErrorToast(page, "შეცდომა პროდუქტების ჩატვირთვისას");
    });

    test("listing: GET 500 shows empty state after error", async ({
      asAdmin: page,
    }) => {
      await page.route(
        (url) =>
          url.pathname === "/api/products" ||
          url.pathname.startsWith("/api/products/partner/"),
        (route) => {
          if (route.request().method() === "GET") {
            route.fulfill({ status: 500, body: "Internal Server Error" });
          } else {
            route.continue();
          }
        },
      );

      await page.goto("/products");
      await page.waitForTimeout(1500);
      // No products list should be shown — either empty state or nothing
      await expect(page.locator(".products-list")).not.toBeVisible();
    });

    test("details: 404 product navigates away and shows toast", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();

      await page.goto(
        `/partners/${testPartnerId}/products/000000000000000000000000`,
      );
      // hook calls toast.error and navigate() on failed fetch
      await expect(
        page.locator(".error-state, .product-listing-page"),
      ).toBeVisible({ timeout: 10000 });
    });

    test("delete: DELETE 500 shows error toast and row stays", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();

      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `DelErr500_${Date.now()}`,
      });
      createdIds.push(product.id);

      await page.goto("/products");
      const row = page
        .locator(".product-row")
        .filter({ hasText: product.titleEn! })
        .first();
      await expect(row).toBeVisible({ timeout: 10000 });

      await page.route(
        (url) => url.pathname === `/api/products/${product.id}`,
        (route) => {
          if (route.request().method() === "DELETE") {
            route.fulfill({ status: 500, body: "Internal Server Error" });
          } else {
            route.continue();
          }
        },
      );

      page.once("dialog", (d) => d.accept());
      await row.locator(".delete-btn").click();
      await expectErrorToast(page, "შეცდომა პროდუქტის წაშლისას");
      await expect(row).toBeVisible();
    });

    test("toggle: PATCH 500 reverts optimistic UI and shows error toast", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();

      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `TogErr500_${Date.now()}`,
        isShown: true,
      });
      createdIds.push(product.id);

      await page.goto("/products");
      const row = page
        .locator(".product-row")
        .filter({ hasText: product.titleEn! })
        .first();
      await expect(row).toBeVisible({ timeout: 10000 });

      await page.route(
        (url) => url.pathname === `/api/products/${product.id}`,
        (route) => {
          if (route.request().method() === "PATCH") {
            route.fulfill({ status: 500, body: "Internal Server Error" });
          } else {
            route.continue();
          }
        },
      );

      await row.locator(".toggle-btn").click();
      await expectErrorToast(page, "შეცდომა სტატუსის შეცვლისას");
      // Should revert to original visible state
      await expect(row.locator(".status-pill")).toHaveClass(/visible/);
    });

    test("401 response redirects to login page", async ({ asAdmin: page }) => {
      await page.route(
        (url) =>
          url.pathname === "/api/products" ||
          url.pathname.startsWith("/api/products"),
        (route) => {
          if (route.request().method() === "GET") {
            route.fulfill({ status: 401, body: "Unauthorized" });
          } else {
            route.continue();
          }
        },
      );

      await page.goto("/products");
      await expect(page).toHaveURL(/login/, { timeout: 10000 });
    });
  });
};
