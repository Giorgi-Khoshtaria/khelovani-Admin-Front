import { test, expect } from "../../../fixtures/auth.fixture";
import { TranslationsPage } from "../../../pages/TranslationsPage";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const translationsDeleteTests = () => {
  test.describe("Admin — Translations › Delete (Bulk)", () => {
    let transPage: TranslationsPage;

    test.beforeEach(async ({ asAdmin: page }) => {
      transPage = new TranslationsPage(page);
      await transPage.goto();
    });

    async function openFormAndGetNs(page: import("@playwright/test").Page) {
      await transPage.addBtn.click();
      const ns =
        (await page
          .locator("#namespace option")
          .nth(0)
          .getAttribute("value")) ?? "auth";
      return ns;
    }

    test("select two rows → bulk delete button shows count (2)", async ({
      asAdmin: page,
    }) => {
      // Create two disposable translations
      const ns = await openFormAndGetNs(page);
      const k1 = `bulk.count.1.${Date.now()}`;
      const k2 = `bulk.count.2.${Date.now()}`;

      await transPage.namespaceInput.selectOption(ns);
      await transPage.keyInput.fill(k1);
      await transPage.geInput.fill("ბ1");
      await transPage.enInput.fill("B1");
      await transPage.saveBtn.click();
      await expectSuccessToast(page);

      await transPage.createTranslation({
        namespace: ns,
        key: k2,
        ge: "ბ2",
        en: "B2",
      });
      await expectSuccessToast(page);

      await transPage.searchInput.fill("bulk.count.");
      await page.waitForTimeout(500);

      await transPage.rowCheckboxes.nth(1).check();
      await transPage.rowCheckboxes.nth(2).check();
      await expect(transPage.bulkDeleteBtn).toContainText("წაშლა (2)");
    });

    test("bulk delete two translations → both rows removed", async ({
      asAdmin: page,
    }) => {
      const ns = await openFormAndGetNs(page);
      const suffix = Date.now();
      const k1 = `bulk.del.1.${suffix}`;
      const k2 = `bulk.del.2.${suffix}`;

      await transPage.namespaceInput.selectOption(ns);
      await transPage.keyInput.fill(k1);
      await transPage.geInput.fill("წასაშლელი 1");
      await transPage.enInput.fill("Delete 1");
      await transPage.saveBtn.click();
      await expectSuccessToast(page);

      await transPage.createTranslation({
        namespace: ns,
        key: k2,
        ge: "წასაშლელი 2",
        en: "Delete 2",
      });
      await expectSuccessToast(page);

      await transPage.searchInput.fill(`bulk.del.`);
      await page.waitForTimeout(500);

      await transPage.rowCheckboxes.nth(1).check();
      await transPage.rowCheckboxes.nth(2).check();

      page.on("dialog", (d) => d.accept());
      await transPage.bulkDeleteBtn.click();

      await expectSuccessToast(page);
      await expect(await transPage.getRowByKey(k1)).not.toBeVisible();
      await expect(await transPage.getRowByKey(k2)).not.toBeVisible();
    });
  });
};
