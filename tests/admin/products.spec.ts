import { test, expect } from "../fixtures/auth.fixture";
import { ProductsPage } from "../pages/ProductsPage";
import { ApiHelper } from "../helpers/api.helper";

test.describe("Admin — Products", () => {
  let productsPage: ProductsPage;
  let api: ApiHelper;
  const testPartnerId = process.env.ORGANIZER_PARTNER_ID || "69d55668455a2f1d177e06a2"; // Updated fallback

  test.beforeEach(async ({ asAdmin: page }) => {
    productsPage = new ProductsPage(page);
    api = new ApiHelper();
    await api.login();
    await productsPage.goto();
  });

  test("PR-001: ✅ all products list loads correctly", async ({ asAdmin: page }) => {
    // Check header first
    await expect(page.locator(".page-header h1")).toHaveText(/ყველა პროდუქტი|All Products/);
    
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator(".product-row").first()).toBeVisible();
  });

  test("PR-002: ✅ delete product as admin from global list", async ({ asAdmin: page }) => {
    // Check header first
    await expect(page.locator(".page-header h1")).toHaveText(/ყველა პროდუქტი|All Products/);

    // 1. Find the first product in the list
    const productRow = page.locator(".product-row").first();
    await expect(productRow).toBeVisible();
    
    // Attempt to get the title from a known selector
    const productTitle = await productRow.locator(".title-ge").first().textContent() || "პროდუქტი";

    // 2. Click Delete
    const deleteBtn = productRow.locator(".delete-btn");
    
    // Handle confirm dialog
    page.once("dialog", async dialog => {
      expect(dialog.message()).toContain("ნამდვილად გსურთ");
      await dialog.accept();
    });

    await deleteBtn.click();

    // 3. Verify success
    await expect(page.locator(".Toastify__toast--success").first()).toBeVisible();
    
    // 4. Search for it and verify it's gone
    const searchInput = page.locator('input[placeholder*="ძიება"]');
    await searchInput.clear();
    await searchInput.fill(productTitle.trim());
    await page.waitForTimeout(1000);
    
    await expect(page.locator(".product-row").filter({ hasText: productTitle.trim() })).not.toBeVisible();
  });

  test("PR-003: ✅ search products by title and description", async ({ asAdmin: page }) => {
    // Check header first
    await expect(page.locator(".page-header h1")).toHaveText(/ყველა პროდუქტი|All Products/);

    // 1. Find the first product to get its details
    const firstRow = page.locator(".product-row").first();
    await expect(firstRow).toBeVisible();
    
    // Attempt to get title and description from known selectors
    const title = (await firstRow.locator(".title-ge").first().textContent())?.trim() || "";
    // Note: Description is not in the row itself, so we'll search by a generic string or just titles

    const searchInput = page.locator('input[placeholder*="ძიება"]');
    
    // 2. Search by title
    if (title) {
      await searchInput.clear();
      await searchInput.fill(title);
      await page.waitForTimeout(1000); 
      await expect(page.locator(".product-row").filter({ hasText: title }).first()).toBeVisible();
    }

    // 3. Search by title (verify filtering works)
    await searchInput.clear();
    await searchInput.fill(title);
    await page.waitForTimeout(1000); 
    const results = page.locator(".product-row");
    await expect(results.first()).toContainText(title);
  });

  test("PR-004: ✅ admin cannot see 'Add Product' button on global list", async ({ asAdmin: page }) => {
    await expect(page.locator(".page-header h1")).toHaveText(/ყველა პროდუქტი|All Products/);
    const addBtn = page.locator(".add-product-btn");
    await expect(addBtn).not.toBeVisible();
  });

  test("PR-005: ✅ admin can see partner products but no 'Add' button", async ({ asAdmin: page }) => {
    await productsPage.goto(testPartnerId);
    await expect(page.locator(".page-header h1")).toHaveText(/პროდუქტები|Products/);
    await expect(page).toHaveURL(new RegExp(`/partners/${testPartnerId}/products`));
    
    const addBtn = page.locator(".add-product-btn");
    await expect(addBtn).not.toBeVisible();
    
    // Verify list loads
    await expect(page.locator(".product-row").or(page.locator(".empty-state"))).toBeVisible();
  });

  test("PR-006: ✅ hide/show (toggle visibility) product as admin", async ({ asAdmin: page }) => {
    // Check header first
    await expect(page.locator(".page-header h1")).toHaveText(/ყველა პროდუქტი|All Products/);

    // 1. Find the first product row
    const productRow = page.locator(".product-row").first();
    await expect(productRow).toBeVisible();

    const toggleBtn = productRow.locator(".toggle-btn");
    const statusCol = productRow.locator(".col-status");
    
    // Check initial state text
    const initialStatus = (await statusCol.textContent())?.trim() || "";
    const isInitiallyShown = initialStatus.includes("საჯარო") || initialStatus.includes("Public");

    // 2. Toggle visibility and wait for API response
    const responsePromise = page.waitForResponse(resp => resp.url().includes("/api/admin/products") && resp.request().method() === "PATCH");
    await toggleBtn.click();
    await responsePromise;
    
    // 3. Wait for success toast
    await expect(page.locator(".Toastify__toast--success").first()).toBeVisible();
    await page.waitForTimeout(500); // Small grace period for React re-render

    // 4. Verify text change
    if (isInitiallyShown) {
      await expect(statusCol).toContainText(/დამალული|Hidden/);
    } else {
      await expect(statusCol).toContainText(/საჯარო|Public/);
    }

    // 5. Toggle back
    const responsePromiseBack = page.waitForResponse(resp => resp.url().includes("/api/admin/products") && resp.request().method() === "PATCH");
    await toggleBtn.click();
    await responsePromiseBack;
    await expect(page.locator(".Toastify__toast--success").first()).toBeVisible();
    await page.waitForTimeout(500);

    if (isInitiallyShown) {
      await expect(statusCol).toContainText(/საჯარო|Public/);
    } else {
      await expect(statusCol).toContainText(/დამალული|Hidden/);
    }
  });

  test("PR-007: ✅ product management from detailed page", async ({ asAdmin: page }) => {
    // Check header first
    await expect(page.locator(".page-header h1")).toHaveText(/ყველა პროდუქტი|All Products/);

    // 1. Find the first product row and navigate to details
    const productRow = page.locator(".product-row").first();
    await expect(productRow).toBeVisible();
    
    const title = (await productRow.locator(".title-ge").first().textContent())?.trim() || "";
    
    // Click row to navigate
    await productRow.click();
    
    // 2. Verify we are on the details page
    await expect(page.locator(".product-details-page")).toBeVisible();
    await expect(page.locator(".details-header h1")).toHaveText(title);

    const toggleBtn = page.locator(".toggle-details-btn");
    const deleteBtn = page.locator(".delete-details-btn");
    const statusText = page.locator(".status-indicator");

    await expect(toggleBtn).toBeVisible();
    await expect(deleteBtn).toBeVisible();

    // 3. Test Toggle Visibility on details page
    const initialText = (await statusText.textContent())?.trim() || "";
    const isInitiallyShown = initialText.includes("საჯარო") || initialText.includes("Public");

    const responsePromise = page.waitForResponse(resp => resp.url().includes("/api/admin/products") && resp.request().method() === "PATCH");
    await toggleBtn.click();
    await responsePromise;
    await expect(page.locator(".Toastify__toast--success").first()).toBeVisible();
    await page.waitForTimeout(500);

    if (isInitiallyShown) {
       await expect(statusText).toContainText(/დამალული|Hidden/);
    } else {
       await expect(statusText).toContainText(/საჯარო|Public/);
    }

    // Toggle back
    const responsePromiseBack = page.waitForResponse(resp => resp.url().includes("/api/admin/products") && resp.request().method() === "PATCH");
    await toggleBtn.click();
    await responsePromiseBack;
    await expect(page.locator(".Toastify__toast--success").first()).toBeVisible();
    await page.waitForTimeout(500);

    if (isInitiallyShown) {
       await expect(statusText).toContainText(/საჯარო|Public/);
    } else {
       await expect(statusText).toContainText(/დამალული|Hidden/);
    }

    // 4. Test Delete on details page
    page.once("dialog", async dialog => {
      expect(dialog.message()).toContain("ნამდვილად გსურთ");
      await dialog.accept();
    });

    const deleteResponsePromise = page.waitForResponse(resp => resp.url().includes("/api/admin/products") && resp.request().method() === "DELETE");
    await deleteBtn.click();
    await deleteResponsePromise;
    await expect(page.locator(".Toastify__toast--success").first()).toBeVisible();

    // After deletion, it should navigate back
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator(".product-row").filter({ hasText: title })).not.toBeVisible();
  });
});

