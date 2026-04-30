import { test, expect } from "../../../fixtures/auth.fixture";
import { CategoriesPage } from "../../../pages/CategoriesPage";
import { ApiHelper } from "../../../helpers/api.helper";

const GE_CHARS = "ტესიაბგდვზთიკ";
const EN_CHARS = "abcdefghijklmnopqrstuvwxyz";
const rand = (chars: string, len: number) =>
  Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
const uniqueSlug = () => `qa_edit_${Date.now()}`;
const uniqueGe = () => rand(GE_CHARS, 8);
const uniqueEn = () => rand(EN_CHARS, 6)[0].toUpperCase() + rand(EN_CHARS, 5);

export const categoriesInlineEditTests = () => {
  test.describe("Categories › Inline Edit", () => {
    let catPage: CategoriesPage;
    let api: ApiHelper;
    let createdId: string;
    let createdSlug: string;

    test.beforeEach(async ({ asAdmin }) => {
      catPage = new CategoriesPage(asAdmin);
      api = new ApiHelper();
      await api.login();

      createdSlug = uniqueSlug();
      const cat = await api.createCategory({
        slug: createdSlug,
        nameGe: uniqueGe(),
        nameEn: uniqueEn(),
      });
      createdId = cat._id;

      await catPage.goto();
      await catPage.waitForLoad();
    });

    test.afterEach(async () => {
      await api.deleteCategory(createdId);
    });

    test("clicking edit shows inline inputs", async () => {
      await catPage.getEditBtnForRow(createdSlug).click();
      await expect(catPage.editingRow).toBeVisible({ timeout: 5000 });
      await expect(catPage.editingRow.locator("input").first()).toBeVisible();
    });

    test("cancel edit restores original display", async () => {
      await catPage.getEditBtnForRow(createdSlug).click();
      await expect(catPage.editingRow).toBeVisible({ timeout: 5000 });

      await catPage.editingRow.locator("button", { hasText: "გაუქმება" }).click();

      await expect(catPage.editingRow).not.toBeVisible({ timeout: 5000 });
      await expect(catPage.getRowBySlug(createdSlug)).toBeVisible();
    });

    test("save edit updates the nameEn in the table", async () => {
      await catPage.getEditBtnForRow(createdSlug).click();
      await expect(catPage.editingRow).toBeVisible({ timeout: 5000 });

      const newNameEn = uniqueEn();
      // inputs: 0=slug, 1=nameGe, 2=nameEn
      await catPage.editingRow.locator("input").nth(2).fill(newNameEn);
      await catPage.editingRow.locator("button", { hasText: "შენახვა" }).click();

      await expect(catPage.editingRow).not.toBeVisible({ timeout: 5000 });
      await expect(catPage.page.locator("tbody")).toContainText(newNameEn, { timeout: 5000 });
    });

    test("inline edit with invalid nameEn shows error", async () => {
      await catPage.getEditBtnForRow(createdSlug).click();
      await expect(catPage.editingRow).toBeVisible({ timeout: 5000 });

      await catPage.editingRow.locator("input").nth(2).fill("სამკაული");
      await catPage.editingRow.locator("button", { hasText: "შენახვა" }).click();

      await expect(catPage.editingRow.locator(".category-row__field-error").first()).toBeVisible();
    });
  });
};
