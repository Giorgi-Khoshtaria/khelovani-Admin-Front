import { Page, Locator } from "@playwright/test";

export class CategoriesPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly addBtn: Locator;
  readonly table: Locator;
  readonly rows: Locator;

  // Modal
  readonly modal: Locator;
  readonly slugInput: Locator;
  readonly nameGeInput: Locator;
  readonly nameEnInput: Locator;
  readonly saveModalBtn: Locator;
  readonly cancelModalBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator("h1");
    this.addBtn = page.locator("button", { hasText: "კატეგორიის დამატება" });
    this.table = page.locator(".category-table");
    this.rows = page.locator(".category-table tbody tr");

    this.modal = page.locator(".category-modal");
    this.slugInput = page.locator("#slug");
    this.nameGeInput = page.locator("#nameGe");
    this.nameEnInput = page.locator("#nameEn");
    this.saveModalBtn = page.locator(".category-modal .btn-primary");
    this.cancelModalBtn = page.locator(".category-modal .btn-secondary");
  }

  async goto() {
    await this.page.goto("/categories");
  }

  async waitForLoad() {
    await this.page.waitForSelector(".category-table", { timeout: 10000 });
  }

  async openAddModal() {
    await this.addBtn.click();
    await this.page.waitForSelector(".category-modal", { timeout: 5000 });
  }

  async fillModal(slug: string, nameGe: string, nameEn: string) {
    await this.slugInput.fill(slug);
    await this.nameGeInput.fill(nameGe);
    await this.nameEnInput.fill(nameEn);
  }

  async submitModal() {
    await this.saveModalBtn.click();
  }

  async closeModal() {
    await this.cancelModalBtn.click();
  }

  getRowBySlug(slug: string) {
    return this.page.locator("tr", { hasText: slug });
  }

  /** Row currently in edit mode (has inline inputs). Only one at a time. */
  get editingRow() {
    return this.page.locator("tbody tr", { has: this.page.locator("input.category-row__input") });
  }

  getEditBtnForRow(slug: string) {
    return this.getRowBySlug(slug).locator("button[title='რედაქტირება']");
  }

  getDeleteBtnForRow(slug: string) {
    return this.getRowBySlug(slug).locator("button[title='წაშლა']");
  }
}
