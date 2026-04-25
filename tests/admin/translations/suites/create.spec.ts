import { test, expect } from "../../../fixtures/auth.fixture";
import { TranslationsPage } from "../../../pages/TranslationsPage";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const translationsCreateTests = () => {
  test.describe("Admin — Translations › Create", () => {
    let transPage: TranslationsPage;

    test.beforeEach(async ({ asAdmin: page }) => {
      transPage = new TranslationsPage(page);
      await transPage.goto();
    });

    async function openFormAndGetNamespace(
      page: import("@playwright/test").Page,
    ) {
      await transPage.addBtn.click();
      await expect(transPage.namespaceInput).toBeVisible();
      const ns = await page
        .locator("#namespace option")
        .nth(0)
        .getAttribute("value");
      return ns ?? "auth";
    }

    test("create translation with all valid fields → success toast + row in list", async ({
      asAdmin: page,
    }) => {
      const ns = await openFormAndGetNamespace(page);
      const key = `create.valid.${Date.now()}`;

      await transPage.namespaceInput.selectOption(ns);
      await transPage.keyInput.fill(key);
      await transPage.geInput.fill("ქართული ტექსტი");
      await transPage.enInput.fill("English text");
      await transPage.saveBtn.click();

      await expectSuccessToast(page);
      await transPage.searchInput.fill(key);
      await page.waitForTimeout(500);
      await expect(await transPage.getRowByKey(key)).toBeVisible();
    });

    test("create in a second namespace (if available)", async ({
      asAdmin: page,
    }) => {
      await transPage.addBtn.click();
      const options = page.locator("#namespace option");
      if ((await options.count()) <= 1) {
        test.skip();
        return;
      }

      const ns = await options.nth(1).getAttribute("value");
      const key = `ns2.create.${Date.now()}`;

      await transPage.namespaceInput.selectOption(ns!);
      await transPage.keyInput.fill(key);
      await transPage.geInput.fill("ნეიმსპეისი 2");
      await transPage.enInput.fill("Namespace 2");
      await transPage.saveBtn.click();

      await expectSuccessToast(page);
      await transPage.searchInput.fill(key);
      await page.waitForTimeout(500);
      await expect(await transPage.getRowByKey(key)).toBeVisible();
    });

    test("form fields are cleared after successful save", async ({
      asAdmin: page,
    }) => {
      const ns = await openFormAndGetNamespace(page);
      const key = `form.clear.${Date.now()}`;

      await transPage.namespaceInput.selectOption(ns);
      await transPage.keyInput.fill(key);
      await transPage.geInput.fill("ტექსტი");
      await transPage.enInput.fill("Text");
      await transPage.saveBtn.click();

      await expectSuccessToast(page);
      // Form should close or clear after save
      await transPage.addBtn.click();
      await expect(transPage.keyInput).toHaveValue("");
    });

    test("toggle button closes and re-opens the add form", async ({
      asAdmin: page,
    }) => {
      await transPage.addBtn.click();
      await expect(transPage.keyInput).toBeVisible();
      await transPage.addBtn.click();
      await expect(page.locator(".add-form")).not.toBeVisible();
      await transPage.addBtn.click();
      await expect(transPage.keyInput).toBeVisible();
    });

    test("translation with emojis in values → success", async ({
      asAdmin: page,
    }) => {
      const ns = await openFormAndGetNamespace(page);
      const key = `emoji.${Date.now()}`;

      await transPage.namespaceInput.selectOption(ns);
      await transPage.keyInput.fill(key);
      await transPage.geInput.fill("ქართული 🚀");
      await transPage.enInput.fill("English 🌟");
      await transPage.saveBtn.click();

      await expectSuccessToast(page);
      await transPage.searchInput.fill(key);
      await page.waitForTimeout(500);
      const row = await transPage.getRowByKey(key);
      await expect(row).toContainText("🚀");
      await expect(row).toContainText("🌟");
    });
  });
};
