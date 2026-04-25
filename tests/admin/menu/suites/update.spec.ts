import { test, expect } from "../../../fixtures/auth.fixture";
import { MenuPage } from "../../../pages/MenuPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const menuUpdateTests = () => {
  test.describe("Admin — Menu › Update", () => {
    let menuPage: MenuPage;
    let api: ApiHelper;
    let createdIds: string[] = [];
    let targetId: string;
    let originalLabel: string;
    let suffix: string;

    test.beforeEach(async ({ asAdmin: page }) => {
      menuPage = new MenuPage(page);
      api = new ApiHelper();
      await api.login();

      suffix = String(Date.now()).slice(-5);
      originalLabel = `ჩ_${suffix}`;
      const res = await api.createMenuItem({
        label: { ka: originalLabel, en: "Update En" },
        href: `/up-${suffix}`,
        order: 5,
        isActive: true,
      });
      targetId = res._id;
      createdIds.push(targetId);

      await menuPage.goto();
      await expect(menuPage.getRowByText(originalLabel)).toBeVisible();
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

    test("update Georgian label, English label and href", async ({
      asAdmin: page,
    }) => {
      const updated = `ახ_${suffix}`;
      await menuPage
        .getRowByText(originalLabel)
        .locator(".btn-primary-sm:has-text('რედაქტირება')")
        .click();

      await menuPage.fillForm({
        labelKa: updated,
        labelEn: "Updated En",
        href: "/updated-path",
      });
      await menuPage.saveBtn.click();

      await expectSuccessToast(page, /განახლდა/);
      await page.reload();
      await expect(menuPage.getRowByText(updated)).toBeVisible();
      await expect(
        page.locator("code:has-text('/updated-path')"),
      ).toBeVisible();
    });

    test("toggle isActive off → status badge shows 'გამორთული'", async ({
      asAdmin: page,
    }) => {
      await menuPage
        .getRowByText(originalLabel)
        .locator(".btn-primary-sm:has-text('რედაქტირება')")
        .click();

      await menuPage.fillForm({ isActive: false });
      await menuPage.saveBtn.click();

      await expectSuccessToast(page, /განახლდა/);
      await page.reload();

      const row = menuPage.getRowByText(originalLabel);
      await expect(row.locator(".status-badge")).toHaveText("გამორთული");
    });

    test("toggle isActive back on → status badge shows active state", async ({
      asAdmin: page,
    }) => {
      await menuPage
        .getRowByText(originalLabel)
        .locator(".btn-primary-sm:has-text('რედაქტირება')")
        .click();
      await menuPage.fillForm({ isActive: false });
      await menuPage.saveBtn.click();
      await expectSuccessToast(page, /განახლდა/);
      await page.reload();

      await menuPage
        .getRowByText(originalLabel)
        .locator(".btn-primary-sm:has-text('რედაქტირება')")
        .click();
      await menuPage.fillForm({ isActive: true });
      await menuPage.saveBtn.click();
      await expectSuccessToast(page, /განახლდა/);
      await page.reload();

      const row = menuPage.getRowByText(originalLabel);
      await expect(row.locator(".status-badge")).not.toHaveText("გამორთული");
    });

    test("cancel edit does not persist changes", async () => {
      await menuPage
        .getRowByText(originalLabel)
        .locator(".btn-primary-sm:has-text('რედაქტირება')")
        .click();

      await menuPage.fillForm({ labelKa: "უნდა_გაუქმდეს" });
      await menuPage.cancelBtn.click();

      await expect(menuPage.modal).not.toBeVisible();
      await expect(menuPage.getRowByText(originalLabel)).toBeVisible();
      await expect(menuPage.getRowByText("უნდა_გაუქმდეს")).not.toBeVisible();
    });
  });
};
