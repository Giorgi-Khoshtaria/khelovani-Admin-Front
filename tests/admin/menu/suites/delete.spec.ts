import { test, expect } from "../../../fixtures/auth.fixture";
import { MenuPage } from "../../../pages/MenuPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const menuDeleteTests = () => {
  test.describe("Admin — Menu › Delete", () => {
    let menuPage: MenuPage;
    let api: ApiHelper;

    test.beforeEach(async ({ asAdmin: page }) => {
      menuPage = new MenuPage(page);
      api = new ApiHelper();
      await api.login();
      await menuPage.goto();
    });

    test("delete an item → success toast + row removed from table", async ({
      asAdmin: page,
    }) => {
      const s = String(Date.now()).slice(-5);
      const label = `წ_${s}`;
      const res = await api.createMenuItem({
        label: { ka: label, en: "Delete Me" },
        href: `/dl-${s}`,
        order: 0,
        isActive: true,
      });

      await page.reload();
      const row = menuPage.getRowByText(label);
      await expect(row).toBeVisible();

      page.on("dialog", (d) => d.accept());
      await row.locator(".btn-danger-sm:has-text('წაშლა')").click();

      await expectSuccessToast(page, /წაიშალა/);
      await expect(menuPage.getRowByText(label)).not.toBeVisible();

      void res._id;
    });

    test("delete confirmation dialog appears before deletion", async ({
      asAdmin: page,
    }) => {
      const s2 = String(Date.now()).slice(-5);
      const label = `კ_${s2}`;
      const res = await api.createMenuItem({
        label: { ka: label, en: "Confirm Delete" },
        href: `/cd-${s2}`,
        order: 1,
        isActive: true,
      });

      await page.reload();
      const row = menuPage.getRowByText(label);

      let dialogText = "";
      page.on("dialog", async (d) => {
        dialogText = d.message();
        await d.accept();
      });

      await row.locator(".btn-danger-sm:has-text('წაშლა')").click();
      await expectSuccessToast(page);
      expect(dialogText.length).toBeGreaterThan(0);

      void res._id;
    });

    test("cancelling the delete dialog keeps the item in the table", async ({
      asAdmin: page,
    }) => {
      const s3 = String(Date.now()).slice(-5);
      const label = `გ_${s3}`;
      const res = await api.createMenuItem({
        label: { ka: label, en: "Keep Me" },
        href: `/km-${s3}`,
        order: 2,
        isActive: true,
      });

      await page.reload();
      const row = menuPage.getRowByText(label);
      await expect(row).toBeVisible();

      page.on("dialog", (d) => d.dismiss());
      await row.locator(".btn-danger-sm:has-text('წაშლა')").click();

      await expect(menuPage.getRowByText(label)).toBeVisible();

      await api.deleteMenuItem(res._id);
    });
  });
};
