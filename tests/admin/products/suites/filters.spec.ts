import { test, expect } from "../../../fixtures/auth.fixture";
import { ProductsPage } from "../../../pages/ProductsPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { resolveTestPartnerId } from "../../../helpers/auth.helper";
import { createTestProduct } from "../../../helpers/product.helper";

export const productsFiltersTests = () => {
  test.describe("Admin — Products › Filters", () => {
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

    test("search input is visible with correct placeholder", async ({
      asAdmin: page,
    }) => {
      await expect(productsPage.searchInput).toBeVisible();
      await expect(productsPage.searchInput).toHaveAttribute(
        "placeholder",
        "ძიება (სათაური, აღწერა)",
      );
    });

    test("search filters products by title and shows matching row", async ({
      asAdmin: page,
    }) => {
      if (!testPartnerId) test.skip();
      const unique = `SearchMatch_${Date.now()}`;
      const product = await createTestProduct(api, testPartnerId, {
        titleEn: unique,
      });
      createdIds.push(product.id);

      const responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await productsPage.searchInput.fill(unique);
      await responsePromise;

      await expect(
        page.locator(".product-row").filter({ hasText: unique }).first(),
      ).toBeVisible();
    });

    test("unmatched search shows empty state", async ({ asAdmin: page }) => {
      const responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await productsPage.searchInput.fill("ZZZNOMATCH_UNIQUE_XYZ999");
      await responsePromise;
      await expect(page.locator(".empty-state")).toBeVisible();
      await expect(page.locator(".empty-state")).toContainText(
        "პროდუქტები ვერ მოიძებნა",
      );
    });

    test("clearing search restores product list", async ({ asAdmin: page }) => {
      // Fill with non-matching search
      let responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await productsPage.searchInput.fill("ZZZNOMATCH_XYZ");
      await responsePromise;
      await expect(page.locator(".empty-state")).toBeVisible();

      // Clear — should fire new request and restore list
      responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await productsPage.searchInput.fill("");
      await responsePromise;
      await expect(page.locator(".product-listing-page")).toBeVisible();
    });

    test("category filter renders and includes 'all' option", async ({
      asAdmin: page,
    }) => {
      await expect(productsPage.categoryFilter).toBeVisible();
      const allOption = productsPage.categoryFilter.locator("option[value='all']");
      await expect(allOption).toBeAttached();
    });

    test("selecting a non-'all' category adds category param to request", async ({
      asAdmin: page,
    }) => {
      const options = await productsPage.categoryFilter
        .locator("option")
        .all();
      let picked = false;
      for (const opt of options) {
        const val = await opt.getAttribute("value");
        if (val && val !== "all") {
          const responsePromise = page.waitForResponse(
            (r) =>
              r.url().includes("/api/products") &&
              r.request().method() === "GET",
          );
          await productsPage.categoryFilter.selectOption(val);
          const resp = await responsePromise;
          expect(resp.url()).toContain("category=");
          picked = true;
          break;
        }
      }
      if (!picked) test.skip();
    });

    test("selecting 'all' category does NOT add category param", async ({
      asAdmin: page,
    }) => {
      // First pick something other than all so we can switch back
      const options = await productsPage.categoryFilter
        .locator("option")
        .all();
      let nonAllVal: string | null = null;
      for (const opt of options) {
        const val = await opt.getAttribute("value");
        if (val && val !== "all") {
          nonAllVal = val;
          break;
        }
      }
      if (!nonAllVal) {
        test.skip();
        return;
      }

      let responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await productsPage.categoryFilter.selectOption(nonAllVal);
      await responsePromise;

      responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await productsPage.categoryFilter.selectOption("all");
      const resp = await responsePromise;
      expect(resp.url()).not.toContain("category=");
    });

    test("partner dropdown is visible on global admin view", async ({
      asAdmin: page,
    }) => {
      await expect(productsPage.partnerFilter).toBeVisible();
      // First option is "ყველა ორგანიზაცია"
      const firstOption = productsPage.partnerFilter.locator("option").first();
      await expect(firstOption).toHaveText("ყველა ორგანიზაცია");
    });

    test("selecting a partner adds partnerId param to request", async ({
      asAdmin: page,
    }) => {
      const options = await productsPage.partnerFilter.locator("option").all();
      let picked = false;
      for (const opt of options) {
        const val = await opt.getAttribute("value");
        if (val && val !== "") {
          const responsePromise = page.waitForResponse(
            (r) =>
              r.url().includes("/api/products") &&
              r.request().method() === "GET",
          );
          await productsPage.partnerFilter.selectOption(val);
          const resp = await responsePromise;
          expect(resp.url()).toContain("partnerId=");
          picked = true;
          break;
        }
      }
      if (!picked) test.skip();
    });

    test("combined search + category compose correctly in request URL", async ({
      asAdmin: page,
    }) => {
      // Pick any non-all category
      const options = await productsPage.categoryFilter
        .locator("option")
        .all();
      let catVal: string | null = null;
      for (const opt of options) {
        const val = await opt.getAttribute("value");
        if (val && val !== "all") {
          catVal = val;
          break;
        }
      }
      if (!catVal) {
        test.skip();
        return;
      }

      let responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await productsPage.categoryFilter.selectOption(catVal);
      await responsePromise;

      responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/products") && r.request().method() === "GET",
      );
      await productsPage.searchInput.fill("test");
      const resp = await responsePromise;
      expect(resp.url()).toContain("category=");
      expect(resp.url()).toContain("search=");
    });
  });
};
