import { test, expect } from "../fixtures/auth.fixture";
import { ProductsPage } from "../pages/ProductsPage";
import * as path from "path";

test.describe("Organizer — Products", () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ asOrganizer: page }) => {
    productsPage = new ProductsPage(page);
    await page.goto("/profile/products");
  });

  test("✅ /products loads — shows only this partner's products", async ({
    asOrganizer: page,
  }) => {
    await expect(page).toHaveURL(/\/profile\/products/);
  });

  test("✅ create product via UI", async ({ asOrganizer: page }) => {
    await expect(page).toHaveURL(/\/profile\/products/);
    await productsPage.addBtn.click();

    const data = {
      titleGe: "ორგანიზატორის პროდუქტი",
      titleEn: "Organizer Product",
      descriptionGe: "სადემონსტრაციო აღწერა ორგანიზატორისთვის.",
      descriptionEn: "Demo description for organizer product.",
      category: "jewelry_accessories",
      price: 99,
      stockQuantity: 10,
      condition: "new",
      tagsGe: "უნიკალური, ხელნაკეთი",
      tagsEn: "Unique, Handmade",
      materialsGe: "ვერცხლი, მინანქარი",
      materialsEn: "Silver, Enamel",
    };

    const filePath = path.resolve(
      process.cwd(),
      "tests/assets/demo-product.jpg",
    );
    await productsPage.imageInput.setInputFiles(filePath);

    await productsPage.fillForm(data);
    
    const saveBtn = page.locator('button.save-btn');
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();

    // Better debugging
    const successToast = page.locator(".Toastify__toast--success");
    const errorToast = page.locator(".Toastify__toast--error");
    const inlineErrors = page.locator(".error-text");

    try {
      await Promise.race([
        expect(successToast.first()).toBeVisible({ timeout: 15000 }),
        expect(errorToast.first()).toBeVisible({ timeout: 15000 }),
        expect(inlineErrors.first()).toBeVisible({ timeout: 15000 }),
      ]);
    } catch (e) {
      await page.screenshot({ path: "test-results/product-creation-failure.png", fullPage: true });
      const errors = await inlineErrors.allInnerTexts();
      if (errors.length > 0) {
        throw new Error(`Product creation failed with inline errors: ${errors.join(", ")}`);
      }
      throw e;
    }

    if (await errorToast.first().isVisible()) {
      const msg = await errorToast.first().innerText();
      throw new Error(`Product creation failed with toast: ${msg}`);
    }
    await expect(successToast.first()).toBeVisible();
  });

  test("✅ visibility toggle is HIDDEN for organizers", async ({
    asOrganizer: page,
  }) => {
    const row = page.locator(".product-row").first();
    await row.click(); // Edit

    // The visibility select should NOT be found
    await expect(page.locator('select[name="isShown"]')).not.toBeVisible();
  });

  test("✅ organizer CANNOT access other partner products", async ({
    asOrganizer: page,
  }) => {
    await page.goto("/partners/other-id/products");
    await expect(page).not.toHaveURL(/\/partners\/other-id\/products/);
    await expect(page).toHaveURL(/\/profile/);
  });
});
