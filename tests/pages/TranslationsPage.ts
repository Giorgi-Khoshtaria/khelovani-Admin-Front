import { Page, Locator } from "@playwright/test";

export class TranslationsPage {
  readonly page: Page;
  readonly addBtn: Locator;
  readonly namespaceInput: Locator;
  readonly keyInput: Locator;
  readonly geInput: Locator;
  readonly enInput: Locator;
  readonly saveBtn: Locator;
  readonly searchInput: Locator;
  readonly deleteBtn: Locator;
  readonly rowCheckboxes: Locator;
  readonly bulkDeleteBtn: Locator;
  readonly editBtn: Locator;
  readonly inlineSaveBtn: Locator;
  readonly inlineCancelBtn: Locator;
  readonly inlineGeInput: Locator;
  readonly inlineEnInput: Locator;
  readonly paginationPrev: Locator;
  readonly paginationNext: Locator;
  readonly pageInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addBtn = page.locator(".add-toggle-btn");
    this.namespaceInput = page.locator("#namespace");
    this.keyInput = page.locator("#key");
    this.geInput = page.locator("#ge");
    this.enInput = page.locator("#en");
    this.saveBtn = page.locator(".add-form button[type='submit']");
    this.searchInput = page.locator('input[placeholder*="ძებნა"]');
    this.deleteBtn = page.locator(".delete-btn");

    this.rowCheckboxes = page.locator(".col-checkbox input");
    this.bulkDeleteBtn = page.locator(".bulk-delete-btn");
    this.editBtn = page.locator(".edit-btn");
    this.inlineSaveBtn = page.locator(".edit-actions .save-btn");
    this.inlineCancelBtn = page.locator(".edit-actions .cancel-btn");
    this.inlineGeInput = page.locator(".item-row input[type='text']").first();
    this.inlineEnInput = page.locator(".item-row input[type='text']").last();

    this.paginationPrev = page.locator(".pagination button:has-text('წინა')");
    this.paginationNext = page.locator(
      ".pagination button:has-text('შემდეგი')",
    );
    this.pageInfo = page.locator(".page-info");
  }

  async goto() {
    await this.page.goto("/translations");
  }

  async createTranslation(data: {
    namespace: string;
    key: string;
    ge: string;
    en: string;
  }) {
    await this.addBtn.click();
    await this.namespaceInput.selectOption(data.namespace);
    await this.keyInput.fill(data.key);
    await this.geInput.fill(data.ge);
    await this.enInput.fill(data.en);
    await this.saveBtn.click();
  }

  async getRowByKey(key: string) {
    return this.page.locator(".item-row", { hasText: key });
  }

  async editRowByKey(key: string, data: { ge?: string; en?: string }) {
    const row = await this.getRowByKey(key);
    await row.locator(".edit-btn").click();

    if (data.ge) {
      await row.locator("input[type='text']").first().fill(data.ge);
    }
    if (data.en) {
      await row.locator("input[type='text']").last().fill(data.en);
    }

    await row.locator(".save-btn").click();
  }
}
