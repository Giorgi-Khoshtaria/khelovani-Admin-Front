import { test, expect } from "../../../fixtures/auth.fixture";

export const usersAccessTests = () => {
  test.describe("Admin — Users › Access Control", () => {
    test("admin can navigate to /users listing", async ({ asAdmin: page }) => {
      await page.goto("/users");
      await expect(page.locator(".user-listing-page")).toBeVisible();
    });

    test("admin sees heading 'მომხმარებლები'", async ({ asAdmin: page }) => {
      await page.goto("/users");
      await expect(page.locator("h1")).toContainText("მომხმარებლები");
    });

    test("side nav contains მომხმარებლები link for admin", async ({
      asAdmin: page,
    }) => {
      await page.goto("/users");
      await expect(
        page.locator(".side-manu__link", { hasText: "მომხმარებლები" }),
      ).toBeVisible();
    });

    test("side nav მომხმარებლები link is active on /users", async ({
      asAdmin: page,
    }) => {
      await page.goto("/users");
      await expect(
        page.locator(".side-manu__item.active", {
          hasText: "მომხმარებლები",
        }),
      ).toBeVisible();
    });

    test("unauthenticated user is redirected to login from /users", async ({
      browser,
    }) => {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.goto("/users");
      await expect(page).toHaveURL(/login/, { timeout: 8000 });
      await ctx.close();
    });

    test("organizer is redirected away from /users", async ({
      asOrganizer: page,
    }) => {
      await page.goto("/users");
      await expect(page).not.toHaveURL(/\/users$/, { timeout: 8000 });
    });

    test("organizer does NOT see მომხმარებლები link in side nav", async ({
      asOrganizer: page,
    }) => {
      await page.goto("/profile");
      await expect(
        page.locator(".side-manu__link", { hasText: "მომხმარებლები" }),
      ).not.toBeVisible();
    });
  });
};
