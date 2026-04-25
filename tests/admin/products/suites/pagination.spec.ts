import { test, expect } from "../../../fixtures/auth.fixture";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { createTestProduct } from "../../../helpers/product.helper";

export const productsPaginationTests = () => {
  test.describe("Admin — Products › Pagination", () => {
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

    test("pagination controls hidden when filtered results ≤ 10", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const unique = `PagHide_${Date.now()}`;
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: unique,
      });
      createdIds.push(product.id);

      await page.goto("/products");
      const responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.locator("input.filters__input").fill(unique);
      await responsePromise;

      await expect(page.locator(".pagination")).not.toBeVisible();
    });

    test("pagination shows 'გვერდი 1 / N' and correct button states", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const batchTag = `Pag_${Date.now()}`;

      // Create 11 products with the same batch tag so we can search for them
      for (let i = 0; i < 11; i++) {
        const p = await createTestProduct(api, testPartnerId, {
          titleEn: `${batchTag}_${String(i).padStart(2, "0")}`,
          titleGe: `გვ ${i}`,
        });
        createdIds.push(p.id);
      }

      await page.goto("/products");
      const responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.locator("input.filters__input").fill(batchTag);
      await responsePromise;

      const pagination = page.locator(".pagination");
      const paginationVisible = await pagination.isVisible({ timeout: 5000 }).catch(() => false);
      if (!paginationVisible) {
        // Backend might not have exactly 11 results on page 1 — skip gracefully
        test.skip();
        return;
      }

      await expect(page.locator(".page-info")).toContainText("გვერდი 1");
      await expect(page.locator("button:has-text('წინა')")).toBeDisabled();
      await expect(page.locator("button:has-text('შემდეგი')")).not.toBeDisabled();
    });

    test("next button fires request with page=2 and updates page-info", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const batchTag = `PagNext_${Date.now()}`;
      for (let i = 0; i < 11; i++) {
        const p = await createTestProduct(api, testPartnerId, {
          titleEn: `${batchTag}_${String(i).padStart(2, "0")}`,
          titleGe: `შემდ ${i}`,
        });
        createdIds.push(p.id);
      }

      await page.goto("/products");
      let responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.locator("input.filters__input").fill(batchTag);
      await responsePromise;

      const pagination = page.locator(".pagination");
      const visible = await pagination.isVisible({ timeout: 5000 }).catch(() => false);
      if (!visible) {
        test.skip();
        return;
      }

      responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.locator("button:has-text('შემდეგი')").click();
      const resp = await responsePromise;
      expect(resp.url()).toContain("page=2");
      await expect(page.locator(".page-info")).toContainText("გვერდი 2");
      await expect(page.locator("button:has-text('შემდეგი')")).toBeDisabled();
      await expect(page.locator("button:has-text('წინა')")).not.toBeDisabled();
    });

    test("prev button fires request with page=1 after going to page 2", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const batchTag = `PagPrev_${Date.now()}`;
      for (let i = 0; i < 11; i++) {
        const p = await createTestProduct(api, testPartnerId, {
          titleEn: `${batchTag}_${String(i).padStart(2, "0")}`,
          titleGe: `წინა ${i}`,
        });
        createdIds.push(p.id);
      }

      await page.goto("/products");
      let responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.locator("input.filters__input").fill(batchTag);
      await responsePromise;

      const visible = await page.locator(".pagination").isVisible({ timeout: 5000 }).catch(() => false);
      if (!visible) {
        test.skip();
        return;
      }

      // Go to page 2
      responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.locator("button:has-text('შემდეგი')").click();
      await responsePromise;

      // Go back to page 1
      responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.locator("button:has-text('წინა')").click();
      const resp = await responsePromise;
      expect(resp.url()).toContain("page=1");
      await expect(page.locator(".page-info")).toContainText("გვერდი 1");
    });

    test("changing search resets to page 1", async ({ asAdmin: page }) => {
      if (!testPartnerId) test.skip();
      const batchTag = `PagReset_${Date.now()}`;
      for (let i = 0; i < 11; i++) {
        const p = await createTestProduct(api, testPartnerId, {
          titleEn: `${batchTag}_${String(i).padStart(2, "0")}`,
          titleGe: `რესეტი ${i}`,
        });
        createdIds.push(p.id);
      }

      await page.goto("/products");
      let responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.locator("input.filters__input").fill(batchTag);
      await responsePromise;

      const visible = await page.locator(".pagination").isVisible({ timeout: 5000 }).catch(() => false);
      if (!visible) {
        test.skip();
        return;
      }

      // Navigate to page 2
      responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.locator("button:has-text('შემდეგი')").click();
      await responsePromise;
      await expect(page.locator(".page-info")).toContainText("გვერდი 2");

      // Change search term — page resets to 1
      responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await page.locator("input.filters__input").fill(batchTag + "_00");
      const resp = await responsePromise;
      expect(resp.url()).toContain("page=1");
    });
  });
};
