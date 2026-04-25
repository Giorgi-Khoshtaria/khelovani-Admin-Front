import { test, expect } from "../../../fixtures/auth.fixture";
import { TranslationsPage } from "../../../pages/TranslationsPage";
import { expectSuccessToast } from "../../../helpers/validation.helper";
export const translationsEditTests = () => {
  test.describe("Admin — Translations › Edit (Modal)", () => {
    let transPage: TranslationsPage;

    test.beforeEach(async ({ asAdmin: page }) => {
      transPage = new TranslationsPage(page);
      await transPage.goto();
    });

    async function createTranslation(
      page: import("@playwright/test").Page,
      key: string,
      ge = "საწყისი",
      en = "Initial",
    ) {
      await transPage.addBtn.click();
      const ns =
        (await page
          .locator("#namespace option")
          .nth(0)
          .getAttribute("value")) ?? "auth";
      await transPage.namespaceInput.selectOption(ns);
      await transPage.keyInput.fill(key);
      await transPage.geInput.fill(ge);
      await transPage.enInput.fill(en);
      await transPage.saveBtn.click();
      await expectSuccessToast(page);
      await page.waitForTimeout(300);
    }

    test("edit Georgian value via modal → change persists in list", async ({
      asAdmin: page,
    }) => {
      const key = `edit.ge.${Date.now()}`;
      await createTranslation(page, key);

      await transPage.searchInput.fill(key);
      await page.waitForTimeout(500);
      await transPage.editRowByKey(key, { ge: "განახლებული" });
      await expectSuccessToast(page);

      const row = await transPage.getRowByKey(key);
      await expect(row).toContainText("განახლებული");
    });

    test("edit English value via modal → change persists in list", async ({
      asAdmin: page,
    }) => {
      const key = `edit.en.${Date.now()}`;
      await createTranslation(page, key);

      await transPage.searchInput.fill(key);
      await page.waitForTimeout(500);
      await transPage.editRowByKey(key, { en: "Updated" });
      await expectSuccessToast(page);

      const row = await transPage.getRowByKey(key);
      await expect(row).toContainText("Updated");
    });

    test("rename key via modal → new key appears in search", async ({
      asAdmin: page,
    }) => {
      const oldKey = `old.key.${Date.now()}`;
      const newKey = `new.key.${Date.now()}`;
      await createTranslation(page, oldKey);

      await transPage.searchInput.fill(oldKey);
      await page.waitForTimeout(500);
      await transPage.editRowByKey(oldKey, { key: newKey });
      await expectSuccessToast(page);

      await transPage.searchInput.fill(newKey);
      await page.waitForTimeout(500);
      await expect(await transPage.getRowByKey(newKey)).toBeVisible();
    });

    test("close modal via header close button", async ({ asAdmin: page }) => {
      const row = page.locator(".item-row").first();
      await row.locator(".edit-btn").click();
      await expect(transPage.editModal).toBeVisible();

      await transPage.modalCloseBtn.click();
      await expect(transPage.editModal).not.toBeVisible();
    });

    test("close modal via overlay click", async ({ asAdmin: page }) => {
      const row = page.locator(".item-row").first();
      await row.locator(".edit-btn").click();
      await expect(transPage.editModal).toBeVisible();

      await transPage.editModal.click({ position: { x: 5, y: 5 } });
      await expect(transPage.editModal).not.toBeVisible();
    });

    test("cancel button in modal discards changes", async ({
      asAdmin: page,
    }) => {
      const key = `cancel.edit.${Date.now()}`;
      await createTranslation(page, key, "ორიგინალი", "Original");

      await transPage.searchInput.fill(key);
      await page.waitForTimeout(500);

      const row = await transPage.getRowByKey(key);
      await row.locator(".edit-btn").click();
      await expect(transPage.editModal).toBeVisible();

      await transPage.editGeInput.fill("გაუქმებული ცვლილება");
      await transPage.modalCancelBtn.click();
      await expect(transPage.editModal).not.toBeVisible();

      await expect(await transPage.getRowByKey(key)).toContainText("ორიგინალი");
    });
  });
};
