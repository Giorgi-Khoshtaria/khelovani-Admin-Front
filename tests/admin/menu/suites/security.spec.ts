import { test, expect } from "../../../fixtures/auth.fixture";
import { MenuPage } from "../../../pages/MenuPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { expectNoXssDialog } from "../../../helpers/validation.helper";

export const menuSecurityTests = () => {
  test.describe("Admin — Menu › Security", () => {
    let menuPage: MenuPage;
    let api: ApiHelper;
    let createdIds: string[] = [];

    test.beforeEach(async ({ asAdmin: page }) => {
      menuPage = new MenuPage(page);
      api = new ApiHelper();
      await api.login();
      await menuPage.goto();
    });

    test.afterEach(async () => {
      for (const id of createdIds) {
        try {
          await api.deleteMenuItem(id);
        } catch {
          /* skip */
        }
      }
      createdIds = [];
    });

    test("XSS in Georgian label → no alert dialog fires", async ({
      asAdmin: page,
    }) => {
      await expectNoXssDialog(page, async () => {
        await menuPage.addBtn.click();
        await menuPage.fillForm({
          labelKa: "<script>alert('xss')</script>",
          labelEn: "XSS Test",
          href: "/xss-test",
          order: 1,
        });
        await menuPage.saveBtn.click();
        await page.waitForTimeout(500);
      });
    });

    test("XSS in English label → no alert dialog fires", async ({
      asAdmin: page,
    }) => {
      await expectNoXssDialog(page, async () => {
        await menuPage.addBtn.click();
        await menuPage.fillForm({
          labelKa: "ტესტი",
          labelEn: "<img src=x onerror=alert(1)>",
          href: "/xss-en",
          order: 1,
        });
        await menuPage.saveBtn.click();
        await page.waitForTimeout(500);
      });
    });

    test("organizer is blocked from /menu", async ({ asOrganizer: page }) => {
      await page.goto("/menu");
      await expect(page).not.toHaveURL(/\/menu/);
    });
  });
};
