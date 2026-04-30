import { test, expect } from "../../../fixtures/auth.fixture";
import { UsersPage } from "../../../pages/UsersPage";
import { ApiHelper } from "../../../helpers/api.helper";

export const usersPaginationTests = () => {
  test.describe("Admin — Users › Pagination", () => {
    let usersPage: UsersPage;
    let api: ApiHelper;

    test.beforeEach(async ({ asAdmin: page }) => {
      usersPage = new UsersPage(page);
      api = new ApiHelper();
      await api.login();
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );
    });

    test("pagination controls render when total pages > 1", async ({
      asAdmin: page,
    }) => {
      const pagination = page.locator(".pagination");
      const isVisible = await pagination.isVisible();
      if (isVisible) {
        await expect(page.locator(".page-info")).toBeVisible();
        await expect(
          page.locator(".pagination button", { hasText: "შემდეგი" }),
        ).toBeVisible();
        await expect(
          page.locator(".pagination button", { hasText: "წინა" }),
        ).toBeVisible();
      }
    });

    test("previous button is disabled on page 1", async ({
      asAdmin: page,
    }) => {
      const pagination = page.locator(".pagination");
      if (await pagination.isVisible()) {
        await expect(
          page.locator(".pagination button", { hasText: "წინა" }),
        ).toBeDisabled();
      }
    });

    test("next button navigates to page 2", async ({ asAdmin: page }) => {
      const pagination = page.locator(".pagination");
      if (!(await pagination.isVisible())) return;

      const nextBtn = page.locator(".pagination button", { hasText: "შემდეგი" });
      if (await nextBtn.isDisabled()) return;

      const responsePromise = page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") &&
          r.url().includes("page=2") &&
          r.request().method() === "GET",
        { timeout: 5000 },
      );
      await nextBtn.click();
      await responsePromise;
      await expect(page.locator(".page-info")).toContainText("გვერდი 2");
    });

    test("previous button returns to page 1 from page 2", async ({
      asAdmin: page,
    }) => {
      const pagination = page.locator(".pagination");
      if (!(await pagination.isVisible())) return;

      const nextBtn = page.locator(".pagination button", { hasText: "შემდეგი" });
      if (await nextBtn.isDisabled()) return;

      await nextBtn.click();
      await page.waitForResponse(
        (r) => r.url().includes("/api/admin/users") && r.url().includes("page=2"),
        { timeout: 5000 },
      );

      const prevBtn = page.locator(".pagination button", { hasText: "წინა" });
      await prevBtn.click();
      await page.waitForResponse(
        (r) => r.url().includes("/api/admin/users"),
        { timeout: 5000 },
      );
      await expect(page.locator(".page-info")).toContainText("გვერდი 1");
    });
  });
};
