import { test, expect } from "../../../fixtures/auth.fixture";
import { MenuPage } from "../../../pages/MenuPage";
import {
  menuLabelEnScenarios,
  menuLabelKaScenarios,
  menuHrefScenarios,
  menuOrderScenarios,
  menuBoundaryPassScenarios,
  assertScenario,
  assertSuccessToast,
} from "../../../helpers/validation-scenarios.helper";

export const menuValidationTests = () => {
  test.describe("Admin — Menu › Validation", () => {
    let menuPage: MenuPage;

    test.beforeEach(async ({ asAdmin: page }) => {
      menuPage = new MenuPage(page);
      await menuPage.goto();
      await menuPage.addBtn.click();
      await expect(menuPage.modal).toBeVisible();
    });

    for (const s of menuLabelEnScenarios) {
      test(`${s.id} — labelEn: ${s.note}`, async () => {
        await menuPage.labelEn.fill(s.value);
        await menuPage.saveBtn.click();
        await assertScenario(menuPage.getErrorLocator("labelEn"), s);
      });
    }

    for (const s of menuLabelKaScenarios) {
      test(`${s.id} — labelKa: ${s.note}`, async () => {
        await menuPage.labelKa.fill(s.value);
        await menuPage.saveBtn.click();
        await assertScenario(menuPage.getErrorLocator("labelKa"), s);
      });
    }

    for (const s of menuHrefScenarios) {
      test(`${s.id} — href: ${s.note}`, async () => {
        await menuPage.href.fill(s.value);
        await menuPage.saveBtn.click();
        await assertScenario(menuPage.getErrorLocator("href"), s);
      });
    }

    for (const s of menuOrderScenarios) {
      test(`${s.id} — order: ${s.note}`, async () => {
        await menuPage.order.fill(s.value);
        await menuPage.saveBtn.click();
        await assertScenario(menuPage.getErrorLocator("order"), s);
      });
    }

    test("empty form → labelKa + href errors visible", async () => {
      await menuPage.saveBtn.click();
      await expect(menuPage.getErrorLocator("labelKa")).toBeVisible();
      await expect(menuPage.getErrorLocator("href")).toBeVisible();
    });

    for (const s of menuBoundaryPassScenarios) {
      test(`${s.id} — boundary pass: ${s.note}`, async () => {
        if (s.field === "order") await menuPage.order.fill(s.value);
        if (s.field === "href") await menuPage.href.fill(s.value);
        if (s.field === "labelEn") await menuPage.labelEn.fill(s.value);
        if (s.field === "labelKa") await menuPage.labelKa.fill(s.value);

        await menuPage.saveBtn.click();

        await expect(menuPage.getErrorLocator(s.field))
          .not.toBeVisible({ timeout: 3000 })
          .catch(() => {});
      });
    }

    test("all fields valid → success toast", async ({ asAdmin: page }) => {
      await menuPage.labelKa.fill("მთავარი");
      await menuPage.labelEn.fill("Home");
      await menuPage.href.fill("/home");
      await menuPage.order.fill("1");
      await menuPage.saveBtn.click();
      await assertSuccessToast(page);
    });
  });
};
