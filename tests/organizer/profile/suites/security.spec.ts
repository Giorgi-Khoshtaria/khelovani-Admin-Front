import { test, expect } from "../../../fixtures/auth.fixture";
import {
  callApiAs,
  expectForbidden,
  XSS_PAYLOADS,
  NOSQL_PAYLOADS,
} from "../../../helpers/security.helper";
import { assertNoXssDialog } from "../../../helpers/validation-assertions.helper";
import { PartnersPage } from "../../../pages/PartnersPage";

const ORGANIZER_ID = "69eb699d041f5ce48e30981c";

export const profileSecurityTests = () => {
  test.describe("Security", () => {
    // ── Role escalation via API ───────────────────────────────────────────

    test("organizer cannot read admin partner list", async () => {
      const res = await callApiAs("organizer", {
        method: "GET",
        url: "/api/admin/partners",
      });
      expectForbidden(res.status);
    });

    test("organizer cannot read admin roles list", async () => {
      const res = await callApiAs("organizer", {
        method: "GET",
        url: "/api/admin/roles",
      });
      expectForbidden(res.status);
    });

    test("organizer cannot read admin menu items", async () => {
      const res = await callApiAs("organizer", {
        method: "GET",
        url: "/api/admin/menu",
      });
      expectForbidden(res.status);
    });

    test("organizer cannot change own status to APPROVED via API", async () => {
      const res = await callApiAs("organizer", {
        method: "PATCH",
        url: `/api/admin/partners/${ORGANIZER_ID}/status`,
        data: { status: "APPROVED" },
      });
      expectForbidden(res.status);
    });

    test("organizer cannot delete another partner via API", async () => {
      const res = await callApiAs("organizer", {
        method: "DELETE",
        url: `/api/admin/partners/000000000000000000000001`,
      });
      expectForbidden(res.status);
    });

    test("unauthenticated request to partner profile → 401", async () => {
      const res = await callApiAs(null, {
        method: "GET",
        url: `/api/admin/partners/${ORGANIZER_ID}`,
      });
      if (res.status !== 401 && res.status !== 403) {
        throw new Error(`Expected 401/403 but got ${res.status}`);
      }
    });

    // ── XSS stored: client should block before it reaches the server ─────

    for (const payload of XSS_PAYLOADS) {
      test(`XSS in companyNameGe [${payload.slice(0, 20)}] → no alert fires`, async ({
        asOrganizer: page,
      }) => {
        const profile = new PartnersPage(page);
        await profile.gotoProfile();
        await profile.openEdit();
        await assertNoXssDialog(page, async () => {
          await profile.companyNameGe.fill(payload);
          await profile.save();
          await page.waitForTimeout(600);
        });
      });
    }

    // ── NoSQL injection in profile fields ─────────────────────────────────

    for (const [i, payload] of NOSQL_PAYLOADS.entries()) {
      test(`NoSQL payload #${i + 1} in phone field → no server crash`, async ({
        asOrganizer: page,
      }) => {
        const profile = new PartnersPage(page);
        await profile.gotoProfile();
        await profile.openEdit();
        await profile.phone.fill(payload);
        await profile.save();
        await expect(page).not.toHaveURL(/error|crash/);
        await expect(page.locator(".partner-profile, .error-text")).toBeVisible(
          { timeout: 5000 },
        );
      });
    }

    // ── Path traversal in partner ID param ───────────────────────────────

    test("path traversal in partner ID → rejected (not 200)", async () => {
      const res = await callApiAs("organizer", {
        method: "GET",
        url: `/api/admin/partners/..%2F..%2Fetc%2Fpasswd`,
      });
      if (res.status === 200) {
        throw new Error(`Expected non-200 for traversal path but got 200`);
      }
    });
  });
};
