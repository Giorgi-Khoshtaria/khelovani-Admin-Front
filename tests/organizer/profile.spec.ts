import { test, expect } from "../fixtures/auth.fixture";
import { PartnersPage } from "../pages/PartnersPage";

test.describe("Organizer — Profile", () => {
  let partnersPage: PartnersPage;

  test.beforeEach(async ({ asOrganizer: page }) => {
    partnersPage = new PartnersPage(page);
    await page.goto("/profile");
    // Enter edit mode — inputs only exist when isEditing=true
    await partnersPage.editBtn.click();
  });

  test("✅ profile page loads with organizer data", async ({ asOrganizer: page }) => {
    await expect(partnersPage.companyNameGe).not.toHaveValue("");
    await expect(page).toHaveURL(/\/profile/);
  });

  test("✅ update companyNameGe", async ({ asOrganizer: page }) => {
    // Backend validates companyNameGe as Georgian-only characters (no numbers allowed)
    const timestamp = Date.now().toString().slice(-4);
    // Map digits to Georgian letters to keep it unique without using numbers
    const geoMap: Record<string, string> = {
      '0': 'ა', '1': 'ბ', '2': 'გ', '3': 'დ', '4': 'ე',
      '5': 'ვ', '6': 'ზ', '7': 'თ', '8': 'ი', '9': 'კ'
    };
    const geoSuffix = timestamp.split('').map(d => geoMap[d] || 'ა').join('');
    const newName = `ორგანიზაცია ${geoSuffix}`;
    await partnersPage.companyNameGe.fill(newName);
    await page.locator("button.save-btn").click();

    await expect(page.locator(".Toastify__toast--success")).toBeVisible();
    await page.reload();
    // Re-enter edit mode after reload to read the input value
    await partnersPage.editBtn.click();
    await expect(partnersPage.companyNameGe).toHaveValue(newName);
  });

  test("❌ clear required field phone", async ({ asOrganizer: page }) => {
    await partnersPage.phone.clear();
    await page.locator("button.save-btn").click();
    await expect(page.locator(".error-text")).toContainText("ტელეფონი სავალდებულოა");
  });
});
