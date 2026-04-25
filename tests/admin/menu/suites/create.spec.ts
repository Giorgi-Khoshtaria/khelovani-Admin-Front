import { test, expect } from "../../../fixtures/auth.fixture";
import { MenuPage } from "../../../pages/MenuPage";
import { ApiHelper } from "../../../helpers/api.helper";
import { expectSuccessToast } from "../../../helpers/validation.helper";
import type { MenuItem } from "../../../../src/apiCalls/menuApiCalls/menu.req";

export const menuCreateTests = () => {
  test.describe("Admin — Menu › Create", () => {
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

    test("create a menu item → success toast + row appears in table", async ({
      asAdmin: page,
    }) => {
      const label = `ახალი_${Date.now()}`;
      await menuPage.createMenuItem({
        labelKa: label,
        labelEn: "New Item En",
        href: "/new-item",
        order: 10,
        isActive: true,
      });

      await expectSuccessToast(page, /დაემატა/);
      await page.reload();
      await expect(menuPage.getRowByText(label)).toBeVisible();

      const items = await api.getMenuItems();
      const item = items.find((i: MenuItem) => i.label.ka === label);
      if (item?._id) createdIds.push(item._id);
    });

    test("created item shows correct English label in table", async ({
      asAdmin: page,
    }) => {
      const label = `ქარ_${Date.now()}`;
      await menuPage.createMenuItem({
        labelKa: label,
        labelEn: "Correct En",
        href: "/correct",
        order: 5,
        isActive: true,
      });

      await expectSuccessToast(page, /დაემატა/);
      await page.reload();

      const row = menuPage.getRowByText(label);
      await expect(row).toBeVisible();
      await expect(row.locator("td").nth(2)).toHaveText("Correct En");

      const items = await api.getMenuItems();
      const item = items.find((i: MenuItem) => i.label.ka === label);
      if (item?._id) createdIds.push(item._id);
    });

    test("created item shows correct href in table", async ({
      asAdmin: page,
    }) => {
      const label = `ჰრეფ_${Date.now()}`;
      await menuPage.createMenuItem({
        labelKa: label,
        labelEn: "Href Test",
        href: "/unique-href-test",
        order: 3,
        isActive: true,
      });

      await expectSuccessToast(page, /დაემატა/);
      await page.reload();
      await expect(
        page.locator("code:has-text('/unique-href-test')"),
      ).toBeVisible();

      const items = await api.getMenuItems();
      const item = items.find((i: MenuItem) => i.label.ka === label);
      if (item?._id) createdIds.push(item._id);
    });

    test("modal opens when clicking add button", async () => {
      await menuPage.addBtn.click();
      await expect(menuPage.modal).toBeVisible();
    });

    test("modal closes via cancel button", async () => {
      await menuPage.addBtn.click();
      await expect(menuPage.modal).toBeVisible();
      await menuPage.cancelBtn.click();
      await expect(menuPage.modal).not.toBeVisible();
    });

    test("modal closes via overlay click", async () => {
      await menuPage.addBtn.click();
      await expect(menuPage.modal).toBeVisible();
      await menuPage.modalOverlay.click({ position: { x: 5, y: 5 } });
      await expect(menuPage.modal).not.toBeVisible();
    });
  });
};
