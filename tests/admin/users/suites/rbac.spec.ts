import { test, expect } from "../../../fixtures/auth.fixture";
import { callApiAs, expectForbidden } from "../../../helpers/security.helper";

export const usersRbacTests = () => {
  test.describe("Admin — Users › RBAC", () => {
    test("organizer cannot GET /api/admin/users", async () => {
      const res = await callApiAs("organizer", {
        method: "GET",
        url: "/api/admin/users",
      });
      expectForbidden(res.status);
    });

    test("organizer cannot DELETE a user via API", async () => {
      const res = await callApiAs("organizer", {
        method: "DELETE",
        url: "/api/admin/users/000000000000000000000000",
      });
      expectForbidden(res.status);
    });

    test("unauthenticated request to GET /api/admin/users is rejected", async () => {
      const res = await callApiAs(null, {
        method: "GET",
        url: "/api/admin/users",
      });
      expectForbidden(res.status);
    });

    test("unauthenticated request to DELETE /api/admin/users/:id is rejected", async () => {
      const res = await callApiAs(null, {
        method: "DELETE",
        url: "/api/admin/users/000000000000000000000000",
      });
      expectForbidden(res.status);
    });

    test("organizer UI does not show მომხმარებლები nav link", async ({
      asOrganizer: page,
    }) => {
      await page.goto("/profile");
      await expect(
        page.locator(".side-manu__link", { hasText: "მომხმარებლები" }),
      ).not.toBeVisible();
    });

    test("organizer navigating to /users is redirected", async ({
      asOrganizer: page,
    }) => {
      await page.goto("/users");
      await expect(page).not.toHaveURL(/\/users$/, { timeout: 8000 });
    });
  });
};
