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
  readonly editModal: Locator;
  readonly editKeyInput: Locator;
  readonly editGeInput: Locator;
  readonly editEnInput: Locator;
  readonly editNamespaceSelect: Locator;
  readonly modalSaveBtn: Locator;
  readonly modalCancelBtn: Locator;
  readonly modalCloseBtn: Locator;
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

    this.editModal = page.locator(".modal-overlay");
    this.editKeyInput = page.locator("#edit-key");
    this.editGeInput = page.locator("#edit-ge");
    this.editEnInput = page.locator("#edit-en");
    this.editNamespaceSelect = page.locator("#edit-namespace");
    this.modalSaveBtn = page.locator(".modal-footer .btn-save");
    this.modalCancelBtn = page.locator(".modal-footer .btn-cancel");
    this.modalCloseBtn = page.locator(".modal-header .close-btn");

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

  async editRowByKey(
    key: string,
    data: { ge?: string; en?: string; key?: string; namespace?: string },
  ) {
    const row = await this.getRowByKey(key);
    await row.locator(".edit-btn").click();

    // Wait for modal
    await expect(this.editModal).toBeVisible();

    if (data.key) {
      await this.editKeyInput.fill(data.key);
    }
    if (data.ge) {
      await this.editGeInput.fill(data.ge);
    }
    if (data.en) {
      await this.editEnInput.fill(data.en);
    }
    if (data.namespace) {
      await this.editNamespaceSelect.selectOption(data.namespace);
    }

    await this.modalSaveBtn.click();
    await expect(this.editModal).not.toBeVisible();
  }
}
