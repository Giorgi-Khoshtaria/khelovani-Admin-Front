import { test } from "../../../fixtures/auth.fixture";
import { TranslationsPage } from "../../../pages/TranslationsPage";
import { assertNoXssDialog } from "../../../helpers/validation-scenarios.helper";

export const translationsSecurityTests = () => {
  test.describe("Admin — Translations › Security", () => {
    let transPage: TranslationsPage;

    test.beforeEach(async ({ asAdmin: page }) => {
      transPage = new TranslationsPage(page);
      await transPage.goto();
    });

    test("XSS payload in ge value → no alert dialog fires", async ({
      asAdmin: page,
    }) => {
      const ns = await (async () => {
        await transPage.addBtn.click();
        const v = await page
          .locator("#namespace option")
          .nth(0)
          .getAttribute("value");
        await transPage.addBtn.click(); // close
        return v ?? "auth";
      })();

      await assertNoXssDialog(page, async () => {
        await transPage.addBtn.click();
        await transPage.namespaceInput.selectOption(ns);
        await transPage.keyInput.fill(`xss.ge.${Date.now()}`);
        await transPage.geInput.fill("<img src=x onerror=alert(1)>");
        await transPage.enInput.fill("XSS test");
        await transPage.saveBtn.click();
        await page.waitForTimeout(800);
      });
    });

    test("XSS payload in en value → no alert dialog fires", async ({
      asAdmin: page,
    }) => {
      const ns = await (async () => {
        await transPage.addBtn.click();
        const v = await page
          .locator("#namespace option")
          .nth(0)
          .getAttribute("value");
        await transPage.addBtn.click(); // close
        return v ?? "auth";
      })();

      await assertNoXssDialog(page, async () => {
        await transPage.addBtn.click();
        await transPage.namespaceInput.selectOption(ns);
        await transPage.keyInput.fill(`xss.en.${Date.now()}`);
        await transPage.geInput.fill("XSS test");
        await transPage.enInput.fill("<script>alert('en')</script>");
        await transPage.saveBtn.click();
        await page.waitForTimeout(800);
      });
    });

    test("XSS payload in key field → no alert dialog fires", async ({
      asAdmin: page,
    }) => {
      await assertNoXssDialog(page, async () => {
        await transPage.addBtn.click();
        await transPage.keyInput.fill("<script>alert('key')</script>");
        await transPage.geInput.fill("ტექსტი");
        await transPage.enInput.fill("Text");
        await transPage.saveBtn.click();
        await page.waitForTimeout(800);
      });
    });
  });
};
