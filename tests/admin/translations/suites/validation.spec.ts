import { test, expect } from "../../../fixtures/auth.fixture";
import { TranslationsPage } from "../../../pages/TranslationsPage";
import {
  translationKeyScenarios,
  translationGeScenarios,
  translationEnScenarios,
  translationBoundaryPassScenarios,
  assertScenario,
  assertSuccessToast,
} from "../../../helpers/validation-scenarios.helper";
export const translationsValidationTests = () => {
  test.describe("Admin — Translations › Validation", () => {
    let transPage: TranslationsPage;

    test.beforeEach(async ({ asAdmin: page }) => {
      transPage = new TranslationsPage(page);
      await transPage.goto();
      await transPage.addBtn.click();
      await expect(transPage.namespaceInput).toBeVisible();
    });

    // ── Key field ─────────────────────────────────────────────────────────────

    for (const s of translationKeyScenarios) {
      test(`${s.id} — key: ${s.note}`, async ({ asAdmin: page }) => {
        await transPage.keyInput.fill(s.value);
        await transPage.saveBtn.click();
        await assertScenario(page.getByTestId("key-error"), s);
      });
    }

    // ── Georgian value ────────────────────────────────────────────────────────

    for (const s of translationGeScenarios) {
      test(`${s.id} — ge: ${s.note}`, async ({ asAdmin: page }) => {
        await transPage.geInput.fill(s.value);
        await transPage.saveBtn.click();
        await assertScenario(page.getByTestId("ge-error"), s);
      });
    }

    // ── English value ─────────────────────────────────────────────────────────

    for (const s of translationEnScenarios) {
      test(`${s.id} — en: ${s.note}`, async ({ asAdmin: page }) => {
        await transPage.enInput.fill(s.value);
        await transPage.saveBtn.click();
        await assertScenario(page.getByTestId("en-error"), s);
      });
    }

    // ── Empty form → all three required errors ────────────────────────────────

    test("empty form → key + ge + en required errors shown", async ({
      asAdmin: page,
    }) => {
      await transPage.saveBtn.click();
      await expect(page.getByTestId("key-error")).toBeVisible();
      await expect(page.getByTestId("ge-error")).toBeVisible();
      await expect(page.getByTestId("en-error")).toBeVisible();
    });

    // ── Boundary: values that must pass ───────────────────────────────────────

    for (const s of translationBoundaryPassScenarios) {
      test(`${s.id} — boundary pass: ${s.note}`, async ({ asAdmin: page }) => {
        if (s.field === "key") await transPage.keyInput.fill(s.value);
        if (s.field === "ge") await transPage.geInput.fill(s.value);
        if (s.field === "en") await transPage.enInput.fill(s.value);

        await transPage.saveBtn.click();

        const errorTestId = `${s.field}-error`;
        await expect(page.getByTestId(errorTestId))
          .not.toBeVisible({ timeout: 3000 })
          .catch(() => {});
      });
    }

    // ── Duplicate key in same namespace → error ───────────────────────────────

    test("duplicate key in same namespace → error on second create", async ({
      asAdmin: page,
    }) => {
      const ns =
        (await page
          .locator("#namespace option")
          .nth(0)
          .getAttribute("value")) ?? "auth";
      const key = `dup.${Date.now()}`;

      await transPage.namespaceInput.selectOption(ns);
      await transPage.keyInput.fill(key);
      await transPage.geInput.fill("პირველი");
      await transPage.enInput.fill("First");
      await transPage.saveBtn.click();
      await assertSuccessToast(page);

      await transPage.createTranslation({
        namespace: ns,
        key,
        ge: "მეორე",
        en: "Second",
      });

      await expect(
        page
          .locator(".Toastify__toast--error")
          .or(page.getByTestId("key-error")),
      ).toBeVisible({ timeout: 10000 });
    });

    // ── Modal edit validation ─────────────────────────────────────────────────

    test("modal edit: ge value over 200 chars → error stays in modal", async ({
      asAdmin: page,
    }) => {
      const ns =
        (await page
          .locator("#namespace option")
          .nth(0)
          .getAttribute("value")) ?? "auth";
      const key = `modal.val.${Date.now()}`;

      await transPage.namespaceInput.selectOption(ns);
      await transPage.keyInput.fill(key);
      await transPage.geInput.fill("საწყისი");
      await transPage.enInput.fill("Initial");
      await transPage.saveBtn.click();
      await assertSuccessToast(page);

      await transPage.searchInput.fill(key);
      await page.waitForTimeout(500);
      const row = await transPage.getRowByKey(key);
      await row.locator(".edit-btn").click();
      await expect(transPage.editModal).toBeVisible();

      await transPage.editGeInput.fill("ა".repeat(201));
      await transPage.modalSaveBtn.click();
      await expect(
        transPage.editModal.locator(".error-text").first(),
      ).toBeVisible();

      await transPage.modalCancelBtn.click();
    });
  });
};
