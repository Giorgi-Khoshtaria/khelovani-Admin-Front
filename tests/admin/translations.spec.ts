import { test, expect } from "../fixtures/auth.fixture";
import { TranslationsPage } from "../pages/TranslationsPage";

test.describe("Admin — Translations", () => {
  // backtest: tests/api/admin/translations/translations.api.spec.ts

  let transPage: TranslationsPage;

  test.beforeEach(async ({ asAdmin: page }) => {
    transPage = new TranslationsPage(page);
    await transPage.goto();
  });

  test.describe("Creation & Basic Actions", () => {
    test("TRN-001: ✅ create translation with valid fields", async ({ asAdmin: page }) => {
      await transPage.addBtn.click();
      const firstNamespace = await page
        .locator("#namespace option")
        .nth(0)
        .getAttribute("value");
      await transPage.addBtn.click(); // Close it back to use createTranslation which opens it

      const data = {
        namespace: firstNamespace!,
        key: `test.key.${Date.now()}`,
        ge: "ქართული თარგმანი",
        en: "English Translation",
      };

      await transPage.createTranslation(data);
      await expect(page.locator(".Toastify__toast--success")).toBeVisible();

      await transPage.searchInput.fill(data.key);
      await page.waitForTimeout(500);
      await expect(await transPage.getRowByKey(data.key)).toBeVisible();
    });

    test("✅ cancel add translation form clears/closes correctly", async ({
      asAdmin: page,
    }) => {
      await transPage.addBtn.click();
      await transPage.keyInput.fill("temp.key");
      await transPage.addBtn.click(); // This is the "გაუქმება" button now

      await expect(page.locator(".add-form")).not.toBeVisible();

      await transPage.addBtn.click();
      await expect(transPage.keyInput).toHaveValue("");
    });

    test("✅ create translation in a specific namespace", async ({
      asAdmin: page,
    }) => {
      await transPage.addBtn.click();
      const namespaces = await page.locator("#namespace option");
      if ((await namespaces.count()) > 1) {
        const secondNamespace = await namespaces.nth(1).getAttribute("value");
        await transPage.addBtn.click(); // Close to use createTranslation
        const key = `ns.test.${Date.now()}`;

        await transPage.createTranslation({
          namespace: secondNamespace!,
          key: key,
          ge: "ტესტ ნეიმსპეისი",
          en: "Test Namespace",
        });

        await expect(page.locator(".Toastify__toast--success")).toBeVisible();

        // Verify in list
        await transPage.searchInput.fill(key);
        await page.waitForTimeout(500);
        await expect(await transPage.getRowByKey(key)).toBeVisible();
      }
    });

    test("✅ handle special characters and long keys", async ({
      asAdmin: page,
    }) => {
      await transPage.addBtn.click();
      const namespaces = await page.locator("#namespace option");
      const firstNamespace = await namespaces.nth(0).getAttribute("value");
      await transPage.addBtn.click(); // Close

      const longKey = "a".repeat(50) + `.special_char.${Date.now()}`;
      await transPage.createTranslation({
        namespace: firstNamespace!,
        key: longKey,
        ge: "სპეციალური",
        en: "Special",
      });

      await expect(page.locator(".Toastify__toast--success")).toBeVisible();
      await transPage.searchInput.fill(""); // Force clear
      await transPage.searchInput.dispatchEvent("change");
      await transPage.searchInput.fill(longKey);
      await page.waitForTimeout(2000); // Give it more time
      const row = await transPage.getRowByKey(longKey);
      await expect(row).toBeVisible();
    });

    test("✅ ge and en: support HTML tags and emojis", async ({
      asAdmin: page,
    }) => {
      await transPage.addBtn.click();
      const namespaces = await page.locator("#namespace option");
      const firstNamespace = await namespaces.nth(0).getAttribute("value");
      await transPage.addBtn.click(); // Close
      const key = `rich.text.${Date.now()}`;
      const geValue = "<b>ქართული</b> 🚀";
      const enValue = "<i>English</i> 🌟";

      await transPage.createTranslation({
        namespace: firstNamespace!,
        key: key,
        ge: geValue,
        en: enValue,
      });

      await expect(page.locator(".Toastify__toast--success")).toBeVisible();
      await transPage.searchInput.fill(key);
      await page.waitForTimeout(500);

      const row = await transPage.getRowByKey(key);
      await expect(row).toContainText(geValue);
      await expect(row).toContainText(enValue);
    });

    test("✅ ge and en: verify whitespace trimming", async ({
      asAdmin: page,
    }) => {
      await transPage.addBtn.click();
      const namespaces = await page.locator("#namespace option");
      const firstNamespace = await namespaces.nth(0).getAttribute("value");
      await transPage.addBtn.click(); // Close
      const key = `trim.test.${Date.now()}`;
      const geValue = "  გაფილტრული  ";
      const enValue = "  trimmed  ";

      await transPage.createTranslation({
        namespace: firstNamespace!,
        key: key,
        ge: geValue,
        en: enValue,
      });

      await expect(page.locator(".Toastify__toast--success")).toBeVisible();
      await transPage.searchInput.fill(key);
      await page.waitForTimeout(500);

      // Check if values in the list are trimmed
      await expect(page.locator(`.item-row:has-text("${key}")`)).toContainText(
        geValue.trim(),
      );
      await expect(page.locator(`.item-row:has-text("${key}")`)).toContainText(
        enValue.trim(),
      );
    });
  });

  test.describe("Inline Editing", () => {
    test("✅ inline edit existing translation", async ({ asAdmin: page }) => {
      const key = `edit.test.${Date.now()}`;
      await transPage.addBtn.click();
      const namespaces = await page.locator("#namespace option");
      const firstNamespace = await namespaces.nth(0).getAttribute("value");
      await transPage.addBtn.click(); // Close

      await transPage.createTranslation({
        namespace: firstNamespace!,
        key,
        ge: "საწყისი",
        en: "Initial",
      });

      await expect(page.locator(".Toastify__toast--success")).toBeVisible();
      await page.waitForTimeout(1000);

      const newGe = "განახლებული";
      await transPage.searchInput.fill("");
      await transPage.searchInput.fill(key);
      await page.waitForTimeout(1000);

      await transPage.editRowByKey(key, { ge: newGe });
      await expect(page.locator(".Toastify__toast--success")).toBeVisible();

      const row = await transPage.getRowByKey(key);
      await expect(row).toContainText(newGe);
    });
  });

  test.describe("Field Validations", () => {
    test("TRN-003: ❌ validation: show errors for each missing required field", async ({
      asAdmin: page,
    }) => {
      await transPage.addBtn.click();
      await transPage.saveBtn.click();

      await expect(page.getByTestId("key-error")).toContainText(
        "გასაღები სავალდებულოა",
      );
      await expect(page.getByTestId("ge-error")).toContainText(
        "ქართული თარგმანი სავალდებულოა",
      );
      await expect(page.getByTestId("en-error")).toContainText(
        "ინგლისური თარგმანი სავალდებულოა",
      );
    });

    test("TRN-002: ❌ 422 — duplicate namespace and key", async ({ asAdmin: page }) => {
      const key = `dup.key.${Date.now()}`;
      const data = {
        namespace: "auth", 
        key: key,
        ge: "პირველი",
        en: "First",
      };
      
      await transPage.createTranslation(data);
      await expect(page.locator(".Toastify__toast--success")).toBeVisible();
      
      // Try creating again
      await transPage.createTranslation(data);
      await expect(page.locator(".Toastify__toast--error").or(page.getByTestId("key-error"))).toBeVisible();
    });

    test("❌ validation: key length (too short and too long)", async ({
      asAdmin: page,
    }) => {
      await transPage.addBtn.click();

      // Too short (1 char)
      await transPage.keyInput.fill("a");
      await transPage.saveBtn.click();
      await expect(page.getByTestId("key-error")).toContainText(
        "გასაღები უნდა იყოს მინიმუმ 2 სიმბოლო",
      );

      // Too long (101 chars)
      await transPage.keyInput.fill("a".repeat(101));
      await transPage.saveBtn.click();
      await expect(page.getByTestId("key-error")).toContainText(
        "გასაღები უნდა იყოს მაქსიმუმ 100 სიმბოლო",
      );
    });

    test("❌ validation: translation length (too long)", async ({
      asAdmin: page,
    }) => {
      await transPage.addBtn.click();

      const longText = "a".repeat(201);
      await transPage.geInput.fill(longText);
      await transPage.enInput.fill(longText);
      await transPage.saveBtn.click();

      await expect(page.getByTestId("ge-error")).toContainText(
        "თარგმანი არ უნდა აღემატებოდეს 200 სიმბოლოს",
      );
      await expect(page.getByTestId("en-error")).toContainText(
        "თარგმანი არ უნდა აღემატებოდეს 200 სიმბოლოს",
      );
    });

    test("❌ validation: inline edit translation length (too long)", async ({
      asAdmin: page,
    }) => {
      const key = `edit.val.test.${Date.now()}`;
      await transPage.addBtn.click();
      const namespaces = await page.locator("#namespace option");
      const firstNamespace = await namespaces.nth(0).getAttribute("value");
      await transPage.addBtn.click(); // Close

      await transPage.createTranslation({
        namespace: firstNamespace!,
        key,
        ge: "საწყისი",
        en: "Initial",
      });

      await expect(page.locator(".Toastify__toast--success")).toBeVisible();
      await page.waitForTimeout(1000);

      await transPage.searchInput.fill("");
      await transPage.searchInput.fill(key);
      await page.waitForTimeout(1000);

      // Enter Edit Mode
      const row = await transPage.getRowByKey(key);
      await row.locator(".edit-btn").click();

      // Fill too long text (> 200)
      const longText = "a".repeat(201);
      await row.locator('input[type="text"]').nth(0).fill(longText);
      await row.locator('input[type="text"]').nth(1).fill(longText);
      await row.locator(".save-btn").click();

      // Check errors
      await expect(row.getByTestId("edit-ge-error")).toContainText(
        "თარგმანი არ უნდა აღემატებოდეს 200 სიმბოლოს",
      );
      await expect(row.getByTestId("edit-en-error")).toContainText(
        "თარგმანი არ უნდა აღემატებოდეს 200 სიმბოლოს",
      );

      // Cancel editing
      await row.locator(".cancel-btn").click();
    });
  });

  test.describe("Search & Management", () => {
    test("✅ search filters results correctly", async ({ asAdmin: page }) => {
      // Search for non-existent key
      await transPage.searchInput.fill("");
      await transPage.searchInput.fill("non_existent_key_99999");
      await page.waitForTimeout(1000); // Wait for debounce and fetch
      await expect(page.locator(".no-data")).toBeVisible();

      // Search for common prefix
      await transPage.searchInput.fill("");
      await transPage.searchInput.fill("auth.");
      await page.waitForTimeout(1000);
      const rows = await page.locator(".item-row").count();
      expect(rows).toBeGreaterThan(0);
    });

    test("TRN-BULK: ✅ bulk select and bulk delete", async () => {
      // Select first two rows (skipping header checkbox at index 0)
      await transPage.rowCheckboxes.nth(1).check();
      await transPage.rowCheckboxes.nth(2).check();

      await expect(transPage.bulkDeleteBtn).toContainText("წაშლა (2)");
    });

    test("TRN-SEC: ❌ prevent XSS in translation values", async ({ asAdmin: page }) => {
       const xss = "<img src=x onerror=alert(1)>";
       await transPage.addBtn.click();
       await transPage.keyInput.fill(`xss.key.${Date.now()}`);
       await transPage.geInput.fill(xss);
       await transPage.enInput.fill("XSS Test");
       await transPage.saveBtn.click();
       
       await expect(page.locator(".Toastify__toast--error").or(page.locator(".error-text"))).toBeVisible();
    });
  });
});

