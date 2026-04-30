import { test, expect } from "../../../fixtures/auth.fixture";
import { CategoriesPage } from "../../../pages/CategoriesPage";
import { ApiHelper } from "../../../helpers/api.helper";

const GE_CHARS = "ტესიაბგდვ";
const EN_CHARS = "abcdefghijklmnopqrstuvwxyz";
const rand = (chars: string, len: number) =>
  Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
const uniqueSlug = () => `qa_del_${Date.now()}`;
const uniqueGe = () => rand(GE_CHARS, 8);
const uniqueEn = () => rand(EN_CHARS, 6)[0].toUpperCase() + rand(EN_CHARS, 5);

export const categoriesDeleteTests = () => {
  test.describe("Categories › Delete", () => {
    let catPage: CategoriesPage;
    let api: ApiHelper;

    test.beforeEach(async ({ asAdmin }) => {
      catPage = new CategoriesPage(asAdmin);
      api = new ApiHelper();
      await api.login();
      await catPage.goto();
      await catPage.waitForLoad();
    });

    test("delete removes category from table", async ({ asAdmin }) => {
      const slug = uniqueSlug();
      const cat = await api.createCategory({
        slug,
        nameGe: uniqueGe(),
        nameEn: uniqueEn(),
      });

      await catPage.goto();
      await catPage.waitForLoad();
      await expect(catPage.getRowBySlug(slug)).toBeVisible();

      asAdmin.on("dialog", (dialog) => dialog.accept());
      await catPage.getDeleteBtnForRow(slug).click();

      await expect(catPage.getRowBySlug(slug)).not.toBeVisible({ timeout: 6000 });

      await api.deleteCategory(cat._id).catch(() => {});
    });

    test("cancel on confirm dialog keeps category in table", async ({ asAdmin }) => {
      const slug = uniqueSlug();
      const cat = await api.createCategory({
        slug,
        nameGe: uniqueGe(),
        nameEn: uniqueEn(),
      });

      await catPage.goto();
      await catPage.waitForLoad();

      asAdmin.on("dialog", (dialog) => dialog.dismiss());
      await catPage.getDeleteBtnForRow(slug).click();

      await expect(catPage.getRowBySlug(slug)).toBeVisible();

      await api.deleteCategory(cat._id);
    });
  });
};
