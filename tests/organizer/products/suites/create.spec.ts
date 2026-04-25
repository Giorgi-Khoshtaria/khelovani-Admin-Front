import * as path from "path";
import { test, expect } from "../../../fixtures/auth.fixture";
import { ProductsPage } from "../../../pages/ProductsPage";
import { expectSuccessToast } from "../../../helpers/validation.helper";

export const createTests = () => {
  test.describe("Organizer — Products › Create", () => {
    let productsPage: ProductsPage;

    test.beforeEach(async ({ asOrganizer: page }) => {
      productsPage = new ProductsPage(page);
      await page.goto("/profile/products");
    });

    test("add product button is visible for organizer", async ({
      asOrganizer: page,
    }) => {
      await productsPage.addBtn.click();
      await expect(page).toHaveURL(
        /\/profile\/products\/new|\/profile\/products\/add/,
      );
    });

    test("create product with all required fields → success toast", async ({
      asOrganizer: page,
    }) => {
      await productsPage.addBtn.click();

      const filePath = path.resolve(
        process.cwd(),
        "tests/assets/demo-product.jpg",
      );
      await productsPage.imageInput.setInputFiles(filePath);

      await productsPage.fillForm({
        titleGe: "ორგანიზატორის პროდუქტი",
        titleEn: "Organizer Product",
        descriptionGe: "სადემონსტრაციო აღწერა.",
        descriptionEn: "Demo description.",
        category: "jewelry",
        price: 99,
        stockQuantity: 10,
        condition: "new",
        tagsGe: "ხელნაკეთი",
        tagsEn: "Handmade",
        materialsGe: "ვერცხლი",
        materialsEn: "Silver",
      });

      const saveBtn = page.locator("button.save-btn");
      await expect(saveBtn).toBeEnabled();
      await saveBtn.click();

      const successToast = page.locator(".Toastify__toast--success");
      const errorToast = page.locator(".Toastify__toast--error");
      const inlineErrors = page.locator(".error-text");

      await Promise.race([
        expectSuccessToast(page),
        expect(errorToast.first()).toBeVisible({ timeout: 15000 }),
        expect(inlineErrors.first()).toBeVisible({ timeout: 15000 }),
      ]);

      if (await errorToast.first().isVisible()) {
        const msg = await errorToast.first().innerText();
        throw new Error(`Product creation failed: ${msg}`);
      }
      await expect(successToast.first()).toBeVisible();
    });
  });
};
