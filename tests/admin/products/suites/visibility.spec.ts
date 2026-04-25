import { test, expect } from "../../../fixtures/auth.fixture";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { createTestProduct } from "../../../helpers/product.helper";
import {
  expectSuccessToast,
  expectErrorToast,
} from "../../../helpers/validation.helper";

export const productsVisibilityTests = () => {
  test.describe("Admin — Products › Visibility Toggle (Details)", () => {
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

    test("toggle button label is 'დამალვა' when product is visible", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `VisLabel_${Date.now()}`,
        isShown: true,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".toggle-details-btn")).toContainText(
        "დამალვა",
      );
    });

    test("toggle button label is 'გამოჩენა' when product is hidden", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `HidLabel_${Date.now()}`,
        isShown: false,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".toggle-details-btn")).toContainText(
        "გამოჩენა",
      );
    });

    test("clicking toggle (visible→hidden): PATCH fires, dot becomes hidden, toast", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `TogHide_${Date.now()}`,
        isShown: true,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".status-dot")).toHaveClass(/shown/);

      const patchPromise = page.waitForResponse(
        (r) =>
          r.url().includes(`/api/products/${product.id}`) &&
          r.request().method() === "PATCH",
      );
      await page.locator(".toggle-details-btn").click();
      await patchPromise;

      await expectSuccessToast(page, "პროდუქტი დაიმალა");
      await expect(page.locator(".status-dot")).toHaveClass(/hidden/);
      await expect(page.locator(".toggle-details-btn")).toContainText(
        "გამოჩენა",
      );
    });

    test("clicking toggle (hidden→visible): PATCH fires, dot becomes shown, toast", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `TogShow_${Date.now()}`,
        isShown: false,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);
      await expect(page.locator(".status-dot")).toHaveClass(/hidden/);

      const patchPromise = page.waitForResponse(
        (r) =>
          r.url().includes(`/api/products/${product.id}`) &&
          r.request().method() === "PATCH",
      );
      await page.locator(".toggle-details-btn").click();
      await patchPromise;

      await expectSuccessToast(page, "პროდუქტი გამოჩნდა");
      await expect(page.locator(".status-dot")).toHaveClass(/shown/);
      await expect(page.locator(".toggle-details-btn")).toContainText(
        "დამალვა",
      );
    });

    test("toggle error: status dot and button label revert, error toast shown", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: `TogErr_${Date.now()}`,
        isShown: true,
      });
      createdIds.push(product.id);
      await page.goto(`/partners/${testPartnerId}/products/${product.id}`);

      // Force PATCH to fail
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

      await page.locator(".toggle-details-btn").click();
      await expectErrorToast(page, "შეცდომა სტატუსის შეცვლისას");
      // Should revert to original shown state
      await expect(page.locator(".status-dot")).toHaveClass(/shown/);
      await expect(page.locator(".toggle-details-btn")).toContainText(
        "დამალვა",
      );
    });
  });
};
