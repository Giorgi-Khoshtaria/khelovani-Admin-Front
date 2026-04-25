import * as path from "path";
import { test, expect } from "../../../fixtures/auth.fixture";
import { ProductsPage } from "../../../pages/ProductsPage";
import {
  productTitleGeScenarios,
  productTitleEnScenarios,
  productDescGeScenarios,
  productDescEnScenarios,
  productPriceScenarios,
  productStockScenarios,
  productBoundaryPassScenarios,
  assertScenario,
} from "../../../helpers/validation-scenarios.helper";

export const validationTests = () => {
  test.describe("Organizer — Products › Validation", () => {
    let productsPage: ProductsPage;

    test.beforeEach(async ({ asOrganizer: page }) => {
      productsPage = new ProductsPage(page);
      await page.goto("/profile/products");
      await productsPage.addBtn.click();
      await expect(page).toHaveURL(/\/profile\/products\/(new|add)/);
    });

    test.describe("Field Validations (with image)", () => {
      test.beforeEach(async () => {
        const filePath = path.resolve(
          process.cwd(),
          "tests/assets/demo-product.jpg",
        );
        await productsPage.imageInput.setInputFiles(filePath);
      });

      // ── Georgian title ────────────────────────────────────────────────────────

      for (const s of productTitleGeScenarios) {
        test(`${s.id} — titleGe: ${s.note}`, async ({ asOrganizer: page }) => {
          await productsPage.titleGe.fill(s.value);
          await page.locator("button.save-btn").click();
          await assertScenario(page.locator(".error-text"), s);
        });
      }

      // ── English title ─────────────────────────────────────────────────────────

      for (const s of productTitleEnScenarios) {
        test(`${s.id} — titleEn: ${s.note}`, async ({ asOrganizer: page }) => {
          await productsPage.titleEn.fill(s.value);
          await page.locator("button.save-btn").click();
          await assertScenario(page.locator(".error-text"), s);
        });
      }

      // ── Georgian description ──────────────────────────────────────────────────

      for (const s of productDescGeScenarios) {
        test(`${s.id} — descriptionGe: ${s.note}`, async ({
          asOrganizer: page,
        }) => {
          await productsPage.descriptionGe.fill(s.value);
          await page.locator("button.save-btn").click();
          await assertScenario(page.locator(".error-text"), s);
        });
      }

      // ── English description ───────────────────────────────────────────────────

      for (const s of productDescEnScenarios) {
        test(`${s.id} — descriptionEn: ${s.note}`, async ({
          asOrganizer: page,
        }) => {
          await productsPage.descriptionEn.fill(s.value);
          await page.locator("button.save-btn").click();
          await assertScenario(page.locator(".error-text"), s);
        });
      }

      // ── Price ─────────────────────────────────────────────────────────────────

      for (const s of productPriceScenarios) {
        test(`${s.id} — price: ${s.note}`, async ({ asOrganizer: page }) => {
          // fill() throws for non-numeric values on type="number" inputs; that's fine — field stays empty
          await productsPage.price.fill(s.value).catch(() => {});
          await page.locator("button.save-btn").click();
          await assertScenario(page.locator(".error-text"), s);
        });
      }

      // ── Stock quantity ────────────────────────────────────────────────────────

      for (const s of productStockScenarios) {
        test(`${s.id} — stockQuantity: ${s.note}`, async ({
          asOrganizer: page,
        }) => {
          // fill() throws for non-numeric values on type="number" inputs; that's fine — field stays empty
          await productsPage.stockQuantity.fill(s.value).catch(() => {});
          await page.locator("button.save-btn").click();
          await assertScenario(page.locator(".error-text"), s);
        });
      }

      // ── Boundary: values that must pass ──────────────────────────────────────

      for (const s of productBoundaryPassScenarios) {
        test(`${s.id} — boundary pass: ${s.note}`, async ({
          asOrganizer: page,
        }) => {
          if (s.field === "price") await productsPage.price.fill(s.value);
          if (s.field === "stockQuantity")
            await productsPage.stockQuantity.fill(s.value);
          if (s.field === "titleGe") await productsPage.titleGe.fill(s.value);
          if (s.field === "descriptionGe")
            await productsPage.descriptionGe.fill(s.value);

          await page.locator("button.save-btn").click();

          // No price/stock error at boundary
          const errText = await page
            .locator(".error-text")
            .first()
            .textContent({ timeout: 3000 })
            .catch(() => "");
          expect(errText).not.toContain(
            s.value === "0" ? "0 ან მეტი" : "მინიმუმ",
          );
        });
      }
    });

    // ── Image & Empty Form (no image uploaded in beforeEach) ─────────────────

    test("empty form → required errors shown", async ({ asOrganizer: page }) => {
      await page.locator("button.save-btn").click();
      await expect(page.locator(".error-text").first()).toBeVisible({
        timeout: 5000,
      });
    });

    test("submit without image → image required error", async ({
      asOrganizer: page,
    }) => {
      await productsPage.fillForm({
        titleGe: "ქართული",
        titleEn: "English",
        price: 10,
        stockQuantity: 1,
      });
      await page.locator("button.save-btn").click();
      await expect(
        page.locator(".error-text, .Toastify__toast--error").first(),
      ).toBeVisible({ timeout: 5000 });
    });

    test("uploading non-image file → validation error", async ({
      asOrganizer: page,
    }) => {
      await productsPage.imageInput.setInputFiles({
        name: "fake.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("not an image"),
      });
      await page.locator("button.save-btn").click();
      await expect(
        page.locator(".error-text, .Toastify__toast--error").first(),
      ).toBeVisible({ timeout: 5000 });
    });
  });
};

