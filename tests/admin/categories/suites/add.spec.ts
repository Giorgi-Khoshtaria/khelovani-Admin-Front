import { test, expect } from "../../../fixtures/auth.fixture";
import { CategoriesPage } from "../../../pages/CategoriesPage";
import { ApiHelper } from "../../../helpers/api.helper";

const GE_CHARS = "ტესიაბგდვზთიკლმნოპ";
const EN_CHARS = "abcdefghijklmnopqrstuvwxyz";
const rand = (chars: string, len: number) =>
  Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
const uniqueSlug = () => `qa_${Date.now()}`;
const uniqueGe = () => rand(GE_CHARS, 8);
const uniqueEn = () => rand(EN_CHARS, 6)[0].toUpperCase() + rand(EN_CHARS, 5);

export const categoriesAddTests = () => {
  test.describe("Categories › Add Modal", () => {
    let page: CategoriesPage;
    let api: ApiHelper;
    let createdIds: string[] = [];

    test.beforeEach(async ({ asAdmin }) => {
      page = new CategoriesPage(asAdmin);
      api = new ApiHelper();
      await api.login();
      await page.goto();
      await page.waitForLoad();
    });

    test.afterEach(async () => {
      for (const id of createdIds) {
        await api.deleteCategory(id);
      }
      createdIds = [];
    });

    test("add button opens modal", async () => {
      await page.openAddModal();
      await expect(page.modal).toBeVisible();
    });

    test("cancel button closes modal", async () => {
      await page.openAddModal();
      await page.closeModal();
      await expect(page.modal).not.toBeVisible();
    });

    test("happy path — create category and see it in table", async () => {
      const slug = uniqueSlug();
      const nameGe = uniqueGe();
      const nameEn = uniqueEn();

      await page.openAddModal();
      await page.fillModal(slug, nameGe, nameEn);
      await page.submitModal();

      await expect(page.modal).not.toBeVisible({ timeout: 5000 });
      await expect(page.getRowBySlug(slug)).toBeVisible({ timeout: 8000 });

      const cats = await api.getCategories();
      const created = cats.find((c: any) => c.slug === slug);
      expect(created).toBeDefined();
      createdIds.push(created._id);
    });

    test("shows error when slug is missing", async () => {
      await page.openAddModal();
      await page.nameGeInput.fill(uniqueGe());
      await page.nameEnInput.fill(uniqueEn());
      await page.submitModal();

      await expect(page.modal).toBeVisible();
      await expect(page.page.locator(".field-error").first()).toBeVisible();
    });

    test("shows error when nameGe is missing", async () => {
      await page.openAddModal();
      await page.slugInput.fill(uniqueSlug());
      await page.nameEnInput.fill(uniqueEn());
      await page.submitModal();

      await expect(page.modal).toBeVisible();
      await expect(page.page.locator(".field-error").first()).toBeVisible();
    });

    test("shows error when nameEn is missing", async () => {
      await page.openAddModal();
      await page.slugInput.fill(uniqueSlug());
      await page.nameGeInput.fill(uniqueGe());
      await page.submitModal();

      await expect(page.modal).toBeVisible();
      await expect(page.page.locator(".field-error").first()).toBeVisible();
    });

    test("shows error when nameGe has Latin chars", async () => {
      await page.openAddModal();
      await page.fillModal(uniqueSlug(), "InvalidLatin", uniqueEn());
      await page.submitModal();

      await expect(page.modal).toBeVisible();
      await expect(page.page.locator(".field-error").first()).toBeVisible();
    });

    test("shows error when nameEn has Georgian chars", async () => {
      await page.openAddModal();
      await page.fillModal(uniqueSlug(), uniqueGe(), "სამკაული");
      await page.submitModal();

      await expect(page.modal).toBeVisible();
      await expect(page.page.locator(".field-error").first()).toBeVisible();
    });

    test("shows error when slug has spaces", async () => {
      await page.openAddModal();
      await page.fillModal("my category", uniqueGe(), uniqueEn());
      await page.submitModal();

      await expect(page.modal).toBeVisible();
      await expect(page.page.locator(".field-error").first()).toBeVisible();
    });

    test("shows error when slug is 1 char (min 2)", async () => {
      await page.openAddModal();
      await page.fillModal("a", uniqueGe(), uniqueEn());
      await page.submitModal();

      await expect(page.modal).toBeVisible();
      await expect(page.page.locator(".field-error").first()).toBeVisible();
    });
  });
};
