import { test, expect } from "../../../fixtures/auth.fixture";
import { CategoriesPage } from "../../../pages/CategoriesPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const categoriesListingTests = () => {
  test.describe("Categories › Listing", () => {
    let page: CategoriesPage;
    let api: ApiHelper;

    test.beforeEach(async ({ asAdmin }) => {
      page = new CategoriesPage(asAdmin);
      api = new ApiHelper();
      await api.login();
      await page.goto();
      await page.waitForLoad();
    });

    test("renders heading and add button", async () => {
      await expect(page.heading).toContainText("კატეგორიები");
      await expect(page.addBtn).toBeVisible();
    });

    test("table shows seeded categories", async () => {
      const rows = await page.rows.count();
      expect(rows).toBeGreaterThan(0);
    });

    test("table has correct column headers", async () => {
      await expect(page.table.locator("th").nth(0)).toContainText("სლაგი");
      await expect(page.table.locator("th").nth(1)).toContainText("ქართ");
      await expect(page.table.locator("th").nth(2)).toContainText("EN");
      await expect(page.table.locator("th").nth(3)).toContainText("სტატუსი");
      await expect(page.table.locator("th").nth(4)).toContainText("მოქმედებები");
    });

    test("each row has edit and delete buttons", async () => {
      const firstRow = page.rows.first();
      await expect(firstRow.locator("button[title='რედაქტირება']")).toBeVisible();
      await expect(firstRow.locator("button[title='წაშლა']")).toBeVisible();
    });

    test("seeded category 'jewelry' appears in table", async () => {
      await expect(page.getRowBySlug("jewelry")).toBeVisible();
    });
  });
};
